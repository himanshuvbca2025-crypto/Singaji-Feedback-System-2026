const Feedback = require('../models/feedback');

const submitFeedback = async (req, res) => {
  try {
    const {
      studentGmail,
      level,
      section,
      facultyName,
      subject,
      metrics,
      remarks,
    } = req.body;


     const existingFeedback = await Feedback.findOne({
      studentGmail,
      facultyName,
      subject,
    });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message:
          'You have already submitted feedback for this faculty and subject.',
      });
    }

    const feedback = await Feedback.create({
      studentGmail,
      level,
      section,
      facultyName,
      subject,
      metrics,
      remarks,
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    console.error('Submit feedback error:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.aggregate([
      {
        $group: {
          _id: {
            facultyName: "$facultyName",
            section: "$section",
          },

          subjects: {
            $addToSet: "$subject",
          },

          overallRating: {
            $avg: "$metrics.Overall",
          },

          totalFeedbacks: {
            $sum: 1,
          },

          latestDate: {
            $max: "$timestamp",
          },

          latestRemarks: {
            $last: "$remarks",
          },
        },
      },

      {
        $project: {
          _id: 0,

          facultyName: "$_id.facultyName",
          department: "$_id.section",

          subjects: 1,

          overallRating: {
            $round: ["$overallRating", 1],
          },

          totalFeedbacks: 1,

          comment: "$latestRemarks",

          date: "$latestDate",

        },
      },

      {
        $sort: {
          overallRating: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error("Get all feedback error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFeedbackByFaculty = async (req, res) => {
  try {
    const { facultyName } = req.params;

    const feedbacks = await Feedback.find({
      facultyName: { $regex: new RegExp(facultyName, "i") },
    }).sort({ timestamp: -1 });

    const totalCount = feedbacks.length;
    let avgRating = 0;
    if (totalCount > 0) {
      const sum = feedbacks.reduce(
        (acc, item) => acc + (item.metrics?.Overall || 4),
        0
      );
      avgRating = (sum / totalCount).toFixed(1);
    }

    return res.status(200).json({
      success: true,
      count: totalCount,
      avgRating: Number(avgRating) || 4.5,
      feedbacks,
    });
  } catch (error) {
    console.error("Get feedback by faculty error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const { sendFeedbackLinkEmail } = require('../utils/sendEmail');

const sendFeedbackInvite = async (req, res) => {
  try {
    const { studentEmail, facultyName, subject, time } = req.body;

    if (!studentEmail || !facultyName || !subject) {
      return res.status(400).json({
        success: false,
        message: "studentEmail, facultyName and subject are required",
      });
    }

    const result = await sendFeedbackLinkEmail(
      studentEmail,
      facultyName,
      subject,
      time || "10:00 AM - 11:30 AM"
    );

    return res.status(200).json({
      success: true,
      message: `Feedback invitation email dispatched to ${studentEmail}`,
      result,
    });
  } catch (error) {
    console.error("Send feedback invite error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  getFeedbackByFaculty,
  sendFeedbackInvite,
};