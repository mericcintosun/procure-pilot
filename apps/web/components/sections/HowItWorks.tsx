"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  FiUpload,
  FiBarChart2,
  FiShield,
} from "react-icons/fi";
import ScrollReveal from "../ui/ScrollReveal";

interface Step {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  number: string;
  title: string;
  description: string;
  color: string;
}

export default function HowItWorks() {
  const steps: Step[] = [
    {
      icon: FiUpload,
      number: "01",
      title: "Extract",
      description:
        "Upload vendor quotation PDFs. AI extracts standardized data: price, lead time, payment terms, penalty clauses, and compliance status.",
      color: "var(--primary)",
    },
    {
      icon: FiBarChart2,
      number: "02",
      title: "Compare",
      description:
        "Get weighted recommendations based on your priorities (price, risk, speed). Every extracted value includes page-level evidence with direct quotes from the source document.",
      color: "var(--success)",
    },
    {
      icon: FiShield,
      number: "03",
      title: "Audit",
      description:
        "Store your decision as an immutable audit record on Hyperledger Fabric. Full traceability with evidence, metadata, and timestamps.",
      color: "var(--info)",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <ScrollReveal>
      <section
        id="how-it-works"
        style={{
          padding: "var(--spacing-3xl) var(--spacing-lg)",
          background: "var(--bg-primary)",
        }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "var(--spacing-2xl)",
              alignItems: "center",
              marginBottom: "var(--spacing-2xl)",
            }}
            className="how-it-works-grid"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                order: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                zIndex: 1000,
              }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/images/illustrations/illustration3.png"
                  alt="How It Works"
                  width={600}
                  height={400}
                  style={{
                    objectFit: "contain",
                    maxWidth: "100%",
                    height: "auto",
                    transition: "all 0.3s ease",
                  }}
                />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                order: 2,
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  marginBottom: "var(--spacing-md)",
                  color: "var(--text-primary)",
                }}
              >
                How It Works
              </h2>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "var(--gray-500)",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Three simple steps to transform your procurement process
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--spacing-xl)",
              marginTop: "var(--spacing-2xl)",
            }}
          >
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                style={{
                  padding: "var(--spacing-2xl)",
                  background: "var(--bg-primary)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border-primary)",
                  boxShadow: "var(--shadow-md)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onHoverStart={(e) => {
                  if (e.currentTarget instanceof HTMLElement) {
                    e.currentTarget.style.boxShadow = "var(--shadow-xl)";
                    e.currentTarget.style.borderColor = step.color;
                  }
                }}
                onHoverEnd={(e) => {
                  if (e.currentTarget instanceof HTMLElement) {
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    e.currentTarget.style.borderColor = "var(--gray-200)";
                  }
                }}
              >
              <div
                style={{
                  position: "absolute",
                  top: "var(--spacing-lg)",
                  right: "var(--spacing-lg)",
                  fontSize: "4rem",
                  fontWeight: 800,
                  color: "var(--gray-100)",
                  lineHeight: 1,
                  zIndex: 0,
                }}
              >
                {step.number}
              </div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "var(--radius-lg)",
                  background: `${step.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "var(--spacing-lg)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <step.icon
                  style={{
                    fontSize: "1.5rem",
                    color: step.color,
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "var(--spacing-md)",
                  color: "var(--text-primary)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  color: "var(--text-tertiary)",
                  lineHeight: 1.7,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {step.description}
              </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  );
}

