import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Calendar, Edit, Camera } from "lucide-react";
import Swal from "sweetalert2";
import UserProduct from "../components/profile/userProduct";
import UserReview from "../components/profile/userReview";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("http://localhost:4000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        setName(response.data.name); // Initialize form fields with current data
        setEmail(response.data.email);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.put(
        "http://localhost:4000/api/me",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(response.data); // Update the displayed user data
      setEditMode(false); // Exit edit mode

      // Show success SweetAlert
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been successfully updated.",
        showConfirmButton: false,
        timer: 2000, // Automatically close after 2 seconds
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);

      // Show error SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-indigo-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <div
            className="p-4 text-sm text-red-700 bg-red-100 rounded-lg"
            role="alert"
          >
            <div className="font-medium">Error loading profile</div>
            <div>{error}</div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {userData ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-indigo-600 h-32 relative">
              <div className="absolute -bottom-16 left-8">
                <div className="h-32 w-32 rounded-full bg-white p-1 shadow-lg">
                  <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt={`${userData.name}'s avatar`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={64} className="text-gray-400" />
                    )}
                    <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full hover:bg-indigo-700 transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 pb-8 px-8">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-center mb-1">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {userData.name}
                    </h1>
                    {userData.verified && (
                      <div className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 mb-6">
                    <Mail size={16} className="mr-2" />
                    <span>{userData.email}</span>
                  </div>

                  {/* Member Since */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex items-center text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      Member since{" "}
                      {new Date(
                        userData.createdAt || Date.now()
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <User size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-800 mb-2">
              No user data available.
            </p>
            <p className="text-gray-600 mb-6">
              There was an issue fetching your profile information.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reload
            </button>
          </div>
        )}
      </div>
      <UserProduct />
      <UserReview />
    </div>
  );
};

export default Profile;
