import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaCar,
  FaHeart,
  FaPlane,
  FaGraduationCap,
  FaSyncAlt,
} from "react-icons/fa";
import { createConsultation } from "../api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";
import EmailVerifyField from "./EmailVerifyField";
import "./AboutPage.css";
import PlanTomorrowModal from "../components/PlanTomorrowModal";
import COOImg from "../assets/niraj2.png";
import daughterImg from "../assets/keshvi2.jpeg";
import founderImg from "../assets/FounderImg.jpg";

const AboutPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    goal: "",
    captcha: "",
  });
  const [emailVerified, setEmailVerified] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    refreshCaptcha();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [showPlanModal, setShowPlanModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      setToast({
        message: "Please verify your email before submitting.",
        type: "info",
      });
      return false;
    }

    if (captchaAnswer !== captchaTarget) {
      setToast({
        message: "Please complete captcha correctly.",
        type: "error",
      });
      return false;
    }

    try {
      await createConsultation({
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        financialGoal: formData.goal,
        notes: "",
      });
      setToast({
        message: "Thank you! Your consultation request has been submitted.",
        type: "success",
      });
      setFormData({ name: "", mobile: "", email: "", goal: "", captcha: "" });
      setEmailVerified(false);
      refreshCaptcha();
      return true;
    } catch (error) {
      console.error(error);
      setToast({
        message: "Unable to submit your request. Please try again later.",
        type: "error",
      });
      return false;
    }
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

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    const random =
      captchaIcons[Math.floor(Math.random() * captchaIcons.length)];

    setCaptchaTarget(random.id);
    setCaptchaAnswer("");
  };

  const scrollToCTA = () => {
    const element = document.getElementById("contact-cta");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="about-page">
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

      <section className="founder-section">
        <div className="founder-header">
          <p className="section-title">Founder's Story</p>

          <h2 className="section-heading">The Story Behind WiseWealth</h2>
        </div>

        <div className="founder-image">

        <div className="founder-images">

    <div className="founder-card">
  <img
    src={founderImg}
    alt="Founder"
    className="founder-photo"
  />

  <div className="founder-info">
    <h3>Jagruti Rangwala</h3>
    <p>Founder, WiseWealth</p>
  </div>
</div>

<div className="founder-card">
  <img
    src={COOImg}
    alt="COO"
    className="founder-photo"
  />

  <div className="founder-info">
    <h3>Niraj Rangwala</h3>
    <p>Chief Operating Officer, WiseWealth</p>
  </div>
</div>

<div className="founder-card">
  <img
    src={daughterImg}
    alt="Keshvi Rangwala"
    className="founder-photo"
  />

  <div className="founder-info">
    <h3>Keshvi Rangwala</h3>
    <p>Business Head, WiseWealth</p>
  </div>
</div>

</div>



</div>

        <div className="founder-content">
          {/* LEFT SIDE - STORY */}

          <div className="story-timeline2">
            <div className="story-step2">
              <div className="step-number2">01</div>

              <div className="step-content2">
                <h3>Corporate Career</h3>

                <p>
                  I didn't plan to build WiseWealth. Life pushed me toward it —
                  and I'm grateful it did. I started out like most people: a
                  steady job at a multinational company, a monthly salary, and a
                  quiet curiosity about money.
                </p>
              </div>
            </div>

            <div className="story-step2">
              <div className="step-number2">02</div>

              <div className="step-content2">
                <h3>Discovered Investing</h3>

                <p>
                  While everyone around me was spending, I was asking a
                  different question — how do I make money work, even when I'm
                  not?
                </p>
              </div>
            </div>

            <div className="story-step2">
              <div className="step-number2">03</div>

              <div className="step-content2">
                <h3>Helping First Clients</h3>

                <p>
                  That curiosity led me to mutual funds. And then to something I
                  didn't expect — the joy of helping others invest smarter. I
                  started advising people on the side because watching someone
                  take control of their financial future genuinely excited me.
                </p>
              </div>
            </div>

            <div className="story-step2">
              <div className="step-number2">04</div>

              <div className="step-content2">
                <h3>Career Turning Point</h3>

                <p>
                  Then came the moment that changed everything. I lost my job.
                  For most people, that's a crisis. For me, it turned out to be
                  an opportunity. Instead of running back to a salary, I went
                  all in — on investing, on learning, on building something
                  real. It wasn't easy. But it was honest.
                </p>
              </div>
            </div>

            <div className="story-step2">
              <div className="step-number2">05</div>

              <div className="step-content2">
                <h3>WiseWealth Was Born</h3>

                <p>
                  That's how WiseWealth was born. Not in a boardroom. Not with
                  funding. But with a passion, a purpose, and a few clients who
                  trusted me before I had anything to show. Today, 250+ families
                  and individuals trust WiseWealth with their financial goals.
                  We're not the biggest name in the room. But we show up with
                  something most big names have forgotten — genuine care for
                  where your money takes you.
                </p>

                <div className="story-quote">
                  WiseWealth exists for one reason: because your financial
                  dreams deserve more than a generic plan.
                </div>
                
              </div>
            </div>
            <h3>- Niraj Rangwala, Founder</h3>
          </div>
          

          {/* RIGHT SIDE - STATS */}

          <div className="impact-box">
            <div className="impact-card">
              <h3>10+</h3>
              <p>Years Experience</p>
            </div>

            <div className="impact-card">
              <h3>250+</h3>
              <p>Families Served</p>
            </div>

            <div className="impact-card">
              <h3>₹25Cr+</h3>
              <p>Assets Managed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="purpose-section">
        <p className="section-title">Our Foundation</p>

        <h2 className="section-heading">What Drives WiseWealth</h2>

        {/* VISION */}

        <div className="vision-card">
          <span className="purpose-tag">OUR VISION</span>

          <h3>A Future Where Every Family Invests With Confidence</h3>

          <p>
            We envision a world where financial decisions are no longer
            confusing or intimidating. A world where every individual has access
            to honest guidance, clear strategies, and the confidence to build
            lasting wealth.
          </p>
        </div>

        {/* MISSION + VALUES */}

        <div className="purpose-grid">
          <div className="purpose-card">
            <span className="purpose-number">01</span>

            <h3>Our Mission</h3>

            <p>
              To simplify investing through personalized advice, disciplined
              planning, and long-term wealth-building strategies that help
              people achieve their life goals.
            </p>
          </div>

          <div className="purpose-card">
            <span className="purpose-number">02</span>

            <h3>Our Values</h3>

            <ul>
              <li>Transparency over complexity</li>
              <li>Trust before transactions</li>
              <li>Discipline over speculation</li>
              <li>Long-term thinking always</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
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

            <form className="wealth-plan-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number *</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter your mobile"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Enter a 10-digit mobile number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <EmailVerifyField
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                  placeholder="Enter your email"
                  nameValue={formData.name}
                  onVerifiedChange={setEmailVerified}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="goal">Your Financial Goal *</label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
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
                disabled={!emailVerified}
                title={!emailVerified ? "Please verify your email first" : undefined}
              >
                Plan My Tomorrow
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />

      <PlanTomorrowModal
        show={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        captchaIcons={captchaIcons}
        captchaTarget={captchaTarget}
        captchaAnswer={captchaAnswer}
        setCaptchaAnswer={setCaptchaAnswer}
        refreshCaptcha={refreshCaptcha}
        emailVerified={emailVerified}
        onEmailVerifiedChange={setEmailVerified}
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

export default AboutPage;

// Made with Bob
