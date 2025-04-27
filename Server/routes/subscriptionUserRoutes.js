const express = require("express");
const router = express.Router();
const {
  createSubscription,
} = require("../controllers/subscriptionUserController");
const upload = require("../utils/multer");

router.post("/create", upload.single("mainImage"), createSubscription);

module.exports = router;
