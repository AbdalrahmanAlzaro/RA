import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Image,
  Package,
  Link,
} from "lucide-react";
import Swal from "sweetalert2";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    address: "",
    contact: "",
    productUrl: "", // Added productUrl to form state
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [otherImagePreviews, setOtherImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);

  const categories = ["Electronics", "Clothing", "Furniture", "Books", "Other"];

  const subCategoriesMap = {
    Electronics: ["Smartphones", "Laptops", "Cameras", "Accessories"],
    Clothing: ["Men", "Women", "Kids", "Sportswear"],
    Furniture: ["Living Room", "Bedroom", "Office", "Kitchen"],
    Books: ["Fiction", "Non-fiction", "Educational", "Comics"],
    Other: ["Miscellaneous"],
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Reset error when user types
    setError("");
  };

  // Handle category change to update subcategories
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({
      ...formData,
      category: selectedCategory,
      subCategory: "", // Reset sub-category when category changes
    });
  };

  // Handle main image upload
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle other images upload
  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // Limit to 4 files
    setOtherImages(files);

    // Create previews
    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        setOtherImagePreviews([...previews]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove main image
  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
  };

  // Remove other image
  const removeOtherImage = (index) => {
    const newImages = [...otherImages];
    newImages.splice(index, 1);
    setOtherImages(newImages);

    const newPreviews = [...otherImagePreviews];
    newPreviews.splice(index, 1);
    setOtherImagePreviews(newPreviews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!mainImage) {
      setError("Main image is required");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in first.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("subCategory", formData.subCategory);
    data.append("address", formData.address);
    data.append("contact", formData.contact);
    data.append("productUrl", formData.productUrl); // Added productUrl to form data
    data.append("mainImage", mainImage);
    otherImages.forEach((file) => {
      data.append("otherImages", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:4000/api/products-create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Product created successfully:", response.data);
      setSuccess(true);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        subCategory: "",
        address: "",
        contact: "",
        productUrl: "", // Reset productUrl
      });
      setMainImage(null);
      setMainImagePreview(null);
      setOtherImages([]);
      setOtherImagePreviews([]);

      if (formRef.current) {
        formRef.current.reset();
      }

      // Show SweetAlert on success
      Swal.fire({
        title: "Success!",
        text: "Product created successfully",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        window.location.href = "/product";
      });
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.response?.data?.message || "Error creating product");
      window.scrollTo({ top: 0, behavior: "smooth" });

      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Error creating product",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
            <div className="flex items-center">
              <Package className="text-white mr-3" size={24} />
              <h1 className="text-2xl font-bold text-white">Add New Product</h1>
            </div>
            <p className="text-blue-100 mt-1">
              Fill in the details to create a new product listing
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="flex items-center bg-green-50 text-green-700 p-4 border-l-4 border-green-500 my-4 mx-6">
              <Check className="mr-2" size={20} />
              <span>Product created successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center bg-red-50 text-red-700 p-4 border-l-4 border-red-500 my-4 mx-6">
              <AlertCircle className="mr-2" size={20} />
              <span>{error}</span>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter product title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Describe your product..."
                    required
                  />
                </div>

                {/* Product URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product URL (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="text-gray-400" size={16} />
                    </div>
                    <input
                      type="url"
                      name="productUrl"
                      value={formData.productUrl}
                      onChange={handleInputChange}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="https://example.com/product"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Category *
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    disabled={!formData.category}
                    required
                  >
                    <option value="">
                      {formData.category
                        ? "Select a sub-category"
                        : "Select a category first"}
                    </option>
                    {formData.category &&
                      subCategoriesMap[formData.category].map((subCat) => (
                        <option key={subCat} value={subCat}>
                          {subCat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter location (optional)"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter contact info (optional)"
                  />
                </div>

                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Image *
                  </label>
                  {mainImagePreview ? (
                    <div className="relative mt-2 rounded-lg overflow-hidden h-40 bg-gray-100">
                      <img
                        src={mainImagePreview}
                        alt="Main product"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="mb-2 text-gray-400" size={24} />
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                        </div>
                        <input
                          type="file"
                          name="mainImage"
                          onChange={handleMainImageChange}
                          className="hidden"
                          accept="image/*"
                          required
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Other Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Images (Up to 4)
                  </label>
                  <div className="mt-2">
                    {otherImagePreviews.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {otherImagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative rounded-lg overflow-hidden h-24 bg-gray-100"
                          >
                            <img
                              src={preview}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeOtherImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {otherImagePreviews.length < 4 && (
                          <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center">
                              <Image className="text-gray-400" size={20} />
                              <p className="text-xs text-gray-500 mt-1">
                                Add more
                              </p>
                            </div>
                            <input
                              type="file"
                              name="otherImages"
                              onChange={handleOtherImagesChange}
                              className="hidden"
                              accept="image/*"
                              multiple
                            />
                          </label>
                        )}
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="mb-2 text-gray-400" size={24} />
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">
                              Upload additional images
                            </span>
                          </p>
                          <p className="text-xs text-gray-400">Optional</p>
                        </div>
                        <input
                          type="file"
                          name="otherImages"
                          onChange={handleOtherImagesChange}
                          className="hidden"
                          accept="image/*"
                          multiple
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Product...
                  </span>
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
