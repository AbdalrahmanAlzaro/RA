const express = require("express");
const router = express.Router();
const { createReport } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-report", authMiddleware, createReport);

module.exports = router;
