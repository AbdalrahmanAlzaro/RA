import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, LogIn, LogOut, Menu, X, Home, Info, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";

const Navbar = () => {
  const { token, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md text-gray-800">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center space-x-2">
            <div className="flex items-center py-2">
              <Link to="/">
                {" "}
                <img
                  src={Logo}
                  alt="Logo"
                  width={150}
                  height={150}
                  className="max-h-20"
                />
              </Link>
            </div>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <Info size={18} />
              <span>About</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <Mail size={18} />
              <span>Contact</span>
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="flex items-center space-x-2 py-2 px-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center space-x-2 py-2 px-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors"
              >
                <Info size={18} />
                <span>About</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center space-x-2 py-2 px-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors"
              >
                <Mail size={18} />
                <span>Contact</span>
              </Link>

              {/* Mobile Auth Buttons */}
              {token ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 py-2 px-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
