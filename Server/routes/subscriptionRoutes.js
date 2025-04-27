const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

router.get("/get-all", subscriptionController.getAllSubscriptions);

router.put(
  "/update-single-subscription/:id",
  subscriptionController.updateSubscription
);

module.exports = router;
