'use strict';
const { Model } = require('sequelize');

const { appUrl, appPort } = require('../../config/app');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      image: {
        type: DataTypes.STRING,
        get() {
          const filename = this.getDataValue('image');
          const id = this.getDataValue('id');
          const url = `${appUrl}:${appPort}`;

          if (filename) return `${url}/images/products/${id}/${filename}`;

          return null;
        },
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      underscored: true,
    }
  );
  return Product;
};
