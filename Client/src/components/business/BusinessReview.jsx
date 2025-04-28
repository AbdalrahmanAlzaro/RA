import React, { useState, useEffect } from "react";
import axios from "axios";

const BusinessReview = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/reviews/business/${id}`
        );
        setReviews(response.data.reviews);
      } catch (err) {
        setError("No review available.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Reviews</h1>
      <div>
        {/* Display first 2 reviews */}
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-lg">{review.User.name}</span>
              <span className="text-gray-500">
                {new Date(review.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm mb-2">{review.description}</p>
            <div className="text-yellow-500">
              {"★".repeat(review.rating)} {"☆".repeat(5 - review.rating)}
            </div>
          </div>
        ))}

        {/* Display remaining reviews in a scrollable container */}
        <div className="max-h-60 ">
          {reviews.slice(2).map((review) => (
            <div key={review.id} className="border-b pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-lg">{review.User.name}</span>
                <span className="text-gray-500">
                  {new Date(review.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm mb-2">{review.description}</p>
              <div className="text-yellow-500">
                {"★".repeat(review.rating)} {"☆".repeat(5 - review.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessReview;
