import express from "express";
import {
  getAverageGradePerCourse,
  getEnrollmentCountPerCourse,
} from "../controllers/analyticsController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/avgrade",
  authenticate,
  authorize(["Admin", "Teacher"]),
  getAverageGradePerCourse
);
router.get(
  "/avenroll",
  authenticate,
  authorize(["Admin", "Teacher"]),
  getEnrollmentCountPerCourse
);

export default router;
