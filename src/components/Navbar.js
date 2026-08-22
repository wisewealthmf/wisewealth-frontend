import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaCar,
  FaHeart,
  FaPlane,
  FaGraduationCap,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { createConsultation } from "../api";
import "./Navbar.css";
import logo from "../assets/logo.png";
import PlanTomorrowModal from "../components/PlanTomorrowModal";
import FreeGuideModal from "../components/FreeGuideModal";
import Toast from "../components/Toast";

function Navbar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("/");
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    setActiveLink(location.pathname);
    setMenuOpen(false); // close menu on route change
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showFreeGuideModal, setShowFreeGuideModal] = useState(false);

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
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/"><img src={logo} alt="WiseWealth Logo" className="logo-img" /></Link>
        </div>

        <ul className="navbar-links">
          <li className={activeLink === "/" ? "active" : ""}>
            <Link to="/">Home</Link>
          </li>
          <li className={activeLink === "/about" ? "active" : ""}>
            <Link to="/about">About</Link>
          </li>
          <li className={activeLink === "/tools" ? "active" : ""}>
            <Link to="/tools">Tools</Link>
          </li>
          <li className={activeLink === "/contact" ? "active" : ""}>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>

        <div className="nav-right">
          <button className="navbar-btn" onClick={() => setShowPlanModal(true)}>
            Plan My Tomorrow
          </button>
          <a href="https://topmate.io/wisewealth">
            <button className="navbar-btn">
              Book Free 1:1 Session
            </button>
          </a>
          <a href="https://topmate.io/wisewealth/2182064?utm_source=public_profile&utm_capaign=wisewealth">
          <button
            className="navbar-btn navbar-btn-guide"
          >
            Get Free Guide
          </button>
          </a>
        </div>

        {/* Hamburger icon — only visible on mobile */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <ul className="mobile-nav-links">
          <li className={activeLink === "/" ? "active" : ""}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li className={activeLink === "/about" ? "active" : ""}>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          </li>
          <li className={activeLink === "/tools" ? "active" : ""}>
            <Link to="/tools" onClick={() => setMenuOpen(false)}>Tools</Link>
          </li>
          <li className={activeLink === "/contact" ? "active" : ""}>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </li>
        </ul>
        <div className="mobile-nav-btns">
          <button
            className="navbar-btn mobile-full-btn"
            onClick={() => { setMenuOpen(false); setShowPlanModal(true); }}
          >
            Plan My Tomorrow
          </button>
          <a href="https://topmate.io/wisewealth" style={{ width: "100%" }}>
            <button className="navbar-btn mobile-full-btn">
              Book Free 1:1 Session
            </button>
          </a>
          <button
            className="navbar-btn navbar-btn-guide mobile-full-btn"
            onClick={() => { setMenuOpen(false); setShowFreeGuideModal(true); }}
          >
            Get Free Guide
          </button>
        </div>
      </div>

      <FreeGuideModal
        show={showFreeGuideModal}
        onClose={() => setShowFreeGuideModal(false)}
      />
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
    </div>
  );
}

export default Navbar;
