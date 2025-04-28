"use strict";
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "Service",
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      mainImage: DataTypes.STRING,
      subImage: DataTypes.STRING,
      businessId: {
        type: DataTypes.INTEGER,
        references: {
          model: "UserSubscriptions",
          key: "id",
        },
      },
    },
    {}
  );

  Service.associate = function (models) {
    Service.belongsTo(models.UserSubscription, { foreignKey: "businessId" });
  };

  return Service;
};
