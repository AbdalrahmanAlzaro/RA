import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import { useAuth } from "../context/AuthContext";
import { Facebook, Globe } from "lucide-react"; // Lucide Icons

const SocialAuthButtons = () => {
  const { login } = useAuth();

  const handleGoogleSuccess = (response) => {
    console.log("Google Success:", response);
    const token = response.credential;
    login(token);
    window.location.href = `http://localhost:4000/auth/google`;
  };

  const handleGoogleFailure = (error) => {
    console.log("Google Failure:", error);
  };

  const handleFacebookResponse = (response) => {
    console.log("Facebook Response:", response);
    const token = response.accessToken;
    login(token);
    window.location.href = `http://localhost:4000/auth/facebook`;
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
      {/* Google Login Button */}
      <GoogleOAuthProvider clientId="436893917634-4rlj4mmkol7r4itf07nqoolj8hu02e2o.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Continue with Google
            </button>
          )}
        />
      </GoogleOAuthProvider>

      {/* Facebook Login Button */}
      <FacebookLogin
        appId="1524867028146262"
        autoLoad={false}
        fields="name,email"
        callback={handleFacebookResponse}
        cssClass="flex items-center justify-center w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition-all"
        icon={<Facebook className="w-5 h-5 mr-2" />}
      />
    </div>
  );
};

export default SocialAuthButtons;
