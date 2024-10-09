import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// Enroll a student in a course
export const enrollStudent = async (req, res, next) => {
  const { student, course } = req.body;

  try {
    // Check if the course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    // Check if the student exists
    const studentExists = await User.findById(student);
    if (!studentExists) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    // Check if the student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student,
      course,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course.",
      });
    }

    // Create new enrollment with startDate and endDate from course
    const enrollment = new Enrollment({
      student,
      course,
      startDate: courseExists.startDate,
      endDate: courseExists.endDate,
    });

    await enrollment.save();
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    next(error);
  }
};

// Get all enrollments
export const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email") // Include email if needed
      .populate("course", "title description startDate endDate");

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    next(error);
  }
};

// Get enrollments by student ID
export const getEnrollmentsByStudentId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const enrollments = await Enrollment.find({ student: id }).populate(
      "course",
      "title description startDate endDate"
    );

    if (enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No enrollments found for this student.",
      });
    }

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    next(error);
  }
};
