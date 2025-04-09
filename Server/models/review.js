"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: "userId" });
      Review.belongsTo(models.Product, { foreignKey: "productId" });
    }
  }
  Review.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
      rating: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
