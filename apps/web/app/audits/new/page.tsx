"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiInfo, FiCheckCircle, FiFileText, FiShield } from "react-icons/fi";
import Logo from "@/components/ui/Logo";

const TEMPLATES = {
  invoice: `Invoice #INV-2025-001 from TechSolutions Inc. Total amount: $15,500.00 USD. Invoice date: December 15, 2025. Payment terms: Net 30. Note: This invoice includes a late fee of $250 due to previous payment delay. Risk: Payment overdue by 15 days.`,
  delivery: `Delivery receipt from Global Logistics. Shipment date: January 5, 2026. Items delivered: 500 units. Note: Package damaged, missing 10 units. Delivery address: 123 Main St, New York. Urgent: Requires immediate attention.`,
  contract: `Service contract with Enterprise Systems Ltd. Contract value: 250,000 EUR. Start date: 2025-01-01. End date: 2025-12-31. Service type: Cloud infrastructure. Payment schedule: Monthly installments of 20,833 EUR.`,
  rfq_offer: `RFQ Offer from TechSolutions Inc. Total Price: $14,900.00 USD. Payment Terms: Net 60 days. Lead Time: 21 calendar days from order confirmation. Offer Validity: 7 days. Note: Missing penalty clause for delivery delays. No GDPR/KVKK compliance documentation provided.`,
};

export default function NewAuditPage() {
  const [mode, setMode] = useState<"manual" | "ai">("ai");
  const [id, setId] = useState("");
  const [json, setJson] = useState('{"type":"invoice","amount":1200}');
  const [text, setText] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiConfirmed, setAiConfirmed] = useState(false);
  const router = useRouter();

  const minChars = 20;
  const maxChars = 500;
  const charCount = text.trim().length;
  const isTextValid = charCount >= minChars && charCount <= maxChars;
  const canSubmitAI = isTextValid && aiConfirmed && !loading;

  function fillTemplate(templateKey: keyof typeof TEMPLATES) {
    setText(TEMPLATES[templateKey]);
    setAiConfirmed(false);
  }

  async function submitManual(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const parsed = JSON.parse(json);

      const r = await fetch("/api/audits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, data: parsed }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || data?.message || "Failed");

      router.push(`/audits/${data.ID}`);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitAI(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      if (!text.trim()) {
        throw new Error("Please enter text to analyze");
      }

      if (charCount < minChars) {
        throw new Error(`Text must be at least ${minChars} characters`);
      }
      if (charCount > maxChars) {
        throw new Error(`Text must not exceed ${maxChars} characters`);
      }

      if (!aiConfirmed) {
        throw new Error("Please confirm that AI output is a suggestion");
      }

      const r = await fetch("/api/ai/audits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ 
          auditId: id || undefined, 
          text: text.trim() 
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || data?.message || "Failed");

      router.push(`/audits/${data.id || data.onChain?.ID}`);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container"
      style={{ padding: "clamp(1rem, 4vw, var(--spacing-xl)) clamp(1rem, 4vw, 2rem)", maxWidth: "1200px", margin: "0 auto" }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link 
          href="/audits" 
          style={{ 
            textDecoration: "none", 
            color: "var(--primary)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "var(--spacing-md)",
          }}
        >
          ← Back to Audits
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "var(--spacing-md)", 
          marginTop: "var(--spacing-sm)", 
          marginBottom: "var(--spacing-xl)" 
        }}
      >
        <Logo size={44} withShadow={true} />
        <h1 style={{ margin: 0 }}>
          Create Audit Record
        </h1>
      </motion.div>

      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-xl)" }}>
        <button
          type="button"
          onClick={() => setMode("ai")}
          style={{
            padding: "0.75rem 1.5rem",
            background: mode === "ai" ? "var(--primary)" : "var(--bg-secondary)",
            color: mode === "ai" ? "white" : "var(--gray-700)",
            border: "none",
            borderRadius: "var(--radius-lg)",
            cursor: "pointer",
            fontWeight: mode === "ai" ? 600 : 500,
            fontSize: "0.875rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (mode !== "ai") {
              e.currentTarget.style.background = "var(--gray-200)";
            }
          }}
          onMouseLeave={(e) => {
            if (mode !== "ai") {
              e.currentTarget.style.background = "var(--bg-secondary)";
            }
          }}
        >
          🤖 Create with AI
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          style={{
            padding: "0.75rem 1.5rem",
            background: mode === "manual" ? "var(--primary)" : "var(--bg-secondary)",
            color: mode === "manual" ? "white" : "var(--gray-700)",
            border: "none",
            borderRadius: "var(--radius-lg)",
            cursor: "pointer",
            fontWeight: mode === "manual" ? 600 : 500,
            fontSize: "0.875rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (mode !== "manual") {
              e.currentTarget.style.background = "var(--gray-200)";
            }
          }}
          onMouseLeave={(e) => {
            if (mode !== "manual") {
              e.currentTarget.style.background = "var(--bg-secondary)";
            }
          }}
        >
          ✏️ Manual (JSON)
        </button>
      </div>

      <div className="audit-form-grid">
        {/* Main Form */}
        <div>
      {/* AI Mode Form */}
      {mode === "ai" && (
            <form onSubmit={submitAI} style={{ display: "grid", gap: "var(--spacing-lg)" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-sm)",
                  }}
                >
                  Audit ID (Optional - leave empty to auto-generate)
                </label>
            <input
                  placeholder="audit-123 or leave empty"
              value={id}
              onChange={(e) => setId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem var(--spacing-md)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.875rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.2)";
                    e.currentTarget.style.background = "var(--bg-tertiary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-primary)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--bg-secondary)";
                  }}
            />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-sm)",
                  }}
                >
                  Text (Enter invoice, delivery, contract details, etc.)
          </label>
                
                {/* Template Chips */}
                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-sm)",
                    marginBottom: "var(--spacing-md)",
                    flexWrap: "wrap",
                  }}
                >
                  {Object.entries(TEMPLATES).map(([key, _]) => (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => fillTemplate(key as keyof typeof TEMPLATES)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-primary)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        textTransform: "capitalize",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--primary-bg)";
                        e.currentTarget.style.borderColor = "var(--primary)";
                        e.currentTarget.style.color = "var(--primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--bg-secondary)";
                        e.currentTarget.style.borderColor = "var(--border-primary)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      {key === "rfq_offer" ? "RFQ Offer" : key}
                    </motion.button>
                  ))}
                </div>

            <textarea
                  rows={12}
              value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setAiConfirmed(false);
                  }}
                  placeholder="Enter or paste your audit text here. Click a template above to fill with an example, or type your own text. Minimum 20, maximum 500 characters required."
                  style={{
                    width: "100%",
                    padding: "var(--spacing-md)",
                    marginTop: 0,
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.875rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    lineHeight: 1.6,
                    resize: "vertical",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.2)";
                    e.currentTarget.style.background = "var(--bg-tertiary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-primary)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--bg-secondary)";
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "var(--spacing-xs)",
                    fontSize: "0.75rem",
                    color: isTextValid ? "var(--success)" : charCount > maxChars ? "var(--error)" : "var(--gray-500)",
                  }}
                >
                  <span>
                    {charCount} / {maxChars} characters
                    {charCount < minChars && ` (${minChars - charCount} more needed)`}
                    {charCount > maxChars && ` (${charCount - maxChars} too many, max is ${maxChars})`}
                  </span>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div
                style={{
                  padding: "var(--spacing-md)",
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--gray-200)",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--spacing-sm)",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={aiConfirmed}
                    onChange={(e) => setAiConfirmed(e.target.checked)}
                    style={{
                      marginTop: "0.125rem",
                      cursor: "pointer",
                    }}
                  />
                  <span style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    I understand that AI output is a suggestion and should be reviewed. Evidence will be captured and stored on Hyperledger Fabric ledger.
                  </span>
          </label>
              </div>

          <button 
                type="submit"
                disabled={!canSubmitAI}
            style={{ 
                  padding: "var(--spacing-md) var(--spacing-xl)",
                  background: canSubmitAI ? "var(--primary)" : "var(--gray-300)",
              color: "white", 
              border: "none", 
                  borderRadius: "var(--radius-lg)",
                  cursor: canSubmitAI ? "pointer" : "not-allowed",
                  fontSize: "1rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--spacing-sm)",
                  transition: "all 0.2s ease",
            }}
                onMouseEnter={(e) => {
                  if (canSubmitAI) {
                    e.currentTarget.style.background = "var(--primary-dark)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canSubmitAI) {
                    e.currentTarget.style.background = "var(--primary)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {loading ? (
                  <>
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    🤖 Create with AI
                  </>
                )}
          </button>
              
              {!canSubmitAI && !loading && (
                <div
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    background: "var(--bg-tertiary)",
                    color: "#fbbf24",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.875rem",
                  }}
                >
                  {charCount < minChars && `⚠️ Enter at least ${minChars} characters`}
                  {charCount > maxChars && `⚠️ Text must not exceed ${maxChars} characters`}
                  {isTextValid && !aiConfirmed && "⚠️ Please confirm that AI output is a suggestion"}
                </div>
              )}

              {err && (
                <div
                  style={{
                    color: "var(--error)",
                    padding: "var(--spacing-md)",
                    background: "#fee2e2",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.875rem",
                  }}
                >
                  {err}
                </div>
              )}
        </form>
      )}

      {/* Manual Mode Form */}
      {mode === "manual" && (
            <form onSubmit={submitManual} style={{ display: "grid", gap: "var(--spacing-lg)" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-sm)",
                  }}
                >
            Audit ID
                </label>
            <input
              placeholder="auditId"
              value={id}
              onChange={(e) => setId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem var(--spacing-md)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.875rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.2)";
                    e.currentTarget.style.background = "var(--bg-tertiary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-primary)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--bg-secondary)";
                  }}
            />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-sm)",
                  }}
                >
                  Data (JSON)
          </label>
            <textarea
                  rows={12}
              value={json}
              onChange={(e) => setJson(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "var(--spacing-md)",
                    marginTop: 0,
                    fontFamily: "monospace",
                    boxSizing: "border-box",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.875rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.2)";
                    e.currentTarget.style.background = "var(--bg-tertiary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-primary)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = "var(--bg-secondary)";
                  }}
                />
              </div>
          <button 
                type="submit"
            disabled={loading || !id} 
            style={{ 
                  padding: "var(--spacing-md) var(--spacing-xl)",
                  background: loading || !id ? "var(--gray-300)" : "var(--primary)",
              color: "white", 
              border: "none", 
                  borderRadius: "var(--radius-lg)",
                  cursor: loading || !id ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!loading && id) {
                    e.currentTarget.style.background = "var(--primary-dark)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && id) {
                    e.currentTarget.style.background = "var(--primary)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
            }}
          >
            {loading ? "Creating..." : "Create"}
          </button>
              {err && (
                <div
                  style={{
                    color: "var(--error)",
                    padding: "var(--spacing-md)",
                    background: "#fee2e2",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.875rem",
                  }}
                >
                  {err}
                </div>
              )}
        </form>
      )}
        </div>

        {/* Info Panel */}
        {mode === "ai" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              padding: "clamp(1rem, 3vw, var(--spacing-xl))",
              background: "var(--gray-50)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--gray-200)",
              height: "fit-content",
              position: "sticky",
              top: "var(--spacing-xl)",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "var(--spacing-lg)",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
              }}
            >
              <FiInfo style={{ fontSize: "1.25rem", color: "var(--info)" }} />
              About AI Creation
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-sm)",
                  alignItems: "flex-start",
                }}
              >
                <FiFileText
                  style={{
                    fontSize: "1rem",
                    color: "var(--primary)",
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    AI Output is Suggestion
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-tertiary)",
                      lineHeight: 1.5,
                    }}
                  >
                    AI extracts structured data from your text. Review and verify all extracted information before storing.
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-sm)",
                  alignItems: "flex-start",
                }}
              >
                <FiCheckCircle
                  style={{
                    fontSize: "1rem",
                    color: "var(--success)",
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Evidence Captured
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-tertiary)",
                      lineHeight: 1.5,
                    }}
                  >
                    Source text and extraction metadata are preserved for audit trail and verification.
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-sm)",
                  alignItems: "flex-start",
                }}
              >
                <FiShield
                  style={{
                    fontSize: "1rem",
                    color: "var(--info)",
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Stored on Fabric Ledger
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-tertiary)",
                      lineHeight: 1.5,
                    }}
                  >
                    All audit records are stored immutably on Hyperledger Fabric blockchain for compliance and traceability.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
