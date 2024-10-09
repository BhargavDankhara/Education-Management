import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";
import User from "../models/User.js";

// Middleware to authenticate JWT token
export const authenticate = async (req, res, next) => {
  const token = req.cookies["jwt-edu"];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token." });
  }
};

// Middleware to authorize roles
export const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Access denied. Insufficient permissions." });
  }
  next();
};
