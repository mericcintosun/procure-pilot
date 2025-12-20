"use client";

import { useState, Fragment } from "react";
import { motion } from "framer-motion";
import { Offer, EvidenceState } from "./types";

interface ComparisonTableProps {
  offers: Offer[];
  recommendation: Offer | null;
  loading: boolean;
  showEvidence: EvidenceState | null;
  setShowEvidence: (state: EvidenceState | null) => void;
  onStore: (offer: Offer) => Promise<void>;
}

export function ComparisonTable({
  offers,
  recommendation,
  loading,
  showEvidence,
  setShowEvidence,
  onStore,
}: ComparisonTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  if (offers.length === 0) return null;

  const toggleRow = (idx: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedRows(newExpanded);
  };

  const isRecommended = (offer: Offer) => recommendation?.filename === offer.filename;
  const riskCount = (offer: Offer) => offer.redFlags?.length || 0;
  const complianceStatus = (offer: Offer) => {
    const hasPenalty = offer.penaltyClause?.exists;
    const hasGdpr = offer.kvkkGdpr?.exists;
    if (hasPenalty && hasGdpr) return { text: "✅ Full", color: "#34d399" };
    if (hasPenalty || hasGdpr) return { text: "⚠️ Partial", color: "#fbbf24" };
    return { text: "❌ Missing", color: "#f87171" };
  };

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
        Compare Offers
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        style={{ color: "#9ca3af", marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}
      >
        Review detailed comparison of all vendor offers. Click on highlighted fields to view evidence from source
        documents.
      </motion.p>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table
          style={{
            width: "100%",
            minWidth: "800px",
            borderCollapse: "collapse",
            marginTop: 16,
            border: "1px solid #374151",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
            background: "#1f2937",
          }}
        >
          <thead>
            <tr style={{ background: "#374151" }}>
              <th style={{ padding: "clamp(8px, 2vw, 12px)", textAlign: "left", border: "1px solid #4b5563", color: "#f9fafb", fontSize: "clamp(12px, 2.5vw, 14px)" }}>Vendor</th>
              <th style={{ padding: "clamp(8px, 2vw, 12px)", textAlign: "left", border: "1px solid #4b5563", color: "#f9fafb", fontSize: "clamp(12px, 2.5vw, 14px)" }}>Total Price</th>
              <th style={{ padding: "clamp(8px, 2vw, 12px)", textAlign: "left", border: "1px solid #4b5563", color: "#f9fafb", fontSize: "clamp(12px, 2.5vw, 14px)" }}>Lead Time</th>
              <th style={{ padding: "clamp(8px, 2vw, 12px)", textAlign: "left", border: "1px solid #4b5563", color: "#f9fafb", fontSize: "clamp(12px, 2.5vw, 14px)" }}>Payment Terms</th>
              <th style={{ padding: "clamp(8px, 2vw, 12px)", textAlign: "left", border: "1px solid #4b5563", color: "#f9fafb", fontSize: "clamp(12px, 2.5vw, 14px)" }}>Risks</th>
              <th style={{ padding: "clamp(8px, 2vw, 12px)", textAlign: "left", border: "1px solid #4b5563", color: "#f9fafb", fontSize: "clamp(12px, 2.5vw, 14px)" }}>Compliance</th>
              <th style={{ padding: "clamp(8px, 2vw, 12px)", textAlign: "left", border: "1px solid #4b5563", color: "#f9fafb", fontSize: "clamp(12px, 2.5vw, 14px)" }}>Score</th>
              <th style={{ padding: "clamp(8px, 2vw, 12px)", textAlign: "left", border: "1px solid #4b5563", color: "#f9fafb", fontSize: "clamp(12px, 2.5vw, 14px)" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer, idx) => {
              const recommended = isRecommended(offer);
              const risks = riskCount(offer);
              const compliance = complianceStatus(offer);
              const expanded = expandedRows.has(idx);

              return (
                <Fragment key={idx}>
                  <motion.tr
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    style={{
                      background: "#1f2937",
                      borderLeft: recommended ? "3px solid #10b981" : "3px solid transparent",
                    }}
                  >
                    <td style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #374151", color: "#f9fafb", fontSize: "clamp(12px, 2.5vw, 14px)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: recommended ? 600 : 400 }}>
                          {offer.vendor || offer.filename}
                        </span>
                        {recommended && (
                          <span
                            style={{
                              padding: "2px 8px",
                              background: "#065f46",
                              color: "#d1fae5",
                              borderRadius: 12,
                              fontSize: 11,
                              fontWeight: 500,
                            }}
                          >
                            ⭐ Recommended
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: 12,
                        border: "1px solid #374151",
                        cursor: offer.evidence?.some((e) => e.field === "totalPrice" || e.field === "currency")
                          ? "pointer"
                          : "default",
                        color: "#f9fafb",
                      }}
                      onClick={() => {
                        if (offer.evidence?.some((e) => e.field === "totalPrice" || e.field === "currency")) {
                          setShowEvidence(
                            showEvidence?.offerIdx === idx && showEvidence?.field === "price"
                              ? null
                              : { offerIdx: idx, field: "price" }
                          );
                        }
                      }}
                      title={
                        offer.evidence?.some((e) => e.field === "totalPrice" || e.field === "currency")
                          ? "Click to view evidence"
                          : undefined
                      }
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>
                          {offer.totalPrice
                            ? `${offer.currency || "USD"} ${offer.totalPrice.toLocaleString()}`
                            : "N/A"}
                        </span>
                        {offer.evidence?.some((e) => e.field === "totalPrice" || e.field === "currency") && (
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>📄</span>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: 12,
                        border: "1px solid #374151",
                        cursor: offer.evidence?.some((e) => e.field === "leadTimeDays") ? "pointer" : "default",
                        color: "#f9fafb",
                      }}
                      onClick={() => {
                        if (offer.evidence?.some((e) => e.field === "leadTimeDays")) {
                          setShowEvidence(
                            showEvidence?.offerIdx === idx && showEvidence?.field === "leadTime"
                              ? null
                              : { offerIdx: idx, field: "leadTime" }
                          );
                        }
                      }}
                      title={offer.evidence?.some((e) => e.field === "leadTimeDays") ? "Click to view evidence" : undefined}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{offer.leadTimeDays ? `${offer.leadTimeDays} days` : "N/A"}</span>
                        {offer.evidence?.some((e) => e.field === "leadTimeDays") && (
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>📄</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #374151", color: "#f9fafb", fontSize: "clamp(12px, 2.5vw, 14px)" }}>
                      {offer.paymentTermsDays ? `Net ${offer.paymentTermsDays}` : "N/A"}
                    </td>
                    <td style={{ padding: 12, border: "1px solid #374151" }}>
                      {risks > 0 ? (
                        <span
                          style={{
                            padding: "4px 10px",
                            background: "#7f1d1d",
                            color: "#fca5a5",
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {risks} {risks === 1 ? "risk" : "risks"}
                        </span>
                      ) : (
                        <span style={{ color: "#34d399", fontSize: 12 }}>✅ None</span>
                      )}
                    </td>
                    <td style={{ padding: 12, border: "1px solid #374151" }}>
                      <span style={{ color: compliance.color, fontSize: 12, fontWeight: 500 }}>
                        {compliance.text}
                      </span>
                    </td>
                    <td style={{ padding: 12, border: "1px solid #374151" }}>
                      {offer.scores ? (
                        <div>
                          <div style={{ fontWeight: "bold", fontSize: 16, color: "#f9fafb" }}>
                            {offer.scores.weighted.toFixed(1)}/100
                          </div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                            P:{Math.round(offer.scores.price)} R:{Math.round(offer.scores.risk)} S:
                            {Math.round(offer.scores.speed)}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: 12, border: "1px solid #374151" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                          onClick={() => toggleRow(idx)}
                          style={{
                            padding: "4px 8px",
                            background: "#374151",
                            color: "#d1d5db",
                            border: "1px solid #4b5563",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 11,
                          }}
                        >
                          {expanded ? "▼ Details" : "▶ Details"}
                        </button>
                        <button
                          onClick={() => onStore(offer)}
                          disabled={loading}
                          style={{
                            padding: "4px 8px",
                            background: loading ? "#4b5563" : "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: 11,
                          }}
                        >
                          Store
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                  {expanded && (
                    <motion.tr
                      key={`${idx}-expand`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan={8} style={{ padding: 16, border: "1px solid #374151", background: "#374151" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div>
                            <h4 style={{ marginTop: 0, marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#f9fafb" }}>
                              Penalty Clause
                            </h4>
                            <div style={{ fontSize: 13, color: "#d1d5db" }}>
                              {offer.penaltyClause?.exists ? (
                                <div>
                                  <span style={{ color: "#34d399" }}>✅ Present</span>
                                  {offer.penaltyClause.details && (
                                    <div style={{ marginTop: 4, color: "#9ca3af" }}>{offer.penaltyClause.details}</div>
                                  )}
                                  {offer.penaltyClause.capPercent && (
                                    <div style={{ marginTop: 4, color: "#9ca3af" }}>
                                      Cap: {offer.penaltyClause.capPercent}%
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span style={{ color: "#f87171" }}>❌ Missing</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 style={{ marginTop: 0, marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#f9fafb" }}>
                              GDPR/KVKK Compliance
                            </h4>
                            <div style={{ fontSize: 13, color: "#d1d5db" }}>
                              {offer.kvkkGdpr?.exists ? (
                                <div>
                                  <span style={{ color: "#34d399" }}>✅ Present</span>
                                  {offer.kvkkGdpr.details && (
                                    <div style={{ marginTop: 4, color: "#9ca3af" }}>{offer.kvkkGdpr.details}</div>
                                  )}
                                </div>
                              ) : (
                                <span style={{ color: "#f87171" }}>❌ Missing</span>
                              )}
                            </div>
                          </div>
                          {offer.redFlags && offer.redFlags.length > 0 && (
                            <div style={{ gridColumn: "1 / -1" }}>
                              <h4 style={{ marginTop: 0, marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#f87171" }}>
                                ⚠️ Red Flags
                              </h4>
                              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#d1d5db" }}>
                                {offer.redFlags.map((flag, i) => (
                                  <li key={i} style={{ marginBottom: 4 }}>{flag}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
