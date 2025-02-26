const teacherService = require("../services/teacherService");
const AppError = require("../utils/AppError");

const registerStudents = async (req, res, next) => {
  try {
    if (!req.body.teacher || !req.body.students) {
      throw new AppError("Teacher and students fields are required", 400);
    }
    await teacherService.registerStudents(req.body.teacher, req.body.students);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getCommonStudents = async (req, res, next) => {
  try {
    const teachers = req.query.teacher;
    if (!teachers) {
      throw new AppError("Missing teacher query parameter", 400);
    }
    const students = await teacherService.getCommonStudents(teachers);
    res.json({ students });
  } catch (error) {
    next(error);
  }
};

const suspendStudent = async (req, res, next) => {
  try {
    if (!req.body.student) {
      throw new AppError("Student field is required", 400);
    }
    await teacherService.suspendStudent(req.body.student);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getNotificationRecipients = async (req, res, next) => {
  try {
    if (!req.body.teacher || !req.body.notification) {
      throw new AppError("Teacher and notification fields are required", 400);
    }
    const recipients = await teacherService.getNotificationRecipients(req.body.teacher, req.body.notification);
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
