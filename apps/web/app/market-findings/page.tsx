"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiDollarSign,
  FiGlobe,
  FiTrendingUp,
  FiShield,
  FiCode,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";
import Image from "next/image";
import Logo from "../../components/ui/Logo";

export default function MarketFindingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container"
      style={{
        paddingTop: "calc(var(--navbar-height) + var(--spacing-xl))",
        paddingBottom: "var(--spacing-xl)",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--spacing-md)",
          marginBottom: "var(--spacing-2xl)",
        }}
      >
        <Logo showText={false} style={{ height: "100px", width: "auto" }} />
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: "white",
            textAlign: "center",
          }}
        >
          Market Findings
        </h1>
      </motion.div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-2xl)",
        }}
      >
        {/* Who it's for */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            padding: "var(--spacing-xl)",
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <FiUsers
              style={{
                fontSize: "1.5rem",
                color: "var(--primary-light)",
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "white",
              }}
            >
              Who it&apos;s for
            </h2>
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.7,
              marginBottom: "var(--spacing-md)",
            }}
          >
            ProcurePilot is built for teams that still receive vendor offers as
            PDFs and need fast, defensible decisions:
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-sm)",
            }}
          >
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: "var(--primary-light)", marginTop: "0.25rem" }}
              >
                •
              </span>
              <span>
                <strong style={{ color: "white" }}>
                  Procurement & Finance
                </strong>{" "}
                (daily users)
              </span>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: "var(--primary-light)", marginTop: "0.25rem" }}
              >
                •
              </span>
              <span>
                <strong style={{ color: "white" }}>
                  Compliance / Internal Audit
                </strong>{" "}
                (trust + traceability)
              </span>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: "var(--primary-light)", marginTop: "0.25rem" }}
              >
                •
              </span>
              <span>
                <strong style={{ color: "white" }}>Developers</strong> (the team
                that integrates and ships it internally)
              </span>
            </li>
          </ul>
        </motion.section>

        {/* How teams spend money/time today */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            padding: "var(--spacing-xl)",
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <FiDollarSign
              style={{
                fontSize: "1.5rem",
                color: "var(--primary-light)",
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "white",
              }}
            >
              How teams spend money/time today
            </h2>
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.7,
              marginBottom: "var(--spacing-md)",
            }}
          >
            Most teams still rely on:
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-sm)",
              marginBottom: "var(--spacing-md)",
            }}
          >
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: "var(--primary-light)", marginTop: "0.25rem" }}
              >
                •
              </span>
              <span>
                <strong style={{ color: "white" }}>
                  Excel + manual copy/paste from PDFs
                </strong>{" "}
                (slow, inconsistent)
              </span>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: "var(--primary-light)", marginTop: "0.25rem" }}
              >
                •
              </span>
              <span>
                <strong style={{ color: "white" }}>Procurement suites</strong>{" "}
                (powerful, but often heavy for RFQ PDF comparison)
              </span>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: "var(--primary-light)", marginTop: "0.25rem" }}
              >
                •
              </span>
              <span>
                <strong style={{ color: "white" }}>
                  Contract/document AI tools
                </strong>{" "}
                (adjacent, but not RFQ-offer decisioning)
              </span>
            </li>
          </ul>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.7,
              fontStyle: "italic",
              margin: 0,
              padding: "var(--spacing-md)",
              background: "rgba(239, 68, 68, 0.1)",
              borderRadius: "var(--radius-md)",
              borderLeft: "3px solid var(--error)",
            }}
          >
            The hidden cost is always the same: time lost + weak evidence when
            someone asks &quot;why did we pick this vendor?&quot;
          </p>
        </motion.section>

        {/* Global signals */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            padding: "var(--spacing-xl)",
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <FiGlobe
              style={{
                fontSize: "1.5rem",
                color: "var(--primary-light)",
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "white",
              }}
            >
              Global signals
            </h2>
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Procurement automation and document intelligence are attracting
            serious investment worldwide. This validates the category: companies
            pay for faster decisions and stronger auditability.
          </p>
        </motion.section>

        {/* YC & startup landscape */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            padding: "var(--spacing-xl)",
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <FiTrendingUp
              style={{
                fontSize: "1.5rem",
                color: "var(--primary-light)",
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "white",
              }}
            >
              YC & startup landscape (adjacent)
            </h2>
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.7,
              marginBottom: "var(--spacing-md)",
            }}
          >
            YC-backed and venture-funded companies focus on:
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-sm)",
              marginBottom: "var(--spacing-md)",
            }}
          >
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: "var(--primary-light)", marginTop: "0.25rem" }}
              >
                •
              </span>
              <span>procurement workflows,</span>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: "var(--primary-light)", marginTop: "0.25rem" }}
              >
                •
              </span>
              <span>negotiation savings,</span>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: "var(--primary-light)", marginTop: "0.25rem" }}
              >
                •
              </span>
              <span>RFP/vendor management,</span>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: "var(--primary-light)", marginTop: "0.25rem" }}
              >
                •
              </span>
              <span>AI document intelligence.</span>
            </li>
          </ul>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.7,
              margin: 0,
              padding: "var(--spacing-md)",
              background: "rgba(34, 197, 94, 0.1)",
              borderRadius: "var(--radius-md)",
              borderLeft: "3px solid var(--success)",
            }}
          >
            <strong style={{ color: "white" }}>
              ProcurePilot&apos;s wedge is narrower but sharper:
            </strong>{" "}
            offer PDFs → evidence → recommendation → audit trail.
          </p>
        </motion.section>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            height: "1px",
            background: "var(--border-primary)",
            margin: "var(--spacing-xl) 0",
          }}
        />

        {/* Competitive Takeaways */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            padding: "var(--spacing-xl)",
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "white",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            Competitive Takeaways
          </h2>

          <h3
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--primary-light)",
              marginBottom: "var(--spacing-md)",
            }}
          >
            What we must do differently
          </h3>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.7,
              marginBottom: "var(--spacing-xl)",
            }}
          >
            To win against suites and AI tools, ProcurePilot must be:
          </p>

          {/* Evidence-first */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              padding: "var(--spacing-lg)",
              background: "rgba(15, 23, 42, 0.5)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-primary)",
              marginBottom: "var(--spacing-md)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              <FiFileText
                style={{
                  fontSize: "1.25rem",
                  color: "var(--primary-light)",
                }}
              />
              <h4
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                1) Evidence-first
              </h4>
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-tertiary)",
                lineHeight: 1.7,
                marginBottom: "var(--spacing-sm)",
                fontStyle: "italic",
              }}
            >
              Not &quot;AI said so,&quot; but:
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-xs)",
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--spacing-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                <FiCheckCircle
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--success)",
                    marginTop: "0.25rem",
                    flexShrink: 0,
                  }}
                />
                <span>Page number + quote for every key field and risk</span>
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--spacing-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                <FiCheckCircle
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--success)",
                    marginTop: "0.25rem",
                    flexShrink: 0,
                  }}
                />
                <span>Clear breakdown of what impacted the final score</span>
              </li>
            </ul>
          </motion.div>

          {/* Developer-first distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            style={{
              padding: "var(--spacing-lg)",
              background: "rgba(15, 23, 42, 0.5)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-primary)",
              marginBottom: "var(--spacing-md)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              <FiCode
                style={{
                  fontSize: "1.25rem",
                  color: "var(--primary-light)",
                }}
              />
              <h4
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                2) Developer-first distribution
              </h4>
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-tertiary)",
                lineHeight: 1.7,
                marginBottom: "var(--spacing-sm)",
              }}
            >
              Offer two ways to adopt:
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-xs)",
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--spacing-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                <FiCheckCircle
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--success)",
                    marginTop: "0.25rem",
                    flexShrink: 0,
                  }}
                />
                <span>UI for fast demos and POCs</span>
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--spacing-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                <FiCheckCircle
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--success)",
                    marginTop: "0.25rem",
                    flexShrink: 0,
                  }}
                />
                <span>API/SDK for internal portals and workflows</span>
              </li>
            </ul>
          </motion.div>

          {/* Audit-ready by design */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            style={{
              padding: "var(--spacing-lg)",
              background: "rgba(15, 23, 42, 0.5)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              <FiShield
                style={{
                  fontSize: "1.25rem",
                  color: "var(--primary-light)",
                }}
              />
              <h4
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                3) Audit-ready by design
              </h4>
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-tertiary)",
                lineHeight: 1.7,
                marginBottom: "var(--spacing-sm)",
              }}
            >
              Keep PDFs off-ledger, but store:
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-xs)",
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--spacing-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                <FiCheckCircle
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--success)",
                    marginTop: "0.25rem",
                    flexShrink: 0,
                  }}
                />
                <span>decision summary,</span>
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--spacing-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                <FiCheckCircle
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--success)",
                    marginTop: "0.25rem",
                    flexShrink: 0,
                  }}
                />
                <span>evidence references,</span>
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--spacing-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                <FiCheckCircle
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--success)",
                    marginTop: "0.25rem",
                    flexShrink: 0,
                  }}
                />
                <span>hashes/metadata,</span>
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--spacing-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                <FiCheckCircle
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--success)",
                    marginTop: "0.25rem",
                    flexShrink: 0,
                  }}
                />
                <span>immutable audit record.</span>
              </li>
            </ul>
          </motion.div>
        </motion.section>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{
          marginTop: "var(--spacing-3xl)",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 0,
        }}
      >
        <Image
          src="/images/illustrations/maskot5.png"
          alt="Market Findings"
          width={400}
          height={300}
          style={{
            objectFit: "contain",
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
