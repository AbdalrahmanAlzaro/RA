const express = require("express");
const router = express.Router();
const {
  createSubscription,
  getBusinessByToken,
  updateBusinessDetails,
} = require("../controllers/subscriptionUserController");
const upload = require("../utils/multer");

router.post("/create", upload.single("mainImage"), createSubscription);

router.get("/get-business", getBusinessByToken);

router.put(
  "/update-business",
  upload.single("mainImage"),
  updateBusinessDetails
);

module.exports = router;
