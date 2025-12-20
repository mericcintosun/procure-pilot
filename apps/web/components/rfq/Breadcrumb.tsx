"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Breadcrumb() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 24,
        fontSize: 14,
      }}
    >
      <Link
        href="/"
        style={{
          color: "#9ca3af",
          textDecoration: "none",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#60a5fa";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#9ca3af";
        }}
      >
        Home
      </Link>
      <span style={{ color: "#4b5563" }}>/</span>
      <span style={{ color: "#f9fafb", fontWeight: 500 }}>RFQ Workspace</span>
    </motion.nav>
  );
}

