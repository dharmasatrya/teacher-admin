const { Teacher, Student, Registration, Suspension } = require("../models");

const findOrCreateTeacher = async (email) => {
  return await Teacher.findOrCreate({ where: { email } });
};

const findOrCreateStudents = async (emails) => {
  return await Promise.all(
    emails.map(email => Student.findOrCreate({ where: { email } }))
  );
};

const associateStudentsWithTeacher = async (teacher, students) => {
  return await teacher.addStudents(students.map(([student]) => student));
};

const findTeachersByEmails = async (emails) => {
  return await Teacher.findAll({
    where: { email: emails },
    include: { model: Student, through: { attributes: [] } },
  });
};

const findStudentByEmail = async (email) => {
  return await Student.findOne({ where: { email } });
};

const createSuspension = async (studentId) => {
  return await Suspension.findOrCreate({ where: { studentId } });
};

const findTeacherWithStudents = async (email) => {
  return await Teacher.findOne({
    where: { email },
    include: { model: Student, through: { attributes: [] } },
  });
};

const findActiveStudents = async (emails) => {
  return await Student.findAll({
    where: { email: emails },
    include: { model: Suspension, required: false },
  });
};

module.exports = {
  findOrCreateTeacher,
  findOrCreateStudents,
  associateStudentsWithTeacher,
  findTeachersByEmails,
  findStudentByEmail,
  createSuspension,
  findTeacherWithStudents,
  findActiveStudents,
};
