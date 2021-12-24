'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment_Info.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "cascade",
        onUpdate: "cascade"
      });
    }
  };
  Payment_Info.init({
    user_id: DataTypes.INTEGER,
    type: DataTypes.ENUM("cash", "online"),
    provider: DataTypes.ENUM("PayPal", "Visa", "VNPay"),
    account_number: DataTypes.STRING,
    expiry: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment_Info',
  });
  return Payment_Info;
};