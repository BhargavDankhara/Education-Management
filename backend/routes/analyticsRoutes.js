import express from "express";
import { getCourseAnalytics } from "../controllers/analyticsController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["Admin", "Teacher"]),
  getCourseAnalytics
);

export default router;
