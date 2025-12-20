"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastId = 0;
const toastListeners: Array<(toast: Toast) => void> = [];

export function showToast(message: string, type: ToastType = "info") {
  const toast: Toast = {
    id: `toast-${toastId++}`,
    message,
    type,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 5000);
    };
    toastListeners.push(listener);
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <FiCheckCircle style={{ fontSize: "1.25rem" }} />;
      case "error":
        return <FiAlertCircle style={{ fontSize: "1.25rem" }} />;
      case "info":
        return <FiInfo style={{ fontSize: "1.25rem" }} />;
    }
  };

  const getColors = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          bg: "#065f46",
          border: "#10b981",
          text: "#d1fae5",
          icon: "#34d399",
        };
      case "error":
        return {
          bg: "#7f1d1d",
          border: "#991b1b",
          text: "#fca5a5",
          icon: "#f87171",
        };
      case "info":
        return {
          bg: "#1e3a8a",
          border: "#3b82f6",
          text: "#dbeafe",
          icon: "#60a5fa",
        };
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "var(--spacing-lg)",
        right: "var(--spacing-lg)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-sm)",
        maxWidth: "400px",
        width: "100%",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const colors = getColors(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: "var(--spacing-md) var(--spacing-lg)",
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: "var(--radius-lg)",
                color: colors.text,
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                pointerEvents: "auto",
              }}
            >
              <div style={{ color: colors.icon, flexShrink: 0 }}>
                {getIcon(toast.type)}
              </div>
              <div style={{ flex: 1, fontSize: "0.875rem", lineHeight: 1.5 }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: colors.text,
                  cursor: "pointer",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "var(--radius-sm)",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                <FiX style={{ fontSize: "1rem" }} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

