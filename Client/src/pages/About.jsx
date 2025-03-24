import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              About RateNest
            </h1>
            <p className="mt-4 text-xl max-w-3xl mx-auto">
              Where honest reviews meet thoughtful consumers
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 bg-white transform skew-y-3 -translate-y-8 z-10"></div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            Our Mission
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Empowering Better Decisions
          </p>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500 lg:mx-auto">
            At RateNest, we believe in the power of authentic feedback to
            transform the way people discover and choose products and services.
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Authentic Reviews
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  We verify reviewers and moderate content to ensure you get
                  genuine insights from real users.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Trusted Platform
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Our rating system is designed to be fair, transparent, and
                  immune to manipulation.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Actionable Insights
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  We go beyond stars and ratings to provide detailed analytics
                  and recommendations.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Community-Driven
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  We foster a community of discerning consumers who value honest
                  feedback and quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Story
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                RateNest was born from a simple frustration: finding reliable
                reviews for products and services was too difficult. Our
                founders spent hours researching purchases only to be
                disappointed by biased or fake reviews.
              </p>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                In 2023, we launched RateNest with a mission to create a haven
                for authentic feedback. We built sophisticated verification
                systems and cultivated a community of trustworthy reviewers.
              </p>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Today, millions of consumers rely on RateNest to make informed
                decisions, and thousands of businesses value our platform for
                genuine customer insights.
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-blue-600 px-6 py-8 sm:p-10 sm:pb-6">
                  <div className="flex items-center justify-center h-20 w-20 rounded-md bg-white text-blue-600 mx-auto">
                    <svg
                      className="h-12 w-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="text-center mt-5">
                    <h3 className="text-2xl leading-8 font-extrabold text-white tracking-tight sm:text-3xl sm:leading-9">
                      Our Values
                    </h3>
                  </div>
                </div>
                <div className="px-6 pt-6 pb-8 bg-white sm:p-10 sm:pt-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        <span className="font-bold">Integrity:</span> We uphold
                        the highest standards of honesty and transparency.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        <span className="font-bold">Empowerment:</span> We give
                        consumers the information they need to make confident
                        choices.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        <span className="font-bold">Quality:</span> We focus on
                        detailed, thoughtful reviews rather than quantity.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        <span className="font-bold">Innovation:</span> We
                        continuously improve our platform with cutting-edge
                        technology.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Passionate professionals committed to transforming how people
            discover quality products and services.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Team Member 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 h-32"></div>
            <div className="px-6 py-8 relative">
              <div className="absolute -mt-16 left-1/2 transform -translate-x-1/2">
                <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.67 0-11 2.45-11 7v1c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-1c0-4.55-5.33-7-11-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-center mt-10">
                <h3 className="text-xl font-bold text-gray-900">
                  Sarah Johnson
                </h3>
                <p className="text-blue-600 font-medium">Co-Founder & CEO</p>
                <p className="mt-2 text-gray-500">
                  Former product manager with a passion for consumer advocacy
                  and transparent business practices.
                </p>
              </div>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 h-32"></div>
            <div className="px-6 py-8 relative">
              <div className="absolute -mt-16 left-1/2 transform -translate-x-1/2">
                <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.67 0-11 2.45-11 7v1c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-1c0-4.55-5.33-7-11-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-center mt-10">
                <h3 className="text-xl font-bold text-gray-900">
                  Michael Chen
                </h3>
                <p className="text-blue-600 font-medium">Co-Founder & CTO</p>
                <p className="mt-2 text-gray-500">
                  Data scientist specialized in developing algorithms that
                  detect patterns and ensure review authenticity.
                </p>
              </div>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 h-32"></div>
            <div className="px-6 py-8 relative">
              <div className="absolute -mt-16 left-1/2 transform -translate-x-1/2">
                <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.67 0-11 2.45-11 7v1c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-1c0-4.55-5.33-7-11-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-center mt-10">
                <h3 className="text-xl font-bold text-gray-900">Priya Patel</h3>
                <p className="text-blue-600 font-medium">Head of Community</p>
                <p className="mt-2 text-gray-500">
                  Community building expert who fosters engagement and ensures
                  quality standards across our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How RateNest Works
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Our innovative approach to product and service reviews
            </p>
          </div>

          <div className="mt-16">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">
                  The RateNest Difference
                </span>
              </div>
            </div>

            <div className="mt-8 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-base text-gray-500 text-center">
                      <span className="block text-lg font-medium text-gray-900">
                        Verified Reviews
                      </span>
                      <span className="block mt-1">
                        We verify all reviewers through a multi-step process to
                        ensure authenticity.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-base text-gray-500 text-center">
                      <span className="block text-lg font-medium text-gray-900">
                        Smart Analytics
                      </span>
                      <span className="block mt-1">
                        Our AI-powered system analyzes reviews to highlight the
                        most helpful feedback.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-base text-gray-500 text-center">
                      <span className="block text-lg font-medium text-gray-900">
                        Community Focus
                      </span>
                      <span className="block mt-1">
                        We foster discussion and reward helpful contributions
                        from our community members.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              What People Are Saying
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
              From consumers to business owners, hear what our community thinks
              about RateNest.
            </p>
          </div>
          <div className="mt-12 space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-12 w-12 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2H6a2 2 0 00-2 2v16c0 1.1.9 2 2 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm0 18H6V4h12v16zM9 5h6v2H9V5zm6 4H9v2h6V9zm6 4H9v2h12v-2zm0 4H9v2h12v-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 italic">
                    "RateNest has completely changed how I shop online. The
                    verified reviews give me confidence that I'm seeing real
                    opinions, not paid endorsements."
                  </p>
                  <div className="mt-3">
                    <p className="text-base font-medium text-gray-900">
                      Alicia Smith
                    </p>
                    <p className="text-sm text-gray-500">Consumer</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-12 w-12 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2H6a2 2 0 00-2 2v16c0 1.1.9 2 2 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm0 18H6V4h12v16zM9 5h6v2H9V5zm6 4H9v2h6V9zm6 4H9v2h12v-2zm0 4H9v2h12v-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 italic">
                    "As a small business owner, RateNest has been invaluable.
                    The detailed feedback helps us improve our products, and the
                    verification system prevents competitors from posting fake
                    negative reviews."
                  </p>
                  <div className="mt-3">
                    <p className="text-base font-medium text-gray-900">
                      David Rodriguez
                    </p>
                    <p className="text-sm text-gray-500">Business Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to experience better reviews?</span>
            <span className="block text-blue-200">
              Join our community today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Sign Up
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
