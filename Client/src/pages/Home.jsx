import React from "react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { token } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to My App</h1>
        {token ? (
          <p className="text-green-600">You are logged in!</p>
        ) : (
          <p className="text-red-600">Please log in or sign up.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
