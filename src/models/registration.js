'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {
    static associate(models) {}
  }

  Registration.init(
    {
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Teachers", key: "id" },
        onDelete: "CASCADE",
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Students", key: "id" },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Registration",
      timestamps: true,
    }
  );

  return Registration;
};
