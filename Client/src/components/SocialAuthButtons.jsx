import React from "react";
import { Facebook, Globe } from "lucide-react";

const SocialAuthButtons = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:4000/auth/facebook";
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
      >
        <Globe className="w-5 h-5 mr-2 text-blue-600" />
        Continue with Google
      </button>

      <button
        onClick={handleFacebookLogin}
        className="flex items-center justify-center w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition-all"
      >
        <Facebook className="w-5 h-5 mr-2" />
        Continue with Facebook
      </button>
    </div>
  );
};

export default SocialAuthButtons;
