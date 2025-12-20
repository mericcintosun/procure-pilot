"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiCode } from "react-icons/fi";

interface RawDataAccordionProps {
  audit: any;
}

export default function RawDataAccordion({ audit }: RawDataAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        border: "1px solid var(--border-primary)",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-card)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "var(--spacing-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--gray-50)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "none";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <FiCode style={{ fontSize: "1.25rem", color: "var(--gray-500)" }} />
          <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Developer View (Raw JSON)
          </h2>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown style={{ fontSize: "1.25rem", color: "var(--gray-500)" }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "var(--spacing-lg)",
                borderTop: "1px solid var(--gray-200)",
                background: "var(--gray-900)",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  padding: "var(--spacing-md)",
                  background: "#111",
                  color: "#fff",
                  borderRadius: "var(--radius-md)",
                  overflow: "auto",
                  fontSize: "0.75rem",
                  lineHeight: 1.6,
                  maxHeight: "500px",
                }}
              >
                {JSON.stringify(audit, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

