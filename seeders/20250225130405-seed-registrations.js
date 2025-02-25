'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Registrations', [
      {
        teacherId: 1,
        studentId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: 1,
        studentId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: 1,
        studentId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: 2,
        studentId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: 2,
        studentId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Registrations', null, {});
  }
};
