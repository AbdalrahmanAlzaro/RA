import React, { useEffect, useState } from "react";
import axios from "axios";
import BusinessReview from "./BusinessReview";
import { Mail, Phone, Globe, Eye, Building, Tag, Star } from "lucide-react"; // Added Star icon

const BusinessDetails = ({ id }) => {
  const [businessData, setBusinessData] = useState(null);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);

        // First fetch businessData
        const businessResponse = await axios.get(
          `http://localhost:4000/api/subscriptions/user/get-business/${id}`
        );
        setBusinessData(businessResponse.data);

        // Then separately try to fetch review stats
        try {
          const statsResponse = await axios.get(
            `http://localhost:4000/api/reviews/business/${id}/stats`
          );
          setReviewStats(statsResponse.data);
        } catch (error) {
          console.warn("No review stats available.", error);
          setReviewStats(null);
        }
      } catch (error) {
        console.error("Error fetching business data:", error);
        setBusinessData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [id]);

  const handleViewProduct = () => {
    window.open(`/products/${id}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
          <div className="text-gray-500">Loading business information...</div>
        </div>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center text-red-600">
        <Building className="w-6 h-6 mx-auto mb-2" />
        Unable to load business information. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-6xl mx-auto">
      {/* Hero section */}
      <div
        className="h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(http://localhost:4000${businessData.mainImage})`,
        }}
      >
        <div className="absolute inset-0"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold text-black">
            {businessData.businessName}
          </h1>

          <div className="mt-2 flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <Tag className="w-4 h-4 mr-1" />
              {businessData.category}
            </span>
            <span className="mx-2 text-black">•</span>
            <span className="text-black text-sm">
              {businessData.subcategory}
            </span>

            {/* Review stats */}
            {reviewStats ? (
              reviewStats.numberOfUsers > 0 ? (
                <div className="bg-white rounded-md">
                  <span className="flex items-center text-yellow-500 text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    {reviewStats.averageRating} Stars,{" "}
                    {reviewStats.numberOfUsers} Users
                  </span>
                </div>
              ) : (
                <div className="bg-white rounded-md">
                  <span className="flex items-center text-gray-400 text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    No Reviews Yet
                  </span>
                </div>
              )
            ) : (
              <div className="bg-white rounded-md">
                <span className="flex items-center text-gray-400 text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  No Review Data Available
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 grid md:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              About the Business
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {businessData.businessDescription}
            </p>
          </div>

          <div className="border-t h-60 border-gray-200 pt-6 overflow-y-scroll">
            <BusinessReview id={id} />
          </div>
        </div>

        {/* Right column */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="font-medium text-gray-700 mb-4">
            Contact Information
          </h3>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full text-blue-500 mr-3">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-gray-700">{businessData.businessEmail}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full text-green-500 mr-3">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-gray-700">{businessData.businessPhone}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full text-purple-500 mr-3">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Website</p>
                <a
                  href={
                    businessData.businessWebsiteUrl.startsWith("http")
                      ? businessData.businessWebsiteUrl
                      : `https://${businessData.businessWebsiteUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {businessData.businessWebsiteUrl}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleViewProduct}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <Eye className="h-5 w-5 mr-2" />
              View Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
