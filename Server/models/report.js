"use strict";
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    "Report",
    {
      reviewId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      reason: DataTypes.STRING,
    },
    {}
  );

  Report.associate = function (models) {
    Report.belongsTo(models.Review, { foreignKey: "reviewId" });
    Report.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Report;
};
