import React from "react";

const Footer = () => {
  return (
    <div className="bg-white">
      <footer className="text-gray-950 p-4 text-center">
        &copy; {new Date().getFullYear()} RateNest. All rights reserved.
      </footer>
    </div>
  );
};

export default Footer;
