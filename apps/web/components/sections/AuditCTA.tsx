"use client";

import { motion } from "framer-motion";
import { FiPlus, FiFile } from "react-icons/fi";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

export default function AuditCTA() {
  return (
    <ScrollReveal>
      <section
        style={{
          padding: "var(--spacing-3xl) var(--spacing-lg)",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            fontWeight: 600,
            marginBottom: "var(--spacing-lg)",
            backdropFilter: "blur(10px)",
          }}
        >
          AI-Powered Audit Creation
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            marginBottom: "var(--spacing-lg)",
            color: "white",
          }}
        >
          Create Audit Records with AI
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.125rem)",
            marginBottom: "var(--spacing-2xl)",
            opacity: 0.95,
            maxWidth: "600px",
            margin: "0 auto var(--spacing-2xl)",
            lineHeight: 1.7,
          }}
        >
          Extract structured audit data from unstructured text. Get AI-powered
          risk analysis and store immutable records on Hyperledger Fabric.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              href="/audits/new"
              variant="outline"
              size="lg"
              icon={<FiPlus />}
            >
              Create Audit
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button href="/audits" variant="secondary" size="lg" icon={<FiFile />}>
              View Audits
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
    </ScrollReveal>
  );
}

