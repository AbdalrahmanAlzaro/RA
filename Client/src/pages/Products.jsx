import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Package,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    subCategory: "",
    sort: "",
    search: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/products", {
        params: {
          ...filters,
          page: currentPage,
          limit: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const productsData = response.data.products;
      setProducts(productsData);

      const totalCount = response.data.totalCount || productsData.length;
      setTotalPages(Math.ceil(totalCount / itemsPerPage));

      const uniqueCategories = [
        ...new Set(productsData.map((product) => product.category)),
      ].filter(Boolean);

      const uniqueSubCategories = [
        ...new Set(productsData.map((product) => product.subCategory)),
      ].filter(Boolean);

      setCategories(uniqueCategories);
      setSubCategories(uniqueSubCategories);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleSearchInputChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      subCategory: "",
      sort: "",
      search: "",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-600 mt-1">
              Browse our collection of products
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleSearchInputChange}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filters Section - Collapsible */}
        {showFilters && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Filter size={18} className="mr-2" /> Filter Products
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm"
                >
                  <X size={16} /> Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Category
                </label>
                <select
                  name="subCategory"
                  value={filters.subCategory}
                  onChange={handleFilterChange}
                  className="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!filters.category}
                >
                  <option value="">All Sub-Categories</option>
                  {subCategories
                    .filter((sub) =>
                      products.some(
                        (product) =>
                          product.category === filters.category &&
                          product.subCategory === sub
                      )
                    )
                    .map((subCategory) => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">None</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* No Products Found */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800">
              No products found
            </h3>
            <p className="text-gray-600 mt-2">
              Try adjusting your filters or search terms
            </p>
            {(filters.category ||
              filters.subCategory ||
              filters.sort ||
              filters.search) && (
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <X size={16} className="mr-1" /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`http://localhost:4000/${product.mainImage}`}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
                        {product.category}
                      </span>
                      {product.subCategory && (
                        <span className="inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded-md ml-2">
                          {product.subCategory}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {product.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-1 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md flex items-center justify-center ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show only current page, first, last, and adjacent pages
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md ${
                            currentPage === page
                              ? "bg-indigo-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={page}
                          className="w-10 h-10 flex items-center justify-center text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md flex items-center justify-center ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        )}
      </div>
      <br />
      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to experience better reviews?</span>
            <span className="block text-blue-200">
              Join our community today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Sign Up
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
