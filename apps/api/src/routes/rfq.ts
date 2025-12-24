/**
 * RFQ (Request for Quotation) Routes
 * Handles PDF upload, extraction, and analysis
 */

import { Router, type IRouter } from "express";
import multer from "multer";
import { extractOfferFromPDFPages } from "../ai/rfq-extraction";
import { extractPdfPages } from "../pdf/extractPages";
import { getFabric } from "../fabric/gateway";
import type { OfferExtracted } from "../ai/rfq-schema";
import {
  calculateFeasibilityScore,
  calculateBenchmarkPrice,
  type FeasibilityScoreResult,
} from "../ai/risk-scoring";

export const rfqRouter: IRouter = Router();

/**
 * Generate a meaningful RFQ audit ID from offer data
 */
function generateMeaningfulRFQId(offer: any): string {
  const parts: string[] = [];

  try {
    // Add vendor (first 2 words, max 15 chars)
    const vendor =
      typeof offer?.vendor === "object" && offer.vendor?.value
        ? offer.vendor.value
        : offer?.vendor || "";

    if (vendor && typeof vendor === "string") {
      const vendorWords = vendor.split(/\s+/).slice(0, 2);
      const vendorPart = vendorWords
        .join("-")
        .replace(/[^a-z0-9-]/gi, "")
        .toLowerCase()
        .substring(0, 15);
      if (vendorPart) parts.push(vendorPart);
    }

    // Add amount if available (rounded to thousands)
    const totalPrice =
      typeof offer?.totalPrice === "object" && offer.totalPrice?.value
        ? offer.totalPrice.value
        : offer?.totalPrice || 0;

    if (totalPrice && typeof totalPrice === "number" && !isNaN(totalPrice)) {
      const amountK = Math.round(totalPrice / 1000);
      if (amountK > 0) parts.push(`${amountK}k`);
    }
  } catch (e) {
    console.warn("Error generating meaningful RFQ ID, using fallback:", e);
  }

  // Add timestamp suffix to ensure uniqueness
  const timestamp = Date.now();

  // Combine parts
  if (parts.length > 0) {
    return `rfq-${parts.join("-")}-${timestamp}`;
  }

  // Fallback to simple timestamp
  return `rfq-${timestamp}`;
}

/**
 * Normalize extracted offer from new schema (value + evidence) to backward-compatible format
 * Converts { vendor: { value: "X", evidence: [...] } } to { vendor: "X", evidence: [...] }
 */
function normalizeExtractedOffer(extracted: OfferExtracted): any {
  const normalized: any = {
    vendor:
      typeof extracted.vendor === "object"
        ? extracted.vendor.value
        : extracted.vendor,
    redFlags:
      extracted.redFlags?.map((rf) =>
        typeof rf === "object" ? rf.flag : rf
      ) || [],
    evidence: [],
  };

  // Extract field values and collect evidence
  if (extracted.totalPrice) {
    if (typeof extracted.totalPrice === "object") {
      normalized.totalPrice = extracted.totalPrice.value;
      normalized.evidence.push(
        ...extracted.totalPrice.evidence.map((ev) => ({
          field: "totalPrice",
          page: ev.page,
          snippet: ev.quote,
          section: ev.section,
        }))
      );
    } else {
      normalized.totalPrice = extracted.totalPrice;
    }
  }

  if (extracted.currency) {
    if (typeof extracted.currency === "object") {
      normalized.currency = extracted.currency.value;
      normalized.evidence.push(
        ...extracted.currency.evidence.map((ev) => ({
          field: "currency",
          page: ev.page,
          snippet: ev.quote,
          section: ev.section,
        }))
      );
    } else {
      normalized.currency = extracted.currency;
    }
  }

  if (extracted.leadTimeDays) {
    if (typeof extracted.leadTimeDays === "object") {
      normalized.leadTimeDays = extracted.leadTimeDays.value;
      normalized.evidence.push(
        ...extracted.leadTimeDays.evidence.map((ev) => ({
          field: "leadTimeDays",
          page: ev.page,
          snippet: ev.quote,
          section: ev.section,
        }))
      );
    } else {
      normalized.leadTimeDays = extracted.leadTimeDays;
    }
  }

  if (extracted.paymentTermsDays) {
    if (typeof extracted.paymentTermsDays === "object") {
      normalized.paymentTermsDays = extracted.paymentTermsDays.value;
      normalized.evidence.push(
        ...extracted.paymentTermsDays.evidence.map((ev) => ({
          field: "paymentTermsDays",
          page: ev.page,
          snippet: ev.quote,
          section: ev.section,
        }))
      );
    } else {
      normalized.paymentTermsDays = extracted.paymentTermsDays;
    }
  }

  if (extracted.validityDays) {
    if (typeof extracted.validityDays === "object") {
      normalized.validityDays = extracted.validityDays.value;
      normalized.evidence.push(
        ...extracted.validityDays.evidence.map((ev) => ({
          field: "validityDays",
          page: ev.page,
          snippet: ev.quote,
          section: ev.section,
        }))
      );
    } else {
      normalized.validityDays = extracted.validityDays;
    }
  }

  // Vendor evidence
  if (typeof extracted.vendor === "object" && extracted.vendor.evidence) {
    normalized.evidence.push(
      ...extracted.vendor.evidence.map((ev) => ({
        field: "vendor",
        page: ev.page,
        snippet: ev.quote,
        section: ev.section,
      }))
    );
  }

  // Penalty clause
  if (extracted.penaltyClause) {
    normalized.penaltyClause = {
      exists: extracted.penaltyClause.exists,
      details: extracted.penaltyClause.details,
      capPercent: extracted.penaltyClause.capPercent,
    };
    if (extracted.penaltyClause.evidence) {
      normalized.evidence.push(
        ...extracted.penaltyClause.evidence.map((ev) => ({
          field: "penaltyClause",
          page: ev.page,
          snippet: ev.quote,
          section: ev.section,
        }))
      );
    }
  }

  // GDPR/KVKK
  if (extracted.kvkkGdpr) {
    normalized.kvkkGdpr = {
      exists: extracted.kvkkGdpr.exists,
      details: extracted.kvkkGdpr.details,
    };
    if (extracted.kvkkGdpr.evidence) {
      normalized.evidence.push(
        ...extracted.kvkkGdpr.evidence.map((ev) => ({
          field: "kvkkGdpr",
          page: ev.page,
          snippet: ev.quote,
          section: ev.section,
        }))
      );
    }
  }

  // Red flags with evidence
  if (extracted.redFlags) {
    extracted.redFlags.forEach((rf) => {
      if (typeof rf === "object" && rf.evidence) {
        normalized.evidence.push(
          ...rf.evidence.map((ev) => ({
            field: "redFlag",
            page: ev.page,
            snippet: ev.quote,
            section: ev.section,
          }))
        );
      }
    });
  }

  // Legacy evidence array (merge if exists)
  if (extracted.evidence && Array.isArray(extracted.evidence)) {
    normalized.evidence.push(...extracted.evidence);
  }

  return normalized;
}

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

/**
 * POST /rfq/upload
 * Upload PDF files and extract text page-by-page
 * multipart/form-data: files[] (max 3 files)
 */
rfqRouter.post("/upload", upload.array("files", 3), async (req, res) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];

    if (!files.length) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const documents = [];
    for (const file of files) {
      try {
        // Extract pages separately for evidence tracking
        const pages = await extractPdfPages(file.buffer);
        const combinedText = pages.map((p) => p.text).join("\n\n");

        documents.push({
          filename: file.originalname,
          pages: pages.map((p) => ({ page: p.page, text: p.text })),
          text: combinedText, // Combined text for backward compatibility
          pageCount: pages.length,
        });
      } catch (error: any) {
        console.error(`Error parsing PDF ${file.originalname}:`, error);
        return res.status(400).json({
          error: `Failed to parse PDF: ${file.originalname}`,
          message: error.message,
        });
      }
    }

    res.json({
      ok: true,
      documents: documents.map((d) => ({
        filename: d.filename,
        pageCount: d.pageCount,
        pages: d.pages, // Page-by-page text for evidence extraction
        textLength: d.text.length,
        text: d.text, // Combined text for backward compatibility
      })),
    });
  } catch (error: any) {
    console.error("RFQ upload error:", error);
    res.status(500).json({
      error: "Failed to process upload",
      message: error.message,
    });
  }
});

/**
 * POST /rfq/analyze
 * Analyze uploaded PDFs and extract normalized offer data
 * body: { documents: [{ filename, text }], weights?: { price?: number, feasibility?: number, speed?: number } }
 */
rfqRouter.post("/analyze", async (req, res) => {
  try {
    const { documents, weights } = req.body || {};

    console.log("RFQ analyze request:", {
      documentsCount: documents?.length,
      documents: documents?.map((d: any) => ({
        filename: d.filename,
        textLength: d.text?.length || 0,
      })),
      weights,
    });

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: "documents array is required" });
    }

    // Extract offers from each document using page-by-page extraction
    const offers = [];
    const extractedOffersMap = new Map<string, OfferExtracted>(); // Store original extracted format

    for (const doc of documents) {
      try {
        // Use page-by-page data if available, otherwise fall back to combined text
        let pages: Array<{ page: number; text: string }> = [];

        if (doc.pages && Array.isArray(doc.pages)) {
          // New format: page-by-page data
          pages = doc.pages;
        } else if (doc.text && doc.text.length > 0) {
          // Fallback: treat as single page
          pages = [{ page: 1, text: doc.text }];
        } else {
          console.warn(`No text in document: ${doc.filename}`);
          offers.push({
            filename: doc.filename,
            error: "No text content in document",
          });
          continue;
        }

        console.log(
          `Extracting offer from ${doc.filename} (${pages.length} pages)...`
        );
        const extracted = await extractOfferFromPDFPages(pages, doc.filename);

        // Store original extracted format for risk scoring
        extractedOffersMap.set(doc.filename, extracted);

        // Normalize extracted data for backward compatibility
        const normalized = normalizeExtractedOffer(extracted);

        // Validate that we have at least a vendor
        const vendorName = normalized.vendor || "Unknown Vendor";
        if (vendorName === "Unknown Vendor") {
          console.warn(
            `⚠️  No vendor extracted from ${doc.filename}, using filename as fallback`
          );
          normalized.vendor =
            doc.filename
              .replace(/\.(pdf|txt|md)$/i, "")
              .replace(/[_-]/g, " ") || "Unknown Vendor";
        }

        offers.push({
          filename: doc.filename,
          ...normalized,
        });
        console.log(`✅ Extracted from ${doc.filename}:`, {
          vendor: normalized.vendor,
          price: normalized.totalPrice,
          currency: normalized.currency,
          leadTime: normalized.leadTimeDays,
          redFlags: normalized.redFlags?.length || 0,
          evidenceCount: normalized.evidence?.length || 0,
        });
      } catch (error: any) {
        console.error(`Error extracting offer from ${doc.filename}:`, error);
        offers.push({
          filename: doc.filename,
          error: error.message,
        });
      }
    }

    // Calculate recommendation based on weights
    const defaultWeights = { price: 0.4, feasibility: 0.4, speed: 0.2 };
    const finalWeights = { ...defaultWeights, ...weights };

    // Filter out offers with errors, but log them for debugging
    const validOffers = offers.filter((o) => {
      if (o.error) {
        console.warn(
          `⚠️  Skipping offer with error: ${o.filename} - ${o.error}`
        );
        return false;
      }
      if (!o.vendor || o.vendor === "Unknown Vendor") {
        console.warn(`⚠️  Skipping offer without vendor: ${o.filename}`);
        return false;
      }
      return true;
    });

    if (validOffers.length === 0) {
      console.error(
        "❌ No valid offers extracted. All offers had errors or missing vendor."
      );
      console.error(
        "Offers received:",
        offers.map((o) => ({
          filename: o.filename,
          vendor: o.vendor,
          error: o.error,
        }))
      );
    }

    // Get original extracted offers for risk scoring
    const extractedOffers: OfferExtracted[] = validOffers
      .map((offer) => extractedOffersMap.get(offer.filename))
      .filter(
        (extracted): extracted is OfferExtracted => extracted !== undefined
      );

    // Calculate benchmark price for outlier detection
    const benchmarkPrice = calculateBenchmarkPrice(extractedOffers);

    // Calculate feasibility scores for all offers
    const feasibilityScoreResultsMap = new Map<
      string,
      FeasibilityScoreResult
    >();
    for (const extracted of extractedOffers) {
      // Find corresponding normalized offer to get filename
      const normalizedOffer = validOffers.find(
        (o) => extractedOffersMap.get(o.filename) === extracted
      );
      if (normalizedOffer) {
        const feasibilityScoreResult = calculateFeasibilityScore(
          extracted,
          benchmarkPrice
        );
        feasibilityScoreResultsMap.set(
          normalizedOffer.filename,
          feasibilityScoreResult
        );
      }
    }

    // Calculate other scores and combine
    const scoredOffers = validOffers
      .map((offer) => {
        // Price score (lower price = higher score)
        const priceScore = offer.totalPrice
          ? Math.max(
              0,
              Math.min(
                100,
                100 - ((offer.totalPrice - 14000) / (18000 - 14000)) * 100
              )
            )
          : 50;

        // Speed score (faster = higher score)
        const speedScore = offer.leadTimeDays
          ? Math.max(
              0,
              Math.min(100, 100 - ((offer.leadTimeDays - 10) / (25 - 10)) * 100)
            )
          : 50;

        // Feasibility score from new system (higher = more feasible/less risky)
        const feasibilityScoreResult = feasibilityScoreResultsMap.get(
          offer.filename
        );
        const feasibilityScore = feasibilityScoreResult?.feasibilityScore ?? 50; // 0-100, higher = more feasible

        const weightedScore =
          priceScore * finalWeights.price +
          feasibilityScore * finalWeights.feasibility +
          speedScore * finalWeights.speed;

        return {
          ...offer,
          scores: {
            price: Math.max(0, Math.min(100, priceScore)),
            feasibility: Math.max(0, Math.min(100, feasibilityScore)), // Feasibility score (higher = more feasible)
            speed: Math.max(0, Math.min(100, speedScore)),
            weighted: Math.max(0, Math.min(100, weightedScore)),
          },
          feasibilityScoreDetails: feasibilityScoreResult || undefined,
        };
      })
      .sort((a, b) => b.scores.weighted - a.scores.weighted);

    const recommendation = scoredOffers[0] || null;

    res.json({
      ok: true,
      offers: scoredOffers,
      recommendation,
      weights: finalWeights,
    });
  } catch (error: any) {
    console.error("RFQ analyze error:", error);
    res.status(500).json({
      error: "Failed to analyze offers",
      message: error.message,
    });
  }
});

/**
 * POST /rfq/store
 * Store analyzed offer to Fabric ledger with evidence and metadata
 * body: { offer: OfferExtracted, analysisId?: string }
 */
rfqRouter.post("/store", async (req, res) => {
  try {
    const { offer, analysisId } = req.body || {};

    if (!offer) {
      return res.status(400).json({ error: "offer is required" });
    }

    const finalId = analysisId || generateMeaningfulRFQId(offer);

    // Prepare audit payload with evidence and metadata
    const auditPayload = {
      type: "rfq_offer",
      ...offer,
      analyzedAt: new Date().toISOString(),
      // Include evidence for audit trail
      evidence: offer.evidence || [],
      // Metadata for traceability
      metadata: {
        model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp",
        extractionMethod: "page-by-page",
        evidenceCount: offer.evidence?.length || 0,
        fieldsWithEvidence: offer.evidence
          ? Array.from(
              new Set(offer.evidence.map((e: { field: string }) => e.field))
            )
          : [],
        timestamp: new Date().toISOString(),
      },
    };

    // Store in Fabric
    const { contract } = await getFabric();
    const resultBytes = await contract.submitTransaction(
      "CreateAuditRecord",
      finalId,
      JSON.stringify(auditPayload)
    );

    const onChain = JSON.parse(Buffer.from(resultBytes).toString("utf8"));

    console.log(
      `✅ Stored RFQ offer to Fabric: ${finalId} with ${auditPayload.metadata.evidenceCount} evidence items`
    );

    res.status(201).json({
      id: finalId,
      offer,
      onChain,
      metadata: auditPayload.metadata,
    });
  } catch (error: any) {
    console.error("RFQ store error:", error);
    res.status(500).json({
      error: "Failed to store offer",
      message: error.message,
    });
  }
});
