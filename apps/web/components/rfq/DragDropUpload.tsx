"use client";

import { useState, useRef, DragEvent } from "react";
import { motion } from "framer-motion";
import { Document } from "./types";

interface DragDropUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
  uploadedDocs: Document[];
  loading: boolean;
  onUpload: () => Promise<void>;
  onAnalyze: () => Promise<void>;
}

export function DragDropUpload({
  files,
  setFiles,
  uploadedDocs,
  loading,
  onUpload,
  onAnalyze,
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
    if (droppedFiles.length > 0) {
      const newFiles = [...files, ...droppedFiles].slice(0, 3);
      setFiles(newFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter((f) => f.type === "application/pdf");
    if (selectedFiles.length > 0) {
      const newFiles = [...files, ...selectedFiles].slice(0, 3);
      setFiles(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 32 }}
    >
      <motion.div
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          padding: 24,
          background: "#1f2937",
          borderRadius: 12,
          border: isDragging ? "2px dashed #3b82f6" : "1px solid #374151",
          boxShadow: isDragging
            ? "0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.3)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          transition: "all 0.2s ease",
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ color: "#f9fafb", marginTop: 0, marginBottom: 16, fontSize: 20, fontWeight: 600 }}
        >
          Upload Vendor Offers
        </motion.h2>
        <p style={{ color: "#9ca3af", marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
          Upload up to 3 vendor quotation PDFs to compare pricing, terms, and compliance. Files are processed securely
          with page-level evidence extraction.
        </p>

        {files.length === 0 && uploadedDocs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            style={{
              padding: 48,
              border: "2px dashed #4b5563",
              borderRadius: 8,
              textAlign: "center",
              background: isDragging ? "rgba(59, 130, 246, 0.05)" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#4b5563";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <div style={{ color: "#f9fafb", fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              Drop up to 3 PDF files here
            </div>
            <div style={{ color: "#9ca3af", fontSize: 14 }}>or click to browse</div>
            <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
              Accepted: Vendor quotations, RFQ offers
            </div>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={{
                  padding: 16,
                  background: "#374151",
                  borderRadius: 8,
                  border: "1px solid #4b5563",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <div style={{ fontSize: 24 }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#f9fafb", fontSize: 14, fontWeight: 500 }}>{file.name}</div>
                    <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  style={{
                    padding: "6px 12px",
                    background: "#7f1d1d",
                    color: "#fca5a5",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#991b1b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#7f1d1d";
                  }}
                >
                  Remove
                </button>
              </motion.div>
            ))}

            {uploadedDocs.map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={{
                  padding: 16,
                  background: "#065f46",
                  borderRadius: 8,
                  border: "1px solid #10b981",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 24 }}>✓</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#d1fae5", fontSize: 14, fontWeight: 500 }}>{doc.filename}</div>
                  <div style={{ color: "#6ee7b7", fontSize: 12, marginTop: 2 }}>
                    {doc.text ? `${doc.text.length.toLocaleString()} chars extracted` : "⚠️ No text extracted"}
                  </div>
                </div>
              </motion.div>
            ))}

            {files.length < 3 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: "12px 24px",
                  background: "#374151",
                  color: "#d1d5db",
                  border: "1px solid #4b5563",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#4b5563";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#374151";
                }}
              >
                + Add More Files ({files.length}/3)
              </motion.button>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <motion.button
            whileHover={{ scale: loading || files.length === 0 ? 1 : 1.02 }}
            whileTap={{ scale: loading || files.length === 0 ? 1 : 0.98 }}
            onClick={onUpload}
            disabled={loading || files.length === 0}
            style={{
              padding: "12px 24px",
              background: loading || files.length === 0 ? "#4b5563" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: loading || files.length === 0 ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              boxShadow: loading || files.length === 0 ? "none" : "0 2px 4px rgba(59, 130, 246, 0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading && files.length > 0) {
                e.currentTarget.style.background = "#2563eb";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(59, 130, 246, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && files.length > 0) {
                e.currentTarget.style.background = "#3b82f6";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.3)";
              }
            }}
          >
            {loading ? "Uploading..." : "Upload & Extract Text"}
          </motion.button>

          {uploadedDocs.length > 0 && (
            <motion.button
              whileHover={{ scale: loading || uploadedDocs.every((d) => !d.text || d.text.length === 0) ? 1 : 1.02 }}
              whileTap={{ scale: loading || uploadedDocs.every((d) => !d.text || d.text.length === 0) ? 1 : 0.98 }}
              onClick={onAnalyze}
              disabled={loading || uploadedDocs.every((d) => !d.text || d.text.length === 0)}
              style={{
                padding: "12px 24px",
                background:
                  loading || uploadedDocs.every((d) => !d.text || d.text.length === 0) ? "#4b5563" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: loading || uploadedDocs.every((d) => !d.text || d.text.length === 0) ? "not-allowed" : "pointer",
                fontSize: 14,
                fontWeight: 600,
                boxShadow:
                  loading || uploadedDocs.every((d) => !d.text || d.text.length === 0)
                    ? "none"
                    : "0 2px 4px rgba(16, 185, 129, 0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading && !uploadedDocs.every((d) => !d.text || d.text.length === 0)) {
                  e.currentTarget.style.background = "#059669";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(16, 185, 129, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !uploadedDocs.every((d) => !d.text || d.text.length === 0)) {
                  e.currentTarget.style.background = "#10b981";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(16, 185, 129, 0.3)";
                }
              }}
            >
              {loading ? "Analyzing..." : "Analyze Offers"}
            </motion.button>
          )}
        </div>

        {uploadedDocs.every((d) => !d.text || d.text.length === 0) && uploadedDocs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: 16,
              padding: 12,
              background: "#7f1d1d",
              borderRadius: 8,
              border: "1px solid #991b1b",
            }}
          >
            <div style={{ fontSize: 12, color: "#fca5a5" }}>
              ⚠️ No text extracted from PDFs. Please re-upload PDF files or check file format.
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

