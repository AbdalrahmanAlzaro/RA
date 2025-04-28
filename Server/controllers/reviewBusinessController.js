const { ReviewBusiness, UserSubscription, User } = require("../models");
const { Sequelize } = require("sequelize");

const addReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const { businessId, description, rating } = req.body;

    if (!businessId || !description || !rating) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const business = await UserSubscription.findByPk(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    const review = await ReviewBusiness.create({
      userId: userId,
      businessId: businessId,
      description,
      rating,
    });

    return res
      .status(201)
      .json({ message: "Review added successfully.", review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

const getReviewsByBusinessId = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required." });
    }

    const reviews = await ReviewBusiness.findAll({
      where: { businessId: businessId },
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this business." });
    }

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

const getReviewStatsByBusinessId = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required." });
    }

    const stats = await ReviewBusiness.findOne({
      where: { businessId },
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
        [Sequelize.fn("COUNT", Sequelize.col("userId")), "numberOfUsers"],
      ],
    });

    if (
      !stats ||
      !stats.dataValues.numberOfUsers ||
      stats.dataValues.numberOfUsers == 0
    ) {
      return res
        .status(404)
        .json({ message: "No reviews found for this business." });
    }

    return res.status(200).json({
      averageRating: parseFloat(stats.dataValues.averageRating).toFixed(2),
      numberOfUsers: parseInt(stats.dataValues.numberOfUsers),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  addReview,
  getReviewsByBusinessId,
  getReviewStatsByBusinessId,
};
