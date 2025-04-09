import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Image as ImageIcon,
  ArrowUpRight,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/products/${id}`
        );

        if (response.data && response.data.product) {
          setProduct(response.data.product);
        } else {
          setError("Invalid product data format");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching product");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://via.placeholder.com/500x500?text=Image+Not+Available";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:4000/${imagePath.replace(/^\//, "")}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = () => {
    switch (product.status) {
      case "approved":
        return "bg-green-50 text-green-600 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      default:
        return "bg-red-50 text-red-600 border-red-200";
    }
  };

  const images = product
    ? [product.mainImage, ...(product.otherImages || [])]
    : [];

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center"
        >
          <ImageIcon className="text-white" size={48} />
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-2xl rounded-2xl p-8 text-center max-w-md"
        >
          <X className="mx-auto mb-4 text-red-500" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
        </motion.div>
      </div>
    );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#f4f4f6] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Navigation */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="mr-2" />
            Back to Catalog
          </motion.button>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide 
              ${getStatusColor()} border`}
          >
            {product.status}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 p-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={getImageUrl(images[currentImageIndex])}
                alt={`${product.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-[500px] object-contain"
              />
            </motion.div>

            {images.length > 1 && (
              <div className="flex justify-center space-x-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden transition-all 
                      ${
                        index === currentImageIndex
                          ? "ring-2 ring-indigo-500 scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.title}
              <ArrowUpRight
                className="inline-block ml-3 text-indigo-600"
                size={28}
              />
            </h1>

            <div className="flex items-center space-x-4 text-gray-600">
              <CheckCircle className="text-green-500" size={20} />
              <span className="capitalize">{product.category}</span>
              {product.subCategory && (
                <>
                  <span>•</span>
                  <span className="capitalize">{product.subCategory}</span>
                </>
              )}
            </div>

            <div className="prose max-w-none text-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Description
              </h3>
              <p className="leading-relaxed">{product.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Clock className="text-indigo-500" size={20} />
                <div>
                  <h4 className="text-sm text-gray-500">Created At</h4>
                  <p className="text-gray-700">
                    {formatDate(product.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="text-indigo-500" size={20} />
                <div>
                  <h4 className="text-sm text-gray-500">Last Updated</h4>
                  <p className="text-gray-700">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {(product.address || product.contact) && (
              <div className="pt-6 border-t space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Contact Information
                </h3>
                {product.address && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <ArrowUpRight className="text-indigo-500" size={20} />
                    <p>{product.address}</p>
                  </div>
                )}
                {product.contact && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <ArrowUpRight className="text-indigo-500" size={20} />
                    <p>{product.contact}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetails;
