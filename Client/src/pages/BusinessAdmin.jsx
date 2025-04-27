import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Store,
  Mail,
  Phone,
  Globe,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Edit2,
  Save,
  X,
  Upload,
  Clock,
  ExternalLink,
} from "lucide-react";

const BusinessAdmin = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessDescription: "",
    businessWebsiteUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/subscriptions/user/get-business",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBusiness(response.data);
        setFormData({
          businessName: response.data.businessName,
          businessEmail: response.data.businessEmail,
          businessPhone: response.data.businessPhone,
          businessDescription: response.data.businessDescription,
          businessWebsiteUrl: response.data.businessWebsiteUrl,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load business details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("businessName", formData.businessName);
    data.append("businessEmail", formData.businessEmail);
    data.append("businessPhone", formData.businessPhone);
    data.append("businessDescription", formData.businessDescription);
    data.append("businessWebsiteUrl", formData.businessWebsiteUrl);
    if (selectedFile) {
      data.append("mainImage", selectedFile);
    }

    try {
      await axios.put(
        "http://localhost:4000/api/subscriptions/user/update-business",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Refresh data
      const refreshed = await axios.get(
        "http://localhost:4000/api/subscriptions/user/get-business",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBusiness(refreshed.data);
      setEditing(false);
      setSelectedFile(null);
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update business details.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Clock className="animate-spin h-12 w-12 mx-auto text-indigo-600 mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Loading your shop details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg shadow-md border border-red-100">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-lg font-medium text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-yellow-50 p-8 rounded-lg shadow-md border border-yellow-100">
          <Store className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <p className="text-lg font-medium text-yellow-700">
            No Business Found
          </p>
          <p className="text-gray-600 mt-2">
            Please create a business profile to continue.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white overflow-hidden shadow rounded-t-2xl">
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-white text-3xl font-bold drop-shadow-md">
                {business.businessName}
              </h1>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="h-36 w-[30rem] rounded-xl border-4 border-white overflow-hidden bg-white shadow-lg">
                <img
                  src={
                    previewImage || `http://localhost:4000${business.mainImage}`
                  }
                  alt="Business Logo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-6 flex justify-between items-center">
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  business.status
                )}`}
              >
                {business.status === "pending" ? (
                  <Clock className="w-4 h-4 mr-1" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-1" />
                )}
                {business.status}
              </span>
            </div>

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors shadow-md"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Shop Details
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow rounded-b-2xl overflow-hidden">
          {editing ? (
            <div className="p-6">
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                encType="multipart/form-data"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Store className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="businessEmail"
                          value={formData.businessEmail}
                          onChange={handleChange}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="businessPhone"
                          value={formData.businessPhone}
                          onChange={handleChange}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="businessWebsiteUrl"
                          value={formData.businessWebsiteUrl}
                          onChange={handleChange}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Description
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          name="businessDescription"
                          value={formData.businessDescription}
                          onChange={handleChange}
                          rows="4"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Logo/Image
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
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
                                onChange={handleFileChange}
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
                      {previewImage && (
                        <div className="mt-2">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-20 w-20 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setPreviewImage(null);
                      setSelectedFile(null);
                    }}
                    className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Shop Details */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Store className="mr-2 text-indigo-600" />
                    Shop Details
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{business.businessName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-gray-700">
                        {business.businessDescription}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <Mail className="text-gray-400 w-4 h-4 mr-2" />
                      <a
                        href={`mailto:${business.businessEmail}`}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        {business.businessEmail}
                      </a>
                    </div>

                    <div className="flex items-center">
                      <Phone className="text-gray-400 w-4 h-4 mr-2" />
                      <a
                        href={`tel:${business.businessPhone}`}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        {business.businessPhone}
                      </a>
                    </div>

                    <div className="flex items-center">
                      <Globe className="text-gray-400 w-4 h-4 mr-2" />
                      <a
                        href={`https://${business.businessWebsiteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 flex items-center"
                      >
                        {business.businessWebsiteUrl}
                        <ExternalLink className="ml-1 w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Column 2: Subscription Details */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="mr-2 text-indigo-600" />
                    Subscription Details
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Plan</p>
                      <p className="font-medium capitalize">
                        {business.billingCycle}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          business.status
                        )}`}
                      >
                        {business.status === "pending" ? (
                          <Clock className="w-3 h-3 mr-1" />
                        ) : (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {business.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="text-gray-700">
                        {new Date(business.startDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="text-gray-700">
                        {new Date(business.endDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Shop Status</p>
                      <div className="flex items-center">
                        {business.isActive ? (
                          <>
                            <span className="bg-green-100 p-1 rounded-full mr-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </span>
                            <span className="text-green-700 font-medium">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="bg-gray-100 p-1 rounded-full mr-2">
                              <X className="w-4 h-4 text-gray-600" />
                            </span>
                            <span className="text-gray-700 font-medium">
                              Inactive
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Quick Actions */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Quick Actions
                  </h2>

                  <div className="space-y-3">
                    <button
                      onClick={() => setEditing(true)}
                      className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors shadow-md"
                    >
                      <Edit2 className="w-5 h-5 mr-2" />
                      Edit Shop Details
                    </button>

                    <a
                      href={`https://${business.businessWebsiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 py-3 px-4 rounded-lg transition-colors shadow-sm"
                    >
                      <Globe className="w-5 h-5 mr-2" />
                      Visit Website
                    </a>
                  </div>

                  {/* Subscription expiry warning if applicable */}
                  {new Date(business.endDate) <
                    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                    <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Your subscription will expire soon. Renew now to
                            avoid service interruption.
                          </p>
                          <a
                            href="/dashboard/subscription/renew"
                            className="mt-2 inline-flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-600"
                          >
                            Renew subscription
                            <span className="ml-1">→</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessAdmin;
