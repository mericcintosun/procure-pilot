"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Offer, EvidenceState } from "./types";
import { showToast } from "../ui/Toast";

interface EvidenceModalProps {
  showEvidence: EvidenceState;
  offers: Offer[];
  onClose: () => void;
}

export function EvidenceModal({ showEvidence, offers, onClose }: EvidenceModalProps) {
  if (!showEvidence || !offers[showEvidence.offerIdx]) return null;

  const offer = offers[showEvidence.offerIdx];
  const fieldMap: Record<string, string[]> = {
    price: ["totalPrice", "currency"],
    leadTime: ["leadTimeDays"],
    payment: ["paymentTermsDays"],
    penalty: ["penaltyClause"],
    gdpr: ["kvkkGdpr"],
  };

  const relevantFields = fieldMap[showEvidence.field] || [];
  const relevantEvidence = offer.evidence?.filter((e) => relevantFields.includes(e.field)) || [];

  return (
    <motion.div
      initial={{ x: 480 }}
      animate={{ x: 0 }}
      exit={{ x: 480 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 480,
        background: "#1f2937",
        boxShadow: "-4px 0 12px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderLeft: "1px solid #374151",
      }}
    >
      <div
        style={{
          padding: 20,
          borderBottom: "1px solid #374151",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#374151",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#f9fafb" }}>
            Evidence Details
          </h3>
          <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
            {offer.vendor || offer.filename}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: "#9ca3af",
            padding: 0,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#4b5563";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "none";
          }}
        >
          ×
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 20, background: "#111827" }}>
        {relevantEvidence.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {relevantEvidence.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                style={{
                  padding: 16,
                  background: "#374151",
                  borderRadius: 8,
                  border: "1px solid #4b5563",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, color: "#f9fafb", fontSize: 14 }}>
                    {ev.field.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {ev.page && (
                      <a
                        href={`#page-${ev.page}`}
                        style={{
                          padding: "4px 10px",
                          background: "#1e40af",
                          color: "#93c5fd",
                          borderRadius: 6,
                          fontSize: 12,
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          showToast(`Open page ${ev.page} in PDF viewer (feature coming soon)`, "info");
                        }}
                      >
                        Open Page {ev.page}
                      </a>
                    )}
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>
                      {ev.page ? `Page ${ev.page}` : "Page unknown"}
                      {ev.section && ` • ${ev.section}`}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: 12,
                    background: "#1f2937",
                    borderRadius: 6,
                    border: "1px solid #4b5563",
                    color: "#d1d5db",
                    fontStyle: "italic",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  &quot;{ev.snippet}&quot;
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <div>No evidence available for this field</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
