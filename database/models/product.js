'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Vendor, {
        foreignKey: "vendor_id"
      });
      Product.belongsToMany(models.Category, {
        through: models.Product_Category,
        foreignKey: "product_id"
      });
      Product.hasMany(models.Product_Image, {
        foreignKey: "product_id",
        onDelete: "cascade",
        onUpdate: "cascade"
      });
    }
  };
  Product.init({
    vendor_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(5, 2),
    discount: DataTypes.DECIMAL(5, 2),
    in_stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};