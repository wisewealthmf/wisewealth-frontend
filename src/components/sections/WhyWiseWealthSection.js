import React from 'react';
import './WhyWiseWealthSection.css';

const WhyWiseWealthSection = () => {
  const reasons = [
    {
      number: '01',
      title: 'Your Goals Come First. Always.',
      description: 'We work for you — not the product. Every recommendation is built around your future. Just what genuinely makes sense for your life.'
    },
    {
      number: '02',
      title: 'We make it simple. Ever.',
      description: "If you don't understand it, we won't recommend it. We speak in plain language — always. You'll leave every conversation clearer than when you came in."
    },
    {
      number: '03',
      title: 'Your Plan is Yours Only.',
      description: "Because your life doesn't look like anyone else's. Your income, your goals, your risk appetite — everything is considered before a single rupee is discussed."
    },
    {
      number: '04',
      title: 'We Stay With You. Always.',
      description: 'The real work begins after day one. Regular check-ins, portfolio reviews, and honest guidance — we stay with you as your life and goals evolve.'
    },
    {
      number: '05',
      title: 'Always Current. Always Prepared.',
      description: "Markets change. Tax laws change. Your advisor shouldn't be behind. We stay updated on the latest funds, regulations, and market shifts — so your plan never becomes outdated."
    }
  ];

  return (
    <section id="why-wisewealth" className="why-section section">
      <div className="container">
        <h2 className="section-heading">Why People Trust WiseWealth</h2>
        
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-card">

            <div className="reason-number">
              {reason.number}
            </div>
          
            <div className="reason-content">
          
              <h3 className="reason-title">
                {reason.title}
              </h3>
          
              <p className="reason-description">
                {reason.description}
              </p>
          
            </div>
          
          </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyWiseWealthSection;

// Made with Bob
