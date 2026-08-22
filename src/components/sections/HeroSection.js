import { useState, useEffect } from "react";
import {
  FaHome,
  FaCar,
  FaHeart,
  FaPlane,
  FaSyncAlt,
  FaGraduationCap,
  FaHeartbeat,
  FaChartLine,
  FaWallet,
  FaBullseye,
  FaRing,
  FaPeopleArrows
} from "react-icons/fa";
import { createConsultation } from "../../api";
import PlanTomorrowModal from "../PlanTomorrowModal";
import Toast from "../Toast";
import "./HeroSection.css";
import logo from '../../assets/logo.png'

function HeroSection() {
  const [active, setActive] = useState(null);
  const [toast, setToast] = useState(null);

  const data = {
    "Smart Investing": {
      title: "Smart Investing",
      text: "Mutual fund strategies designed to grow your wealth with balanced risk.",
    },

    "Goal Planning": {
      title: "Goal Planning",
      text: "Create focused financial plans for retirement, education, and milestones.",
    },

    "Wealth Tracking": {
      title: "Wealth Tracking",
      text: "Monitor portfolio growth and investment performance in real time.",
    },

    "Expert Guidance": {
      title: "Expert Guidance",
      text: "Get trusted financial insights and personalized support for every stage.",
    },
  };

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    goal: "",
    captcha: "",
  });

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
        message: "Thank you! We will contact you soon.",
        type: "success",
      });
      setFormData({ name: "", mobile: "", email: "", goal: "", captcha: "" });
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshCaptcha = () => {
    const random =
      captchaIcons[Math.floor(Math.random() * captchaIcons.length)];

    setCaptchaTarget(random.id);
    setCaptchaAnswer("");
  };

  return (
    <section className="hero">
      {/* LEFT */}
      <div className="hero-left">
        <p className="hero-tag">WiseWealth</p>

        <h1>
          BUILD YOUR
          <br />
          TOMORROW.
        </h1>

        <p className="hero-desc">
          Helping you invest with clarity, confidence, and long-term financial
          vision.
        </p>

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

      {/* RIGHT */}
      <div className="hero-right">

  <div className="center-logo">
    <div className="goal-ring"></div>
    <span>Goals</span>
  </div>

  <div className="orbit-container">

    <div className="orbit o1">
      <div className="finance-bubble">
      <div className="bubble-content">
        <FaWallet />
        <span>Wealth</span>
        </div>
      </div>
    </div>

    <div className="orbit o2">
      <div className="finance-bubble">
      <div className="bubble-content">
        <FaHome />
        <span>Home</span>
        </div>
      </div>
    </div>

    <div className="orbit o3">
      <div className="finance-bubble">
      <div className="bubble-content">
        <FaGraduationCap />
        <span>Education</span>
        </div>
      </div>
    </div>

    <div className="orbit o4">
      <div className="finance-bubble">
      <div className="bubble-content">
        <FaPlane />
        <span>Travel</span>
        </div>
      </div>
    </div>

    <div className="orbit o5">
      <div className="finance-bubble">
      <div className="bubble-content">
        <FaHeartbeat />
        <span>Health</span>
        </div>
      </div>
    </div>

    <div className="orbit o6">
      <div className="finance-bubble">
      <div className="bubble-content">
        <FaCar />
        <span>Car</span>
        </div>
      </div>
    </div>

    <div className="orbit o7">
      <div className="finance-bubble">
        <div className="bubble-content">
        <FaRing />
        <span>Marriage</span>
        </div>
      </div>
    </div>

  </div>

</div>

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
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}

export default HeroSection;
