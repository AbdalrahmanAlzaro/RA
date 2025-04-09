import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format the category name for display
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  // Subcategories mapping (same as your original)
  const subCategoriesMap = {
    Electronics: ["Smartphones", "Laptops", "Cameras", "Accessories"],
    Clothing: ["Men", "Women", "Kids", "Sportswear"],
    Furniture: ["Living Room", "Bedroom", "Office", "Kitchen"],
    Books: ["Fiction", "Non-fiction", "Educational", "Comics"],
    Other: ["Miscellaneous"],
  };

  // Static images for each category (same as your original)
  const categoryImages = {
    Electronics:
      "https://img.freepik.com/premium-photo/photo-computer-peripherals_778780-49866.jpg",
    Clothing:
      "https://img.freepik.com/free-photo/flatlay-outfit-travel_53876-138233.jpg",
    Furniture:
      "https://img.freepik.com/premium-photo/interior-design-concept-sale-home-decorations-furniture-promotions-discounts_1226542-5693.jpg",
    Books:
      "https://img.freepik.com/premium-photo/pile-paperback-books-table_93675-129046.jpg",
    Other:
      "https://img.freepik.com/free-photo/travel-still-life-pack-top-view_23-2148837310.jpg",
  };

  // Fetch products for this category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products", {
          params: {
            category: formattedCategory,
            status: "approved",
          },
        });
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, formattedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Home
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {formattedCategory}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Category header with image */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 bg-gray-50 rounded-xl p-6">
        <div className="md:w-1/3">
          <img
            src={categoryImages[formattedCategory]}
            alt={`${formattedCategory} category`}
            className="rounded-lg shadow-md w-full h-auto object-cover aspect-[4/3]"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {formattedCategory}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {subCategoriesMap[formattedCategory]?.map((subCategory) => (
              <Link
                key={subCategory}
                to={`/category/${category}/${subCategory
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-all border border-gray-200"
              >
                <span className="font-medium text-gray-700">{subCategory}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* All products in this category */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          All Products in {formattedCategory}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <img
                  src={`http://localhost:4000/${product.mainImage}`}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-medium text-gray-800 mb-1">
                    {product.title}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-600">
                      {product.description}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No products found in this category
            </h3>
            <p className="text-gray-500 mb-4">
              There are currently no products available in {formattedCategory}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
