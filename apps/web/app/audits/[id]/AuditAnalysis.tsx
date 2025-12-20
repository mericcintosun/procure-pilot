"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiCpu,
  FiTarget,
  FiFileText,
} from "react-icons/fi";
import Logo from "../../../components/ui/Logo";

interface AuditAnalysisProps {
  auditId: string;
  auditData: any;
}

export default function AuditAnalysis({
  auditId,
  auditData,
}: AuditAnalysisProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);

  // Load existing analysis on mount
  useEffect(() => {
    async function loadExistingAnalysis() {
      try {
        const r = await fetch(`/api/audits/${auditId}/analysis`);
        if (r.ok) {
          const data = await r.json();
          if (data.exists && data.analysis) {
            setAnalysis(data.analysis);
          }
        } else if (r.status === 404) {
          // 404 is expected if no analysis exists yet - silently ignore
        }
        // 404 is expected if no analysis exists yet, so we don't treat it as an error
      } catch (e: any) {
        // Silently ignore errors - it's okay if analysis doesn't exist yet
      } finally {
        setLoadingExisting(false);
      }
    }

    loadExistingAnalysis();
  }, [auditId]);

  async function handleAnalyze() {
    if (!approved) {
      setError(
        "Please confirm that AI output is a suggestion before proceeding"
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const r = await fetch(`/api/audits/${auditId}/analyze`, {
        method: "POST",
      });

      if (!r.ok) {
        const errorData = await r
          .json()
          .catch(() => ({ error: "Analysis failed" }));
        throw new Error(
          errorData?.error ||
            errorData?.message ||
            `Analysis failed: ${r.status} ${r.statusText}`
        );
      }

      const data = await r.json();
      console.log("Analysis response:", data);

      // Handle different response formats
      let analysisData = null;
      if (data.analysis) {
        analysisData = data.analysis;
      } else if (data) {
        // If entire response is the analysis
        analysisData = data;
      } else {
        throw new Error("Invalid response format: analysis data not found");
      }

      // Validate required fields
      if (!analysisData.riskScore && analysisData.riskScore !== 0) {
        console.warn("Analysis missing riskScore:", analysisData);
      }

      setAnalysis(analysisData);

      // Notify parent components that analysis is updated
      window.dispatchEvent(
        new CustomEvent("audit-analysis-updated", {
          detail: { auditId, analysis: analysisData },
        })
      );
    } catch (e: any) {
      console.error("Analysis error:", e);
      setError(
        e.message ||
          "Failed to analyze audit. Please check console for details."
      );
    } finally {
      setLoading(false);
    }
  }

  function getFeasibilityColor(score: number): string {
    // Higher score = more feasible = better (green)
    if (score >= 80) return "var(--success)";
    if (score >= 60) return "var(--warning)";
    if (score >= 30) return "var(--error)";
    return "#dc2626";
  }

  function getFeasibilityLabel(score: number): string {
    // Higher score = more feasible
    if (score >= 80) return "Highly Feasible";
    if (score >= 60) return "Feasible";
    if (score >= 30) return "Moderately Feasible";
    return "Not Feasible";
  }

  const formatEvidencePage = (page: number | null | undefined): string => {
    if (page === null || page === undefined || page === 0) {
      return "Page unknown (OCR needed)";
    }
    return `Page ${page}`;
  };

  const getEvidenceStatusColor = (page: number | null | undefined): string => {
    if (page === null || page === undefined || page === 0) {
      return "var(--warning)";
    }
    return "var(--primary)";
  };

  return (
    <div
      style={{
        border: "1px solid var(--border-primary)",
        borderRadius: "var(--radius-xl)",
        padding: "clamp(1rem, 4vw, var(--spacing-xl))",
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="ai-analysis-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "var(--spacing-md)",
          marginBottom: "var(--spacing-lg)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
            fontWeight: 600,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexShrink: 0,
          }}
        >
          <FiCpu style={{ fontSize: "clamp(1.25rem, 4vw, 1.5rem)" }} />
          AI Analysis
        </h2>
        {!analysis && (
          <div
            className="ai-analysis-controls"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)",
              alignItems: "stretch",
              flex: "1 1 100%",
              minWidth: "280px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                cursor: "pointer",
                padding:
                  "clamp(0.75rem, 2vw, var(--spacing-md)) clamp(1rem, 3vw, var(--spacing-lg))",
                background: approved ? "var(--primary-bg)" : "var(--gray-50)",
                borderRadius: "var(--radius-lg)",
                border: approved
                  ? "2px solid var(--primary)"
                  : "2px solid var(--gray-300)",
                transition: "all 0.2s ease",
                fontWeight: 500,
              }}
            >
              <input
                type="checkbox"
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
                style={{
                  cursor: "pointer",
                  width: "clamp(18px, 4vw, 20px)",
                  height: "clamp(18px, 4vw, 20px)",
                  accentColor: "var(--primary)",
                  flexShrink: 0,
                  marginTop: "0.125rem",
                }}
              />
              <span
                style={{
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontSize: "clamp(0.8125rem, 2.5vw, 0.9375rem)",
                  lineHeight: 1.5,
                }}
              >
                I understand AI analysis is a suggestion and requires human
                review
              </span>
            </label>
            <button
              onClick={handleAnalyze}
              disabled={loading || !approved}
              style={{
                padding:
                  "clamp(0.75rem, 2vw, var(--spacing-sm)) clamp(1rem, 3vw, var(--spacing-lg))",
                background:
                  loading || !approved ? "var(--gray-300)" : "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-lg)",
                cursor: loading || !approved ? "not-allowed" : "pointer",
                fontWeight: 600,
                fontSize: "clamp(0.8125rem, 2.5vw, 0.875rem)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--spacing-sm)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!loading && approved) {
                  e.currentTarget.style.background = "var(--primary-dark)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && approved) {
                  e.currentTarget.style.background = "var(--primary)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? "Analyzing..." : "Analyze with AI"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "var(--spacing-md)",
            background: "#fee2e2",
            color: "var(--error)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "var(--spacing-lg)",
            fontSize: "0.875rem",
            border: "1px solid var(--error)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
              marginBottom: "var(--spacing-xs)",
            }}
          >
            <FiAlertTriangle style={{ fontSize: "1rem" }} />
            <strong>Analysis Error</strong>
          </div>
          <div>{error}</div>
        </motion.div>
      )}

      {(loading || loadingExisting) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "var(--spacing-3xl)",
            textAlign: "center",
            color: "var(--text-tertiary)",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              marginBottom: "var(--spacing-md)",
              display: "inline-block",
            }}
          >
            <Logo size={48} withShadow={true} />
          </motion.div>
          <p
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "var(--spacing-sm)",
            }}
          >
            {loadingExisting ? "Loading analysis..." : "Analyzing with AI..."}
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
            {loadingExisting
              ? "Checking for existing analysis"
              : "This may take a few seconds"}
          </p>
        </motion.div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "grid", gap: "var(--spacing-xl)" }}
        >
          {/* Summary */}
          {analysis.summary && (
            <div>
              <h3
                style={{
                  marginBottom: "var(--spacing-md)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)",
                }}
              >
                <FiInfo style={{ fontSize: "1.25rem", color: "var(--info)" }} />
                Summary
              </h3>
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  fontSize: "0.9375rem",
                }}
              >
                {analysis.summary}
              </p>
            </div>
          )}

          {/* Feasibility Score */}
          {analysis.riskScore !== undefined && analysis.riskScore !== null && (
            <div>
              <h3
                style={{
                  marginBottom: "var(--spacing-md)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Feasibility Assessment
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-xl)",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: `conic-gradient(${getFeasibilityColor(
                      analysis.riskScore
                    )} 0% ${analysis.riskScore}%, var(--gray-200) ${
                      analysis.riskScore
                    }% 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  {analysis.riskScore}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: getFeasibilityColor(analysis.riskScore),
                      marginBottom: "var(--spacing-xs)",
                    }}
                  >
                    {getFeasibilityLabel(analysis.riskScore)}
                  </div>
                  {analysis.confidence && (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-tertiary)",
                        marginTop: "var(--spacing-xs)",
                      }}
                    >
                      Confidence: {analysis.confidence}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Risk Reasons */}
          {analysis.reasons && analysis.reasons.length > 0 && (
            <div>
              <h3
                style={{
                  marginBottom: "var(--spacing-lg)",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)",
                }}
              >
                <FiAlertTriangle
                  style={{ fontSize: "1.5rem", color: "var(--error)" }}
                />
                Risk Factors
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-md)",
                }}
              >
                {analysis.reasons.map((reason: string, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: "var(--spacing-md)",
                      background: "#fee2e215",
                      borderLeft: "4px solid var(--error)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--gray-800)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.7,
                    }}
                  >
                    <strong
                      style={{
                        color: "var(--error)",
                        marginRight: "var(--spacing-xs)",
                      }}
                    >
                      •
                    </strong>
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Next Steps */}
          {analysis.suggestedNextSteps &&
            analysis.suggestedNextSteps.length > 0 && (
              <div>
                <h3
                  style={{
                    marginBottom: "var(--spacing-lg)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-sm)",
                  }}
                >
                  <FiCheckCircle
                    style={{ fontSize: "1.5rem", color: "var(--success)" }}
                  />
                  Recommended Actions
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-md)",
                  }}
                >
                  {analysis.suggestedNextSteps.map(
                    (step: string, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          padding: "var(--spacing-md)",
                          background: "#dcfce715",
                          borderLeft: "4px solid var(--success)",
                          borderRadius: "var(--radius-md)",
                          color: "var(--gray-800)",
                          fontSize: "0.9375rem",
                          lineHeight: 1.7,
                        }}
                      >
                        <strong
                          style={{
                            color: "var(--success)",
                            marginRight: "var(--spacing-xs)",
                          }}
                        >
                          ✓
                        </strong>
                        {step}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Evidence Links */}
          {auditData?.evidence && auditData.evidence.length > 0 && (
            <div>
              <h3
                style={{
                  marginBottom: "var(--spacing-lg)",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)",
                }}
              >
                <FiInfo
                  style={{ fontSize: "1.25rem", marginRight: "0.5rem" }}
                />
                Evidence References
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-md)",
                }}
              >
                {auditData.evidence.map((ev: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: "var(--spacing-lg)",
                      background: "var(--bg-card)",
                      borderRadius: "var(--radius-lg)",
                      border: "2px solid var(--gray-200)",
                      boxShadow: "var(--shadow-sm)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--gray-200)";
                      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "var(--spacing-sm)",
                        flexWrap: "wrap",
                        gap: "var(--spacing-sm)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          textTransform: "capitalize",
                          padding: "0.25rem 0.75rem",
                          background: "var(--gray-100)",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        {ev.field?.replace(/([A-Z])/g, " $1").trim() ||
                          "Unknown Field"}
                      </span>
                      <span
                        style={{
                          padding: "0.5rem 1rem",
                          background: getEvidenceStatusColor(ev.page),
                          color: "white",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        {ev.page === null ||
                        ev.page === undefined ||
                        ev.page === 0 ? (
                          <FiAlertTriangle style={{ fontSize: "0.8125rem" }} />
                        ) : (
                          <FiInfo style={{ fontSize: "0.8125rem" }} />
                        )}
                        {formatEvidencePage(ev.page)}
                      </span>
                    </div>
                    {ev.snippet || ev.quote ? (
                      <div
                        style={{
                          fontSize: "0.9375rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                          marginTop: "var(--spacing-sm)",
                          padding: "var(--spacing-sm)",
                          background: "var(--bg-secondary)",
                          borderRadius: "var(--radius-sm)",
                          fontStyle: "italic",
                          borderLeft: "3px solid var(--primary)",
                        }}
                      >
                        &quot;{ev.snippet || ev.quote}&quot;
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Rules */}
          {analysis.rulesResult && analysis.rulesResult.results && (
            <div>
              <h3
                style={{
                  marginBottom: "var(--spacing-md)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Validation Rules
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--spacing-sm)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                {analysis.rulesResult.results.map((rule: any, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      padding: "0.5rem 1rem",
                      background: rule.passed
                        ? "var(--success)"
                        : "var(--error)",
                      color: "white",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {rule.passed ? (
                      <FiCheckCircle
                        style={{ fontSize: "0.75rem", marginRight: "0.25rem" }}
                      />
                    ) : (
                      <FiAlertTriangle
                        style={{ fontSize: "0.75rem", marginRight: "0.25rem" }}
                      />
                    )}{" "}
                    {rule.rule}
                  </span>
                ))}
              </div>
              {analysis.rulesResult.score > 0 && (
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-tertiary)",
                  }}
                >
                  Rules Score: {analysis.rulesResult.score}/100
                </div>
              )}
            </div>
          )}

          {/* Policy Flags */}
          {analysis.policyFlags && analysis.policyFlags.length > 0 && (
            <div>
              <h3
                style={{
                  marginBottom: "var(--spacing-md)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Policy Compliance Flags
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--spacing-sm)",
                }}
              >
                {analysis.policyFlags.map((flag: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "var(--warning)",
                      color: "white",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fabric Info */}
          <div
            style={{
              padding: "var(--spacing-md)",
              background: "var(--primary-bg)",
              borderRadius: "var(--radius-lg)",
              fontSize: "0.875rem",
              color: "var(--info)",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
            }}
          >
            <FiCheckCircle style={{ fontSize: "1rem" }} />
            Analysis stored on Hyperledger Fabric ledger
          </div>
        </motion.div>
      )}

      {!analysis && !loading && !loadingExisting && !error && (
        <div
          style={{
            padding: "var(--spacing-3xl)",
            textAlign: "center",
            color: "var(--text-tertiary)",
          }}
        >
          <div
            style={{
              marginBottom: "var(--spacing-md)",
              opacity: 0.3,
            }}
          >
            <Logo size={48} withShadow={true} />
          </div>
          <h3
            style={{
              fontSize: "1.25rem",
              marginBottom: "var(--spacing-md)",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            AI-Powered Risk Analysis
          </h3>
          <p
            style={{
              fontSize: "1rem",
              marginBottom: "var(--spacing-lg)",
              fontWeight: 500,
              color: "var(--text-secondary)",
              maxWidth: "600px",
              margin: "0 auto var(--spacing-lg)",
            }}
          >
            Get comprehensive insights to make informed procurement decisions
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "clamp(var(--spacing-sm), 2vw, var(--spacing-md))",
              marginTop: "var(--spacing-xl)",
              textAlign: "left",
              maxWidth: "700px",
              margin: "var(--spacing-xl) auto 0",
            }}
          >
            <div
              style={{
                padding: "clamp(0.75rem, 2vw, var(--spacing-md))",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <FiTarget
                style={{
                  fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--primary)",
                }}
              />
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--text-primary)",
                  fontSize: "clamp(0.9375rem, 2.5vw, 1rem)",
                }}
              >
                Risk Assessment
              </div>
              <div
                style={{
                  fontSize: "clamp(0.8125rem, 2vw, 0.875rem)",
                  color: "var(--text-tertiary)",
                  lineHeight: 1.5,
                }}
              >
                0-100 feasibility score with detailed breakdown
              </div>
            </div>
            <div
              style={{
                padding: "clamp(0.75rem, 2vw, var(--spacing-md))",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <FiCheckCircle
                style={{
                  fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--success)",
                }}
              />
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--text-primary)",
                  fontSize: "clamp(0.9375rem, 2.5vw, 1rem)",
                }}
              >
                Recommended Actions
              </div>
              <div
                style={{
                  fontSize: "clamp(0.8125rem, 2vw, 0.875rem)",
                  color: "var(--text-tertiary)",
                  lineHeight: 1.5,
                }}
              >
                Actionable next steps tailored to findings
              </div>
            </div>
            <div
              style={{
                padding: "clamp(0.75rem, 2vw, var(--spacing-md))",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <FiFileText
                style={{
                  fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--info)",
                }}
              />
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--text-primary)",
                  fontSize: "clamp(0.9375rem, 2.5vw, 1rem)",
                }}
              >
                Evidence Links
              </div>
              <div
                style={{
                  fontSize: "clamp(0.8125rem, 2vw, 0.875rem)",
                  color: "var(--text-tertiary)",
                  lineHeight: 1.5,
                }}
              >
                Direct references to source documents
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
