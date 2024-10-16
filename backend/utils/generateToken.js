import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "5d" });
  res.cookie("jwt-edu", token, {
    maxAge: 5 * 24 * 60 * 60 * 1000, //15d in miliseconds
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks, not accessible by js
    sameSite: "strict", // CSRF protection
    secure: ENV_VARS.NODE_ENV !== "development",
  });

  return token;
};
