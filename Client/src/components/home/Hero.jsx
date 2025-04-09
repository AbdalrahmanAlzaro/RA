import React from "react";
import { Star } from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 h-[38rem] to-purple-700 py-16 px-4 sm:px-6 lg:px-8 rounded-lg shadow-xl">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Discover Honest Reviews You Can Trust
          </h1>

          <p className="text-xl text-blue-100">
            Join thousands of users finding the best products and services with
            our verified community ratings.
          </p>

          <div className="flex items-center">
            <div className="flex mr-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={24} fill="#FFD700" color="#FFD700" />
              ))}
            </div>
            <span className="text-white font-medium">
              4.9 from 10,000+ reviews
            </span>
          </div>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0">
          <div className="relative">
            <img
              src="https://img.freepik.com/premium-vector/icon-template-5-stars-approved-gentle-colors-web-banners-flyers-printing-postcards-invitat_678847-50.jpg?ga=GA1.1.905776187.1727602890&semt=ais_hybrid&w=740"
              alt="People reviewing products"
              className="rounded-lg shadow-lg object-cover"
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <div className="text-blue-600 font-bold text-xl">4.8</div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <Star
                      key={star}
                      size={16}
                      fill={index < 4 ? "#FFD700" : "#FFD700"}
                      color="#FFD700"
                      fillOpacity={index < 4 ? 1 : 0.8}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">Top Rated Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
