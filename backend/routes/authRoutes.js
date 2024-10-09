import express from "express";
import {
  signup,
  login,
  authCheck,
  logout,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/authCheck", authenticate, authCheck);

export default router;
