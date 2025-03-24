import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    address: "",
    contact: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle main image upload
  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  // Handle other images upload
  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // Limit to 4 files
    setOtherImages(files);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
      setError("No token found. Please log in.");
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
    data.append("mainImage", mainImage);
    otherImages.forEach((file, index) => {
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
      alert("Product created successfully!");
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        subCategory: "",
        address: "",
        contact: "",
      });
      setMainImage(null);
      setOtherImages([]);
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.response?.data?.message || "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Sub Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Sub Category
          </label>
          <input
            type="text"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Address (Optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Contact (Optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Contact
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Main Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Main Image
          </label>
          <input
            type="file"
            name="mainImage"
            onChange={handleMainImageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Other Images (Up to 4) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Other Images (Up to 4)
          </label>
          <input
            type="file"
            name="otherImages"
            onChange={handleOtherImagesChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            multiple
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
