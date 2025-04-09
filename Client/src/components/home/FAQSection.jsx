import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I submit a product review?",
      answer:
        "To submit a product review, navigate to the product page you wish to review, click on the 'Write a Review' button, and fill out the form with your rating and comments. You'll need to be logged in to submit a review.",
    },
    {
      question: "How is the overall product rating calculated?",
      answer:
        "The overall product rating is calculated as a weighted average of all user reviews. We consider factors such as review recency, reviewer credibility, and verification status to ensure the most accurate representation.",
    },
    {
      question: "Can I edit or delete my review?",
      answer:
        "Yes, you can edit or delete your review at any time. Simply navigate to your profile, find the review in your review history, and click the 'Edit' or 'Delete' option.",
    },
    {
      question: "How do I know if a review is verified?",
      answer:
        "Verified reviews are marked with a 'Verified Purchase' badge. This indicates that the reviewer has purchased the product through a verified channel and we've confirmed the purchase.",
    },
    {
      question: "What if I suspect fake reviews for a product?",
      answer:
        "If you suspect fake reviews, please use the 'Report Review' feature available on each review. Our moderation team will investigate and take appropriate action to maintain the integrity of our platform.",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <HelpCircle className="text-blue-600 h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about using RateNest for product
            ratings and reviews.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex items-center justify-between w-full p-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-5 pb-5 text-gray-700">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600">Can't find what you're looking for?</p>
          <a
            href="/contact"
            className="inline-block mt-3 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
