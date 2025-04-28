import React, { useState } from "react";
import axios from "axios";
import { Star, Send, Loader, AlertCircle, CheckCircle } from "lucide-react";

const AddBusinessReview = ({ id, onReviewAdded }) => {
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in to submit a review.");
      return;
    }

    const reviewData = {
      businessId: id,
      description,
      rating,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/reviews/create",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      if (response.status === 201) {
        setMessage("Review submitted successfully.");
        setDescription("");
        setRating(0);
        if (onReviewAdded) {
          onReviewAdded(); // Notify parent component
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Something went wrong.");
      } else {
        setMessage("Failed to submit review. Please try again later.");
      }
      console.error("Error submitting review:", error);
    }
  };

  const StarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className="focus:outline-none"
          >
            <Star
              size={24}
              className={`${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } transition-colors duration-200 hover:text-yellow-400`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-100 mb-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Add a Review
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Write your review here..."
            required
            rows="4"
            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition duration-200"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700"
          >
            Rating
          </label>
          <StarRating />
          <input type="hidden" id="rating" value={rating} required />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin mr-2" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send size={18} className="mr-2" />
              <span>Submit Review</span>
            </>
          )}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg flex items-center ${
            message.includes("success")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.includes("success") ? (
            <CheckCircle size={18} className="mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          )}
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
};

export default AddBusinessReview;
