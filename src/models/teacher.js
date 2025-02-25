'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      Teacher.belongsToMany(models.Student, {
        through: models.Registration,
        foreignKey: "teacherId",
      });
    }
  }

  Teacher.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Teacher",
      timestamps: true,
    }
  );

  return Teacher;
};
