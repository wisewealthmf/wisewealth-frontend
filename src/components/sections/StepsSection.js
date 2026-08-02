import React from 'react';
import './StepsSection.css';

const StepsSection = () => {
  const steps = [
    {
      number: '01',
      title: 'We Understand You',
      subtitle: 'Before we talk money, we talk life.',
      description: 'Your goals, your income, your dreams, your fears — we listen to all of it. No assumptions, no generic advice.'
    },
    {
      number: '02',
      title: 'We Build Your Plan',
      subtitle: 'Not a template. Your personalised plan.',
      description: 'A clear, simple investment roadmap designed around where you are today — and where you want to be tomorrow.'
    },
    {
      number: '03',
      title: 'You Start with Confidence',
      subtitle: 'The hardest step is the first one. We make it easy.',
      description: 'We set everything up, walk you through it, and make sure you begin without a single moment of confusion or doubt. Regular reviews, guidance, and updates so your plan keeps moving in the right direction.'
    },
    {
      number: '04',
      title: 'You Grow with Discipline',
      subtitle: "Wealth isn't built in a day. But it is built — consistently.",
      description: "Regular reviews, smart habits, and a partner who stays with you — so your money keeps working long after you've forgotten you invested."
    }
  ];

  return (
    <section id="steps" className="steps-section section">
      <div className="container">
        <p className="section-title">Your Wealth Journey</p>
        <h2 className="section-heading">Four Simple Steps</h2>
        <p className="section-subheading">From where you are — to where you want to be.</p>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-subtitle">{step.subtitle}</p>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;

// Made with Bob
