const { Report } = require("../models");

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

module.exports = {
  createReport,
};
