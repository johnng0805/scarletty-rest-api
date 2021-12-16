'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Product_Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
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
    await queryInterface.dropTable('Product_Categories');
  }
};