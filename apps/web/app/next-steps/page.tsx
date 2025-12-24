"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FiCode,
  FiZap,
  FiLink,
  FiCheckCircle,
  FiFileText,
  FiTarget,
  FiLayers,
  FiArrowRight,
  FiBox,
  FiTool,
} from "react-icons/fi";
import Image from "next/image";
import Logo from "../../components/ui/Logo";

export default function NextStepsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container"
      style={{
        paddingTop: "calc(var(--navbar-height) + var(--spacing-xl))",
        paddingBottom: "var(--spacing-xl)",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          marginBottom: "var(--spacing-3xl)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--spacing-md)",
            marginBottom: "var(--spacing-lg)",
            flexWrap: "wrap",
          }}
        >
          <Logo showText={false} style={{ height: "100px", width: "auto" }} />
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            color: "white",
            marginBottom: "var(--spacing-md)",
            background:
              "linear-gradient(135deg, var(--primary-light), var(--primary))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Next Steps
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-tertiary)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Roadmap for developers and product strategy
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-3xl)",
        }}
      >
        {/* How Developers Use ProcurePilot */}
        <motion.section
          variants={itemVariants}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--spacing-2xl)",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-md)",
                marginBottom: "var(--spacing-xl)",
              }}
            >
              <div
                style={{
                  padding: "var(--spacing-md)",
                  background:
                    "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiCode
                  style={{
                    fontSize: "1.5rem",
                    color: "white",
                  }}
                />
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                How Developers Use ProcurePilot
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "var(--spacing-lg)",
              }}
            >
              {/* Embed into portal */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{
                  padding: "var(--spacing-xl)",
                  background: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-primary)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    background:
                      "radial-gradient(circle, rgba(0, 112, 243, 0.1), transparent)",
                    borderRadius: "50%",
                    transform: "translate(30%, -30%)",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-sm)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    <FiBox
                      style={{
                        fontSize: "1.5rem",
                        color: "var(--primary-light)",
                      }}
                    />
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "white",
                      }}
                    >
                      Embed into an internal procurement portal
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text-tertiary)",
                      lineHeight: 1.7,
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Add &quot;Offer Intelligence&quot; as a module:
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-xs)",
                    }}
                  >
                    {[
                      "Upload PDFs",
                      "Analyze",
                      "Compare",
                      "Approve",
                      "Store decision",
                    ].map((step, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--spacing-sm)",
                          color: "var(--text-secondary)",
                          fontSize: "0.9rem",
                        }}
                      >
                        <FiArrowRight
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--primary-light)",
                            flexShrink: 0,
                          }}
                        />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Automate the pipeline */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{
                  padding: "var(--spacing-xl)",
                  background: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-primary)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    background:
                      "radial-gradient(circle, rgba(34, 197, 94, 0.1), transparent)",
                    borderRadius: "50%",
                    transform: "translate(30%, -30%)",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-sm)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    <FiZap
                      style={{
                        fontSize: "1.5rem",
                        color: "var(--success)",
                      }}
                    />
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "white",
                      }}
                    >
                      Automate the pipeline
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text-tertiary)",
                      lineHeight: 1.7,
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Trigger analysis when PDFs land in storage (Drive/S3/email):
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-xs)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "var(--spacing-sm)",
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
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
                      <span>Output structured results + evidence</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "var(--spacing-sm)",
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
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
                      <span>Approve → write audit record</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Use alongside procurement suites */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{
                  padding: "var(--spacing-xl)",
                  background: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-primary)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    background:
                      "radial-gradient(circle, rgba(168, 85, 247, 0.1), transparent)",
                    borderRadius: "50%",
                    transform: "translate(30%, -30%)",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-sm)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    <FiLayers
                      style={{
                        fontSize: "1.5rem",
                        color: "var(--primary-light)",
                      }}
                    />
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "white",
                      }}
                    >
                      Use alongside procurement suites
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text-tertiary)",
                      lineHeight: 1.7,
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Keep existing tools, but add:
                  </p>
                  <div
                    style={{
                      padding: "var(--spacing-md)",
                      background: "rgba(15, 23, 42, 0.5)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-primary)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      RFQ PDF extraction + evidence + scoring + audit trail as
                      an add-on layer.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              zIndex: 0,
            }}
          >
            <Image
              src="/images/illustrations/maskot4.png"
              alt="Next Steps"
              width={400}
              height={300}
              style={{
                objectFit: "contain",
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </motion.div>
        </motion.section>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, var(--border-primary), transparent)",
            margin: "var(--spacing-xl) 0",
          }}
        />

        {/* Competitive Matrix */}
        <motion.section variants={itemVariants}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-md)",
              marginBottom: "var(--spacing-xl)",
            }}
          >
            <div
              style={{
                padding: "var(--spacing-md)",
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiFileText
                style={{
                  fontSize: "1.5rem",
                  color: "white",
                }}
              />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                fontWeight: 700,
                color: "white",
              }}
            >
              Competitive Matrix
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              marginBottom: "var(--spacing-xl)",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "900px",
                borderCollapse: "collapse",
                background: "rgba(30, 41, 59, 0.6)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--border-primary)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #1e293b, #334155)",
                    borderBottom: "2px solid var(--border-primary)",
                  }}
                >
                  <th
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      borderRight: "1px solid var(--border-primary)",
                    }}
                  >
                    Feature
                  </th>
                  <th
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      borderRight: "1px solid var(--border-primary)",
                      background: "rgba(0, 112, 243, 0.2)",
                    }}
                  >
                    ProcurePilot
                  </th>
                  <th
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      borderRight: "1px solid var(--border-primary)",
                    }}
                  >
                    Excel + Manual Process
                  </th>
                  <th
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      borderRight: "1px solid var(--border-primary)",
                    }}
                  >
                    Procurement Suites
                    <br />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 400,
                        opacity: 0.8,
                      }}
                    >
                      (SAP Ariba, Coupa, Ivalua, JAGGAER)
                    </span>
                  </th>
                  <th
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Document AI Tools
                    <br />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 400,
                        opacity: 0.8,
                      }}
                    >
                      (ContractPodAi, Lexion)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "AI-Powered Structured Data Extraction",
                    procurepilot: "check",
                    excel: "cross",
                    suites: "limited",
                    docAI: "check",
                  },
                  {
                    feature: "Side-by-Side Comparison Table",
                    procurepilot: "check",
                    excel: "limited",
                    suites: "check",
                    docAI: "cross",
                  },
                  {
                    feature: "Feasibility Scoring & Red Flag Detection",
                    procurepilot: "check",
                    excel: "cross",
                    suites: "limited",
                    docAI: "limited",
                  },
                  {
                    feature: "Evidence Tracking (Page-level Citations)",
                    procurepilot: "check",
                    excel: "cross",
                    suites: "cross",
                    docAI: "limited",
                  },
                  {
                    feature: "Customizable Weighted Scoring",
                    procurepilot: "check",
                    excel: "limited",
                    suites: "limited",
                    docAI: "cross",
                  },
                  {
                    feature: "Blockchain Audit Trail (Hyperledger Fabric)",
                    procurepilot: "check",
                    excel: "cross",
                    suites: "cross",
                    docAI: "cross",
                  },
                  {
                    feature: "GDPR/KVKK Compliance Check",
                    procurepilot: "check",
                    excel: "cross",
                    suites: "limited",
                    docAI: "limited",
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom:
                        index < 6 ? "1px solid var(--border-primary)" : "none",
                      background:
                        index % 2 === 0
                          ? "rgba(15, 23, 42, 0.3)"
                          : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "var(--spacing-md)",
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        borderRight: "1px solid var(--border-primary)",
                      }}
                    >
                      {row.feature}
                    </td>
                    <td
                      style={{
                        padding: "var(--spacing-md)",
                        textAlign: "center",
                        borderRight: "1px solid var(--border-primary)",
                        background: "rgba(0, 112, 243, 0.1)",
                      }}
                    >
                      {row.procurepilot === "check" ? (
                        <FiCheckCircle
                          style={{
                            fontSize: "1.5rem",
                            color: "#22c55e",
                          }}
                        />
                      ) : row.procurepilot === "limited" ? (
                        <span
                          style={{
                            color: "#f59e0b",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          Limited
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "1.5rem",
                            color: "#ef4444",
                          }}
                        >
                          ×
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "var(--spacing-md)",
                        textAlign: "center",
                        borderRight: "1px solid var(--border-primary)",
                      }}
                    >
                      {row.excel === "check" ? (
                        <FiCheckCircle
                          style={{
                            fontSize: "1.5rem",
                            color: "#22c55e",
                          }}
                        />
                      ) : row.excel === "limited" ? (
                        <span
                          style={{
                            color: "#f59e0b",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          Limited
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "1.5rem",
                            color: "#ef4444",
                          }}
                        >
                          ×
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "var(--spacing-md)",
                        textAlign: "center",
                        borderRight: "1px solid var(--border-primary)",
                      }}
                    >
                      {row.suites === "check" ? (
                        <FiCheckCircle
                          style={{
                            fontSize: "1.5rem",
                            color: "#22c55e",
                          }}
                        />
                      ) : row.suites === "limited" ? (
                        <span
                          style={{
                            color: "#f59e0b",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          Limited
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "1.5rem",
                            color: "#ef4444",
                          }}
                        >
                          ×
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "var(--spacing-md)",
                        textAlign: "center",
                      }}
                    >
                      {row.docAI === "check" ? (
                        <FiCheckCircle
                          style={{
                            fontSize: "1.5rem",
                            color: "#22c55e",
                          }}
                        />
                      ) : row.docAI === "limited" ? (
                        <span
                          style={{
                            color: "#f59e0b",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          Limited
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "1.5rem",
                            color: "#ef4444",
                          }}
                        >
                          ×
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              padding: "var(--spacing-lg)",
              background: "rgba(0, 112, 243, 0.1)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid rgba(0, 112, 243, 0.3)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              <strong style={{ color: "white" }}>ProcurePilot</strong> is the
              only solution that combines{" "}
              <strong style={{ color: "var(--primary-light)" }}>
                AI-powered extraction
              </strong>
              ,{" "}
              <strong style={{ color: "var(--primary-light)" }}>
                evidence tracking
              </strong>
              , and{" "}
              <strong style={{ color: "var(--primary-light)" }}>
                blockchain audit trail
              </strong>{" "}
              in a single platform, making it the most comprehensive solution
              for procurement decision-making with full transparency and
              accountability.
            </p>
          </motion.div>
        </motion.section>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, var(--border-primary), transparent)",
            margin: "var(--spacing-xl) 0",
          }}
        />

        {/* Next Steps */}
        <motion.section variants={itemVariants}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-md)",
              marginBottom: "var(--spacing-xl)",
            }}
          >
            <div
              style={{
                padding: "var(--spacing-md)",
                background: "linear-gradient(135deg, var(--success), #16a34a)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiTarget
                style={{
                  fontSize: "1.5rem",
                  color: "white",
                }}
              />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                fontWeight: 700,
                color: "white",
              }}
            >
              Next Steps
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--spacing-lg)",
            }}
          >
            {[
              {
                number: "1",
                title: "Publish a 1-page competitor matrix",
                description:
                  "suites vs orchestration vs doc AI vs ProcurePilot",
                icon: FiFileText,
                color: "var(--primary-light)",
              },
              {
                number: "2",
                title: "Make the product story crystal clear",
                description: "&quot;Compare vendor offers with evidence.&quot;",
                icon: FiTool,
                color: "#04d6ff", // cyan/blue
              },
              {
                number: "3",
                title: "Upgrade evidence UX",
                description:
                  "evidence drawer, consistent tooltips, optional highlights",
                icon: FiBox,
                color: "var(--warning)",
              },
              {
                number: "4",
                title: "Ship a developer pack",
                description: "3 endpoints, sample payloads, integration guide",
                icon: FiCode,
                color: "var(--primary-light)",
              },
              {
                number: "5",
                title: "Choose a wedge ICP",
                description:
                  "compliance-heavy orgs, or suite-users who still live in PDFs",
                icon: FiTarget,
                color: "var(--success)",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                style={{
                  padding: "var(--spacing-xl)",
                  background: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-primary)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "60px",
                    height: "60px",
                    background: `radial-gradient(circle, ${step.color}15, transparent)`,
                    borderRadius: "50%",
                    transform: "translate(-20%, -20%)",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--spacing-md)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-md)",
                        background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: "white",
                      }}
                    >
                      {step.number}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--spacing-sm)",
                          marginBottom: "var(--spacing-xs)",
                        }}
                      >
                        <step.icon
                          style={{
                            fontSize: "1.125rem",
                            color: step.color,
                            fill: step.color,
                          }}
                        />
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "1.125rem",
                            fontWeight: 600,
                            color: "white",
                          }}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-tertiary)",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}
