import React, { useState } from "react";
import { registerUser, loginUser } from "../api";
import Toast from "./Toast";
import "./LoginModal.css";

function LoginModal({ show, onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      try {
        await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: "",
        });

        setToast({
          message: "Account created successfully! You can now log in.",
          type: "success",
        });
        setIsSignup(false);
        setFormData({ name: "", email: "", password: "" });
      } catch (error) {
        console.error(error);
        setToast({
          message:
            error.message ||
            "Unable to create account. Please try again later.",
          type: "error",
        });
      }
    } else {
      try {
        const response = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        setToast({ message: "Logged in successfully.", type: "success" });
        setFormData({ name: "", email: "", password: "" });
        onClose();
      } catch (error) {
        console.error(error);
        setToast({
          message: error.message || "Unable to log in. Please try again later.",
          type: "error",
        });
      }
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="login-header">
          <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

          <p>
            {isSignup
              ? "Start your wealth journey today."
              : "Login to your account."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignup && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn">
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="login-switch">
          {isSignup ? "Already have an account?" : "Don't have an account?"}

          <button onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </div>
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
}

export default LoginModal;
