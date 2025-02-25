const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();

const TeacherMock = dbMock.define("Teacher", {
  id: 1,
  email: "teacherken@gmail.com",
});

const StudentMock = dbMock.define("Student", {
  id: 1,
  email: "studentjon@gmail.com",
});

const RegistrationMock = dbMock.define("Registration", {});
const SuspensionMock = dbMock.define("Suspension", {});

// Define Associations
TeacherMock.belongsToMany(StudentMock, { through: RegistrationMock });
StudentMock.belongsToMany(TeacherMock, { through: RegistrationMock });

// Helper function to attach mock methods
const attachMockMethods = (instance) => {
  if (!instance.addStudents) {
    instance.addStudents = jest.fn(() => Promise.resolve());
  }
  return instance;
};

// Mock methods for Teacher
TeacherMock.findOrCreate = jest.fn(({ where }) => {
  const teacherInstance = attachMockMethods(TeacherMock.build({ email: where.email }));
  return Promise.resolve([teacherInstance, true]); // Sequelize returns [instance, created]
});

TeacherMock.findOne = jest.fn(({ where }) => {
  if (!where || !where.email) return Promise.resolve(null);

  const teacherInstance = attachMockMethods(TeacherMock.build({ email: where.email }));
  return Promise.resolve(teacherInstance);
});

TeacherMock.findAll = jest.fn(({ where }) => {
  const teachers = [
    {
      id: 1,
      email: "teacherken@gmail.com",
      Students: [
        { email: "commonstudent@gmail.com" },
        { email: "student1@gmail.com" },
      ],
    },
    {
      id: 2,
      email: "teacherjoe@gmail.com",
      Students: [
        { email: "commonstudent@gmail.com" },
        { email: "student2@gmail.com" },
      ],
    },
  ];

  if (where && where.email) {
    return Promise.resolve(teachers.filter(teacher => where.email.includes(teacher.email)));
  }
  return Promise.resolve(teachers);
});

// Mock methods for Student
StudentMock.findOrCreate = jest.fn(({ where }) => {
  const studentInstance = StudentMock.build({ id: Math.random(), email: where.email });
  return Promise.resolve([studentInstance, true]); // Sequelize returns [instance, created]
});

StudentMock.findOne = jest.fn(({ where }) => {
  if (!where || !where.email) return Promise.resolve(null);

  const studentInstance = StudentMock.build({ id: Math.random(), email: where.email });
  return Promise.resolve(studentInstance);
});

StudentMock.findAll = jest.fn(({ where, include }) => {
  const students = [
    { id: 1, email: "studentbob@gmail.com", Suspension: null },
    { id: 2, email: "studentagnes@gmail.com", Suspension: { id: 1 } }, // Suspended student
    { id: 3, email: "commonstudent@gmail.com", Suspension: null },
  ];

  if (where && where.email) {
    const filteredStudents = students.filter(student => where.email.includes(student.email));
    return Promise.resolve(filteredStudents);
  }
  return Promise.resolve(students);
});

// Mock methods for Registration
RegistrationMock.create = jest.fn(() => Promise.resolve(true));

// Mock methods for Suspension
SuspensionMock.findOrCreate = jest.fn(({ where }) => {
  return Promise.resolve([{ id: 1, studentId: where.studentId }, true]);
});

module.exports = {
  Teacher: TeacherMock,
  Student: StudentMock,
  Registration: RegistrationMock,
  Suspension: SuspensionMock,
};