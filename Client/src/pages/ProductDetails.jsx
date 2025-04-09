import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  Image as ImageIcon,
  ArrowUpRight,
  CheckCircle,
  Clock,
  X,
  Star,
  Edit,
  Trash2,
  Send,
  MessageSquare,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    title: "",
    description: "",
    rating: "",
    image: null,
  });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ratingStats, setRatingStats] = useState(null);

  useEffect(() => {
    const fetchRatingStats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/reviews/productRating/${id}`
        );
        setRatingStats(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to load product rating");
      } finally {
        setLoading(false);
      }
    };

    fetchRatingStats();
  }, [id]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/products/${id}`),
          axios.get("http://localhost:4000/api/reviews/allReviews"),
        ]);

        if (productRes.data?.product) setProduct(productRes.data.product);

        const productReviews = reviewsRes.data.filter(
          (r) => r.productId === Number(id)
        );
        setReviews(productReviews);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching product/reviews"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setReviewForm({ ...reviewForm, rating });
  };

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

  const handleImageChange = (e) => {
    setReviewForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", reviewForm.title);
    formData.append("description", reviewForm.description);
    formData.append("rating", reviewForm.rating);
    formData.append("productId", id);
    if (reviewForm.image) formData.append("image", reviewForm.image);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };
      if (editingReviewId) {
        await axios.put(
          `http://localhost:4000/api/reviews/updateReview/${editingReviewId}`,
          formData,
          { headers }
        );
      } else {
        await axios.post(
          "http://localhost:4000/api/reviews/writeReview",
          formData,
          {
            headers,
          }
        );
      }
      setReviewForm({ title: "", description: "", rating: "", image: null });
      setEditingReviewId(null);
      // Refresh reviews
      const reviewsRes = await axios.get(
        "http://localhost:4000/api/reviews/allReviews"
      );
      const productReviews = reviewsRes.data.filter(
        (r) => r.productId === Number(id)
      );
      setReviews(productReviews);
    } catch (err) {
      alert(err.response?.data?.message || "Review operation failed");
    }
  };

  const handleEdit = (review) => {
    setReviewForm({
      title: review.title,
      description: review.description,
      rating: review.rating,
      image: null,
    });
    setEditingReviewId(review.id);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(
        `http://localhost:4000/api/reviews/deleteReview/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  const clearForm = () => {
    setReviewForm({ title: "", description: "", rating: 0 });
    setEditingReviewId(null);
    setSelectedImage(null);
    setPreviewImage(null);
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
        <div
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
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-2xl rounded-2xl p-8 text-center max-w-md"
        >
          <X className="mx-auto mb-4 text-red-500" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden"
      >
        {/* Navigation */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <ChevronLeft className="mr-2" />
            Back to Catalog
          </button>
          <div
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide 
          ${getStatusColor()} border shadow-sm`}
          >
            {product.status}
          </div>
          <div className="bg-gray-50 p-4 rounded-xl shadow-md max-w-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Product Rating
            </h3>
            <p className="flex items-center gap-2">
              Average Rating:{" "}
              <strong className="text-amber-500">
                {ratingStats.averageRating}
              </strong>
              <span className="text-yellow-400 text-lg">⭐</span>
            </p>
            <p className="text-gray-600">
              Rated by{" "}
              <strong className="text-gray-800">
                {ratingStats.numberOfRatings}
              </strong>{" "}
              user(s)
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 p-8">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100"
            >
              <img
                src={getImageUrl(images[currentImageIndex])}
                alt={`${product.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-[500px] object-contain p-2"
              />
            </div>

            {images.length > 1 && (
              <div className="flex justify-center space-x-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 border
                  ${
                    index === currentImageIndex
                      ? "ring-2 ring-indigo-500 scale-105 border-indigo-200"
                      : "opacity-70 hover:opacity-100 border-gray-200"
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
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
              {product.title}
              <ArrowUpRight className="ml-3 text-indigo-600" size={28} />
            </h1>

            <div className="flex items-center space-x-4 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg inline-flex">
              <CheckCircle className="text-green-500" size={20} />
              <span className="capitalize font-medium">{product.category}</span>
              {product.subCategory && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="capitalize font-medium">
                    {product.subCategory}
                  </span>
                </>
              )}
            </div>

            <div className="prose max-w-none text-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Description
              </h3>
              <p className="leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                <Clock className="text-indigo-500" size={20} />
                <div>
                  <h4 className="text-sm text-gray-500 font-medium">
                    Created At
                  </h4>
                  <p className="text-gray-700">
                    {formatDate(product.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                <Clock className="text-indigo-500" size={20} />
                <div>
                  <h4 className="text-sm text-gray-500 font-medium">
                    Last Updated
                  </h4>
                  <p className="text-gray-700">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {(product.address || product.contact) && (
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Contact Information
                </h3>
                {product.address && (
                  <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                    <ArrowUpRight className="text-indigo-500" size={20} />
                    <p className="font-medium">{product.address}</p>
                  </div>
                )}
                {product.contact && (
                  <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                    <ArrowUpRight className="text-indigo-500" size={20} />
                    <p className="font-medium">{product.contact}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="p-8 space-y-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="text-indigo-500" size={24} />
            Customer Reviews
          </h2>
          {reviews.length > 0 ? (
            <div
              className="space-y-6 overflow-y-auto pr-2"
              style={{ maxHeight: "600px" }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-white relative"
                >
                  {review.image && (
                    <div className="mb-5 overflow-hidden rounded-xl shadow-md">
                      <img
                        src={`http://localhost:4000/${review.image}`}
                        alt=""
                        className="w-full h-64 object-cover object-center transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-800">
                      {review.title}
                    </h3>
                    <span className="text-yellow-500 flex bg-yellow-50 p-1.5 rounded-lg shadow-sm">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={22}
                          fill={i < review.rating ? "#facc15" : "none"}
                          stroke={i < review.rating ? "#facc15" : "#d1d5db"}
                          className="drop-shadow-sm"
                        />
                      ))}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed text-lg">
                    {review.description}
                  </p>
                  <p className="text-gray-500 mb-4 italic text-sm">
                    {review.User.email}
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        {review.User?.name || "Anonymous"}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>

                    {review.User?.id === userId && (
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:bg-indigo-50 px-3 py-1 rounded-lg"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:bg-red-50 px-3 py-1 rounded-lg"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-lg">
                No reviews yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>
      {/* review form */}

      <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <h2 className="text-3xl font-bold">Write a Review</h2>
          <p className="text-indigo-100 mt-2 text-lg">
            Share your experience with our product
          </p>
        </div>

        {/* Review Form */}
        <div className="bg-white p-8 border-t border-gray-200">
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-800">
                {editingReviewId ? "Edit Your Review" : "Your Feedback"}
              </h3>
              {editingReviewId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Star Rating Input */}
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">
                Your Rating
              </label>
              <div className="flex gap-2 bg-gray-50 p-3 rounded-xl inline-flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => handleRatingClick(rating)}
                    className="focus:outline-none text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      fill={
                        (hoveredRating || reviewForm.rating) >= rating
                          ? "#facc15"
                          : "none"
                      }
                      stroke={
                        (hoveredRating || reviewForm.rating) >= rating
                          ? "#facc15"
                          : "#d1d5db"
                      }
                      className="transition-colors duration-200 drop-shadow-sm"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                name="title"
                value={reviewForm.title}
                onChange={handleInputChange}
                placeholder="What's most important to know?"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm text-lg"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                name="description"
                value={reviewForm.description}
                onChange={handleInputChange}
                placeholder="What did you like or dislike? How was your experience?"
                required
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm text-lg"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Add Photos (optional)
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition bg-indigo-50 px-4 py-3 rounded-lg hover:bg-indigo-100">
                  <ImageIcon size={22} />
                  <span className="font-medium">Upload Image</span>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg shadow-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setPreviewImage(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              {editingReviewId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md font-medium text-lg"
              >
                <Send size={18} />
                {editingReviewId ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
