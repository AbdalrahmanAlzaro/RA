const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const multer = require("../utils/multer");

router.post(
  "/writeReview",
  multer.single("image"),
  reviewController.createReview
);

router.put(
  "/updateReview/:id",
  multer.single("image"),
  reviewController.updateReview
);

router.delete("/deleteReview/:id", reviewController.deleteReview);

router.get("/allReviews", reviewController.getAllReviews);

router.get("/productRating/:productId", reviewController.getProductRatingStats);

router.get("/myReviews", reviewController.getUserReviews);

module.exports = router;
