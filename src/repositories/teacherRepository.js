const { Teacher, Student, Registration, Suspension } = require("../models");

const registerStudents = async (teacherEmail, studentEmails) => {
  const [teacher] = await Teacher.findOrCreate({ where: { email: teacherEmail } });

  const students = await Promise.all(
    studentEmails.map(email => Student.findOrCreate({ where: { email } }))
  );

  await teacher.addStudents(students.map(([student]) => student));
};

const getCommonStudents = async (teacherEmails) => {
  const teachers = await Teacher.findAll({
    where: { email: teacherEmails },
    include: { model: Student, through: { attributes: [] } },
  });

  if (teachers.length === 0) return [];

  const studentLists = teachers.map(t => t.Students.map(s => s.email));
  return studentLists.reduce((a, b) => a.filter(email => b.includes(email)));
};

const suspendStudent = async (studentEmail) => {
  const student = await Student.findOne({ where: { email: studentEmail } });
  if (!student) throw new Error("Student not found");

  await Suspension.findOrCreate({ where: { studentId: student.id } });
};

const getNotificationRecipients = async (teacherEmail, notification) => {
  const teacher = await Teacher.findOne({
    where: { email: teacherEmail },
    include: { model: Student, through: { attributes: [] } },
  });

  //find mentioned email
  const mentionedEmails = (notification.match(/@([\w.-]+@[\w.-]+)/g) || []).map(email => email.slice(1));

  const registeredStudents = teacher ? teacher.Students.map(s => s.email) : [];
  const allRecipients = [...new Set([...registeredStudents, ...mentionedEmails])];

  const activeStudents = await Student.findAll({
    where: { email: allRecipients },
    include: { model: Suspension, required: false },
  });

  return activeStudents.filter(s => !s.Suspension).map(s => s.email);
};

module.exports = {
    registerStudents,
    getCommonStudents,
    suspendStudent,
    getNotificationRecipients
}
