const express = require("express");
const router = express.Router();
const {
  createReport,
  getAllReports,
  deleteReview,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-report", authMiddleware, createReport);

router.get("/reports", getAllReports);

router.delete("/review/:id", deleteReview);

module.exports = router;
