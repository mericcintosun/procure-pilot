"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "../ui/ScrollReveal";

export default function Problem() {
  return (
    <ScrollReveal>
      <section
        style={{
          padding: "var(--spacing-3xl) var(--spacing-lg)",
          background: "var(--gray-50)",
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
            }}
            className="problem-grid"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                order: 2,
              }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  marginBottom: "var(--spacing-lg)",
                  color: "var(--text-primary)",
                  textAlign: "center",
                }}
              >
                The Problem
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.125rem)",
                  color: "var(--text-tertiary)",
                  lineHeight: 1.8,
                  textAlign: "center",
                }}
              >
                PDFs are scattered, everyone uses different formats, decision
                rationale gets lost, and auditing is difficult. Procurement teams
                waste hours manually comparing vendor quotes, with no way to verify
                where numbers came from or maintain an audit trail of decisions.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                order: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                zIndex: 0,
              }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/images/illustrations/maskot1.png"
                  alt="Procurement Problem"
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
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  );
}

