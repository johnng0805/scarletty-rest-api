'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Order_Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Orders",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      product_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Order_Items');
  }
};