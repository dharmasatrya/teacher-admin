const teacherRepository = require("../repositories/teacherRepository");
const AppError = require("../utils/AppError");

const registerStudents = async (teacherEmail, studentEmails) => {

  const [teacher] = await teacherRepository.findOrCreateTeacher(teacherEmail);
  const students = await teacherRepository.findOrCreateStudents(studentEmails);

  await teacherRepository.associateStudentsWithTeacher(teacher, students);
};

const getCommonStudents = async (teacherEmails) => {

  const teachers = await teacherRepository.findTeachersByEmails(teacherEmails);
  if (teachers.length === 0) return [];

  const studentLists = teachers.map(t => t.Students.map(s => s.email));
  return studentLists.reduce((a, b) => a.filter(email => b.includes(email)));
};

const suspendStudent = async (studentEmail) => {

  const student = await teacherRepository.findStudentByEmail(studentEmail);
  if (!student) throw new AppError("Student not found", 404);

  await teacherRepository.createSuspension(student.id);
};

const getNotificationRecipients = async (teacherEmail, notification) => {

  // Find teacher and their registered students
  const teacher = await teacherRepository.findTeacherWithStudents(teacherEmail);
  if (!teacher) throw new AppError("Teacher not found", 404);
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
