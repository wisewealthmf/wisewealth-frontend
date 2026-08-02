import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Toast.css";

function Toast({ message, type = "info", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const toastElement = (
    <div className={`toast toast--${type}`}>
      <div className="toast__content">
        <span className="toast__message">{message}</span>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return toastElement;
  }

  return createPortal(toastElement, document.body);
}

export default Toast;
