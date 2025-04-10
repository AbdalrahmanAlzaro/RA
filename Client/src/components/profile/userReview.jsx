import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MessageSquare,
  Star,
  Clock,
  ShoppingBag,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

const UserReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          "http://localhost:4000/api/reviews/myReviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReviews(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, []);

  // Rating stars component
  const RatingStars = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating}/5
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading your reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={24} />
            <p className="text-red-700">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-8">
        <MessageSquare className="text-indigo-600 mr-3" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">My Reviews</h1>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <MessageSquare className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600 font-medium">
            You haven't written any reviews yet.
          </p>
          <p className="text-gray-500 mt-2">
            Once you review products, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {review.title}
                  </h3>
                  <RatingStars rating={review.rating} />
                </div>

                <p className="text-gray-600 mb-4">{review.description}</p>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <ShoppingBag size={16} className="mr-2" />
                  <span>Product: {review.Product.title}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-2" />
                  <span>
                    Reviewed on:{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {review.image && (
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-700 mb-2">
                      <ImageIcon size={16} className="mr-2" />
                      <span>Attached Image</span>
                    </div>
                    <div className="relative rounded-md overflow-hidden bg-gray-100 inline-block">
                      <img
                        src={`http://localhost:4000/${review.image}`}
                        alt="Review attachment"
                        className="max-w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReview;
