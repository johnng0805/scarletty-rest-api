'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        // validate: {
        //   is: /^[a-zA-Z ]+$/
        // }
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
        // validate: {
        //   isEmail: true
        // }
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      remember_token: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};