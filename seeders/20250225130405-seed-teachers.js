'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Teachers', [
      {
        email: 'teacherdharma@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'teacheraisha@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teachers', null, {});
  }
};
