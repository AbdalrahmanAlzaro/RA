import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import OAuthSuccessWrapper from "./components/OAuthSuccessWrapper";
import OTPVerify from "./pages/OTPVerify";
import { ArrowUp } from "lucide-react";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import CategoryPage from "./pages/CategoryPage";
import Business from "./pages/Business";
import BusinessAdmin from "./pages/BusinessAdmin";
import Market from "./pages/Market";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarFooterPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];

  const shouldHideNavbarFooter = hideNavbarFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/add" element={<AddProduct />} />{" "}
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/oauth-success" element={<OAuthSuccessWrapper />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/become-business" element={<Business />} />
        <Route path="/business" element={<BusinessAdmin />} />
        <Route path="/markets" element={<Market />} />
        <Route
          path="/category/:category/:subcategory"
          element={<CategoryProductsPage />}
        />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>
      {!shouldHideNavbarFooter && <Footer />}
      <ScrollToTopButton />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
