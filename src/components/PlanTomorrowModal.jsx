import React, { useState, useRef, useEffect } from "react";
import { FaSyncAlt, FaTimes } from "react-icons/fa";
import { createConsultation } from "../api";
import Toast from "./Toast";
import "./PlanTomorrowModal.css";

const PlanTomorrowModal = ({
  show,
  onClose,
  formData,
  handleInputChange,
  handleSubmit,
  captchaIcons,
  captchaTarget,
  captchaAnswer,
  setCaptchaAnswer,
  refreshCaptcha,
}) => {
  const [toast, setToast] = useState(null);
  const closeTimerRef = useRef(null);
  const toastDuration = 3000;

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const closeWithDelay = () => {
    closeTimerRef.current = setTimeout(() => {
      onClose();
    }, toastDuration);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (captchaAnswer !== captchaTarget) {
      setToast({
        message: "Please complete captcha correctly.",
        type: "error",
      });
      return;
    }

    try {
      if (typeof handleSubmit === "function") {
        const result = await handleSubmit(e);
        if (result === false) return;

        setToast({
          message: "Thank you! Your consultation request has been submitted.",
          type: "success",
        });
        refreshCaptcha();
      } else {
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

        if (typeof handleInputChange === "function") {
          handleInputChange({ target: { name: "name", value: "" } });
          handleInputChange({ target: { name: "mobile", value: "" } });
          handleInputChange({ target: { name: "email", value: "" } });
          handleInputChange({ target: { name: "goal", value: "" } });
        }
        refreshCaptcha();
      }

      closeWithDelay();
    } catch (error) {
      console.error(error);
      setToast({
        message: "Unable to submit your request. Please try again later.",
        type: "error",
      });
    }
  };

  if (!show) return null;

  return (
    <div className="plan-modal-overlay" onClick={onClose}>
      <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="cta-header">
          <h2>Let's Plan Your Tomorrow</h2>
          <p>Take the first step towards financial freedom.</p>
        </div>

        <form className="wealth-plan-form" onSubmit={handleModalSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter mobile"
                pattern="[0-9]{10}"
                maxLength={10}
                title="Enter a 10-digit mobile number"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Your Financial Goal *</label>
            <select
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
                  <option value="loan-against-mutual-funds">Loan Against Mutual Funds</option>
                  <option value="public-offers">Public Offers</option>
                  <option value="fixed-income">Fixed Income</option>
                  <option value="others">Others</option>
            </select>
          </div>

          <div className="captcha-box">
            <div className="captcha-header">
              <p>
                Select:
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
          >
            Plan My Tomorrow
          </button>
        </form>
      </div>
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

export default PlanTomorrowModal;
