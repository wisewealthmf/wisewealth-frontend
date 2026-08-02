import React, { useState } from "react";
import {
  FaHome,
  FaCar,
  FaHeart,
  FaPlane,
  FaGraduationCap,
  FaSyncAlt,
} from "react-icons/fa";

import { createConsultation } from "../../api";
import Toast from "../Toast";
import EmailVerifyField from "../EmailVerifyField";
import "./FAQSection.css";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    interest: "",
    captcha: "",
  });
  const [emailVerified, setEmailVerified] = useState(false);

  const faqs = [
    {
      question: "What is WiseWealth?",
      answer:
        "WiseWealth is a mutual fund distribution brand. We help individuals like you invest with clarity, confidence, and a real plan built around your goals.",
    },
    {
      question: "Why should I invest in mutual funds?",
      answer:
        "Because your money sitting in a savings account is quietly losing value to inflation every single day. Mutual funds put your money to work — growing steadily while you focus on living your life. Whether your dream is a home, financial freedom, or retiring early — mutual funds are how ordinary people build extraordinary wealth over time.",
    },
    {
      question: "Are mutual funds safe?",
      answer:
        "Mutual funds are market-linked and can fluctuate — but they are SEBI-regulated, professionally managed, and historically one of the most effective tools for long-term wealth creation. The key is the right fund, the right timeline, and a plan built for you.",
    },
    {
      question: "I'm a complete beginner. Can I still invest?",
      answer:
        "Yes — beginners are exactly who we love working with. We walk you through everything step by step: what mutual funds are, how SIPs work, and which option suits your situation. No complexity, no pressure.",
    },
    {
      question: "What's the minimum amount I can start with?",
      answer:
        "You can start a SIP with as little as ₹500 per month. There's no need to wait until you have a large sum. The earlier you start, the more your money grows.",
    },
    {
      question: "How do you help clients choose the right mutual funds?",
      answer:
        "We start by understanding you — your goals, your income, your timeline, and how much risk lets you sleep at night. Then we match you with funds that fit your goals. Because the \"best\" fund isn't the one with the highest returns — it's the one that gets you to your finish line.",
    },
    {
      question: "Is my money safe with WiseWealth?",
      answer:
        "Your investments are held directly with SEBI-registered AMCs — not with us. We simply guide you to the right funds and make sure you stay on track. Mutual fund is a long term product, so you have stay invested for long term to get your goals.",
    },
    {
      question: "Can I withdraw my investment anytime?",
      answer:
        "Yes, most mutual funds allow you to redeem anytime. Some funds may have a small exit load or tax implication depending on your holding period — we'll always make sure you know what to expect before you invest.",
    },
    {
      question: "How do I get started?",
      answer:
        'Just click "Plan Your Tomorrow" on this page. We\'ll understand your goals, build your plan, and get you started — without confusion or pressure.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      setToast({
        message: "Please verify your email before submitting.",
        type: "info",
      });
      return;
    }

    if (captchaAnswer !== captchaTarget) {
      setToast({
        message: "Please complete captcha correctly.",
        type: "error",
      });
      return;
    }

    try {
      await createConsultation({
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        financialGoal: formData.interest,
        notes: "",
      });
      setToast({
        message: "Thank you! We will contact you soon.",
        type: "success",
      });
      setFormData({
        name: "",
        email: "",
        mobile: "",
        interest: "",
        captcha: "",
      });
      setEmailVerified(false);
      refreshCaptcha();
    } catch (error) {
      console.error(error);
      setToast({
        message: "Unable to submit your request. Please try again later.",
        type: "error",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const captchaIcons = [
    { id: "home", icon: <FaHome /> },
    { id: "car", icon: <FaCar /> },
    { id: "health", icon: <FaHeart /> },
    { id: "travel", icon: <FaPlane /> },
    { id: "education", icon: <FaGraduationCap /> },
  ];

  const [captchaTarget, setCaptchaTarget] = useState("home");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const refreshCaptcha = () => {
    const random =
      captchaIcons[Math.floor(Math.random() * captchaIcons.length)];

    setCaptchaTarget(random.id);
    setCaptchaAnswer("");
  };

  return (
    <section id="faq" className="faq-section section">
      <div className="container">
        <p className="section-title">FAQs</p>
        <h2 className="section-heading">Frequently Asked Questions</h2>

        <div className="faq-content">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeIndex === index ? "active" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </button>
                {activeIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div id="contact" className="cta-form-container">
            <h3 className="form-title">Plan My Tomorrow</h3>
            <form onSubmit={handleSubmit} className="cta-form">
              <input
                type="text"
                name="name"
                placeholder="Name *"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <EmailVerifyField
                value={formData.email}
                onChange={handleChange}
                name="email"
                placeholder="Email *"
                nameValue={formData.name}
                onVerifiedChange={setEmailVerified}
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number *"
                value={formData.mobile}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength={10}
                title="Enter a 10-digit mobile number"
                required
              />
              <select
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
              >
                <option value="">Select Interest Type *</option>
                <option value="mutual-fund">Mutual Fund Investment</option>
                <option value="goal-planning">Goal Based Planning</option>
                <option value="dream-goals">Dream Goals Planning</option>
                <option value="portfolio-review">Portfolio Review</option>
                <option value="nri-support">NRI Investment Support</option>
                <option value="others">Others</option>
              </select>
              <div className="captcha-box">
                <div className="captcha-header">
                  <p>
                    To complete captcha, please select:
                    <strong> {captchaTarget}</strong>
                  </p>

                  <button
                    type="button"
                    className="captcha-refresh"
                    onClick={refreshCaptcha}
                  >
                    <FaSyncAlt />
                  </button>
                </div>

                <div className="captcha-icons">
                  {captchaIcons.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`captcha-icon ${
                        captchaAnswer === item.id ? "selected" : ""
                      }`}
                      onClick={() => setCaptchaAnswer(item.id)}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={!emailVerified}
                title={!emailVerified ? "Please verify your email first" : undefined}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
};

export default FAQSection;

// Made with Bob
