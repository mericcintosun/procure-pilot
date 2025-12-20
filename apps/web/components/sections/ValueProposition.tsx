"use client";

import { motion } from "framer-motion";
import { FiFileText, FiCheckCircle, FiLink } from "react-icons/fi";
import ScrollReveal from "../ui/ScrollReveal";

interface Point {
  number: string;
  title: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
}

export default function ValueProposition() {
  const points: Point[] = [
    {
      number: "1",
      title: "Standardize",
      description:
        "PDF → Single schema (price / lead time / payment / penalty / compliance / risks)",
      color: "var(--primary)",
      icon: FiFileText,
    },
    {
      number: "2",
      title: "Prove",
      description:
        "Every field includes page number + quote. Click the 📄 button to see exactly where data came from.",
      color: "var(--success)",
      icon: FiCheckCircle,
    },
    {
      number: "3",
      title: "Track",
      description:
        "Results are written to Fabric audit ledger (full traceability with evidence and metadata).",
      color: "#8b5cf6",
      icon: FiLink,
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

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <ScrollReveal>
      <section
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
              textAlign: "center",
              marginBottom: "var(--spacing-2xl)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                marginBottom: "var(--spacing-md)",
                color: "var(--text-primary)",
              }}
            >
              What Makes Us Different
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "var(--text-muted)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Three core principles that set us apart
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{
              display: "grid",
              gap: "var(--spacing-lg)",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {points.map((point, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 4, transition: { duration: 0.3 } }}
                style={{
                  padding: "var(--spacing-xl)",
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-lg)",
                  borderLeft: `4px solid ${point.color}`,
                  display: "flex",
                  gap: "var(--spacing-lg)",
                  alignItems: "flex-start",
                  cursor: "pointer",
                }}
                onHoverStart={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  if (target) {
                    target.style.background = "var(--bg-card)";
                    target.style.boxShadow = "var(--shadow-md)";
                  }
                }}
                onHoverEnd={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  if (target) {
                    target.style.background = "var(--bg-secondary)";
                    target.style.boxShadow = "none";
                  }
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-lg)",
                    background: `${point.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <point.icon
                    style={{
                      fontSize: "1.25rem",
                      color: point.color,
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      marginBottom: "var(--spacing-xs)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {point.number}. {point.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-tertiary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {point.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  );
}
