"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Product.hasMany(models.Review, { foreignKey: "productId" });
    }
  }
  Product.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      mainImage: DataTypes.STRING,
      otherImages: DataTypes.STRING,
      category: DataTypes.STRING,
      subCategory: DataTypes.STRING,
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      productUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isUrl: {
            protocols: ["http", "https"],
            require_tld: false, // <-- this line allows localhost
            require_protocol: true,
          },
        },
      },
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
