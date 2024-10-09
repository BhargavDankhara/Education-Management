import Grade from "../models/Grade.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// Get average grade per course
export const getAverageGradePerCourse = async (req, res, next) => {
  try {
    const avgGrades = await Grade.aggregate([
      {
        $group: {
          _id: "$course",
          averageGrade: {
            $avg: { $ifNull: ["$assignmentGrade", "$quizGrade"] },
          },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      {
        $unwind: "$courseInfo",
      },
      {
        $project: {
          course: "$courseInfo.title",
          averageGrade: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: avgGrades });
  } catch (error) {
    next(error);
  }
};

// Get the number of students enrolled per course
export const getEnrollmentCountPerCourse = async (req, res, next) => {
  try {
    const enrollmentCount = await Enrollment.aggregate([
      {
        $match: { status: "enrolled" },
      },
      {
        $group: {
          _id: "$course",
          enrolledStudents: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      {
        $unwind: "$courseInfo",
      },
      {
        $project: {
          course: "$courseInfo.title",
          enrolledStudents: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: enrollmentCount });
  } catch (error) {
    next(error);
  }
};
