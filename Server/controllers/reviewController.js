const { Review } = require("../models");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

exports.createReview = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { title, description, rating, productId } = req.body;
    const image = req.file ? req.file.path : null;

    const review = await Review.create({
      title,
      description,
      image,
      rating,
      userId,
      productId,
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { id } = req.params;
    const { title, description, rating } = req.body;
    const newImage = req.file;

    const review = await Review.findOne({ where: { id } });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this review" });
    }

    if (newImage && review.image) {
      try {
        await fs.unlink(review.image);
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    const updatedReview = await review.update({
      title: title || review.title,
      description: description || review.description,
      rating: rating || review.rating,
      image: newImage ? newImage.path : review.image,
    });

    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { id } = req.params;

    const review = await Review.findOne({ where: { id } });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review" });
    }

    if (review.image) {
      try {
        await fs.unlink(review.image);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    await review.destroy();

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          association: "User",
          attributes: ["id", "name", "email"],
        },
        {
          association: "Product",
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProductRatingStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { productId },
      attributes: ["rating"],
    });

    if (reviews.length === 0) {
      return res.status(404).json({
        message: "No reviews found for this product",
        averageRating: 0,
        numberOfRatings: 0,
      });
    }

    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRatings / reviews.length;

    return res.status(200).json({
      productId,
      averageRating: parseFloat(averageRating.toFixed(2)),
      numberOfRatings: reviews.length,
    });
  } catch (error) {
    console.error("Error getting product rating stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
