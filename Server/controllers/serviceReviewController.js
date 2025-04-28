const { ServiceReview, User } = require("../models");
const jwt = require("jsonwebtoken");

const createReview = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { serviceId, title, description, rating } = req.body;

    if (!serviceId || !title || !description || rating == null) {
      return res.status(400).json({
        message: "serviceId, title, description, and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = await ServiceReview.create({
      userId,
      serviceId,
      title,
      description,
      rating,
    });

    return res
      .status(201)
      .json({ message: "Review created successfully", review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getReviewsForService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    const reviews = await ServiceReview.findAll({
      where: { serviceId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createReview, getReviewsForService };
