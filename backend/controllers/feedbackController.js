
const Feedback = require("../models/feedback");
const SelectedStudents = require("../models/SeletedStudents");

// =========================================================
// SUBMIT FEEDBACK
// =========================================================
const submitFeedback = async (req, res) => {
  try {
    const {
      studentGmail,
      facultyName,
      subject,
      metrics,
      remarks,
    } = req.body;

    console.log("======================================");
    console.log("FEEDBACK SUBMISSION REQUEST");
    console.log("Gmail:", studentGmail);
    console.log("Faculty:", facultyName);
    console.log("Subject:", subject);
    console.log("Metrics:", metrics);
    console.log("======================================");


    // =====================================================
    // 1. REQUIRED DATA VALIDATION
    // =====================================================
    if (
      !studentGmail ||
      !facultyName ||
      !subject ||
      !metrics
    ) {
      return res.status(400).json({
        success: false,
        message: "Required feedback data is missing.",
      });
    }


    // =====================================================
    // 2. NORMALIZE GMAIL
    // =====================================================
    const normalizedGmail = studentGmail
      .trim()
      .toLowerCase();


    // =====================================================
    // 3. CHECK GMAIL IN SELECTED STUDENTS COLLECTION
    // =====================================================
    const selectedStudent = await SelectedStudents.findOne({
      gmail: normalizedGmail,
    });

    console.log(
      "Selected Student Found:",
      selectedStudent
    );


    // =====================================================
    // 4. GMAIL NOT FOUND
    // =====================================================
    if (!selectedStudent) {
      return res.status(400).json({
        success: false,
        message:
          "Please submit the form using your registered college Gmail.",
      });
    }


    // =====================================================
    // 5. GET LEVEL + SECTION FROM SELECTED STUDENTS
    // =====================================================
    const studentLevel =
      selectedStudent.level || "";

    const studentSection =
      selectedStudent.section || "ITEG";


    console.log(
      "Student Level:",
      studentLevel
    );

    console.log(
      "Student Section:",
      studentSection
    );


    // =====================================================
    // 6. CHECK DUPLICATE FEEDBACK
    // =====================================================
    const existingFeedback =
      await Feedback.findOne({
        studentGmail: normalizedGmail,
        facultyName,
        subject,
      });


    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message:
          "You have already submitted feedback for this faculty and subject.",
      });
    }


    // =====================================================
    // 7. VALIDATE METRICS
    // =====================================================
    const requiredMetrics = [
      "Explanation",
      "Punctuality",
      "Engagement",
      "Resolution",
      "Overall",
    ];


    for (const metric of requiredMetrics) {
      const value = metrics[metric];


      if (
        value === undefined ||
        value === null ||
        Number(value) < 1 ||
        Number(value) > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid or missing rating for ${metric}.`,
        });
      }
    }


    // =====================================================
    // 8. SAVE FEEDBACK IN Feedbacks COLLECTION
    // =====================================================
    const feedback = await Feedback.create({
      studentGmail: normalizedGmail,

      level: studentLevel,

      section: studentSection,

      facultyName: facultyName.trim(),

      subject: subject.trim(),

      metrics: {
        Explanation: Number(
          metrics.Explanation
        ),

        Punctuality: Number(
          metrics.Punctuality
        ),

        Engagement: Number(
          metrics.Engagement
        ),

        Resolution: Number(
          metrics.Resolution
        ),

        Overall: Number(
          metrics.Overall
        ),
      },

      remarks: remarks
        ? remarks.trim()
        : "",
    });


    // =====================================================
    // 9. SUCCESS RESPONSE
    // =====================================================
    console.log(
      "Feedback successfully saved:",
      feedback._id
    );


    return res.status(201).json({
      success: true,
      message:
        "Feedback submitted successfully.",
      feedback,
    });


  } catch (error) {

    console.error(
      "Submit feedback error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================================================
// GET ALL FEEDBACK
// =========================================================
const getAllFeedback = async (req, res) => {
  try {

    const { date } = req.query;

    let matchStage = null;


    // =====================================================
    // DATE FILTER
    // =====================================================
    if (date) {

      const startDate = new Date(
        `${date}T00:00:00+05:30`
      );

      const endDate = new Date(
        `${date}T23:59:59.999+05:30`
      );


      matchStage = {
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }


    const pipeline = [];


    // =====================================================
    // APPLY DATE FILTER
    // =====================================================
    if (matchStage) {
      pipeline.push({
        $match: matchStage,
      });
    }


    // =====================================================
    // GROUP FEEDBACK
    // =====================================================
    pipeline.push(
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


      // ===================================================
      // PROJECT
      // ===================================================
      {
        $project: {

          _id: 0,

          facultyName: "$_id.facultyName",

          department: "$_id.section",

          subjects: 1,

          overallRating: {
            $round: [
              "$overallRating",
              1,
            ],
          },

          totalFeedbacks: 1,

          comment: "$latestRemarks",

          date: "$latestDate",
        },
      },


      // ===================================================
      // SORT
      // ===================================================
      {
        $sort: {
          overallRating: -1,
        },
      }
    );


    const feedbacks =
      await Feedback.aggregate(
        pipeline
      );


    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });


  } catch (error) {

    console.error(
      "Get all feedback error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================================================
// GET FEEDBACK BY FACULTY
// =========================================================
const getFeedbackByFaculty = async (
  req,
  res
) => {

  try {

    const { facultyName } =
      req.params;


    const feedbacks =
      await Feedback.find({
        facultyName: {
          $regex: new RegExp(
            facultyName,
            "i"
          ),
        },
      }).sort({
        timestamp: -1,
      });


    const totalCount =
      feedbacks.length;


    let avgRating = 0;


    if (totalCount > 0) {

      const sum =
        feedbacks.reduce(
          (acc, item) =>
            acc +
            (item.metrics?.Overall || 0),
          0
        );


      avgRating = (
        sum / totalCount
      ).toFixed(1);
    }


    return res.status(200).json({

      success: true,

      count: totalCount,

      avgRating:
        Number(avgRating) || 0,

      feedbacks,
    });


  } catch (error) {

    console.error(
      "Get feedback by faculty error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================================================
// SEND FEEDBACK INVITE
// =========================================================
const {
  sendFeedbackLinkEmail,
} = require("../utils/sendEmail");


const sendFeedbackInvite = async (
  req,
  res
) => {

  try {

    const {
      studentEmail,
      facultyName,
      subject,
      time,
    } = req.body;


    // =====================================================
    // VALIDATION
    // =====================================================
    if (
      !studentEmail ||
      !facultyName ||
      !subject
    ) {

      return res.status(400).json({
        success: false,
        message:
          "studentEmail, facultyName and subject are required",
      });
    }


    // =====================================================
    // SEND EMAIL
    // =====================================================
    const result =
      await sendFeedbackLinkEmail(
        studentEmail,
        facultyName,
        subject,
        time ||
          "10:00 AM - 11:30 AM"
      );


    return res.status(200).json({

      success: true,

      message:
        `Feedback invitation email dispatched to ${studentEmail}`,

      result,
    });


  } catch (error) {

    console.error(
      "Send feedback invite error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================================================
// EXPORTS
// =========================================================
module.exports = {
  submitFeedback,
  getAllFeedback,
  getFeedbackByFaculty,
  sendFeedbackInvite,
};
