import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem("token");
  const userFromStorage = localStorage.getItem("user");

  let parsedUser = null;
  try {
    parsedUser = userFromStorage ? JSON.parse(userFromStorage) : null;
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    parsedUser = null;
    localStorage.removeItem("user");
  }

  const [token, setToken] = useState(tokenFromStorage);
  const [user, setUser] = useState(parsedUser);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
