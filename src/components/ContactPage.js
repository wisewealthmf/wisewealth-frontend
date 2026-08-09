import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaCar,
  FaHeart,
  FaPlane,
  FaGraduationCap,
  FaSyncAlt,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaYoutube,
  FaXTwitter
} from "react-icons/fa";
import { createQuery, createConsultation } from "../api";
import PlanTomorrowModal from "../components/PlanTomorrowModal";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";
import EmailVerifyField from "./EmailVerifyField";
import "./ContactPage.css";

const ContactPage = () => {
  const [toast, setToast] = useState(null);

  // ── Query form ──────────────────────────────────────────────────────────────
  const [queryFormData, setQueryFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    query: "",
  });
  const [queryEmailVerified, setQueryEmailVerified] = useState(false);

  // ── Consultation form ───────────────────────────────────────────────────────
  const [consultFormData, setConsultFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    goal: "",
  });
  const [consultEmailVerified, setConsultEmailVerified] = useState(false);

  const [showPlanModal, setShowPlanModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    refreshCaptcha();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Captcha ─────────────────────────────────────────────────────────────────
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
    const random = captchaIcons[Math.floor(Math.random() * captchaIcons.length)];
    setCaptchaTarget(random.id);
    setCaptchaAnswer("");
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleQueryInputChange = (e) => {
    setQueryFormData({ ...queryFormData, [e.target.name]: e.target.value });
  };

  const handleConsultInputChange = (e) => {
    setConsultFormData({ ...consultFormData, [e.target.name]: e.target.value });
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    if (!queryEmailVerified) {
      setToast({
        message: "Please verify your email before submitting.",
        type: "info",
      });
      return;
    }

    try {
      await createQuery({
        name: queryFormData.name,
        email: queryFormData.email,
        phone: queryFormData.mobile,
        queryText: queryFormData.query,
        category: "OTHER",
      });
      setToast({
        message: "Thank you! Your query has been submitted.",
        type: "success",
      });
      setQueryFormData({ name: "", mobile: "", email: "", query: "" });
      setQueryEmailVerified(false);
      refreshCaptcha();
    } catch (error) {
      console.error(error);
      setToast({
        message: "Unable to submit your query. Please try again later.",
        type: "error",
      });
    }
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();

    if (!consultEmailVerified) {
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
        name: consultFormData.name,
        email: consultFormData.email,
        phone: consultFormData.mobile,
        financialGoal: consultFormData.goal,
        notes: "",
      });
      setToast({
        message: "Thank you! Your consultation request has been submitted.",
        type: "success",
      });
      setConsultFormData({ name: "", mobile: "", email: "", goal: "" });
      setConsultEmailVerified(false);
      refreshCaptcha();
      return true;
    } catch (error) {
      console.error(error);
      setToast({
        message: "Unable to submit your consultation request. Please try again later.",
        type: "error",
      });
      return false;
    }
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/919876543210", "_blank");
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero reveal">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-hero-title">WiseWealth</h1>
            <p className="about-hero-tagline">Build Your Tomorrow</p>
            <button
              className="about-cta-button"
              onClick={() => setShowPlanModal(true)}
            >
              Plan My Tomorrow
            </button>
            <a href="https://topmate.io/wisewealth">
              <button className="about-cta-button">
                Book Free 1:1 Session
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Query Form Section */}
      <section id="contact-cta" className="contact-cta-section section">
        <div className="containerc">
          <div className="contact-cta-content">
            <div className="cta-header">
              <h2>Ask You Quries</h2>
              <p>Contact us to know more.</p>
            </div>

            <form className="wealth-plan-form" onSubmit={handleQuerySubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="query-name">Full Name *</label>
                  <input
                    type="text"
                    id="query-name"
                    name="name"
                    value={queryFormData.name}
                    onChange={handleQueryInputChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="query-mobile">Mobile Number</label>
                  <input
                    type="tel"
                    id="query-mobile"
                    name="mobile"
                    value={queryFormData.mobile}
                    onChange={handleQueryInputChange}
                    placeholder="Enter your mobile  (optional)"
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="query-email">Email Address *</label>
                <EmailVerifyField
                  value={queryFormData.email}
                  onChange={handleQueryInputChange}
                  name="email"
                  placeholder="Enter your email"
                  nameValue={queryFormData.name}
                  onVerifiedChange={setQueryEmailVerified}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="query-text">Your Query *</label>
                <textarea
                  id="query-text"
                  name="query"
                  rows="4"
                  placeholder="Enter your query here..."
                  value={queryFormData.query}
                  onChange={handleQueryInputChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-wealth-plan"
                disabled={!queryEmailVerified}
                title={
                  !queryEmailVerified
                    ? "Please verify your email first"
                    : undefined
                }
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Consultation Form Section */}
      <section id="contact-cta" className="contact-cta-section section">
        <div className="container">
          <div className="contact-cta-content">
            <div className="cta-header">
              <h2>Let's Plan Your Tomorrow</h2>
              <p>
                Take the first step towards financial freedom. Share your
                details and we'll guide you.
              </p>
            </div>

            <form
              className="wealth-plan-form"
              onSubmit={handleConsultationSubmit}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="consult-name">Full Name *</label>
                  <input
                    type="text"
                    id="consult-name"
                    name="name"
                    value={consultFormData.name}
                    onChange={handleConsultInputChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="consult-mobile">Mobile Number *</label>
                  <input
                    type="tel"
                    id="consult-mobile"
                    name="mobile"
                    value={consultFormData.mobile}
                    onChange={handleConsultInputChange}
                    placeholder="Enter your mobile"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Enter a 10-digit mobile number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="consult-email">Email Address *</label>
                <EmailVerifyField
                  value={consultFormData.email}
                  onChange={handleConsultInputChange}
                  name="email"
                  placeholder="Enter your email"
                  nameValue={consultFormData.name}
                  onVerifiedChange={setConsultEmailVerified}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="consult-goal">Your Financial Goal *</label>
                <select
                  id="consult-goal"
                  name="goal"
                  value={consultFormData.goal}
                  onChange={handleConsultInputChange}
                  required
                >
                  <option value="">Select Interest Type *</option>
                  <option value="mutual-fund">Mutual Fund Investment</option>
                  <option value="goal-planning">Goal Based Planning</option> 
                  <option value="portfolio-review">Portfolio Review</option>
                  <option value="nri-support">NRI Investment Support</option>
                  <option value="fixed-deposits">Fixed Deposits</option>
                  <option value="public-offers">Public Offers</option>
                  <option value="loan-against-mutual-funds">Loan Against Mutual Funds</option>
                  <option value="others">Others</option>
                </select>
              </div>

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
                className="submit-wealth-plan"
                disabled={!consultEmailVerified}
                title={
                  !consultEmailVerified
                    ? "Please verify your email first"
                    : undefined
                }
              >
                Plan My Tomorrow
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How to Reach Us Section */}
      <section className="reach-us-section section">
        <div className="container">
          <p className="section-title">Connect With Us</p>
          <h2 className="section-heading">How to Reach Us</h2>

          <div className="reach-us-grid">
            {/* Talk to Us Directly */}
            <div className="reach-card direct-contact">
              <h3>Talk to Us Directly</h3>
              <div className="contact-methods">
                <a
                  href="mailto:support@wisewealth.in"
                  className="contact-method"
                >
                  <div className="method-icon">📧</div>
                  <div className="method-details">
                    <span className="method-label">Email</span>
                    <span className="method-value">wisewealth.mf@gmail.com</span>
                  </div>
                </a>
                {/* <button
                  onClick={handleWhatsAppClick}
                  className="contact-method whatsapp-btn"
                >
                  <div className="method-icon">💬</div>
                  <div className="method-details">
                    <span className="method-label">WhatsApp</span>
                    <span className="method-value">Click to Chat</span>
                  </div>
                </button> */}
              </div>
            </div>

            {/* Social Presence */}
            <div className="reach-card social-presence">
              <h3>🌐 Social Presence</h3>
              <p className="social-description">
                Follow us for daily insights, tips, and updates on wealth
                management
              </p>
              <div className="footer-socials">

  <a
    href="https://instagram.com/wisewealth.firm"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaInstagram />
  </a>

  <a
    href="https://www.linkedin.com/company/wisewealthfirm"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaLinkedin />
  </a>

  {/* <a
    href="https://youtube.com/@yourchannel"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaYoutube />
  </a> */}

</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <PlanTomorrowModal
        show={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        formData={consultFormData}
        handleInputChange={handleConsultInputChange}
        handleSubmit={handleConsultationSubmit}
        captchaIcons={captchaIcons}
        captchaTarget={captchaTarget}
        captchaAnswer={captchaAnswer}
        setCaptchaAnswer={setCaptchaAnswer}
        refreshCaptcha={refreshCaptcha}
        emailVerified={consultEmailVerified}
        onEmailVerifiedChange={setConsultEmailVerified}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ContactPage;

// Made with Bob
