"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { showToast } from "@/components/ui/Toast";

interface ClearAllModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClearAllModal({ isOpen, onClose }: ClearAllModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState("");
  const router = useRouter();

  const requiredText = "DELETE";

  async function handleClear() {
    if (confirmationText !== requiredText) {
      setError(`Please type "${requiredText}" to confirm`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const r = await fetch("/api/audits", {
        method: "DELETE",
      });

      const data = await r.json();
      if (!r.ok) {
        const errorMsg = data?.error || data?.message || "Failed to clear audits";
        if (errorMsg.includes("does not exist")) {
          throw new Error("ClearAllAuditRecords function not found. Please redeploy chaincode first.");
        }
        throw new Error(errorMsg);
      }

      showToast(`Successfully cleared ${data.deletedCount || 0} audit records`, "success");
      setConfirmationText("");
      onClose();
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-xl)",
              maxWidth: "500px",
              width: "90%",
              zIndex: 1001,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "var(--spacing-xl)",
                borderBottom: "1px solid var(--gray-200)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--error)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <FiAlertTriangle style={{ fontSize: "1.25rem" }} />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  Clear All Audit Records
                </h3>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "var(--gray-500)",
                  padding: "0.5rem",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--gray-100)";
                  e.currentTarget.style.color = "var(--gray-900)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "var(--gray-500)";
                }}
              >
                <FiX />
              </button>
            </div>

            <div style={{ padding: "var(--spacing-xl)" }}>
              <p
                style={{
                  margin: 0,
                  marginBottom: "var(--spacing-lg)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                This action will permanently delete <strong>all audit records</strong> from the
                blockchain ledger. This cannot be undone.
              </p>

              <div style={{ marginBottom: "var(--spacing-lg)" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-sm)",
                  }}
                >
                  Type <strong>&quot;{requiredText}&quot;</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => {
                    setConfirmationText(e.target.value);
                    setError(null);
                  }}
                  placeholder={requiredText}
                  style={{
                    width: "100%",
                    padding: "0.75rem var(--spacing-md)",
                    border: error ? "2px solid var(--error)" : "1px solid var(--gray-300)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.875rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    if (!error) {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 112, 243, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!error) {
                      e.currentTarget.style.borderColor = "var(--gray-300)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                />
                {error && (
                  <p style={{ margin: "var(--spacing-xs) 0 0 0", color: "var(--error)", fontSize: "0.875rem" }}>
                    {error}
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-sm)",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "var(--gray-100)",
                    color: "var(--text-secondary)",
                    border: "none",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "var(--gray-200)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "var(--gray-100)";
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleClear}
                  disabled={loading || confirmationText !== requiredText}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background:
                      loading || confirmationText !== requiredText ? "var(--gray-300)" : "var(--error)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: loading || confirmationText !== requiredText ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-sm)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && confirmationText === requiredText) {
                      e.currentTarget.style.background = "#dc2626";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && confirmationText === requiredText) {
                      e.currentTarget.style.background = "var(--error)";
                    }
                  }}
                >
                  <FiTrash2 style={{ fontSize: "1rem" }} />
                  {loading ? "Clearing..." : "Clear All Records"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

