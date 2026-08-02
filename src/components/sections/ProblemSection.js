import React from 'react';
import logo from "../../assets/logo.png";
import './ProblemSection.css';

const ProblemSection = () => {
  const userProblems = [
    {
      emoji: '📉',
      name: 'User 1',
      message: '"The market fell… and I panicked." I invested once. It dropped. I exited in fear — and now I\'m scared to try again.'
    },
    {
      emoji: '💸',
      name: 'User 2',
      message: '"Salary comes in… and disappears." By month-end, there\'s nothing left. Investing feels like something I\'ll do "later."'
    },
    {
      emoji: '🤔',
      name: 'User 3',
      message: '"I want to invest, but where do I start?" SIPs, mutual funds, stocks — too many options, no clear direction.'
    },
    {
      emoji: '⏳',
      name: 'User 4',
      message: '"I\'ll start when the time is right." I keep planning to invest… but never actually begin.'
    },
    {
      emoji: '🎯',
      name: 'User 5',
      message: '"No clear goal behind my money." I\'m saving — but without planning my tomorrow. Where is it all going?'
    }
  ];

  return (
    <section id="problem" className="problem-section section">
      <div className="container">
        <p className="section-title">The Problem</p>
        <h2 className="section-heading">Does This Sound Like You?</h2>
        
        <div className="group-chat-container">
          {/* User Messages - All on Left */}
          {userProblems.map((problem, index) => (
  <div
    key={index}
    className="chat-message user-message animate-message"
    style={{
      animationDelay: `${index * 1.2}s`
    }}
  >
    <div className="chat-avatar">
      <div className="avatar-circle user-avatar">
        <span className="avatar-emoji">
          {problem.emoji}
        </span>
      </div>
    </div>

    <div className="chat-content">
      <div className="chat-name">
        {problem.name}
      </div>

      <div className="chat-bubble user-bubble">
        <p className="chat-text">
          {problem.message}
        </p>
      </div>
    </div>
  </div>
))}

          {/* WiseWealth Response - On Right */}
          <div
            className="chat-message wisewealth-message animate-message"
            style={{
              animationDelay: `${userProblems.length * 1.2}s`
            }}
          >
            <div className="chat-content wisewealth-content">
              <div className="chat-name wisewealth-name">WiseWealth</div>
              <div className="chat-bubble wisewealth-bubble">
                
                <p className="chat-text">
                  If any of these sound like you — you're not alone. And you're exactly who WiseWealth is built for. 
                  We understand your fears, your confusion, and your hesitation. That's why we're here — to guide you through every step, 
                  answer every question, and help you build the tomorrow you deserve.
                </p>
              </div>
            </div>
            <div className="chat-avatar">
            <div className="avatar-circle wisewealth-avatar">

              <img
                src={logo}
                alt="WiseWealth"
                className="avatar-logo"
              />

            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

// Made with Bob
