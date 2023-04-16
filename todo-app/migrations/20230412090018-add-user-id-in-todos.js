'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Todos','userId', {//add col in todos model for forngine key
      type: Sequelize.DataTypes.INTEGER //properties of foreign key
    })

    await queryInterface.addConstraint('Todos', {//table name
      fields: ['userId'],//foregin key name
      type: 'foreign key',//key type
      references: {
        table: 'Users',//relation model
        field: 'id'//whicn key is use foregine key
      }
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Todos', 'userId')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
