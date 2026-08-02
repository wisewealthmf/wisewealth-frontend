import React, { useState } from 'react';
import './ServicesSection.css';


const ServicesSection = () => {
  const [activeCard, setActiveCard] = useState(null);

  const services = [
    {
      id: 1,
      title: 'Mutual Fund Investing',
      subtitle: 'SIP · Lumpsum · ELSS · SWP',
      description: 'We find the right type for your situation.',
      color: '#2266a0'
    },
    {
      id: 2,
      title: 'Goal-Based Planning',
      subtitle: 'Home. Education. Marriage. Retirement.',
      description: 'We build a plan around your actual life goals.',
      color: '#4a9fd8'
    },
    {
      id: 3,
      title: 'Dream Goals',
      subtitle: 'Dream car. Dream watch. Dream trip.',
      description: "That moment you've been putting off. We help you invest so your dreams have a deadline — not just a wishlist.",
      color: '#d4af37'
    },
    {
      id: 4,
      title: 'Portfolio Review',
      subtitle: 'Already investing somewhere?',
      description: 'We review it, fix the gaps, and align it with where you want to go.',
      color: '#4caf50'
    },
    {
      id: 5,
      title: 'NRI Investment Support',
      subtitle: 'Living abroad?',
      description: 'We make investing in India simple and guided — from wherever you are.',
      color: '#ff9800'
    }
  ];

  return (
    <section id="services" className="services-section section">
      <div className="container">
        <p className="section-title">Services</p>
        <h2 className="section-heading">Here's How We Help You</h2>
        <p className="section-subheading">No tips. No confusion. Just simple steps to grow your money.</p>
        
        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`service-card ${activeCard === service.id ? 'active' : ''}`}
              onMouseEnter={() => setActiveCard(service.id)}
              onMouseLeave={() => setActiveCard(null)}
              style={{ '--card-color': service.color }}
            >
              <div className="service-number">
                0{service.id}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-subtitle">{service.subtitle}</p>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

// Made with Bob
