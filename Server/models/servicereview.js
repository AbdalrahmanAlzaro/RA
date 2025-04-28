"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ServiceReview extends Model {
    static associate(models) {
      ServiceReview.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      ServiceReview.belongsTo(models.Service, {
        foreignKey: "serviceId",
        as: "service",
      });
    }
  }

  ServiceReview.init(
    {
      userId: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: "ServiceReview",
    }
  );

  return ServiceReview;
};
