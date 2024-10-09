import Grade from "../models/Grade.js";
import Assignment from "../models/Assignment.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

// Assign grades to a student for a specific assignment, or quiz
export const assignGrade = async (req, res, next) => {
  const { student, course, assignmentGrade, quizGrade, assignment, quiz } =
    req.body;

  try {
    // Check if the student and course exist
    const studentExists = await User.findById(student);
    const courseExists = await Course.findById(course);

    if (!studentExists || !courseExists) {
      return res
        .status(404)
        .json({ success: false, message: "Student or course not found." });
    }

    const gradeEntry = new Grade({
      student,
      course,
      assignmentGrade,
      quizGrade,
      assignment,
      quiz,
    });

    await gradeEntry.save();
    res.status(201).json({ success: true, data: gradeEntry });
  } catch (error) {
    next(error);
  }
};

// Get grades for students with optional filtering by assignment or quiz
export const getGrades = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.query;

    if (studentId) filter.student = studentId;
    if (courseId) filter.course = courseId;

    const grades = await Grade.find()
      .populate("student", "name email")
      .populate("course", "title")
      .populate("assignment", "title")
      .populate("quiz", "title");

    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    next(error);
  }
};
