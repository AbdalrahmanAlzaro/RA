import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CategoryProductsPage = () => {
  // Get URL parameters
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format the subcategory name for display (replace hyphens with spaces)
  const formattedSubcategory = subcategory.replace(/-/g, " ");

  // Fetch products for this category/subcategory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products", {
          params: {
            category: category.charAt(0).toUpperCase() + category.slice(1),
            subcategory: formattedSubcategory,
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
  }, [category, subcategory, formattedSubcategory]);

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
          <li>
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
              <Link
                to={`/category/${category}`}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            </div>
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
                {formattedSubcategory}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {formattedSubcategory.charAt(0).toUpperCase() +
            formattedSubcategory.slice(1)}
        </h1>
        <p className="text-gray-600">
          Browse all products in {category} &gt; {formattedSubcategory}
        </p>
      </div>

      {/* Products grid */}
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
            There are currently no products available in {formattedSubcategory}.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Browse all categories
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;
