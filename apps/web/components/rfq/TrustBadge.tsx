"use client";

import { motion } from "framer-motion";
import Logo from "../ui/Logo";

export function TrustBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      style={{
        padding: 20,
        background: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
        borderRadius: 12,
        border: "1px solid #10b981",
        marginBottom: 32,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <Logo showText={false} style={{ height: "40px", width: "auto" }} />
        <h3 style={{ margin: 0, color: "#d1fae5", fontSize: 16, fontWeight: 600 }}>Secure Processing</h3>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ color: "#34d399", fontSize: 16, marginTop: 2 }}>✓</div>
          <div style={{ color: "#d1fae5", fontSize: 13, lineHeight: 1.6 }}>
            Files are used only for analysis and evidence extraction
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ color: "#34d399", fontSize: 16, marginTop: 2 }}>✓</div>
          <div style={{ color: "#d1fae5", fontSize: 13, lineHeight: 1.6 }}>
            Evidence extracted with page-level references for audit trail
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ color: "#34d399", fontSize: 16, marginTop: 2 }}>✓</div>
          <div style={{ color: "#d1fae5", fontSize: 13, lineHeight: 1.6 }}>
            Final decision stored as immutable audit record on Hyperledger Fabric
          </div>
        </div>
      </div>
    </motion.div>
  );
}

