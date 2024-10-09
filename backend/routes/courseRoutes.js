import express from "express";
import {
  addAssignmentToCourse,
  addQuizToCourse,
  createCourse,
  getAllCourses,
  getAssignments,
  getQuizzes,
} from "../controllers/courseController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authenticate, authorize(["Admin"]), createCourse);
router.get("/get", getAllCourses);

// Routes for assignments
router.post(
  "/assignments",
  authenticate,
  authorize("Teacher"),
  addAssignmentToCourse
);
router.get("/assignments/:id", authenticate, getAssignments);

// Routes for quizzes
router.post("/quizzes", authenticate, authorize("Teacher"), addQuizToCourse);
router.get("/quizzes/:id", authenticate, getQuizzes);

export default router;
