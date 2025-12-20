"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiMoreVertical,
  FiTrash2,
  FiPlus,
  FiHome,
  FiArrowLeft,
  FiClipboard,
  FiAlertTriangle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ClearAllModal from "./ClearAllModal";
import Logo from "../../components/ui/Logo";

interface Audit {
  ID: string;
  Timestamp: string;
  Data?: {
    type?: string;
    vendor?: string;
    amount?: number;
    currency?: string;
    riskFlags?: string[];
    filename?: string;
  };
  analysis?: {
    riskScore?: number;
  };
}

interface AuditsPageClientProps {
  audits: Audit[];
}

export default function AuditsPageClient({
  audits: initialAudits,
}: AuditsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [showClearModal, setShowClearModal] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  // Filter and sort audits
  const filteredAudits = useMemo(() => {
    let filtered = initialAudits.filter(
      (a: any) => a.ID && !a.ID.startsWith("analysis::")
    );

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((a: any) => {
        const id = a.ID?.toLowerCase() || "";
        const vendor = a.Data?.vendor?.toLowerCase() || "";
        const type = a.Data?.type?.toLowerCase() || "";
        const filename = a.Data?.filename?.toLowerCase() || "";
        return (
          id.includes(query) ||
          vendor.includes(query) ||
          type.includes(query) ||
          filename.includes(query)
        );
      });
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((a: any) => {
        if (filterType === "rfq_offer") {
          return a.Data?.filename || a.ID.includes("rfq");
        }
        return a.Data?.type === filterType;
      });
    }

    // Sort
    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.Timestamp).getTime();
      const dateB = new Date(b.Timestamp).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [initialAudits, searchQuery, filterType, sortBy]);

  const getRiskScore = (audit: any): number | null => {
    return audit.analysis?.riskScore ?? null;
  };

  const getRiskCount = (audit: any): number => {
    return audit.Data?.riskFlags?.length || 0;
  };

  const getVendorName = (audit: any): string => {
    return audit.Data?.vendor || audit.Data?.filename || "Unknown Vendor";
  };

  const getTypeLabel = (audit: any): string => {
    if (audit.Data?.filename) return "RFQ Offer";
    return audit.Data?.type || "Unknown";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container"
      style={{ padding: "var(--spacing-xl) 0", minHeight: "100vh" }}
    >
      {/* Back Button */}
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--spacing-sm)",
          color: "var(--primary-light)",
          textDecoration: "none",
          marginBottom: "var(--spacing-lg)",
          fontSize: "0.875rem",
          fontWeight: 500,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--primary)";
          e.currentTarget.style.transform = "translateX(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--primary-light)";
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        <FiArrowLeft style={{ fontSize: "1rem" }} />
        Back to Home
      </Link>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "var(--spacing-md)",
          marginBottom: "var(--spacing-xl)",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-md)",
              marginBottom: "var(--spacing-xs)",
            }}
          >
            <Logo size={40} withShadow={true} />
            <h1 style={{ margin: 0, fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
              Audit Ledger
            </h1>
          </div>
          <p
            style={{
              margin: "var(--spacing-xs) 0 0 0",
              color: "var(--text-tertiary)",
              fontSize: "0.875rem",
            }}
          >
            {filteredAudits.length} of{" "}
            {
              initialAudits.filter(
                (a: any) => a.ID && !a.ID.startsWith("analysis::")
              ).length
            }{" "}
            records
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-sm)",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Link
            href="/audits/new"
            style={{
              padding: "clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-lg)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--primary-dark)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--primary)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FiPlus style={{ fontSize: "1rem" }} />
            Create Audit Record
          </Link>
        </div>
      </div>

      {/* Toolbar: Search, Filter, Sort */}
      <div
        style={{
          display: "flex",
          gap: "var(--spacing-md)",
          marginBottom: "var(--spacing-xl)",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div
          style={{
            position: "relative",
            flex: "1 1 200px",
            minWidth: "150px",
          }}
        >
          <FiSearch
            style={{
              position: "absolute",
              left: "var(--spacing-md)",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gray-400)",
              fontSize: "1rem",
            }}
          />
          <input
            type="text"
            placeholder="Search by ID, vendor, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem var(--spacing-md) 0.75rem 2.5rem",
              border: "1px solid var(--border-primary)",
              borderRadius: "var(--radius-lg)",
              fontSize: "0.875rem",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(0, 112, 243, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--gray-300)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Filter */}
        <div style={{ position: "relative" }}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "0.75rem 2.5rem 0.75rem var(--spacing-md)",
              border: "1px solid var(--border-primary)",
              borderRadius: "var(--radius-lg)",
              fontSize: "0.875rem",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              cursor: "pointer",
              outline: "none",
              appearance: "none",
            }}
          >
            <option
              value="all"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
            >
              All Types
            </option>
            <option
              value="rfq_offer"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
            >
              RFQ Offers
            </option>
            <option
              value="invoice"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
            >
              Invoices
            </option>
            <option
              value="delivery"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
            >
              Deliveries
            </option>
            <option
              value="contract"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
            >
              Contracts
            </option>
          </select>
          <FiFilter
            style={{
              position: "absolute",
              right: "var(--spacing-md)",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gray-400)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Sort */}
        <div style={{ position: "relative" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            style={{
              padding: "0.75rem 2.5rem 0.75rem var(--spacing-md)",
              border: "1px solid var(--border-primary)",
              borderRadius: "var(--radius-lg)",
              fontSize: "0.875rem",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              cursor: "pointer",
              outline: "none",
              appearance: "none",
            }}
          >
            <option
              value="newest"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
            >
              Newest First
            </option>
            <option
              value="oldest"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
            >
              Oldest First
            </option>
          </select>
          <FiChevronDown
            style={{
              position: "absolute",
              right: "var(--spacing-md)",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gray-400)",
              pointerEvents: "none",
              fontSize: "0.875rem",
            }}
          />
        </div>

        {/* Menu with Clear All */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(showMenu ? null : "menu")}
            style={{
              padding: "0.75rem",
              border: "1px solid var(--border-primary)",
              borderRadius: "var(--radius-lg)",
              background: "var(--bg-card)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--gray-400)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--gray-300)";
            }}
          >
            <FiMoreVertical
              style={{ fontSize: "1rem", color: "var(--text-tertiary)" }}
            />
          </button>
          <AnimatePresence>
            {showMenu === "menu" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.5rem)",
                  right: 0,
                  background: "var(--bg-card)",
                  border: "1px solid var(--gray-200)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-lg)",
                  minWidth: "200px",
                  zIndex: 100,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => {
                    setShowClearModal(true);
                    setShowMenu(null);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem var(--spacing-md)",
                    border: "none",
                    background: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-sm)",
                    color: "var(--error)",
                    fontSize: "0.875rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--gray-50)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <FiTrash2 style={{ fontSize: "1rem" }} />
                  Clear All Records
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Audit Cards */}
      {filteredAudits.length === 0 ? (
        <div
          style={{
            padding: "var(--spacing-3xl)",
            textAlign: "center",
            maxWidth: "500px",
            margin: "var(--spacing-3xl) auto",
          }}
        >
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "var(--spacing-lg)",
              opacity: 0.3,
              color: "var(--gray-400)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FiClipboard style={{ fontSize: "4rem" }} />
          </div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "var(--spacing-md)",
            }}
          >
            {searchQuery || filterType !== "all"
              ? "No matching audits"
              : "No audits found"}
          </h3>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.6,
              marginBottom: "var(--spacing-xl)",
            }}
          >
            {searchQuery || filterType !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Create your first audit record to start tracking procurement decisions on the blockchain ledger."}
          </p>
          {!searchQuery && filterType === "all" && (
            <Link
              href="/audits/new"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                background: "var(--primary)",
                color: "white",
                borderRadius: "var(--radius-lg)",
                textDecoration: "none",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary-dark)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--primary)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Create Audit Record
            </Link>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "var(--spacing-md)",
          }}
        >
          {filteredAudits.map((audit: any) => {
            const riskScore = getRiskScore(audit);
            const riskCount = getRiskCount(audit);
            const vendorName = getVendorName(audit);
            const typeLabel = getTypeLabel(audit);

            return (
              <motion.div
                key={audit.ID}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <Link
                  href={`/audits/${audit.ID}`}
                  style={{
                    display: "block",
                    padding: "clamp(0.75rem, 2vw, var(--spacing-lg))",
                    background: "var(--bg-card)",
                    border: "1px solid var(--gray-200)",
                    borderRadius: "var(--radius-lg)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "all 0.2s ease",
                    boxShadow: "var(--shadow-sm)",
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
                      gap: "var(--spacing-md)",
                    }}
                  >
                    {/* Left: Vendor + Type */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--spacing-sm)",
                          marginBottom: "var(--spacing-xs)",
                          flexWrap: "wrap",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "clamp(1rem, 3vw, 1.125rem)",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            wordBreak: "break-word",
                          }}
                        >
                          {vendorName}
                        </h3>
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "var(--gray-100)",
                            color: "var(--text-secondary)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "clamp(0.625rem, 2vw, 0.75rem)",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {typeLabel}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--gray-500)",
                          marginBottom: "var(--spacing-xs)",
                        }}
                      >
                        {audit.ID}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--gray-500)",
                        }}
                      >
                        {new Date(audit.Timestamp).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {/* Right: Risk Badge + Score */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "var(--spacing-xs)",
                      }}
                    >
                      {riskCount > 0 && (
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "var(--error)",
                            color: "white",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <FiAlertTriangle style={{ fontSize: "0.75rem" }} />
                          {riskCount} Risk{riskCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {riskScore !== null && (
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            background:
                              riskScore >= 70
                                ? "var(--error)"
                                : riskScore >= 40
                                ? "var(--warning)"
                                : "var(--success)",
                            color: "white",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          Score: {riskScore}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Clear All Modal */}
      <ClearAllModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
      />
    </motion.div>
  );
}
