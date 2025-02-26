const teacherRepository = require("../repositories/teacherRepository");
const AppError = require("../utils/AppError");

const registerStudents = async (teacherEmail, studentEmails) => {
  if (!teacherEmail || !studentEmails || studentEmails.length === 0) {
    throw new AppError("Teacher and students fields are required", 400);
  }

  const [teacher] = await teacherRepository.findOrCreateTeacher(teacherEmail);
  const students = await teacherRepository.findOrCreateStudents(studentEmails);

  await teacherRepository.associateStudentsWithTeacher(teacher, students);
};

const getCommonStudents = async (teacherEmails) => {
  if (!teacherEmails || teacherEmails.length === 0) {
    throw new AppError("At least one teacher email is required", 400);
  }

  const teachers = await teacherRepository.findTeachersByEmails(teacherEmails);
  if (teachers.length === 0) return [];

  const studentLists = teachers.map(t => t.Students.map(s => s.email));
  return studentLists.reduce((a, b) => a.filter(email => b.includes(email)));
};

const suspendStudent = async (studentEmail) => {
  if (!studentEmail) {
    throw new AppError("Student email is required", 400);
  }

  const student = await teacherRepository.findStudentByEmail(studentEmail);
  if (!student) throw new AppError("Student not found", 404);

  await teacherRepository.createSuspension(student.id);
};

const getNotificationRecipients = async (teacherEmail, notification) => {
  if (!teacherEmail || !notification) {
    throw new AppError("Teacher and notification fields are required", 400);
  }

  // Find teacher and their registered students
  const teacher = await teacherRepository.findTeacherWithStudents(teacherEmail);
  const registeredStudents = teacher ? teacher.Students.map(s => s.email) : [];

  // Extract mentioned students from the notification text
  const mentionedEmails = (notification.match(/@([\w.-]+@[\w.-]+)/g) || []).map(email => email.slice(1));
  const allRecipients = [...new Set([...registeredStudents, ...mentionedEmails])];

  // Filter out suspended students
  const activeStudents = await teacherRepository.findActiveStudents(allRecipients);
  return activeStudents.filter(s => !s.Suspension).map(s => s.email);
};

module.exports = {
  registerStudents,
  getCommonStudents,
  suspendStudent,
  getNotificationRecipients,
};
