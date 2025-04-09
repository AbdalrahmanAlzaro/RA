import React from "react";
import { useLocation } from "react-router-dom";
import OAuthSuccess from "../pages/OAuthSuccess";

const OAuthSuccessWrapper = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const token = params.get("token");
  const user = params.get("user");

  let parsedUser = null;
  try {
    parsedUser = user ? JSON.parse(decodeURIComponent(user)) : null;
  } catch (err) {
    console.error("Failed to parse user data from URL:", err);
  }

  return <OAuthSuccess token={token} user={parsedUser} />;
};

export default OAuthSuccessWrapper;
