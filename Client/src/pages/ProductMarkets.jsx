import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingBag,
  Image as ImageIcon,
  Loader,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

const ProductMarkets = () => {
  const { id } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/services/business/${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setServices(data);
        } else {
          setError(data.message || "Failed to fetch services");
        }
      } catch (error) {
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            <span className="text-indigo-600">Product</span> Markets
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Exploring Products
          </p>
        </div>

        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
            <p className="mt-4 text-xl font-medium text-gray-700">
              No services available for this business.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={`http://localhost:4000/uploads/${service.mainImage}`}
                    alt={service.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/320";
                      e.target.alt = "Image not available";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                    {service.title}
                  </h3>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="mt-4">
                    <div className="flex items-center mb-3">
                      <ImageIcon className="w-5 h-5 text-indigo-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Gallery</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {service.subImage.split(", ").map((image, index) => (
                        <div
                          key={index}
                          className="relative h-20 rounded-md overflow-hidden bg-gray-100"
                        >
                          <img
                            src={`http://localhost:4000/uploads/${image.trim()}`}
                            alt={`${service.title} image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/api/placeholder/100/100";
                              e.target.alt = "Preview not available";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <Link
                    to={`/product-market-details/${service.id}`}
                    className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-medium"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMarkets;
