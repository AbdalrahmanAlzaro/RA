import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  Loader,
  AlertCircle,
  ArrowLeft,
  Heart,
  MessageSquare,
  Star,
  Share2,
} from "lucide-react";

const ProductMarketsDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    title: "",
    description: "",
    rating: 5,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [liked, setLiked] = useState(false);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchServiceAndReviews = async () => {
      try {
        setLoading(true);

        // Fetch service details
        const serviceResponse = await axios.get(
          `http://localhost:4000/api/services/service/${id}`
        );
        setService(serviceResponse.data);
        setActiveImage(
          `http://localhost:4000/uploads/${serviceResponse.data.mainImage}`
        );

        // Fetch service reviews
        const reviewsResponse = await axios.get(
          `http://localhost:4000/api/reviews/service/${id}`
        );

        const fetchedReviews = reviewsResponse.data.reviews;
        setReviews(fetchedReviews);

        // Calculate average rating
        if (fetchedReviews.length > 0) {
          const totalRating = fetchedReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          setAvgRating((totalRating / fetchedReviews.length).toFixed(1));
        }
      } catch (error) {
        console.error("Error fetching service or reviews:", error);
        setError("Failed to load service details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndReviews();
  }, [id]);

  const handleSubImageClick = (url) => {
    setActiveImage(url);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated.");
      }

      await axios.post(
        "http://localhost:4000/api/reviews/services/create",
        {
          serviceId: id,
          title: newReview.title,
          description: newReview.description,
          rating: newReview.rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh reviews after successful submit
      const reviewsResponse = await axios.get(
        `http://localhost:4000/api/reviews/service/${id}`
      );

      const updatedReviews = reviewsResponse.data.reviews;
      setReviews(updatedReviews);

      // Recalculate average rating
      if (updatedReviews.length > 0) {
        const totalRating = updatedReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        setAvgRating((totalRating / updatedReviews.length).toFixed(1));
      }

      setNewReview({ title: "", description: "", rating: 5 }); // Reset form with 5 stars default
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please login and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
        <p className="text-gray-600 text-xl font-medium">
          Loading service details...
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <p className="text-red-500 text-xl font-medium">{error}</p>
        <button
          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Service Not Found State
  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <p className="text-red-500 text-xl font-medium">Service not found</p>
        <button
          className="mt-6 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-md flex items-center"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  const mainImageUrl = `http://localhost:4000/uploads/${service.mainImage}`;
  const subImagesUrls = service.subImage
    .split(",")
    .map((img) => `http://localhost:4000/uploads/${img.trim()}`);

  return (
    <div className="min-h-screen pb-16">
      <div className="h-72 w-full relative overflow-hidden">
        <img
          src={mainImageUrl}
          alt={service.title}
          className="w-full h-full object-cover  absolute"
        />
        <div className="absolute inset-0 "></div>
        <div className="max-w-6xl mx-auto h-full flex items-end px-6 relative z-10">
          <nav className="absolute top-6 left-6">
            <button
              className="flex items-center text-black bg-white  20 px-4 py-2 rounded-full hover:bg-opacity-30 transition-colors shadow-md"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Services
            </button>
          </nav>
          <h1 className="text-5xl font-bold text-black mb-8 drop-shadow-lg tracking-tight">
            {service.title}
          </h1>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Column - Images */}
            <div className="col-span-3">
              <div className="mb-6 overflow-hidden rounded-xl shadow-lg bg-white group relative">
                <img
                  src={activeImage || mainImageUrl}
                  alt={service.title}
                  className="w-full h-96 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div
                  className={`cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
                    activeImage === mainImageUrl
                      ? "ring-2 ring-indigo-500 scale-105 shadow-indigo-100 shadow-lg"
                      : ""
                  }`}
                  onClick={() => handleSubImageClick(mainImageUrl)}
                >
                  <img
                    src={mainImageUrl}
                    alt="Main Service"
                    className="w-full h-20 object-cover"
                  />
                </div>

                {subImagesUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
                      activeImage === url
                        ? "ring-2 ring-indigo-500 scale-105 shadow-indigo-100 shadow-lg"
                        : ""
                    }`}
                    onClick={() => handleSubImageClick(url)}
                  >
                    <img
                      src={url}
                      alt={`Sub Image ${index}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="flex items-center bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-full shadow-sm">
                    <Star className="w-6 h-6 text-yellow-500 mr-2 fill-yellow-500" />
                    <span className="font-semibold text-lg text-yellow-700">
                      {avgRating > 0 ? avgRating : "New"}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      ({reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-indigo-900 flex items-center">
                  <span className="w-2 h-6 bg-indigo-500 rounded mr-3 block"></span>
                  About This Service
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-100 shadow-sm transition-all duration-300 hover:shadow-md">
                  <Calendar className="w-6 h-6 text-indigo-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                      Created
                    </p>
                    <p className="font-medium text-gray-800">
                      {new Date(service.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-100 shadow-sm transition-all duration-300 hover:shadow-md">
                  <Clock className="w-6 h-6 text-indigo-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                      Last Updated
                    </p>
                    <p className="font-medium text-gray-800">
                      {new Date(service.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 transition-all duration-300 hover:shadow-2xl">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-indigo-600" />
                Customer Reviews
              </h2>
              <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full shadow-sm">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-2" />
                <span className="font-semibold text-lg text-yellow-700">
                  {avgRating > 0 ? avgRating : "New"}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  ({reviews.length})
                </span>
              </div>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-12 h-12 text-indigo-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Be the first to share your experience with this service!
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-100 p-6 space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-lg font-semibold text-gray-800">
                        {review.user?.name || "Anonymous"}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-400 ml-3">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-indigo-600 text-lg">
                    {review.title}
                  </h3>
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {review.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Review Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <Star className="w-6 h-6 mr-3 text-indigo-600" />
            Leave a Review
          </h2>
          <form onSubmit={handleReviewSubmit} className="space-y-8">
            <div>
              <label className="block text-gray-700 mb-3 font-medium">
                Your Rating
              </label>
              <div className="flex bg-gray-50 p-4 rounded-xl justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none mx-2 transition-transform duration-200 hover:scale-125"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= newReview.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      } transition-all duration-300`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 mb-3 font-medium"
              >
                Review Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Sum up your experience"
                value={newReview.title}
                onChange={handleReviewChange}
                required
                className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300 hover:shadow-md"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 mb-3 font-medium"
              >
                Your Review
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Share the details of your experience with this service"
                value={newReview.description}
                onChange={handleReviewChange}
                required
                rows="5"
                className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300 hover:shadow-md"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 mr-3 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Your Review"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductMarketsDetails;
