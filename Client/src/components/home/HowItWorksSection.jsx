import React from "react";
import { Search, Star, MessageSquare, ThumbsUp, Users } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Search className="h-12 w-12 text-blue-600" />,
      title: "Find Products",
      description:
        "Search our extensive catalog of products across various categories or browse trending items to find what you're looking for.",
    },
    {
      icon: <Star className="h-12 w-12 text-yellow-500" />,
      title: "Rate Products",
      description:
        "Share your experience by rating products on a 5-star scale based on quality, value, and overall satisfaction.",
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-green-500" />,
      title: "Write Reviews",
      description:
        "Provide detailed feedback about your experience with the product to help other consumers make informed decisions.",
    },
    {
      icon: <ThumbsUp className="h-12 w-12 text-purple-500" />,
      title: "Vote on Reviews",
      description:
        "Mark helpful reviews to increase their visibility and help the community identify the most valuable feedback.",
    },
    {
      icon: <Users className="h-12 w-12 text-red-500" />,
      title: "Join the Community",
      description:
        "Connect with other users, follow reviewers with similar tastes, and build your reputation as a trusted reviewer.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How RateNest Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how our platform helps you make informed purchasing
            decisions and share your valuable experiences with others.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-gray-50 rounded-full shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute transform translate-x-32 translate-y-10">
                  <svg
                    className="w-12 h-8 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-700 mb-6">
            Join thousands of users who make better purchasing decisions with
            RateNest every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/product"
              className="px-8 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
