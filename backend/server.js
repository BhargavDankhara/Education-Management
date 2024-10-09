import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { ENV_VARS } from "./config/envVars.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(errorHandler);

const PORT = ENV_VARS.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDB();
});
