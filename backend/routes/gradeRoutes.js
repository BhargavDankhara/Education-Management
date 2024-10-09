import express from "express";
import { assignGrade, getGrades } from "../controllers/gradeController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authenticate, authorize(["Teacher"]), assignGrade);
router.get(
  "/get",
  authenticate,
  authorize(["Admin", "Teacher", "Student"]),
  getGrades
);

export default router;
