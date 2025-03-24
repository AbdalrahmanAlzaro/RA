const express = require("express");
const router = express.Router();
const { createProduct } = require("../controllers/productController");
const upload = require("../utils/multer");

router.post(
  "/products-create",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "otherImages", maxCount: 4 },
  ]),
  createProduct
);

module.exports = router;
