const express = require("express");
const router = express.Router();
const {
  getUserData,
  updateUserData,
} = require("../controllers/userController");

router.get("/me", getUserData);
router.put("/me", updateUserData);

module.exports = router;
