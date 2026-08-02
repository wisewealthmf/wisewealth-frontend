import React, { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { requestFreeGuide } from "../api";
import Toast from "./Toast";
import "./FreeGuideModal.css";

const FreeGuideModal = ({ show, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const closeTimerRef = useRef(null);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      await requestFreeGuide(name.trim(), email.trim());
      setToast({
        message: "Guide sent! Check your inbox.",
        type: "success",
      });
      setName("");
      setEmail("");
      closeTimerRef.current = setTimeout(() => onClose(), 3000);
    } catch (err) {
      setToast({
        message:
          err.message || "Unable to send guide. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    onClose();
  };

  return (
    <div className="free-guide-overlay" onClick={handleClose}>
      <div className="free-guide-modal" onClick={(e) => e.stopPropagation()}>
        <button className="free-guide-close" onClick={handleClose}>
          <FaTimes />
        </button>

        <div className="free-guide-header">
          <h2>Get Your Free Guide</h2>
          <p>
            Enter your name and email and we'll send you our free financial
            planning guide — packed with actionable tips to grow your wealth.
          </p>
        </div>

        <form className="free-guide-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fg-name">Full Name *</label>
            <input
              id="fg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="fg-email">Email Address *</label>
            <input
              id="fg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="free-guide-submit"
            disabled={loading}
          >
            {loading ? "Sending…" : "Send Me the Guide"}
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

export default FreeGuideModal;
