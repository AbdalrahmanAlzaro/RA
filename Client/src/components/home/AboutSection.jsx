import React from "react";
import { Star, Users, Search, Check, MessageSquare } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-white py-12 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          About RateNest
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Your trusted destination for honest product reviews and ratings.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-600">
          At RateNest, we believe that making informed purchasing decisions
          shouldn't be complicated. We've created a community-driven platform
          where real people share their authentic experiences with products
          across various categories.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Star className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Unbiased Reviews
            </h3>
            <p className="text-gray-600">
              Our community provides honest feedback based on real-world use
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Search className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Comprehensive Ratings
            </h3>
            <p className="text-gray-600">
              Easy-to-understand scoring system to quickly compare products
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              User-Friendly Experience
            </h3>
            <p className="text-gray-600">
              Simple navigation to find exactly what you're looking for
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Why Trust RateNest
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start mb-4">
            <div className="mr-4 mt-1">
              <Check className="text-green-500" size={20} />
            </div>
            <p className="text-gray-600">
              We don't accept paid reviews or sponsored content.
            </p>
          </div>
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <Check className="text-green-500" size={20} />
            </div>
            <p className="text-gray-600">
              Our commitment is to transparency and authenticity, ensuring that
              every rating and review you find here reflects genuine user
              experiences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
