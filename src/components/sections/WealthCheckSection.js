import React, { useState, useEffect } from "react";
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
import "./WealthCheckSection.css";
import PlanTomorrowModal from "../PlanTomorrowModal";

// Helpers

function formatIndian(n) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function formatFull(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

const WealthCheckSection = () => {
  const [investment, setInvestment] = useState("100000");
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(15);

  const [result, setResult] = useState(null);

  useEffect(() => {
    const P = Number(investment);

    if (!P || P <= 0) {
      setResult(null);
      return;
    }

    const total = P * Math.pow(1 + returnRate / 100, years);

    const gains = total - P;

    const oppCost = total - P * Math.pow(1 + returnRate / 100, years - 1);

    const multiplier = (total / P).toFixed(1);

    setResult({
      invested: P,
      total,
      gains,
      oppCost,
      multiplier,
    });
  }, [investment, returnRate, years]);

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
  const [toast, setToast] = useState(null);

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
    <section id="wealth-check" className="wealth-check-section section">
      <div className="container">
        <p className="section-title">Opportunity Cost</p>

        <h2 className="section-heading">Wealth Reality Check</h2>

        <div className="wealth-calculator">
          {/* INPUTS */}

          <div className="calculator-card">
            <div className="input-row">
              <div className="input-group">
                <label>One-Time Investment</label>

                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  placeholder="₹ 1,00,000"
                />
              </div>

              <div className="input-group">
                <label>Expected Return (%)</label>

                <input
                  type="number"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="slider-row">
              <div className="slider-header">
                <label>Years To Invest</label>

                <span>{years} Years</span>
              </div>

              <input
                type="range"
                min="1"
                max="50"
                value={years}
                className="year-slider"
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>
          </div>

          {/* RESULTS */}

          {result && (
            <>
              <div className="results-row">
                <div className="result-box main-result">
                  <h3>Your Wealth Growth</h3>

                  <div className="result-item">
                    <span>Investment</span>
                    <strong>{formatFull(result.invested)}</strong>
                  </div>

                  <div className="result-item">
                    <span>Returns</span>
                    <strong>{formatIndian(result.gains)}</strong>
                  </div>

                  <div className="result-item total">
                    <span>Total Value</span>
                    <strong>{formatIndian(result.total)}</strong>
                  </div>

                  <p className="result-multiplier">
                    That's <strong>{result.multiplier}×</strong> your money in{" "}
                    {years} years
                  </p>
                </div>

                <div className="result-box opportunity-box">
                  <h3>Cost of Waiting 1 Year</h3>

                  <div className="opportunity-value">
                    {formatIndian(result.oppCost)}
                  </div>

                  <p>
                    Waiting just one year reduces the power of compounding and
                    costs you <strong>{formatIndian(result.oppCost)}</strong> in
                    future wealth.
                  </p>
                </div>
              </div>

              <div className="opportunity-explainer">
                <h3>Why Opportunity Cost Matters</h3>

                <p>
                  Opportunity cost is the money you miss out on by delaying an
                  investment decision.
                </p>

                <p>
                  The earlier you invest, the longer compounding has to work for
                  you. Even a one-year delay can create a surprisingly large gap
                  in future wealth.
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
            </>
          )}
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
};

export default WealthCheckSection;
