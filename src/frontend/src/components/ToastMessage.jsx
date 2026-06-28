// src/components/common/ToastMessage.jsx
import React from "react";
import { useToast } from "../context/ToastContext";
import "../styles/toast-message.css";

const ToastMessage = () => {
  const { toast } = useToast();

  if (!toast.visible || !toast.message) return null;

  const className =
    toast.type === "success"
      ? "toast-message toast-success"
      : "toast-message toast-error";

  return <div className={className}>{toast.message}</div>;
};

export default ToastMessage;