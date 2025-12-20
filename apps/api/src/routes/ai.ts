import { Router, type IRouter } from "express";
import { extractAuditFromText } from "../ai/gemini";
import { getFabric } from "../fabric/gateway";

export const aiRouter: IRouter = Router();

/**
 * Generate a meaningful audit ID from extracted data
 */
function generateMeaningfulAuditId(extracted: any): string {
  const parts: string[] = [];
  
  try {
    // Add type
    if (extracted?.type && typeof extracted.type === 'string') {
      const typePart = extracted.type.replace(/[^a-z0-9]/gi, '').toLowerCase().substring(0, 10);
      if (typePart) parts.push(typePart);
    }
    
    // Add vendor (first 2 words, max 15 chars)
    if (extracted?.vendor && typeof extracted.vendor === 'string') {
      const vendorWords = extracted.vendor.split(/\s+/).slice(0, 2);
      const vendorPart = vendorWords.join('-').replace(/[^a-z0-9-]/gi, '').toLowerCase().substring(0, 15);
      if (vendorPart) parts.push(vendorPart);
    }
    
    // Add date (YYYY-MM-DD format, or just year-month if available)
    if (extracted?.date) {
      try {
        const dateStr = String(extracted.date);
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const isoDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
          parts.push(isoDate);
        }
      } catch (e) {
        // Ignore date parsing errors
      }
    }
  } catch (e) {
    console.warn("Error generating meaningful audit ID, using fallback:", e);
  }
  
  // Add timestamp suffix to ensure uniqueness
  const timestamp = Date.now();
  
  // Combine parts
  if (parts.length > 0) {
    return `audit-${parts.join('-')}-${timestamp}`;
  }
  
  // Fallback to simple timestamp
  return `audit-${timestamp}`;
}

/**
 * POST /ai/audits
 * body: { auditId?: string, text: string }
 * -> Gemini extract -> Fabric CreateAuditRecord
 */
aiRouter.post("/audits", async (req, res) => {
  try {
    const { auditId, text } = req.body ?? {};
    if (!text) {
      return res.status(400).json({ error: "text is required" });
    }

    // Gemini ile structured extraction
    let extracted = await extractAuditFromText(text);

    // Normalize date to ISO format (post-processing)
    if (extracted.date) {
      try {
        const date = new Date(extracted.date);
        if (!isNaN(date.getTime())) {
          extracted.date = date.toISOString().split('T')[0];
        }
      } catch (e) {
        // Keep original if normalization fails
      }
    }

    // Generate meaningful audit ID if not provided
    const finalId = auditId || generateMeaningfulAuditId(extracted);

    // Fabric chaincode CreateAuditRecord(ctx, auditId, recordData)
    const { contract } = await getFabric();
    const payload = JSON.stringify(extracted);
    const resultBytes = await contract.submitTransaction(
      "CreateAuditRecord",
      finalId,
      payload
    );

    const onChain = JSON.parse(Buffer.from(resultBytes).toString("utf8"));

    return res.status(201).json({
      id: finalId,
      extracted,
      onChain,
    });
  } catch (error: any) {
    console.error("AI route error:", error);
    
    // Special handling for quota errors
    if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("rate limit")) {
      return res.status(429).json({
        error: "API quota exceeded",
        message: "Daily API request limit reached. Please try again tomorrow or upgrade your plan.",
        fallback: true,
      });
    }
    
    return res.status(500).json({
      error: error.message || "AI extraction failed",
    });
  }
});

