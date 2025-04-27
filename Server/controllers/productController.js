const { Product } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const categories = ["Electronics", "Clothing", "Furniture", "Books", "Other"];

const subCategoriesMap = {
  Electronics: ["Smartphones", "Laptops", "Cameras", "Accessories"],
  Clothing: ["Men", "Women", "Kids", "Sportswear"],
  Furniture: ["Living Room", "Bedroom", "Office", "Kitchen"],
  Books: ["Fiction", "Non-fiction", "Educational", "Comics"],
  Other: ["Miscellaneous"],
};

const createProduct = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const {
      title,
      description,
      category,
      subCategory,
      address,
      contact,
      productUrl,
    } = req.body;

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
      productUrl: productUrl || null, // Added productUrl
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
    const { category, subcategory, sort, search, page, limit } = req.query;
    const { Op } = require("sequelize");

    const filter = { status: "approved" };

    if (category) {
      const normalizedCategory = categories.find(
        (c) => c.toLowerCase() === category.toLowerCase()
      );
      if (!normalizedCategory) {
        return res.status(400).json({ message: "Invalid category" });
      }
      filter.category = { [Op.iLike]: normalizedCategory };
    }

    if (subcategory) {
      if (category) {
        const normalizedCategory = categories.find(
          (c) => c.toLowerCase() === category.toLowerCase()
        );
        const validSubcategories = subCategoriesMap[normalizedCategory] || [];
        const normalizedSubcategory = validSubcategories.find(
          (sc) => sc.toLowerCase() === subcategory.toLowerCase()
        );

        if (!normalizedSubcategory) {
          return res.status(400).json({
            message: "Invalid subcategory for the specified category",
          });
        }
        filter.subCategory = { [Op.iLike]: normalizedSubcategory };
      } else {
        const allSubcategories = Object.values(subCategoriesMap).flat();
        const normalizedSubcategory = allSubcategories.find(
          (sc) => sc.toLowerCase() === subcategory.toLowerCase()
        );

        if (!normalizedSubcategory) {
          return res.status(400).json({ message: "Invalid subcategory" });
        }
        filter.subCategory = { [Op.iLike]: normalizedSubcategory };
      }
    }

    if (search) {
      filter[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { productUrl: { [Op.iLike]: `%${search}%` } }, // Added productUrl to search
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

const getAllProducts11 = async (req, res) => {
  try {
    const { category, subcategory, sort, search, page, limit } = req.query;
    const { Op } = require("sequelize");

    const filter = {};

    if (category) {
      const normalizedCategory = categories.find(
        (c) => c.toLowerCase() === category.toLowerCase()
      );
      if (!normalizedCategory) {
        return res.status(400).json({ message: "Invalid category" });
      }
      filter.category = { [Op.iLike]: normalizedCategory };
    }

    if (subcategory) {
      if (category) {
        const normalizedCategory = categories.find(
          (c) => c.toLowerCase() === category.toLowerCase()
        );
        const validSubcategories = subCategoriesMap[normalizedCategory] || [];
        const normalizedSubcategory = validSubcategories.find(
          (sc) => sc.toLowerCase() === subcategory.toLowerCase()
        );

        if (!normalizedSubcategory) {
          return res.status(400).json({
            message: "Invalid subcategory for the specified category",
          });
        }
        filter.subCategory = { [Op.iLike]: normalizedSubcategory };
      } else {
        const allSubcategories = Object.values(subCategoriesMap).flat();
        const normalizedSubcategory = allSubcategories.find(
          (sc) => sc.toLowerCase() === subcategory.toLowerCase()
        );

        if (!normalizedSubcategory) {
          return res.status(400).json({ message: "Invalid subcategory" });
        }
        filter.subCategory = { [Op.iLike]: normalizedSubcategory };
      }
    }

    if (search) {
      filter[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { productUrl: { [Op.iLike]: `%${search}%` } }, // Added productUrl to search
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

const getUserProducts = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { page, limit } = req.query;

    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * itemsPerPage;

    const { count, rows: products } = await Product.findAndCountAll({
      where: { userId },
      limit: itemsPerPage,
      offset,
    });

    res.status(200).json({
      message: "User's products retrieved successfully",
      products,
      totalCount: count,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / itemsPerPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving user's products",
      error: error.message,
    });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "approved", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = status;
    await product.save();

    res.status(200).json({
      message: "Product status updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating product status",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getUserProducts,
  updateProductStatus,
  getAllProducts11,
};
