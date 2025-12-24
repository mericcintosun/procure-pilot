"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Weights, WeightPreset, WEIGHT_PRESETS } from "./types";

interface WeightAdjustmentProps {
  weights: Weights;
  setWeights: (weights: Weights) => void;
  loading: boolean;
  onRescore: (weights: Weights) => void;
}

function normalizeWeights(w: Weights): Weights {
  const total = w.price + w.feasibility + w.speed;
  if (total === 0) return { price: 0.33, feasibility: 0.33, speed: 0.34 };
  return {
    price: w.price / total,
    feasibility: w.feasibility / total,
    speed: w.speed / total,
  };
}

export function WeightAdjustment({ weights, setWeights, loading, onRescore }: WeightAdjustmentProps) {
  const [preset, setPreset] = useState<WeightPreset>("custom");
  const [localWeights, setLocalWeights] = useState<Weights>(weights);

  useEffect(() => {
    setLocalWeights(weights);
  }, [weights]);

  const handlePresetChange = (newPreset: WeightPreset) => {
    setPreset(newPreset);
    if (newPreset !== "custom") {
      const presetWeights = WEIGHT_PRESETS[newPreset];
      setLocalWeights(presetWeights);
      setWeights(presetWeights);
      onRescore(presetWeights);
    } else {
      setLocalWeights(weights);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        marginBottom: 32,
        padding: "clamp(16px, 4vw, 24px)",
        border: "1px solid #374151",
        borderRadius: 12,
        background: "#1f2937",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ color: "#f9fafb", marginTop: 0, marginBottom: 8, fontSize: "clamp(18px, 4vw, 20px)", fontWeight: 600 }}
      >
        Adjust Scoring Weights
      </motion.h2>
      <p style={{ color: "#9ca3af", marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
        Customize how offers are ranked by adjusting the importance of price, feasibility, and delivery speed.
      </p>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => handlePresetChange("cost-first")}
            style={{
              padding: "8px 16px",
              background: preset === "cost-first" ? "#3b82f6" : "#374151",
              color: preset === "cost-first" ? "white" : "#d1d5db",
              border: "1px solid #4b5563",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Cost-first
          </button>
          <button
            onClick={() => handlePresetChange("feasibility-first")}
            style={{
              padding: "8px 16px",
              background: preset === "feasibility-first" ? "#3b82f6" : "#374151",
              color: preset === "feasibility-first" ? "white" : "#d1d5db",
              border: "1px solid #4b5563",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Feasibility-first
          </button>
          <button
            onClick={() => handlePresetChange("speed-first")}
            style={{
              padding: "8px 16px",
              background: preset === "speed-first" ? "#3b82f6" : "#374151",
              color: preset === "speed-first" ? "white" : "#d1d5db",
              border: "1px solid #4b5563",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Speed-first
          </button>
          <button
            onClick={() => handlePresetChange("custom")}
            style={{
              padding: "8px 16px",
              background: preset === "custom" ? "#3b82f6" : "#374151",
              color: preset === "custom" ? "white" : "#d1d5db",
              border: "1px solid #4b5563",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Custom
          </button>
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af" }}>
          Total: {(localWeights.price + localWeights.feasibility + localWeights.speed).toFixed(2)} (auto-normalized to 1.0)
        </div>
      </div>

      {preset === "custom" ? (
        <div style={{ display: "grid", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 4, color: "#f9fafb" }}>
              Price Weight: {localWeights.price.toFixed(2)} ({Math.round(localWeights.price * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={localWeights.price}
              onChange={(e) => {
                const price = parseFloat(e.target.value);
                const remaining = 1 - price;
                const feasibility = (remaining * localWeights.feasibility) / (localWeights.feasibility + localWeights.speed || 1);
                const speed = remaining - feasibility;
                const newWeights = normalizeWeights({ price, feasibility, speed });
                setLocalWeights(newWeights);
                setWeights(newWeights);
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 4, color: "#f9fafb" }}>
              Feasibility Weight: {localWeights.feasibility.toFixed(2)} ({Math.round(localWeights.feasibility * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={localWeights.feasibility}
              onChange={(e) => {
                const feasibility = parseFloat(e.target.value);
                const remaining = 1 - feasibility;
                const price = (remaining * localWeights.price) / (localWeights.price + localWeights.speed || 1);
                const speed = remaining - price;
                const newWeights = normalizeWeights({ price, feasibility, speed });
                setLocalWeights(newWeights);
                setWeights(newWeights);
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 4, color: "#f9fafb" }}>
              Speed Weight: {localWeights.speed.toFixed(2)} ({Math.round(localWeights.speed * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={localWeights.speed}
              onChange={(e) => {
                const speed = parseFloat(e.target.value);
                const remaining = 1 - speed;
                const price = (remaining * localWeights.price) / (localWeights.price + localWeights.feasibility || 1);
                const feasibility = remaining - price;
                const newWeights = normalizeWeights({ price, feasibility, speed });
                setLocalWeights(newWeights);
                setWeights(newWeights);
              }}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      ) : (
        <div style={{ padding: 12, background: "#374151", borderRadius: 6, marginBottom: 12 }}>
          <div style={{ fontSize: 14, color: "#d1d5db" }}>
            <strong>Current weights:</strong> Price {Math.round(localWeights.price * 100)}% / Feasibility {Math.round(localWeights.feasibility * 100)}% / Speed {Math.round(localWeights.speed * 100)}%
          </div>
        </div>
      )}

      <motion.button
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        onClick={() => {
          const normalized = normalizeWeights(localWeights);
          onRescore(normalized);
        }}
        disabled={loading}
        style={{
          padding: "8px 16px",
          background: loading ? "#4b5563" : "#10b981",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 500,
        }}
      >
        {loading ? "Updating..." : "Update Recommendation"}
      </motion.button>
    </motion.div>
  );
}
