import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { checkEmailVerified, resendVerificationEmail } from "../api";
import "./EmailVerifyField.css";

/**
 * EmailVerifyField
 *
 * Drop-in replacement for a plain email <input> that adds:
 *  - A "Verify Email" button shown once a valid-looking email is typed
 *  - A green ✓ tick (+ label) when the email is already verified in the DB
 *  - Auto re-checks the DB when the user comes back to this tab (visibilitychange / focus)
 *    so they don't have to reload the page after clicking the verification link
 *  - Blocks the parent form submit via `onVerifiedChange(false)` until verified
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailVerifyField = ({
  value,
  onChange,
  name = "email",
  placeholder = "Enter your email",
  nameValue = "",
  onVerifiedChange,
  required,
}) => {
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const lastCheckedRef = useRef("");

  // ── Core check function (reusable) ─────────────────────────────────────────
  const checkStatus = useCallback(async (email) => {
    if (!EMAIL_RE.test(email)) return;
    setChecking(true);
    try {
      const res = await checkEmailVerified(email);
      const isVerified = !!res?.verified;
      lastCheckedRef.current = email;
      setVerified(isVerified);
      if (onVerifiedChange) onVerifiedChange(isVerified);
      // Once verified, clear the "sent" hint — no longer needed
      if (isVerified) setSent(false);
    } catch {
      // silently ignore
    } finally {
      setChecking(false);
    }
  }, [onVerifiedChange]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset when email value changes ─────────────────────────────────────────
  useEffect(() => {
    if (value !== lastCheckedRef.current) {
      lastCheckedRef.current = ""; // clear cache so same email re-checks on re-mount
      setVerified(false);
      setSent(false);
      setError("");
      if (onVerifiedChange) onVerifiedChange(false);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-check on email change (debounced 600ms) ───────────────────────────
  useEffect(() => {
    if (!EMAIL_RE.test(value)) return;
    if (value === lastCheckedRef.current) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!cancelled) await checkStatus(value);
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, checkStatus]);

  // ── Re-check when user returns to the tab after verifying their email ───────
  useEffect(() => {
    const recheck = () => {
      // Only fire if we have a valid email that was sent a verification link
      if (EMAIL_RE.test(value) && sent && !verified) {
        checkStatus(value);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") recheck();
    };

    window.addEventListener("focus", recheck);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", recheck);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [value, sent, verified, checkStatus]);

  const handleVerifyClick = async () => {
    if (!EMAIL_RE.test(value)) {
      setError("Please enter a valid email address first.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await resendVerificationEmail({ name: nameValue, email: value });
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send verification email. Try again.");
    } finally {
      setSending(false);
    }
  };

  const isValidEmail = EMAIL_RE.test(value);

  return (
    <div className="evf-wrapper">
      <div className={`evf-input-row ${verified ? "evf-verified" : ""}`}>
        <input
          type="email"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="evf-input"
          disabled={verified}
        />
        {checking && (
          <span className="evf-status evf-checking">Checking…</span>
        )}
        {!checking && verified && (
          <span className="evf-status evf-tick">
            <FaCheckCircle className="evf-tick-icon" />
            Verified
          </span>
        )}
        {!checking && !verified && isValidEmail && !sent && (
          <button
            type="button"
            className="evf-verify-btn"
            onClick={handleVerifyClick}
            disabled={sending}
          >
            {sending ? "Sending…" : "Verify Email"}
          </button>
        )}
      </div>

      {sent && !verified && (
        <p className="evf-hint evf-sent">
          ✉ Verification link sent! Open the email, click the link, then come
          back to this tab — the form will unlock automatically.
        </p>
      )}
      {!verified && isValidEmail && !sent && !checking && (
        <p className="evf-hint">
          Click <strong>Verify Email</strong> to receive a verification link.
        </p>
      )}
      {error && <p className="evf-hint evf-error">{error}</p>}
    </div>
  );
};

export default EmailVerifyField;
