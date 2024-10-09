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

// Add students, assignments, and quizzes to an existing course
export const updateCourseDetails = async (req, res, next) => {
  const { id } = req.params;
  const { students, assignments, quizzes } = req.body;

  try {
    // Fetch course by ID
    const course = await Course.findByIdAndUpdate(id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Validate each student ID and add to course
    if (students) {
      // Ensure `students` is always an array
      const studentIds = Array.isArray(students) ? students : [students];

      // Fetch all valid students from the database
      const validStudents = await User.find({
        _id: { $in: studentIds },
      }).select("_id");

      if (!Array.isArray(validStudents)) {
        return res.status(500).json({
          success: false,
          message: "Error fetching students",
        });
      }

      // Extract valid student IDs
      const validStudentIds = validStudents.map((student) =>
        student._id.toString()
      );
      const providedStudentIds = studentIds.map((id) => id.toString());

      // Find any invalid IDs
      const invalidIds = providedStudentIds.filter(
        (id) => !validStudentIds.includes(id)
      );

      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Some student IDs are invalid",
          invalidIds,
        });
      }

      // Check for existing student IDs
      const existingStudentIds = course.students.map((student) =>
        student.toString()
      );
      const newStudentIds = studentIds.filter(
        (id) => !existingStudentIds.includes(id)
      );

      // Notify about existing students
      const existingStudents = studentIds.filter((id) =>
        existingStudentIds.includes(id)
      );
      if (existingStudents.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "The following student IDs already exist in this course: " +
            existingStudents.join(", "),
        });
      }

      // Add valid students to the course
      course.students.push(...newStudentIds);
    }

    // Validate each assignment ID and add to course
    if (assignments) {
      // Ensure `assignments` is always an array
      const assignmentIds = Array.isArray(assignments)
        ? assignments
        : [assignments];

      // Fetch all valid assignments from the database
      const validAssignments = await Assignment.find({
        _id: { $in: assignmentIds },
      });

      // Check if we received the same number of valid assignments as provided IDs
      if (validAssignments.length !== assignmentIds.length) {
        return res.status(400).json({
          success: false,
          message: "Some assignment IDs are invalid",
        });
      }

      // Check for existing assignment IDs
      const existingAssignmentIds = course.assignments.map((assignment) =>
        assignment.toString()
      );
      const newAssignmentIds = assignmentIds.filter(
        (id) => !existingAssignmentIds.includes(id)
      );

      // Notify about existing assignments
      const existingAssignments = assignmentIds.filter((id) =>
        existingAssignmentIds.includes(id)
      );
      if (existingAssignments.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "The following assignment IDs already exist in this course: " +
            existingAssignments.join(", "),
        });
      }

      // Add valid assignments to the course
      course.assignments.push(...newAssignmentIds);
    }

    // Validate each quiz ID and add to course
    if (quizzes) {
      // Ensure `quizzes` is always an array
      const quizIds = Array.isArray(quizzes) ? quizzes : [quizzes];

      // Fetch all valid quizzes from the database
      const validQuizzes = await Quiz.find({ _id: { $in: quizIds } });

      // Check if all provided quiz IDs are valid
      if (validQuizzes.length !== quizIds.length) {
        return res.status(400).json({
          success: false,
          message: "Some quiz IDs are invalid",
        });
      }

      // Check for existing quiz IDs
      const existingQuizIds = course.quizzes.map((quiz) => quiz.toString());
      const newQuizIds = quizIds.filter((id) => !existingQuizIds.includes(id));

      // Notify about existing quizzes
      const existingQuizzes = quizIds.filter((id) =>
        existingQuizIds.includes(id)
      );
      if (existingQuizzes.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "The following quiz IDs already exist in this course: " +
            existingQuizzes.join(", "),
        });
      }

      // Add valid quizzes to the course
      course.quizzes.push(...newQuizIds);
    }

    // Save updates
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
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
