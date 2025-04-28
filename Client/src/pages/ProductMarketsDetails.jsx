import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  Briefcase,
  Image as ImageIcon,
  Loader,
  AlertCircle,
  ArrowLeft,
  Share2,
  Heart,
  MessageSquare,
} from "lucide-react";

const ProductMarketsDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/services/service/${id}`
        );
        setService(response.data);
        setActiveImage(
          `http://localhost:4000/uploads/${response.data.mainImage}`
        );
      } catch (error) {
        console.error("Error fetching service:", error);
        setError("Failed to load service details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleSubImageClick = (url) => {
    setActiveImage(url);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Loading service details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 text-lg font-medium">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 text-lg font-medium">Service not found</p>
        <button
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
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
    <div className="max-w-6xl mx-auto p-6">
      <nav className="mb-8">
        <button
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Services
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Images */}
        <div>
          <div className="mb-4 overflow-hidden rounded-xl shadow-lg bg-white">
            <img
              src={activeImage || mainImageUrl}
              alt={service.title}
              className="w-full h-96 object-cover object-center"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div
              className={`cursor-pointer overflow-hidden rounded-lg border-2 ${
                activeImage === mainImageUrl
                  ? "border-primary"
                  : "border-transparent"
              }`}
              onClick={() => handleSubImageClick(mainImageUrl)}
            >
              <img
                src={mainImageUrl}
                alt="Main Service"
                className="w-full h-24 object-cover"
              />
            </div>

            {subImagesUrls.map((url, index) => (
              <div
                key={index}
                className={`cursor-pointer overflow-hidden rounded-lg border-2 ${
                  activeImage === url ? "border-primary" : "border-transparent"
                }`}
                onClick={() => handleSubImageClick(url)}
              >
                <img
                  src={url}
                  alt={`Sub Image ${index}`}
                  className="w-full h-24 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {service.title}
            </h1>
          </div>

          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-primary mr-2" />
              <span className="text-gray-700">
                Created:{" "}
                <span className="font-medium">
                  {new Date(service.createdAt).toLocaleDateString()}
                </span>
              </span>
            </div>

            <div className="flex items-center">
              <Clock className="w-5 h-5 text-primary mr-2" />
              <span className="text-gray-700">
                Last Updated:{" "}
                <span className="font-medium">
                  {new Date(service.updatedAt).toLocaleDateString()}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMarketsDetails;
