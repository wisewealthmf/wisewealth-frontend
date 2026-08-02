import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import HeroSection from './sections/HeroSection';
import ProblemSection from './sections/ProblemSection';
import ServicesSection from './sections/ServicesSection';
import StepsSection from './sections/StepsSection';
import WhyWiseWealthSection from './sections/WhyWiseWealthSection';
import WealthCheckSection from './sections/WealthCheckSection';
import ReviewsSection from './sections/ReviewsSection';
import FAQSection from './sections/FAQSection';
import Footer from './Footer';
import './HomePage.css';

const HomePage = () => {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    // Logo animation on page load
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page">
      {/* Logo Animation Overlay */}
      {showLogo && (
        <div className="logo-overlay">
          <div className="logo-animation">
            <h1 className="animated-logo">WiseWealth</h1>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!showLogo && (
        <>
          <Navbar />
          <HeroSection />
          {/* <ProblemSection /> */}
          <ServicesSection />
          <StepsSection />
          <WhyWiseWealthSection />
          <WealthCheckSection />
          <ReviewsSection />
          <FAQSection />
          <Footer />
        </>
      )}
    </div>
  );
};

export default HomePage;

// Made with Bob
