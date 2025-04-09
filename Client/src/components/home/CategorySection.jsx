import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CategorySection = () => {
  const categories = ["Electronics", "Clothing", "Furniture", "Books", "Other"];
  const subCategoriesMap = {
    Electronics: ["Smartphones", "Laptops", "Cameras", "Accessories"],
    Clothing: ["Men", "Women", "Kids", "Sportswear"],
    Furniture: ["Living Room", "Bedroom", "Office", "Kitchen"],
    Books: ["Fiction", "Non-fiction", "Educational", "Comics"],
    Other: ["Miscellaneous"],
  };

  const [activeCategory, setActiveCategory] = useState("Electronics");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static images for each category
  const categoryImages = {
    Electronics:
      "https://img.freepik.com/premium-photo/photo-computer-peripherals_778780-49866.jpg?ga=GA1.1.905776187.1727602890&semt=ais_hybrid&w=740",
    Clothing:
      "https://img.freepik.com/free-photo/flatlay-outfit-travel_53876-138233.jpg?ga=GA1.1.905776187.1727602890&semt=ais_hybrid&w=740",
    Furniture:
      "https://img.freepik.com/premium-photo/interior-design-concept-sale-home-decorations-furniture-promotions-discounts-it-is-surrounded-by-beds-sofas-armchairs-advertising-spaces-banner-white-background-3d-render_1226542-5693.jpg?ga=GA1.1.905776187.1727602890&semt=ais_hybrid&w=740",
    Books:
      "https://img.freepik.com/premium-photo/pile-paperback-books-table_93675-129046.jpg?ga=GA1.1.905776187.1727602890&semt=ais_hybrid&w=740",
    Other:
      "https://img.freepik.com/free-photo/travel-still-life-pack-top-view_23-2148837310.jpg?ga=GA1.1.905776187.1727602890&semt=ais_hybrid&w=740",
  };

  // Fetch products for the selected category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products", {
          params: { category: activeCategory, status: "approved" },
        });
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const categoryIcons = {
    Electronics: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    Clothing: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    Furniture: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    Books: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    Other: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
        />
      </svg>
    ),
  };

  const categoryColors = {
    Electronics: "bg-blue-50",
    Clothing: "bg-purple-50",
    Furniture: "bg-amber-50",
    Books: "bg-green-50",
    Other: "bg-gray-50",
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Browse Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore and rate products across our most popular categories
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar">
          <div className="flex space-x-2 mx-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center px-5 py-3 rounded-lg transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span className="mr-2">{categoryIcons[category]}</span>
                <span className="font-medium">{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Category Display */}
        <div
          className={`rounded-xl p-6 mb-8 ${categoryColors[activeCategory]}`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <img
                src={categoryImages[activeCategory]} // Use the static image based on the active category
                alt={`${activeCategory} category`}
                className="rounded-lg shadow-md w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {activeCategory}
              </h3>
              <p className="text-gray-600 mb-6">
                {/* Display category description here */}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {subCategoriesMap[activeCategory].map((subCategory) => (
                  <Link
                    key={subCategory}
                    to={`/category/${activeCategory.toLowerCase()}/${subCategory
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-all border border-gray-200"
                  >
                    <span className="font-medium text-gray-700">
                      {subCategory}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Products Preview */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Top Rated in {activeCategory}
            </h3>
            <Link
              to={`product`}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              View all
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div>Loading...</div>
            ) : (
              products.map((product) => (
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
              ))
            )}
          </div>
        </div>

        {/* View all categories link */}
        <div className="mt-10 text-center">
          <Link
            to="/product"
            className="text-lg font-medium text-indigo-600 hover:text-indigo-800"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
