"use strict";
module.exports = (sequelize, DataTypes) => {
  const ReviewBusiness = sequelize.define(
    "ReviewBusiness",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );

  ReviewBusiness.associate = function (models) {
    ReviewBusiness.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    ReviewBusiness.belongsTo(models.UserSubscription, {
      foreignKey: "businessId",
      onDelete: "CASCADE",
    });
  };

  return ReviewBusiness;
};
