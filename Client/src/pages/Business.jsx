import React, { useEffect, useState } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  Package,
  Check,
  X,
  CreditCard,
  Calendar,
  Building,
  Mail,
  Phone,
  Globe,
  FileText,
  Upload,
  BarChart,
  Clock,
  ShoppingCart,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";

const Business = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedPrices, setSelectedPrices] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessDescription: "",
    businessWebsiteUrl: "",
    mainImage: null,
    category: "",
    subcategory: "",
  });

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

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/subscriptions/get-all"
        );
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handlePriceChange = (e, subId) => {
    setSelectedPrices({
      ...selectedPrices,
      [subId]: e.target.value,
    });
  };

  const handleModalToggle = (sub = null) => {
    if (sub) {
      setSelectedSubscription(sub);
    }
    setIsModalOpen(!isModalOpen);
    setFormStep(1); // Reset to first step when opening modal
  };

  const handleBusinessDetailChange = (e) => {
    const { name, value } = e.target;
    setBusinessDetails({
      ...businessDetails,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === "category" ? { subcategory: "" } : {}),
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBusinessDetails({
        ...businessDetails,
        mainImage: file,
      });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateBusinessDetails = () => {
    if (!businessDetails.businessName) return false;
    if (!businessDetails.businessEmail) return false;
    if (!businessDetails.businessPhone) return false;
    if (!businessDetails.category) return false;
    return true;
  };

  const handleNextStep = () => {
    if (validateBusinessDetails()) {
      setFormStep(2);
    } else {
      alert("Please complete all required fields marked with *");
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    if (!selectedSubscription || !selectedPrices[selectedSubscription.id]) {
      alert("Please select a subscription and billing cycle");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authorization token is required.");
      return;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append("subscriptionId", selectedSubscription.id);
    formData.append("billingCycle", selectedPrices[selectedSubscription.id]);
    formData.append("businessName", businessDetails.businessName);
    formData.append("businessEmail", businessDetails.businessEmail);
    formData.append("businessPhone", businessDetails.businessPhone || "");
    formData.append("category", businessDetails.category);
    formData.append("subcategory", businessDetails.subcategory || "");
    formData.append(
      "businessDescription",
      businessDetails.businessDescription || ""
    );
    formData.append(
      "businessWebsiteUrl",
      businessDetails.businessWebsiteUrl || ""
    );

    // Only append image if it exists
    if (businessDetails.mainImage instanceof File) {
      formData.append("mainImage", businessDetails.mainImage);
    } else {
      // Append empty file field if no image was selected
      formData.append("mainImage", new Blob(), "");
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/subscriptions/user/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        // Success, close modal and show success message
        setIsModalOpen(false);
        // Reset form
        setBusinessDetails({
          businessName: "",
          businessEmail: "",
          businessPhone: "",
          businessDescription: "",
          businessWebsiteUrl: "",
          mainImage: null,
          category: "",
          subcategory: "",
        });
        setPreviewImage(null);

        // Show success message
        alert("Subscription successfully created!");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      alert(`Failed to create subscription: ${error.message}`);
    }
  };

  const getPriceDisplay = (sub, cycle) => {
    switch (cycle) {
      case "weekly":
        return {
          price: sub.priceWeekly,
          period: "week",
          savings: null,
        };
      case "monthly":
        return {
          price: sub.priceMonthly,
          period: "month",
          savings: Math.round(
            100 - ((sub.priceMonthly * 52) / 12 / (sub.priceWeekly * 52)) * 100
          ),
        };
      case "yearly":
        return {
          price: sub.priceYearly,
          period: "year",
          savings: Math.round(
            100 - (sub.priceYearly / (sub.priceMonthly * 12)) * 100
          ),
        };
      default:
        return {
          price: 0,
          period: "",
          savings: null,
        };
    }
  };

  // Get features for selected subscription
  const getSubscriptionFeatures = () => {
    if (!selectedSubscription) return [];
    return selectedSubscription.features;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="px-4 lg:px-32 mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-indigo-700 mb-4">
              Grow Your Business
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect subscription plan that fits your business needs
              and start reaching more customers today.
            </p>
          </div>

          {/* Subscription Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Clock className="animate-spin h-12 w-12 text-indigo-600 mr-3" />
              <p className="text-xl text-gray-700">
                Loading available plans...
              </p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
              <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
              <p className="text-xl text-gray-700">
                No subscription plans available at the moment.
              </p>
              <p className="text-gray-500 mt-2">
                Please check back later or contact support.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((sub) => {
                const selectedCycle = selectedPrices[sub.id] || "";
                const priceDisplay = getPriceDisplay(sub, selectedCycle);

                return (
                  <div
                    key={sub.id}
                    className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${
                      selectedPrices[sub.id]
                        ? "ring-2 ring-indigo-500 transform scale-[1.02]"
                        : "hover:shadow-lg"
                    }`}
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">
                          {sub.name}
                        </h2>
                        {sub.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Image */}
                      <div className="mb-6 rounded-lg overflow-hidden h-48 bg-gray-100">
                        <img
                          src="https://img.freepik.com/free-vector/subscriber-concept-illustration_114360-26727.jpg?ga=GA1.1.674192113.1745719925&semt=ais_hybrid&w=740"
                          alt={sub.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-6">{sub.description}</p>

                      {/* Features */}
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                          <Package className="h-4 w-4 mr-2 text-indigo-600" />
                          Features
                        </h3>
                        <ul className="space-y-2">
                          {sub.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600 text-sm">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing */}
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-indigo-600" />
                          Select Plan
                        </h3>
                        <select
                          value={selectedPrices[sub.id] || ""}
                          onChange={(e) => handlePriceChange(e, sub.id)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                          <option value="">Choose billing cycle</option>
                          <option value="weekly">
                            ${sub.priceWeekly} Weekly
                          </option>
                          <option value="monthly">
                            ${sub.priceMonthly} Monthly
                          </option>
                          <option value="yearly">
                            ${sub.priceYearly} Yearly
                          </option>
                        </select>
                      </div>

                      {/* Selected Price Display */}
                      {selectedCycle && (
                        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-600 text-sm">
                                Selected plan:
                              </p>
                              <p className="text-2xl font-bold text-indigo-700">
                                ${priceDisplay.price}
                                <span className="text-sm text-gray-500 font-normal">
                                  /{priceDisplay.period}
                                </span>
                              </p>
                            </div>
                            {priceDisplay.savings && (
                              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                Save {priceDisplay.savings}%
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Subscribe Button */}
                      <button
                        onClick={() => handleModalToggle(sub)}
                        disabled={!selectedPrices[sub.id] || !sub.isActive}
                        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center ${
                          selectedPrices[sub.id] && sub.isActive
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        } transition-colors`}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {!sub.isActive
                          ? "Currently Unavailable"
                          : !selectedPrices[sub.id]
                          ? "Select a Plan First"
                          : "Subscribe Now"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Subscription Modal */}
      {isModalOpen && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-2" />
                  {formStep === 1
                    ? "Business Details"
                    : "Complete Your Purchase"}
                </h2>
                <button
                  onClick={() => handleModalToggle()}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 pt-6">
              <div className="flex items-center mb-6">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    formStep >= 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    formStep === 2 ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    formStep === 2
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
              </div>
            </div>

            {/* Form Steps */}
            <div className="p-6 pt-0">
              {formStep === 1 ? (
                /* Step 1: Business Details */
                <div className="space-y-5">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                      <Package className="h-6 w-6 text-indigo-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {selectedSubscription.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedPrices[selectedSubscription.id] ===
                            "weekly" &&
                            `$${selectedSubscription.priceWeekly}/week`}
                          {selectedPrices[selectedSubscription.id] ===
                            "monthly" &&
                            `$${selectedSubscription.priceMonthly}/month`}
                          {selectedPrices[selectedSubscription.id] ===
                            "yearly" &&
                            `$${selectedSubscription.priceYearly}/year`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Business Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="businessName"
                          value={businessDetails.businessName}
                          onChange={handleBusinessDetailChange}
                          placeholder="Your business name"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Business Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="businessEmail"
                          value={businessDetails.businessEmail}
                          onChange={handleBusinessDetailChange}
                          placeholder="contact@yourbusiness.com"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Business Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="businessPhone"
                          value={businessDetails.businessPhone}
                          onChange={handleBusinessDetailChange}
                          placeholder="+1 (555) 123-4567"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Category{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BarChart className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          name="category"
                          value={businessDetails.category}
                          onChange={handleBusinessDetailChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                          required
                        >
                          <option value="">Select a category</option>
                          {Object.keys(categories).map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Subcategory */}
                    {businessDetails.category && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Subcategory
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BarChart className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            name="subcategory"
                            value={businessDetails.subcategory}
                            onChange={handleBusinessDetailChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                          >
                            <option value="">
                              Select a subcategory (optional)
                            </option>
                            {categories[businessDetails.category]?.map(
                              (subcategory) => (
                                <option key={subcategory} value={subcategory}>
                                  {subcategory}
                                </option>
                              )
                            )}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Business Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Description
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          name="businessDescription"
                          value={businessDetails.businessDescription}
                          onChange={handleBusinessDetailChange}
                          placeholder="Tell us about your business..."
                          rows="4"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Business Website */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Website
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="businessWebsiteUrl"
                          value={businessDetails.businessWebsiteUrl}
                          onChange={handleBusinessDetailChange}
                          placeholder="www.yourbusiness.com"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Business Logo/Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Logo/Image
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                          {previewImage ? (
                            <div className="mb-3">
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="h-32 w-32 object-cover mx-auto rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewImage(null);
                                  setBusinessDetails({
                                    ...businessDetails,
                                    mainImage: null,
                                  });
                                }}
                                className="mt-2 text-sm text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          )}

                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="mainImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors shadow-md"
                    >
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Payment */
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Package className="h-5 w-5 text-indigo-600 mr-2" />
                      Subscription Summary
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">
                          {selectedSubscription.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Billing:</span>
                        <span className="font-medium capitalize">
                          {selectedPrices[selectedSubscription.id]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">
                          $
                          {selectedPrices[selectedSubscription.id] === "weekly"
                            ? selectedSubscription.priceWeekly
                            : selectedPrices[selectedSubscription.id] ===
                              "monthly"
                            ? selectedSubscription.priceMonthly
                            : selectedSubscription.priceYearly}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">
                          {businessDetails.category}
                        </span>
                      </div>
                      {businessDetails.subcategory && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subcategory:</span>
                          <span className="font-medium">
                            {businessDetails.subcategory}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Features:
                      </h4>
                      <ul className="space-y-1">
                        {getSubscriptionFeatures().map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
                      Payment Method
                    </h3>

                    <PayPalScriptProvider
                      options={{
                        "client-id":
                          "AQO_lrXGFsV-gcb9dl11jWIu-BW84qeQbOxa31FnSsbeJj_fpHAMK3sb-c2aJjJSnjuaN4CDAxvT3tL1",
                      }}
                    >
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "blue",
                          shape: "pill",
                          label: "pay",
                        }}
                        createOrder={(data, actions) => {
                          const price =
                            selectedPrices[selectedSubscription.id] === "weekly"
                              ? selectedSubscription.priceWeekly
                              : selectedPrices[selectedSubscription.id] ===
                                "monthly"
                              ? selectedSubscription.priceMonthly
                              : selectedPrices[selectedSubscription.id] ===
                                "yearly"
                              ? selectedSubscription.priceYearly
                              : 0;

                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: price,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          const order = await actions.order.capture();
                          handlePaymentSuccess(order);
                        }}
                        onError={(err) => {
                          console.error("Payment Error:", err);
                          alert("Payment failed. Please try again.");
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg transition-colors"
                    >
                      Back to Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Business;
