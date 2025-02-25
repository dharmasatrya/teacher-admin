'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Students', [
      {
        email: 'studentjon@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'studenthon@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'studentbob@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'studentagnes@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'studentmiche@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Students', null, {});
  }
};
