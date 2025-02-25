'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.belongsToMany(models.Teacher, {
        through: models.Registration,
        foreignKey: "studentId",
      });

      Student.hasOne(models.Suspension, {
        foreignKey: "studentId",
        onDelete: "CASCADE",
      });
    }
  }

  Student.init(
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
      modelName: "Student",
      timestamps: true,
    }
  );

  return Student;
};
