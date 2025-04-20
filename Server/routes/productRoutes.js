const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  getUserProducts,
  updateProductStatus,
  getAllProducts11,
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
router.get("/products11", getAllProducts11);

router.get("/products/:id", getProductById);

router.get("/user-products", getUserProducts);

router.patch("/products/:id/status", updateProductStatus);

module.exports = router;
