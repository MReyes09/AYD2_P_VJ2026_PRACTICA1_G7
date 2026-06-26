// src/components/common/AlertMessage.jsx
import React from "react";
import "../styles/AlertMessage.css";

const AlertMessage = ({ type = "success", message }) => {
  if (!message) return null;

  return (
    <div
      className={
        type === "success"
          ? "alert-message alert-success"
          : "alert-message alert-error"
      }
    >
      {message}
    </div>
  );
};

export default AlertMessage;