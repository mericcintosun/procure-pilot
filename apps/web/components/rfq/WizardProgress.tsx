"use client";

import { motion } from "framer-motion";

interface WizardProgressProps {
  currentStep: 1 | 2 | 3;
  step1Complete: boolean;
  step2Complete: boolean;
}

export function WizardProgress({ currentStep, step1Complete, step2Complete }: WizardProgressProps) {
  const steps = [
    { number: 1, label: "Upload PDFs", complete: step1Complete, active: currentStep === 1 },
    { number: 2, label: "AI Analysis", complete: step2Complete, active: currentStep === 2 },
    { number: 3, label: "Compare & Decide", complete: false, active: currentStep === 3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        marginBottom: 32,
        padding: 24,
        background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
        borderRadius: 12,
        border: "1px solid #374151",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
        {steps.map((step, idx) => {
          const isComplete = step.complete;
          const isActive = step.active;
          const isLocked = !isComplete && !isActive && idx > 0 && !steps[idx - 1].complete;

          return (
            <div key={step.number} style={{ display: "flex", alignItems: "center", flex: 1, position: "relative" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isComplete
                      ? "#10b981"
                      : isActive
                      ? "#3b82f6"
                      : isLocked
                      ? "#374151"
                      : "#4b5563",
                    color: isComplete || isActive ? "white" : "#9ca3af",
                    fontWeight: 600,
                    fontSize: 18,
                    border: isActive ? "2px solid #60a5fa" : "none",
                    boxShadow: isActive ? "0 0 0 4px rgba(59, 130, 246, 0.2)" : "none",
                    transition: "all 0.3s ease",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {isComplete ? "✓" : step.number}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 + 0.1 }}
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#f9fafb" : isLocked ? "#6b7280" : "#d1d5db",
                    textAlign: "center",
                  }}
                >
                  {step.label}
                </motion.div>
              </div>
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: step.complete ? 1 : 0.3 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 + 0.2 }}
                  style={{
                    position: "absolute",
                    left: "calc(50% + 24px)",
                    right: "calc(-50% + 24px)",
                    top: 24,
                    height: 2,
                    background: step.complete ? "#10b981" : "#374151",
                    zIndex: 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

