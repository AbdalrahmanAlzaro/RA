const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");
const upload = require("../utils/multer");

router.post(
  "/products-create",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "otherImages", maxCount: 4 },
  ]),
  createProduct
);

router.get("/products", getAllProducts);

router.get("/products/:id", getProductById);

module.exports = router;
