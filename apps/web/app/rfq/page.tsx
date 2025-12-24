"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { showToast } from "@/components/ui/Toast";
import {
  Document,
  Offer,
  Weights,
  EvidenceState,
  ErrorDisplay,
  DragDropUpload,
  WeightAdjustment,
  ComparisonTable,
  EvidenceModal,
  EvidenceSection,
  WizardProgress,
  TrustBadge,
  Breadcrumb,
} from "@/components/rfq";
import Logo from "@/components/ui/Logo";

export default function RFQPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [recommendation, setRecommendation] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weights, setWeights] = useState<Weights>({
    price: 0.4,
    feasibility: 0.4,
    speed: 0.2,
  });
  const [showEvidence, setShowEvidence] = useState<EvidenceState | null>(null);

  const currentStep = useMemo(() => {
    if (offers.length > 0) return 3;
    if (uploadedDocs.length > 0) return 2;
    return 1;
  }, [offers.length, uploadedDocs.length]);

  async function handleUpload() {
    if (files.length === 0) {
      setError("Please select at least one PDF file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const r = await fetch("/api/rfq/upload", {
        method: "POST",
        body: formData,
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Upload failed");

      setUploadedDocs(data.documents || []);
      setFiles([]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    if (uploadedDocs.length === 0) {
      setError("Please upload PDFs first");
      return;
    }

    const docsWithText = uploadedDocs.filter(
      (doc) => doc.text && doc.text.length > 0
    );
    if (docsWithText.length === 0) {
      setError("No text extracted from PDFs. Please re-upload.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const documents = docsWithText.map((doc) => ({
        filename: doc.filename,
        text: doc.text || "",
      }));

      const r = await fetch("/api/rfq/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents, weights }),
      });

      const data = await r.json();

      if (!r.ok) {
        const errorMsg = data.error || data.message || "Analysis failed";
        console.error("Analysis error:", errorMsg, data);
        throw new Error(errorMsg);
      }

      const offersWithScores = (data.offers || []).map((offer: Offer) => ({
        ...offer,
        scores: calculateScore(offer, weights),
      }));

      const sortedOffers = [...offersWithScores].sort(
        (a, b) => (b.scores?.weighted || 0) - (a.scores?.weighted || 0)
      );

      setOffers(sortedOffers);
      setRecommendation(sortedOffers[0] || null);
    } catch (e: any) {
      console.error("Analyze error:", e);
      setError(e.message || "Analysis failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  function calculateScore(
    offer: Offer,
    weights: Weights
  ): { price: number; feasibility: number; speed: number; weighted: number } {
    const priceScore = offer.totalPrice
      ? Math.max(
          0,
          Math.min(
            100,
            100 - ((offer.totalPrice - 14000) / (18000 - 14000)) * 100
          )
        )
      : 50;

    // Use new feasibility scoring system if available, otherwise fallback to old calculation
    const feasibilityScore = offer.feasibilityScoreDetails
      ? offer.feasibilityScoreDetails.feasibilityScore // 0-100, higher = more feasible
      : Math.max(0, Math.min(100, 100 - (offer.redFlags?.length || 0) * 20));

    const speedScore = offer.leadTimeDays
      ? Math.max(
          0,
          Math.min(100, 100 - ((offer.leadTimeDays - 10) / (25 - 10)) * 100)
        )
      : 50;

    // Feasibility score is already in the correct direction (higher = better)
    const weightedScore =
      priceScore * weights.price +
      feasibilityScore * weights.feasibility +
      speedScore * weights.speed;

    return {
      price: Math.max(0, Math.min(100, priceScore)),
      feasibility: Math.max(0, Math.min(100, feasibilityScore)), // Feasibility score (higher = more feasible)
      speed: Math.max(0, Math.min(100, speedScore)),
      weighted: Math.max(0, Math.min(100, weightedScore)),
    };
  }

  const handleRescore = useCallback((newWeights: Weights) => {
    // Use a ref-like pattern to capture the new recommendation
    let newRecommendation: Offer | null = null;

    setOffers((currentOffers) => {
      if (currentOffers.length === 0) {
        setWeights(newWeights);
        return currentOffers;
      }

      const rescoredOffers = currentOffers.map((offer) => ({
        ...offer,
        scores: calculateScore(offer, newWeights),
      }));

      const sortedOffers = [...rescoredOffers].sort(
        (a, b) => (b.scores?.weighted || 0) - (a.scores?.weighted || 0)
      );

      // Capture the new recommendation
      newRecommendation = sortedOffers[0] || null;

      return sortedOffers;
    });

    // Update weights and recommendation outside the callback
    setWeights(newWeights);
    setRecommendation(newRecommendation);
  }, []);

  async function handleStore(offer: Offer) {
    if (!offer.vendor) {
      setError("Cannot store offer without vendor");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const r = await fetch("/api/rfq/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Store failed");

      showToast(`Offer stored to ledger: ${data.id}`, "success");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: "32px 24px",
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
        color: "#f9fafb",
      }}
    >
      <Breadcrumb />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          marginBottom: 32,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--spacing-xl)",
          alignItems: "center",
        }}
        className="rfq-header-grid"
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            order: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-md)",
              marginBottom: 8,
            }}
          >
          <Logo showText={false} style={{ height: "40px", width: "auto" }} />
            <h1
              style={{
                margin: 0,
                color: "#f9fafb",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              RFQ Workspace
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            style={{
              margin: 0,
              color: "#9ca3af",
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            Compare up to 3 vendor offers with AI-powered analysis and audit
            trail
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          whileHover={{ scale: 1.05, rotate: 1 }}
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
              src="/images/illustrations/maskot3.png"
              alt="RFQ Workspace"
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

      <WizardProgress
        currentStep={currentStep}
        step1Complete={uploadedDocs.length > 0}
        step2Complete={offers.length > 0}
      />

      <ErrorDisplay error={error} />

      {currentStep === 1 && <TrustBadge />}

      <DragDropUpload
        files={files}
        setFiles={setFiles}
        uploadedDocs={uploadedDocs}
        loading={loading}
        onUpload={handleUpload}
        onAnalyze={handleAnalyze}
      />

      {offers.length > 0 && (
        <WeightAdjustment
          weights={weights}
          setWeights={setWeights}
          loading={loading}
          onRescore={handleRescore}
        />
      )}

      <ComparisonTable
        offers={offers}
        recommendation={recommendation}
        loading={loading}
        showEvidence={showEvidence}
        setShowEvidence={setShowEvidence}
        onStore={handleStore}
      />

      {showEvidence && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              zIndex: 999,
            }}
            onClick={() => setShowEvidence(null)}
          />
          <EvidenceModal
            showEvidence={showEvidence}
            offers={offers}
            onClose={() => setShowEvidence(null)}
          />
        </>
      )}

      {offers.length > 0 && <EvidenceSection offers={offers} />}
    </motion.div>
  );
}
