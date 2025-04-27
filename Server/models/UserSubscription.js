"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserSubscription extends Model {
    static associate(models) {
      UserSubscription.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      UserSubscription.belongsTo(models.Subscription, {
        foreignKey: "subscriptionId",
        as: "subscription",
      });
    }
  }

  UserSubscription.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subscriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      billingCycle: {
        type: DataTypes.ENUM("weekly", "monthly", "yearly"),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      businessName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      businessEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      businessPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      businessDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      businessWebsiteUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      mainImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "UserSubscription",
    }
  );

  return UserSubscription;
};
