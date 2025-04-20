const { Report, Review, User } = require("../models");

const createReport = async (req, res) => {
  try {
    const { reviewId, reason } = req.body;
    const userId = req.user.id;

    if (!reviewId || !reason) {
      return res
        .status(400)
        .json({ message: "Review ID and reason are required." });
    }

    const report = await Report.create({ reviewId, userId, reason });

    return res.status(201).json({
      message: "Report created successfully.",
      report,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Review,
          attributes: [
            "id",
            "title",
            "description",
            "image",
            "rating",
            "createdAt",
          ],
        },
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    await review.destroy();

    await Report.destroy({ where: { reviewId } });

    return res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createReport,
  getAllReports,
  deleteReview,
};
