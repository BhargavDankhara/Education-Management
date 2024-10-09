import Grade from "../models/Grade.js";

export const assignGrade = async (req, res, next) => {
  try {
    const { student, course, grade } = req.body;
    const gradeEntry = new Grade({ student, course, grade });
    await gradeEntry.save();
    res.status(201).json({ success: true, data: gradeEntry });
  } catch (error) {
    next(error);
  }
};

export const getGrades = async (req, res, next) => {
  try {
    const grades = await Grade.find()
      .populate("student", "name")
      .populate("course", "title");
    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    next(error);
  }
};
