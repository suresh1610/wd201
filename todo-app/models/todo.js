"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      // define association here
    }
    static addTodo({ title, dueDate, userId}) {
      return this.create({ title: title, dueDate: dueDate, completed: false, userId });
    }
    markAsCompleted() {
      return this.update({ completed: true });
    }
    deletetodo() {
      return this.removetask(id);
    }
    static getTodo() {
      return this.findAll({ order: [["id", "ASC"]] });
    }
    static overdue(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString(),
          },
          userId,
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static dueToday(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString(),
          },
          userId,
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static dueLater(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString(),
          },
          userId,
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static completedItems(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId
        },
        order: [["id", "ASC"]],
      });
    }
    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId
        },
      });
    }
    setCompletionStatus(bool) {
      return this.update({ completed: bool });
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};