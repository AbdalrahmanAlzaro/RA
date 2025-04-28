const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsForService,
} = require("../controllers/serviceReviewController");

router.post("/reviews/services/create", createReview);

router.get("/reviews/service/:serviceId", getReviewsForService);

module.exports = router;
