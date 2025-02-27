const teacherService = require("../services/teacherService");
const AppError = require("../utils/AppError");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const registerStudents = async (req, res, next) => {
  try {
    const { teacher, students } = req.body;

    if (!teacher || !students || !Array.isArray(students) || students.length === 0) {
      throw new AppError("Teacher and students fields are required and must be valid", 400);
    }

    if (!isValidEmail(teacher)) {
      throw new AppError("Invalid teacher email format", 400);
    }

    if (students.some((email) => !isValidEmail(email))) {
      throw new AppError("One or more student emails have an invalid format", 400);
    }

    await teacherService.registerStudents(teacher, students);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getCommonStudents = async (req, res, next) => {
  try {
    let teachers = req.query.teacher;

    if (!teachers) {
      throw new AppError("Missing teacher query parameter", 400);
    }

    if (!Array.isArray(teachers)) {
      teachers = [teachers]; // Convert single string to array
    }

    if (teachers.some((email) => !isValidEmail(email))) {
      throw new AppError("One or more teacher emails have an invalid format", 400);
    }

    const students = await teacherService.getCommonStudents(teachers);
    res.json({ students });
  } catch (error) {
    next(error);
  }
};

const suspendStudent = async (req, res, next) => {
  try {
    const { student } = req.body;

    if (!student) {
      throw new AppError("Student field is required", 400);
    }

    if (!isValidEmail(student)) {
      throw new AppError("Invalid student email format", 400);
    }

    await teacherService.suspendStudent(student);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getNotificationRecipients = async (req, res, next) => {
  try {
    const { teacher, notification } = req.body;

    if (!teacher || !notification) {
      throw new AppError("Teacher and notification fields are required", 400);
    }

    if (!isValidEmail(teacher)) {
      throw new AppError("Invalid teacher email format", 400);
    }

    const recipients = await teacherService.getNotificationRecipients(teacher, notification);
    res.json({ recipients });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerStudents,
  getCommonStudents,
  suspendStudent,
  getNotificationRecipients,
};
