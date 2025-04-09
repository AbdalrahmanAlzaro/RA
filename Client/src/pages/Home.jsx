import React from "react";
import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import AboutSection from "../components/home/AboutSection";
import FAQSection from "../components/home/FAQSection";
import HowItWorksSection from "../components/home/HowItWorksSection";

const Home = () => {
  return (
    <>
      <Hero />
      <div className="px-4 py-8">
        <CategorySection />
        <AboutSection />
        <HowItWorksSection />
        <FAQSection />
      </div>
    </>
  );
};

export default Home;
