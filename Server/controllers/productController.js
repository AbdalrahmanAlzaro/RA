const { Product } = require("../models");
const jwt = require("jsonwebtoken");
const upload = require("../utils/multer");

const createProduct = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { title, description, category, subCategory, address, contact } =
      req.body;

    const mainImage = req.files["mainImage"][0].path;
    const otherImages = req.files["otherImages"].map((file) => file.path);

    const product = await Product.create({
      title,
      description,
      mainImage,
      otherImages: otherImages.join(","),
      category,
      subCategory,
      address: address || null,
      contact: contact || null,
      status: "pending",
      userId,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

module.exports = { createProduct };
