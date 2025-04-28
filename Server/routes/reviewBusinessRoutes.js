const express = require("express");
const router = express.Router();
const reviewBusinessController = require("../controllers/reviewBusinessController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/reviews/create",
  authMiddleware,
  reviewBusinessController.addReview
);

router.get(
  "/reviews/business/:businessId",
  reviewBusinessController.getReviewsByBusinessId
);

router.get(
  "/reviews/business/:businessId/stats",
  reviewBusinessController.getReviewStatsByBusinessId
);

module.exports = router;
