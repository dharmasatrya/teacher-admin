const teacherService = require("../services/teacherService");

const registerStudents = async (req, res) => {
  try {
    await teacherService.registerStudents(req.body.teacher, req.body.students);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCommonStudents = async (req, res) => {
  try {
    const teachers = req.query.teacher;
    const students = await teacherService.getCommonStudents(teachers);
    res.json({ students });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const suspendStudent = async (req, res) => {
  try {
    await teacherService.suspendStudent(req.body.student);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getNotificationRecipients = async (req, res) => {
  try {
    const recipients = await teacherService.getNotificationRecipients(req.body.teacher, req.body.notification);
    res.json({ recipients });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
    registerStudents,
    getCommonStudents,
    suspendStudent,
    getNotificationRecipients,
  };