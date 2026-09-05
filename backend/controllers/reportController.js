const Feedback = require('../models/feedback');
const SelectedStudents = require('../models/SeletedStudents');

// @desc    Get complete reports
// @route   GET /api/reports
const getOverallReport = async (req, res) => {
  try {
    // =========================================================
    // 1. OVERALL CAMPUS REPORT
    // =========================================================
    const designatedStudents = await SelectedStudents.distinct('gmail');

     const submittedStudents = await Feedback.distinct('studentGmail');

         const submittedDesignatedStudents = submittedStudents.filter((gmail) =>
          designatedStudents.includes(gmail)
  );

       const totalDesignatedStudents = designatedStudents.length;
       const totalSubmittedStudents = submittedDesignatedStudents.length;

        const feedbackCompletion =
         totalDesignatedStudents > 0
           ? Math.round(
           (totalSubmittedStudents / totalDesignatedStudents) * 100
         )
        : 0;   


    const overallResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,

          overallRating: {
            $avg: '$metrics.Overall',
          },

          totalSubmissions: {
            $sum: 1,
          },

          lowScoreAlerts: {
            $sum: {
              $cond: [
                { $lt: ['$metrics.Overall', 3.5] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // =========================================================
    // 2. DEPARTMENT-WISE REPORT
    // =========================================================

    const departmentResult = await Feedback.aggregate([
      {
        $group: {
          _id: '$section',

          overallRating: {
            $avg: '$metrics.Overall',
          },

          totalSubmissions: {
            $sum: 1,
          },

          lowScoreAlerts: {
            $sum: {
              $cond: [
                { $lt: ['$metrics.Overall', 3.5] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          overallRating: -1,
        },
      },
    ]);

    // =========================================================
    // 3. TOP RATED FACULTY
    // =========================================================

    const topRatedFaculty = await Feedback.aggregate([
      {
        $group: {
          _id: {
            facultyName: '$facultyName',
            section: '$section',
            subject: '$subject',
          },

          averageRating: {
            $avg: '$metrics.Overall',
          },

          totalFeedbacks: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          averageRating: -1,
        },
      },

      {
        $limit: 4,
      },
    ]);

    // =========================================================
    // 4. LOW SCORE ALERTS
    // =========================================================

    const lowScoreAlerts = await Feedback.find({
      'metrics.Overall': {
        $lt: 3.5,
      },
    })
      .sort({ 'metrics.Overall': 1 })
      .limit(10)
      .select(
        'facultyName section subject metrics.Overall remarks timestamp'
      );

    // =========================================================
    // 5. FINAL RESPONSE
    // =========================================================

    const overall = overallResult.length > 0
      ? {
          overallRating: Number(
            overallResult[0].overallRating.toFixed(1)
          ),

          totalSubmissions:
            overallResult[0].totalSubmissions,

          lowScoreAlerts:
            overallResult[0].lowScoreAlerts,
        }
      : {
          overallRating: 0,
          totalSubmissions: 0,
          lowScoreAlerts: 0,
        };

    return res.status(200).json({
      success: true,

      overall,

      campusFeedbackCompletion: {
      percentage: feedbackCompletion,
      submitted: totalSubmittedStudents,
      designated: totalDesignatedStudents,
},

      /// Department Wise

      departments: departmentResult.map((department) => ({
        department: department._id,
        overallRating: Number(
          department.overallRating.toFixed(1)
        ),
        totalSubmissions: department.totalSubmissions,
        lowScoreAlerts: department.lowScoreAlerts,
      })),

      // Top Rated Faculties

      topRatedFaculty: topRatedFaculty.map((faculty) => ({
        facultyName: faculty._id.facultyName,
        department: faculty._id.section,
        subject: faculty._id.subject,
        rating: Number(faculty.averageRating.toFixed(1)),
        totalFeedbacks: faculty.totalFeedbacks,
      })),

      // low Rated Faculties

      lowScoreDetails: lowScoreAlerts.map((feedback) => ({
        facultyName: feedback.facultyName,
        department: feedback.section,
        subject: feedback.subject,
        rating: feedback.metrics.Overall,
        reason: feedback.remarks,
        date: feedback.timestamp,
      })),
    });
  } catch (error) {
    console.error('Get overall report error:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getOverallReport,
  // getFacultyReport,
  // getCourseReport,
};