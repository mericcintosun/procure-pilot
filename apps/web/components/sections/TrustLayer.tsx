"use client";

import { motion } from "framer-motion";
import { FiSearch, FiUser, FiLink } from "react-icons/fi";
import ScrollReveal from "../ui/ScrollReveal";

interface Feature {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  title: string;
  description: string;
  color: string;
}

export default function TrustLayer() {
  const features: Feature[] = [
    {
      icon: FiSearch,
      title: "Evidence-First AI",
      description:
        'Not just "AI recommended this." Every field shows the exact page number and verbatim quote from the source PDF.',
      color: "var(--primary)",
    },
    {
      icon: FiUser,
      title: "Human-in-the-Loop",
      description:
        "Adjustable weights let you prioritize what matters. You make the final decision, AI provides the analysis.",
      color: "var(--success)",
    },
    {
      icon: FiLink,
      title: "Audit on Fabric",
      description:
        "Decisions are stored on Hyperledger Fabric blockchain for immutable audit trails and compliance.",
      color: "var(--info)",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
          background:
            "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
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
              Why Trust ProcurePilot?
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "var(--text-muted)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Built for transparency, control, and compliance
            </p>
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
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                style={{
                  padding: "var(--spacing-xl)",
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-lg)",
                  background: `${feature.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "var(--spacing-lg)",
                }}
              >
                <feature.icon
                  style={{
                    fontSize: "1.25rem",
                    color: feature.color,
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "var(--spacing-sm)",
                  color: "var(--text-primary)",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: "var(--text-tertiary)",
                  lineHeight: 1.7,
                }}
              >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  );
}

