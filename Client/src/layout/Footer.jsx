import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 text-gray-100 p-4 text-center">
        &copy; {new Date().getFullYear()} RateNest. All rights reserved.
      </footer>
    </div>
  );
};

export default Footer;
