const { Product } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

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

const getAllProducts = async (req, res) => {
  try {
    const { category, subCategory, sort, search, page, limit } = req.query;
    const { Op } = require("sequelize");

    const filter = { status: "approved" };
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;

    if (search) {
      filter[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * itemsPerPage;

    const order = [];
    if (sort === "newest") {
      order.push(["createdAt", "DESC"]);
    } else if (sort === "oldest") {
      order.push(["createdAt", "ASC"]);
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: filter,
      order,
      limit: itemsPerPage,
      offset,
    });

    res.status(200).json({
      message: "Products retrieved successfully",
      products,
      totalCount: count,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / itemsPerPage),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const response = {
      message: "Product retrieved successfully",
      product: {
        ...product.toJSON(),
        otherImages: product.otherImages ? product.otherImages.split(",") : [],
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving product", error: error.message });
  }
};

module.exports = { createProduct, getAllProducts, getProductById };
