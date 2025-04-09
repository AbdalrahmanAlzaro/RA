import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthSuccess = ({ token, user }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      login(token, user); // ✅ Safe: Only runs once if token and user are valid
      navigate("/"); // or whatever route you want
    }
  }, [token, user]); // ✅ Only trigger once if token/user change from outside

  return <p>Logging you in...</p>;
};

export default OAuthSuccess;
