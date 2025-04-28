const express = require("express");
const router = express.Router();
const {
  createSubscription,
  getBusinessByToken,
  updateBusinessDetails,
  getAllBusinesses,
  updateBusinessStatus,
  getActiveBusiness,
  getBusinessById,
} = require("../controllers/subscriptionUserController");
const upload = require("../utils/multer");

router.post("/create", upload.single("mainImage"), createSubscription);

router.get("/get-business", getBusinessByToken);

router.put(
  "/update-business",
  upload.single("mainImage"),
  updateBusinessDetails
);

router.get("/get-all-businesses", getAllBusinesses);

router.put("/update-status", updateBusinessStatus);

router.get("/get-active-business", getActiveBusiness);

router.get("/get-business/:businessId", getBusinessById);

module.exports = router;
