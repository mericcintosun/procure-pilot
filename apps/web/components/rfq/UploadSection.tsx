"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Document } from "./types";

interface UploadSectionProps {
  files: File[];
  setFiles: (files: File[]) => void;
  uploadedDocs: Document[];
  loading: boolean;
  onUpload: () => Promise<void>;
  onAnalyze: () => Promise<void>;
}

export function UploadSection({
  files,
  setFiles,
  uploadedDocs,
  loading,
  onUpload,
  onAnalyze,
}: UploadSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 32, padding: 16, border: "1px solid #374151", borderRadius: 8, background: "#1f2937" }}
    >
      <h2 style={{ color: "#f9fafb", marginTop: 0 }}>1. Upload PDFs (Max 3)</h2>
      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
        style={{ marginBottom: 12, color: "#f9fafb" }}
      />
      {files.length > 0 && (
        <div style={{ marginBottom: 12, fontSize: 14, color: "#9ca3af" }}>
          Selected: {files.map((f) => f.name).join(", ")}
        </div>
      )}
      <motion.button
        onClick={onUpload}
        disabled={loading || files.length === 0}
        whileHover={!loading && files.length > 0 ? { scale: 1.02 } : {}}
        whileTap={!loading && files.length > 0 ? { scale: 0.98 } : {}}
        style={{
          padding: "8px 16px",
          background: loading || files.length === 0 ? "#4b5563" : "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: loading || files.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Uploading..." : "Upload PDFs"}
      </motion.button>

      {uploadedDocs.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 8 }}>
            ✅ Uploaded: {uploadedDocs.length} document(s)
            {uploadedDocs.map((doc, i) => (
              <div key={i} style={{ fontSize: 12, marginTop: 4, color: doc.text ? "#34d399" : "#f87171" }}>
                • {doc.filename} ({doc.text ? `${doc.text.length} chars` : "⚠️ no text"})
              </div>
            ))}
          </div>
          <motion.button
            onClick={onAnalyze}
            disabled={loading || uploadedDocs.every((d) => !d.text || d.text.length === 0)}
            whileHover={!loading && !uploadedDocs.every((d) => !d.text || d.text.length === 0) ? { scale: 1.02 } : {}}
            whileTap={!loading && !uploadedDocs.every((d) => !d.text || d.text.length === 0) ? { scale: 0.98 } : {}}
            style={{
              padding: "8px 16px",
              background: loading || uploadedDocs.every((d) => !d.text || d.text.length === 0) ? "#4b5563" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: loading || uploadedDocs.every((d) => !d.text || d.text.length === 0) ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Analyzing..." : "Analyze Offers"}
          </motion.button>
          {uploadedDocs.every((d) => !d.text || d.text.length === 0) && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#f87171" }}>
              ⚠️ No text extracted. Please re-upload PDF files.
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

