import React, { useEffect, useState } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Business = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedPrices, setSelectedPrices] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessDescription: "",
    businessWebsiteUrl: "",
    mainImage: null, // for storing selected image
  });

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

  const handleSubscriptionSelect = (sub) => {
    setSelectedSubscription(sub);
  };

  const handlePriceChange = (e, subId) => {
    setSelectedPrices({
      ...selectedPrices,
      [subId]: e.target.value,
    });
    console.log("Selected Price: ", e.target.value);
  };

  const handleModalToggle = (sub) => {
    setSelectedSubscription(sub);
    setIsModalOpen(!isModalOpen);
  };

  const handleBusinessDetailChange = (e) => {
    const { name, value } = e.target;
    setBusinessDetails({ ...businessDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBusinessDetails({
        ...businessDetails,
        mainImage: file,
      });
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

    // Validate required business details
    if (!businessDetails.businessName || !businessDetails.businessEmail) {
      alert("Business name and email are required");
      return;
    }

    const { id: subscriptionId } = selectedSubscription;
    const billingCycle = selectedPrices[selectedSubscription.id];

    // Prepare the form data
    const formData = new FormData();
    formData.append("subscriptionId", subscriptionId);
    formData.append("billingCycle", billingCycle);
    formData.append("businessName", businessDetails.businessName);
    formData.append("businessEmail", businessDetails.businessEmail);
    formData.append("businessPhone", businessDetails.businessPhone || "");
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
        alert("Subscription successfully created!");
        // Reset form
        setBusinessDetails({
          businessName: "",
          businessEmail: "",
          businessPhone: "",
          businessDescription: "",
          businessWebsiteUrl: "",
          mainImage: null,
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      alert(`Failed to create subscription: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">
        Choose Your Subscription
      </h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="text-gray-500">Loading subscriptions...</div>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center text-gray-500">
          No subscriptions available.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300 flex flex-col justify-between"
            >
              <img
                src="https://img.freepik.com/free-vector/subscriber-concept-illustration_114360-26727.jpg?ga=GA1.1.674192113.1745719925&semt=ais_hybrid&w=740"
                alt="Subscription"
                className="rounded-md mb-4 h-[25rem] w-full object-cover"
              />

              <div>
                <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
                  {sub.name}
                </h2>
                <p className="text-gray-600 mb-4">{sub.description}</p>

                <ul className="list-disc list-inside text-gray-500 text-sm mb-4 space-y-1">
                  {sub.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-lg font-bold text-gray-800 mb-2">Prices:</p>
                <div className="flex flex-col space-y-1 text-gray-700 text-sm">
                  <select
                    value={selectedPrices[sub.id] || ""}
                    onChange={(e) => handlePriceChange(e, sub.id)}
                    className="p-2 border rounded"
                  >
                    <option value="">Select a plan</option>
                    <option value="weekly">${sub.priceWeekly} Weekly</option>
                    <option value="monthly">${sub.priceMonthly} Monthly</option>
                    <option value="yearly">${sub.priceYearly} Yearly</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                {sub.isActive ? (
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
                    Inactive
                  </span>
                )}
              </div>

              {selectedPrices[sub.id] && (
                <button
                  onClick={() => handleModalToggle(sub)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Subscribe
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedSubscription && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center"
          onClick={handleModalToggle}
        >
          <div
            className="bg-white p-8 rounded-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              Enter Business Details
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                name="businessName"
                value={businessDetails.businessName}
                onChange={handleBusinessDetailChange}
                placeholder="Business Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="businessEmail"
                value={businessDetails.businessEmail}
                onChange={handleBusinessDetailChange}
                placeholder="Business Email"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="businessPhone"
                value={businessDetails.businessPhone}
                onChange={handleBusinessDetailChange}
                placeholder="Business Phone"
                className="w-full p-2 border rounded"
              />
              <textarea
                name="businessDescription"
                value={businessDetails.businessDescription}
                onChange={handleBusinessDetailChange}
                placeholder="Business Description"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="businessWebsiteUrl"
                value={businessDetails.businessWebsiteUrl}
                onChange={handleBusinessDetailChange}
                placeholder="Business Website URL"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                name="mainImage"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mt-6">
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
                    shape: "rect",
                    label: "subscribe",
                  }}
                  createOrder={(data, actions) => {
                    const price =
                      selectedPrices[selectedSubscription.id] === "weekly"
                        ? selectedSubscription.priceWeekly
                        : selectedPrices[selectedSubscription.id] === "monthly"
                        ? selectedSubscription.priceMonthly
                        : selectedPrices[selectedSubscription.id] === "yearly"
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
                    handleModalToggle();
                  }}
                  onError={(err) => {
                    console.error("Payment Error:", err);
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Business;
