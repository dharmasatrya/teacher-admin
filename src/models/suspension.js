'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Suspension extends Model {
    static associate(models) {
      Suspension.belongsTo(models.Student, {
        foreignKey: "studentId",
        onDelete: "CASCADE",
      });
    }
  }

  Suspension.init(
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Students", key: "id" },
        unique: true, // Ensures a student can only be suspended once
      },
    },
    {
      sequelize,
      modelName: "Suspension",
      timestamps: true,
    }
  );

  return Suspension;
};
