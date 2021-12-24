'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Delivery_Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Delivery_Address.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "cascade",
        onUpdate: "cascade"
      });
    }
  };
  Delivery_Address.init({
    user_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Delivery_Address',
  });
  return Delivery_Address;
};