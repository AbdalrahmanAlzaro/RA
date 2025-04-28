import React, { useEffect, useState } from "react";
import axios from "axios";
import { Store, Phone, ChevronRight, AlertCircle, Loader2 } from "lucide-react";

const categories = {
  Restaurants: [
    "TakeOut",
    "Thai",
    "Delivery",
    "Burgers",
    "Chinese",
    "Italian",
    "Reservation",
    "Mexican",
  ],
  Services: [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Landscaping",
    "Carpentry",
    "Moving",
    "Handyman",
    "Design",
  ],
  AutoServices: [
    "CarMaintenance",
    "TireChange",
    "EngineRepair",
    "OilChange",
    "BrakeService",
    "Detailing",
    "Inspection",
    "EmergencyTowing",
  ],
  More: [
    "DryCleaning",
    "PhoneRepair",
    "Cafes",
    "OutdoorActivities",
    "HairSalons",
    "Gyms",
    "Spas",
    "Shopping",
  ],
};

const Market = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    setNoResults(false);

    try {
      const response = await axios.get(
        "http://localhost:4000/api/subscriptions/user/get-active-business",
        {
          params: {
            name: searchName,
            category: selectedCategory,
            subcategory: selectedSubcategory,
          },
        }
      );

      // Check if there are no active businesses based on the filter
      if (
        response.data.message === "No active businesses found" ||
        (Array.isArray(response.data) && response.data.length === 0)
      ) {
        setSubscriptions([]);
        setNoResults(true);
      } else {
        setSubscriptions(response.data);
        setNoResults(false);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setError("Failed to load businesses. Please try again later.");
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Separate the search input handling from the API call
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearch = () => {
    setSearchName(searchTerm);
  };

  // Add debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchName(searchTerm);
    }, 500); // Wait for 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchSubscriptions();
  }, [searchName, selectedCategory, selectedSubcategory]);

  const handleResetFilters = () => {
    setSearchName("");
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubcategory("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading businesses...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-center mb-8">
        <Store className="w-6 h-6 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">Market</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
        <div className="w-full md:w-1/3 flex">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="border border-gray-300 rounded-l-lg px-4 py-2 w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition duration-300"
          >
            Search
          </button>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategory(""); // reset subcategory when category changes
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4"
        >
          <option value="">All Categories</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4"
          disabled={!selectedCategory}
        >
          <option value="">All Subcategories</option>
          {selectedCategory &&
            categories[selectedCategory].map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
        </select>
      </div>

      {/* Reset Filters Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleResetFilters}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Reset Filters
        </button>
      </div>

      {/* Businesses */}
      {noResults ? (
        <div className="flex flex-col items-center justify-center h-64 p-6 bg-yellow-50 rounded-lg">
          <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
          <p className="text-yellow-700 font-medium text-center">
            No businesses found matching your filters
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            Clear Filters
          </button>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 p-6 bg-red-50 rounded-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-700 font-medium text-center">{error}</p>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 p-6 bg-yellow-50 rounded-lg">
          <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
          <p className="text-yellow-700 font-medium text-center">
            No Market Found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={`http://localhost:4000${business.mainImage}`}
                  alt={business.businessName}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {business.businessName}
                </h2>
                <p className="text-gray-600 mb-4">
                  {business.businessDescription}
                </p>

                <div className="space-y-2 mb-6">
                  {business.businessPhone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{business.businessPhone}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center font-medium">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>

                  <button className="border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-300 font-medium">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Market;
