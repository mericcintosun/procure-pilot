"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FiCpu,
  FiBarChart2,
  FiAlertTriangle,
  FiLink,
  FiZap,
  FiTarget,
} from "react-icons/fi";

export default function FeaturesPage() {
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const descriptions = [
    {
      text: "AI-powered procurement proposal comparison platform. Automatically analyzes PDF proposals, detects risks, and recommends the best option. All decisions are immutably recorded using Hyperledger Fabric blockchain.",
    },
    {
      text: "In traditional procurement processes, manually comparing PDF proposals in different formats takes hours. ProcurePilot completes this process in 30 seconds and stores every step with its evidence on the blockchain.",
    },
    {
      text: "With an evidence-first approach, it doesn't just say 'AI recommended', it shows the source of every data point. Page numbers, direct quotes, and interactive evidence viewing provide complete transparency.",
    },
  ];

  const features = [
    {
      icon: FiCpu,
      title: "AI Analysis",
      description:
        "Automatic data extraction from PDFs and page-based evidence tracking",
    },
    {
      icon: FiBarChart2,
      title: "Comparison",
      description: "Side-by-side proposal visualization and weighted scoring",
    },
    {
      icon: FiAlertTriangle,
      title: "Risk Detection",
      description:
        "Automatic detection of GDPR compliance issues and missing information",
    },
    {
      icon: FiLink,
      title: "Blockchain",
      description: "Immutable audit trail and complete traceability",
    },
    {
      icon: FiZap,
      title: "Fast Results",
      description:
        "While manual comparison takes hours, ProcurePilot delivers results in 30 seconds",
    },
    {
      icon: FiTarget,
      title: "Customizable",
      description: "Adjust price, risk, and speed priorities with sliders",
    },
  ];

  // Auto-rotate descriptions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDescriptionIndex((prev) => (prev + 1) % descriptions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [descriptions.length]);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="features-page"
      style={{
        minHeight: "100vh",
        position: "relative",
        paddingTop: "calc(var(--navbar-height) + var(--spacing-xl))",
        paddingBottom: "var(--spacing-xl)",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1001 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--spacing-2xl)",
            alignItems: "stretch",
            alignContent: "stretch",
          }}
          className="features-grid"
        >
          {/* Left Side - Project Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              color: "var(--text-secondary)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
              gap: "var(--spacing-lg)",
            }}
            className="features-left"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-lg)",
              }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                  fontWeight: 800,
                  marginBottom: 0,
                  color: "white",
                  lineHeight: 1.2,
                }}
              >
                ProcurePilot
              </motion.h1>

              {/* Description Carousel */}
              <div
                style={{
                  position: "relative",
                  minHeight: "120px",
                  overflow: "hidden",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentDescriptionIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text-tertiary)",
                      lineHeight: 1.6,
                      position: "absolute",
                      width: "100%",
                      top: 0,
                      left: 0,
                      margin: 0,
                      padding: 0,
                      cursor: "default",
                    }}
                  >
                    {descriptions[currentDescriptionIndex].text.includes(
                      "Hyperledger Fabric"
                    ) ? (
                      <>
                        {
                          descriptions[currentDescriptionIndex].text.split(
                            "Hyperledger Fabric"
                          )[0]
                        }
                        <strong style={{ color: "var(--primary-light)" }}>
                          Hyperledger Fabric
                        </strong>
                        {
                          descriptions[currentDescriptionIndex].text.split(
                            "Hyperledger Fabric"
                          )[1]
                        }
                      </>
                    ) : (
                      descriptions[currentDescriptionIndex].text
                    )}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Features Carousel */}
              <div
                style={{
                  position: "relative",
                  minHeight: "140px",
                  overflow: "hidden",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeatureIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: "var(--spacing-lg)",
                      background: "rgba(30, 41, 59, 0.5)",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border-primary)",
                      position: "absolute",
                      width: "100%",
                      top: 0,
                      left: 0,
                      cursor: "default",
                      minHeight: "140px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "white",
                        marginBottom: "var(--spacing-sm)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-xs)",
                      }}
                    >
                      {(() => {
                        const Icon = features[currentFeatureIndex].icon;
                        return Icon ? (
                          <Icon
                            style={{
                              fontSize: "1.125rem",
                              color: "var(--primary-light)",
                            }}
                          />
                        ) : null;
                      })()}
                      {features[currentFeatureIndex].title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-tertiary)",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {features[currentFeatureIndex].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* How It Works - Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{
                padding: "var(--spacing-lg)",
                background: "rgba(30, 41, 59, 0.5)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-primary)",
                marginTop: "auto",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "white",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                How It Works?
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-tertiary)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Upload PDFs → AI analyzes → Proposals are compared → Best option
                is recommended → Decision is stored on blockchain. The entire
                process is completed in{" "}
                <strong style={{ color: "var(--success)" }}>30 seconds</strong>.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side - Developer Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              alignSelf: "stretch",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
            className="features-right"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{
                padding: "var(--spacing-2xl)",
                background: "rgba(30, 41, 59, 0.5)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-primary)",
                backdropFilter: "blur(10px)",
                maxWidth: "450px",
                width: "100%",
                position: "relative",
                zIndex: 1000,
                isolation: "isolate",
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-lg)",
                height: "100%",
                justifyContent: "center",
              }}
            >
              {/* Meriç Image */}
              <div
                style={{
                  position: "relative",
                  width: "160px",
                  height: "160px",
                  margin: "0 auto",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                  background: "var(--bg-secondary)",
                  isolation: "isolate",
                  zIndex: 1003,
                  mixBlendMode: "normal",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "var(--bg-secondary)",
                    zIndex: 1004,
                    borderRadius: "var(--radius-xl)",
                    mixBlendMode: "normal",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    zIndex: 1005,
                    isolation: "isolate",
                    mixBlendMode: "normal",
                    background: "var(--bg-secondary)",
                  }}
                >
                  <Image
                    src="/images/meric.png"
                    alt="Meriç Cintosun"
                    width={160}
                    height={160}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "relative",
                      isolation: "isolate",
                      mixBlendMode: "normal",
                    }}
                  />
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "var(--primary-light)",
                  margin: 0,
                }}
              >
                Meriç Cintosun
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-tertiary)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Full Stack Blockchain Developer
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                style={{
                  paddingTop: "var(--spacing-lg)",
                  borderTop: "1px solid var(--border-primary)",
                  marginTop: "auto",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  &quot;Building the future of procurement with AI and
                  blockchain technology&quot;
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
