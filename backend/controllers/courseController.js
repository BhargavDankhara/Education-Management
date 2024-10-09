import Course from "../models/Course.js";
import User from "../models/User.js";
import Assignment from "../models/Assignment.js";
import Quiz from "../models/Quiz.js";

export const createCourse = async (req, res, next) => {
  try {
    const { title, description, teacher, startDate, endDate } = req.body;

    // Check if the teacher exists
    const teacherExists = await User.findById(teacher);
    if (!teacherExists) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found." });
    }

    const course = new Course({
      title,
      description,
      teacher,
      startDate,
      endDate,
    });

    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("teacher", "name");
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

// Add Assignment to Course
export const addAssignmentToCourse = async (req, res, next) => {
  const { course, title, description, dueDate } = req.body;

  try {
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }
    const assignment = new Assignment({
      title,
      description,
      dueDate,
      course: course,
    });

    await assignment.save();

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// Add Quiz to Course
export const addQuizToCourse = async (req, res, next) => {
  const { course, title, questions } = req.body;

  try {
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    const quiz = new Quiz({
      title,
      questions,
      course: course,
    });

    await quiz.save();

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

// Get all Assignments for a Course
export const getAssignments = async (req, res, next) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findById(id).populate(
      "course",
      "title"
    );

    // Check if the assignment was found
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found." });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// Get all Quizzes for a Course
export const getQuizzes = async (req, res, next) => {
  const { id } = req.params;

  try {
    const quizzes = await Quiz.findById(id).populate("course", "title");

    // Check if quizzes exist
    if (!quizzes) {
      return res.status(404).json({
        success: false,
        message: "No quizzes found for this course.",
      });
    }

    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
};
