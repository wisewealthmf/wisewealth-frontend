import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./EmailVerifiedPage.css";
import { API_BASE_URL } from "../api";

const EmailVerifiedPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");
  // Guard against React StrictMode double-invoking the effect
  const calledRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (calledRef.current) return;
    calledRef.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link. Please use the link from your email.");
      return;
    }

    fetch(`${API_BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully! You can now submit forms on WiseWealth.");
        } else {
          const body = await res.json().catch(() => ({}));
          setStatus("error");
          setMessage(body.message || "The verification link is invalid or has expired. Please submit a form again to receive a new link.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again or contact support.");
      });
  }, [searchParams]);

  return (
    <div className="email-verified-page">
      <Navbar />

      <section className="email-verified-section">
        <div className="email-verified-card">
          {status === "loading" && (
            <>
              <div className="ev-spinner" />
              <h2>Verifying your email…</h2>
              <p>Please wait a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="ev-icon ev-icon--success">✓</div>
              <h2>Email Verified!</h2>
              <p>{message}</p>
              <Link to="/contact" className="ev-btn">
                Submit a Form
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="ev-icon ev-icon--error">✗</div>
              <h2>Verification Failed</h2>
              <p>{message}</p>
              <Link to="/contact" className="ev-btn ev-btn--secondary">
                Go Back to Contact Page
              </Link>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EmailVerifiedPage;
