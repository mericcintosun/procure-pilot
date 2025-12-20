"use client";

import { motion } from "framer-motion";
import { Offer } from "./types";

interface EvidenceSectionProps {
  offers: Offer[];
}

export function EvidenceSection({ offers }: EvidenceSectionProps) {
  if (offers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 32 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ color: "#f9fafb", marginBottom: 8, fontSize: 20, fontWeight: 600 }}
      >
        Evidence & Red Flags
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        style={{ color: "#9ca3af", marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}
      >
        Complete audit trail with page-level references for all extracted data and identified risk factors.
      </motion.p>
      {offers.map((offer, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          style={{
            marginBottom: 16,
            padding: 16,
            border: "1px solid #374151",
            borderRadius: 8,
            background: "#1f2937",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#f9fafb" }}>{offer.vendor || offer.filename}</h3>

          {offer.redFlags && offer.redFlags.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ color: "#f87171" }}>⚠️ Red Flags:</h4>
              <ul style={{ color: "#d1d5db" }}>
                {offer.redFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {offer.evidence && offer.evidence.length > 0 && (
            <div>
              <h4 style={{ color: "#f9fafb" }}>All Evidence Snippets:</h4>
              <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                {offer.evidence.map((ev, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    style={{
                      padding: 12,
                      background: "#374151",
                      borderRadius: 6,
                      border: "1px solid #4b5563",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontWeight: "bold", fontSize: 13, color: "#f9fafb" }}>
                        {ev.field.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>
                        {ev.page ? `Page ${ev.page}` : "Page unknown"}
                        {ev.section && ` • ${ev.section}`}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: 8,
                        background: "#1f2937",
                        borderRadius: 4,
                        border: "1px solid #4b5563",
                        color: "#d1d5db",
                        fontStyle: "italic",
                        fontSize: 12,
                        lineHeight: 1.4,
                      }}
                    >
                      &quot;{ev.snippet}&quot;
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

