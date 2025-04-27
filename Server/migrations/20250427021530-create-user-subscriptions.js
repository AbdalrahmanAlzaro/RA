"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserSubscriptions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      subscriptionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Subscriptions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      billingCycle: {
        type: Sequelize.ENUM("weekly", "monthly", "yearly"),
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessPhone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      businessWebsiteUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      mainImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserSubscriptions");
  },
};
