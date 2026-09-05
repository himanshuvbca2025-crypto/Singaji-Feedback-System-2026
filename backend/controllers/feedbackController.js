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

module.exports = {
  submitFeedback,
   getAllFeedback,
};