import express from "express";
import {
  enrollStudent,
  getEnrollments,
  getEnrollmentsByStudentId,
} from "../controllers/enrollmentController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/enroll", authenticate, authorize(["Admin"]), enrollStudent);
router.get(
  "/get",
  authenticate,
  authorize(["Admin", "Teacher"]),
  getEnrollments
);
router.get(
  "/get/:id",
  authenticate,
  authorize(["Admin", "Teacher", "Student"]),
  getEnrollmentsByStudentId
);

export default router;
