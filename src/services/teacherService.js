const teacherRepository = require("../repositories/teacherRepository");

const registerStudents = async (teacherEmail, studentEmails) => {
  return await teacherRepository.registerStudents(teacherEmail, studentEmails);
};

const getCommonStudents = async (teachers) => {
  return await teacherRepository.getCommonStudents(teachers);
};

const suspendStudent = async (studentEmail) => {
  return await teacherRepository.suspendStudent(studentEmail);
};

const getNotificationRecipients = async (teacherEmail, notification) => {
  return await teacherRepository.getNotificationRecipients(teacherEmail, notification);
};

module.exports = {
    registerStudents,
    getCommonStudents,
    suspendStudent,
    getNotificationRecipients
}