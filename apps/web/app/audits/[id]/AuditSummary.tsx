"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiDollarSign,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";

interface AuditSummaryProps {
  auditData: any;
  auditId: string;
  analysis?: any;
}

export default function AuditSummary({
  auditData,
  auditId,
  analysis: initialAnalysis,
}: AuditSummaryProps) {
  const [analysis, setAnalysis] = useState<any>(initialAnalysis || null);

  // Load analysis and listen for updates
  useEffect(() => {
    async function loadAnalysis() {
      try {
        const r = await fetch(`/api/audits/${auditId}/analysis`);
        if (r.ok) {
          const data = await r.json();
          if (data.exists && data.analysis) {
            setAnalysis(data.analysis);
          }
        } else if (r.status === 404) {
          // 404 is expected if no analysis exists yet - silently ignore
          return;
        }
      } catch (e: any) {
        // Ignore errors
      }
    }

    // Load initially
    if (initialAnalysis) {
      setAnalysis(initialAnalysis);
    } else {
      loadAnalysis();
    }

    // Listen for analysis updates from AuditAnalysis component
    const handleAnalysisUpdate = (event: CustomEvent) => {
      if (event.detail.auditId === auditId) {
        setAnalysis(event.detail.analysis);
      }
    };

    window.addEventListener(
      "audit-analysis-updated",
      handleAnalysisUpdate as EventListener
    );

    // Poll for updates every 3 seconds (in case analysis is being created)
    const interval = setInterval(() => {
      loadAnalysis();
    }, 3000);

    return () => {
      window.removeEventListener(
        "audit-analysis-updated",
        handleAnalysisUpdate as EventListener
      );
      clearInterval(interval);
    };
  }, [auditId, initialAnalysis]);
  const getType = () => {
    if (auditData?.filename) return "RFQ Offer";
    return auditData?.type || "Unknown";
  };

  const getVendor = () => {
    return auditData?.vendor || auditData?.filename || "Unknown Vendor";
  };

  const getAmount = () => {
    const amount = auditData?.amount || auditData?.totalPrice;
    const currency = auditData?.currency || "USD";
    if (amount) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
    }
    return "N/A";
  };

  const getLeadTime = () => {
    const days = auditData?.leadTimeDays;
    if (days) return `${days} days`;
    return "N/A";
  };

  const getRiskCount = () => {
    // Use AI analysis risk score if available, otherwise use flags
    if (analysis?.riskScore !== undefined && analysis?.riskScore !== null) {
      // Convert risk score (0-100) to a count-like representation
      if (analysis.riskScore === 0) return 0;
      if (analysis.riskScore <= 30) return 0; // Low risk = no flags
      if (analysis.riskScore <= 60) return 1; // Medium risk = 1 flag
      if (analysis.riskScore <= 80) return 2; // High risk = 2 flags
      return 3; // Critical risk = 3+ flags
    }
    // Fallback to flags if no analysis
    const flags = auditData?.riskFlags || auditData?.redFlags || [];
    return flags.length;
  };

  const getRecommendation = () => {
    // Use AI analysis risk score if available
    if (analysis?.riskScore !== undefined && analysis?.riskScore !== null) {
      if (analysis.riskScore <= 30) return "Approve";
      if (analysis.riskScore <= 60) return "Review";
      if (analysis.riskScore <= 80) return "Requires Attention";
      return "Critical Review";
    }
    // Fallback to risk count
    const riskCount = getRiskCount();
    if (riskCount === 0) return "Approve";
    if (riskCount <= 2) return "Review";
    return "Requires Attention";
  };

  const cards = [
    {
      icon: FiFileText,
      label: "Type",
      value: getType(),
      color: "var(--primary)",
    },
    {
      icon: FiDollarSign,
      label: "Vendor",
      value: getVendor(),
      color: "var(--info)",
    },
    {
      icon: FiTrendingUp,
      label: "Total Price",
      value: getAmount(),
      color: "var(--success)",
    },
    {
      icon: FiClock,
      label: "Lead Time",
      value: getLeadTime(),
      color: "var(--warning)",
    },
    {
      icon: FiAlertTriangle,
      label: "Risk Count",
      value: getRiskCount(),
      color: getRiskCount() > 0 ? "var(--error)" : "var(--success)",
    },
    {
      icon: FiCheckCircle,
      label: "Recommendation",
      value: getRecommendation(),
      color:
        getRecommendation() === "Approve"
          ? "var(--success)"
          : getRecommendation() === "Review"
          ? "var(--warning)"
          : "var(--error)",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "var(--spacing-md)",
        marginBottom: "var(--spacing-xl)",
      }}
    >
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          whileHover={{
            y: -2,
            borderColor: card.color,
            boxShadow: "var(--shadow-md)",
            transition: { duration: 0.2 },
          }}
          style={{
            padding: "var(--spacing-lg)",
            background: "var(--bg-card)",
            border: "1px solid var(--border-primary)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
              marginBottom: "var(--spacing-sm)",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-md)",
                background: `${card.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <card.icon style={{ fontSize: "1rem", color: card.color }} />
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {card.label}
            </span>
          </div>
          <div
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              wordBreak: "break-word",
            }}
          >
            {card.value}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
