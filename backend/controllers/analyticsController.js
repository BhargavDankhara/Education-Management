import Grade from "../models/Grade.js";
import Enrollment from "../models/Enrollment.js";

export const getCourseAnalytics = async (req, res, next) => {
  try {
    const analytics = await Grade.aggregate([
      {
        $group: {
          _id: "$course",
          averageGrade: { $avg: "$grade" },
          studentCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      { $unwind: "$courseDetails" },
      {
        $project: {
          courseTitle: "$courseDetails.title",
          averageGrade: 1,
          studentCount: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
};
