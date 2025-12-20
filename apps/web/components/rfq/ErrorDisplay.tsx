"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          style={{
            padding: 12,
            background: "#7f1d1d",
            color: "#fca5a5",
            borderRadius: 8,
            marginBottom: 16,
            border: "1px solid #991b1b",
          }}
        >
          {error}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

