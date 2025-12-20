"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import Button from "../ui/Button";
import Logo from "../ui/Logo";

export default function Hero() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("how-it-works");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        padding: "var(--spacing-3xl) var(--spacing-lg)",
        textAlign: "center",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)",
        color: "white",
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
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-md)",
            marginBottom: "var(--spacing-lg)",
          }}
        >
          <Logo showText={false} style={{ height: "100px", width: "auto" }} />
          <div
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: 600,
              backdropFilter: "blur(10px)",
            }}
          >
            Evidence-First Procurement AI
          </div>
        </motion.div>
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            marginBottom: "var(--spacing-lg)",
            lineHeight: 1.1,
            color: "white",
          }}
        >
          Compare vendor offers.
          <br />
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              background: "linear-gradient(120deg, #04d6ff 0%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
          >
            With evidence.
          </motion.span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            maxWidth: "700px",
            margin: "0 auto var(--spacing-2xl)",
            lineHeight: 1.7,
            opacity: 0.95,
            color: "white",
          }}
        >
          Upload up to 3 quotation PDFs. Get a weighted recommendation with
          page-level proof. Store an immutable audit record on Hyperledger
          Fabric.
        </motion.p>
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              href="/rfq"
              variant="outline"
              size="lg"
              icon={<FiArrowRight />}
            >
              Open Workspace
            </Button>
          </motion.div>
          <motion.button
            onClick={scrollToFeatures}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "1rem 2rem",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              borderRadius: "var(--radius-lg)",
              fontWeight: 600,
              fontSize: "1rem",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backdropFilter: "blur(10px)",
              cursor: "pointer",
            }}
          >
            Learn More
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FiChevronDown />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}

