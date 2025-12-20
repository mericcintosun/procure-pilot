import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as crypto from "crypto";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Rate limiting disabled - using gemini-2.5-flash-lite which has higher quotas
// Rate limit checks removed to allow unlimited requests

export function checkRateLimit(): { allowed: boolean; resetIn?: number } {
  // Always allow - rate limiting disabled
  return { allowed: true };
}

export function incrementRateLimit(): void {
  // No-op - rate limiting disabled
}

// Cache functions removed - caching disabled

/**
 * Normalize date string to ISO format (YYYY-MM-DD)
 * Handles various date formats: "March 10, 2025", "2025-03-10", "10/03/2025", etc.
 */
function normalizeDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;

  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      // Convert to ISO format (YYYY-MM-DD)
      return date.toISOString().split("T")[0];
    }
  } catch (e) {
    // If parsing fails, return original
  }

  return dateStr;
}

export const AuditSchema = z.object({
  type: z.string().describe("Record type. ex: invoice, delivery, contract"),
  amount: z.number().optional().describe("Monetary amount if present"),
  currency: z.string().optional().describe("Currency code if present"),
  vendor: z.string().optional().describe("Vendor/company name if present"),
  date: z.string().optional().describe("ISO date if present"),
  notes: z.string().optional().describe("Short free-text notes"),
  riskFlags: z
    .array(z.string())
    .default([])
    .describe("Any risk/compliance flags"),
});

export type AuditExtracted = z.infer<typeof AuditSchema>;

// AI Analysis Schema
export const AuditAnalysisSchema = z.object({
  summary: z
    .string()
    .describe("Brief summary of the audit record (2-3 sentences)"),
  riskScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Feasibility score from 0 (not feasible) to 100 (highly feasible). Calculated as inverse of risk factors."
    ),
  reasons: z
    .array(z.string())
    .describe("List of specific reasons for the feasibility score"),
  suggestedNextSteps: z
    .array(z.string())
    .describe("Recommended actions to take"),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe("AI confidence level in the analysis"),
  policyFlags: z
    .array(z.string())
    .optional()
    .describe("Any policy compliance flags"),
});

export type AuditAnalysis = z.infer<typeof AuditAnalysisSchema>;

// Responsible AI Metadata
export interface AnalysisMetadata {
  model: string;
  promptVersion: string;
  promptHash: string;
  temperature?: number;
  topP?: number;
  safetySettings?: any;
  inputHash: string;
  analysisTimestamp: string;
  confidence?: number;
  rulesScore?: number;
  llmScore?: number;
}

/**
 * Fallback extraction using simple regex patterns when API quota is exceeded
 */
function fallbackExtractAuditFromText(text: string): AuditExtracted {
  const extracted: AuditExtracted = {
    type: "unknown",
    riskFlags: [],
  };

  // Extract type
  const typePatterns = [
    { pattern: /invoice|inv-/i, type: "invoice" },
    { pattern: /delivery|shipment|receipt/i, type: "delivery" },
    { pattern: /contract|agreement/i, type: "contract" },
    { pattern: /payment|transfer|wire/i, type: "payment" },
    { pattern: /purchase.?order|po-/i, type: "purchase_order" },
  ];

  for (const { pattern, type } of typePatterns) {
    if (pattern.test(text)) {
      extracted.type = type;
      break;
    }
  }

  // Extract amount
  const amountMatch = text.match(
    /(?:amount|value|total|price)[\s:]*\$?([\d,]+\.?\d*)/i
  );
  if (amountMatch) {
    extracted.amount = parseFloat(amountMatch[1].replace(/,/g, ""));
  }

  // Extract currency
  const currencyMatch = text.match(/\b(USD|EUR|GBP|TRY|JPY|CNY)\b/i);
  if (currencyMatch) {
    extracted.currency = currencyMatch[1].toUpperCase();
  }

  // Extract vendor
  const vendorMatch = text.match(
    /(?:from|vendor|supplier|company)[\s:]+([A-Z][A-Za-z\s&]+?)(?:\.|,|$)/i
  );
  if (vendorMatch) {
    extracted.vendor = vendorMatch[1].trim();
  }

  // Extract date and normalize to ISO format
  const dateMatch = text.match(
    /(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\w+\s+\d{1,2},?\s+\d{4})/
  );
  if (dateMatch) {
    const dateStr = dateMatch[1];
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        // Convert to ISO format (YYYY-MM-DD)
        extracted.date = date.toISOString().split("T")[0];
      } else {
        extracted.date = dateStr; // Keep original if parsing fails
      }
    } catch (e) {
      extracted.date = dateStr; // Keep original if parsing fails
    }
  }

  // Risk flags
  if (/overdue|late|delayed|urgent|damaged|missing|error/i.test(text)) {
    extracted.riskFlags?.push("Potential issues detected");
  }

  return extracted;
}

export async function extractAuditFromText(
  text: string
): Promise<AuditExtracted> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  // Cache disabled - always perform new extraction
  // This ensures fresh analysis every time

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const model = ai.getGenerativeModel({ model: modelName });

  const prompt = `
You are an expert procurement and auditing assistant. Your task is to extract structured audit information from unstructured text.

INSTRUCTIONS:
1. Analyze the provided text carefully and identify all relevant procurement/audit information
2. Extract the following fields if present:
   - type: The type of record (invoice, delivery, contract, payment, purchase_order, etc.)
   - amount: Any monetary value mentioned (extract as number, no currency symbols)
   - currency: Currency code if mentioned (USD, EUR, TRY, etc.)
   - vendor: Company name, supplier name, or vendor identifier
   - date: Any date mentioned (convert to ISO format YYYY-MM-DD if possible)
   - notes: Important notes, comments, or additional context
   - riskFlags: Any compliance issues, delays, discrepancies, or risk indicators mentioned

3. If a field is not present in the text, omit it (do not include null values)
4. For riskFlags: Identify any red flags such as:
   - Payment delays or overdue amounts
   - Delivery delays or missed deadlines
   - Price discrepancies or unexpected charges
   - Compliance violations or policy breaches
   - Missing documentation or incomplete information
   - Quality issues or defects
   - Contract terms violations

5. Be precise and only extract information that is explicitly stated or clearly implied in the text
6. For dates, try to parse and normalize to ISO format (YYYY-MM-DD)
7. For amounts, extract only the numeric value (remove currency symbols, commas, etc.)

TEXT TO ANALYZE:
${text}

Extract the audit information and return it as a structured JSON object following the schema.
`;

  try {
    // Gemini için basitleştirilmiş JSON Schema (zodToJsonSchema çıktısını temizle)
    const rawSchema = zodToJsonSchema(AuditSchema as any, "AuditSchema") as any;

    // Gemini'nin beklediği format: $ref ve definitions olmadan
    const geminiSchema = {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: "Record type. ex: invoice, delivery, contract",
        },
        amount: { type: "number", description: "Monetary amount if present" },
        currency: { type: "string", description: "Currency code if present" },
        vendor: {
          type: "string",
          description: "Vendor/company name if present",
        },
        date: { type: "string", description: "ISO date if present" },
        notes: { type: "string", description: "Short free-text notes" },
        riskFlags: {
          type: "array",
          items: { type: "string" },
          description: "Any risk/compliance flags",
          default: [],
        },
      },
      required: ["type"],
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiSchema,
      },
    } as any);

    const response = result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    const validated = AuditSchema.parse(parsed);

    // Normalize date to ISO format
    if (validated.date) {
      validated.date = normalizeDate(validated.date) || validated.date;
    }

    // Cache disabled - return fresh result
    return validated;
  } catch (error: any) {
    // Handle quota/rate limit errors - still use fallback if API fails
    if (
      error.message?.includes("429") ||
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      console.warn("⚠️  Gemini API quota exceeded. Using fallback extraction.");
      return fallbackExtractAuditFromText(text);
    }

    console.error("Gemini extraction error:", error);
    throw new Error(`Failed to extract audit data: ${error.message}`);
  }
}

/**
 * Analyze an existing audit record and provide AI insights
 * Includes Responsible AI metadata
 */
/**
 * Fallback analysis when API quota is exceeded
 */
function fallbackAnalyzeAudit(
  auditData: AuditExtracted,
  rulesScore: number = 0
): { analysis: AuditAnalysis; metadata: AnalysisMetadata } {
  // Build more specific reasons based on data
  const reasons: string[] = [];
  let hasFutureDate = false;
  let hasInvalidDate = false;
  let hasMissingCurrency = false;

  if (auditData.date) {
    try {
      const date = new Date(auditData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      if (date > today) {
        hasFutureDate = true;
        reasons.push(
          `Future date detected: ${auditData.date} - This is unusual and may indicate an error`
        );
      }
    } catch (e) {
      hasInvalidDate = true;
      reasons.push(
        `Invalid date format: ${auditData.date} - Date cannot be parsed`
      );
    }
  }

  if (!auditData.currency && auditData.amount) {
    hasMissingCurrency = true;
    reasons.push(
      "Currency missing for monetary amount - This may cause accounting issues"
    );
  }

  if (auditData.riskFlags?.length) {
    reasons.push(...auditData.riskFlags);
  }

  if (reasons.length === 0) {
    reasons.push("Standard audit record - no major issues detected");
  }

  // Calculate risk score based on issues found (0-100, higher = more risk)
  // Start with rules score (already includes future date, missing currency, etc.)
  let riskScore = rulesScore;

  // Add penalties for additional issues found in fallback analysis
  // (rulesScore already covers: negative amount, missing currency, future date, large amount, missing vendor, invalid date format)

  if (hasInvalidDate && !rulesScore) {
    // Invalid date adds 3 points if not already counted in rules
    riskScore += 3;
  }

  // Risk flags add significant weight (8 points per flag, minimum 40 if any flags exist)
  if (auditData.riskFlags?.length) {
    const flagsPenalty = Math.min(60, auditData.riskFlags.length * 12);
    riskScore = Math.max(riskScore, flagsPenalty);
  }

  // Additional context-based adjustments
  // Very large amounts (over 100k) add extra risk
  if (
    auditData.amount &&
    auditData.amount > 100000 &&
    auditData.amount <= 1000000
  ) {
    riskScore = Math.max(riskScore, rulesScore + 3);
  }

  // Cap at 100
  riskScore = Math.min(100, riskScore);

  // If no issues at all, set to low risk (10-15 range)
  if (
    riskScore === 0 &&
    reasons.length === 1 &&
    reasons[0].includes("no major issues")
  ) {
    riskScore = 12; // Very low risk for clean records
  } else if (
    riskScore === 0 &&
    rulesScore === 0 &&
    !hasFutureDate &&
    !hasInvalidDate &&
    !hasMissingCurrency &&
    !auditData.riskFlags?.length
  ) {
    // Truly no issues
    riskScore = 10;
  }

  // Ensure minimum visibility for any detected issues
  if (rulesScore > 0 && riskScore < rulesScore) {
    riskScore = rulesScore; // Don't go below rules score if rules found issues
  }

  // Convert risk score to feasibility score (inverse: 100 - risk)
  // Higher feasibility = less risk = more feasible
  const feasibilityScore = 100 - riskScore;

  // More specific next steps based on issues
  const suggestedNextSteps: string[] = [];

  if (hasFutureDate) {
    suggestedNextSteps.push(
      "Verify the date is correct - future dates are unusual"
    );
    suggestedNextSteps.push("Contact vendor to confirm invoice/delivery date");
    suggestedNextSteps.push("Check if this is a pre-dated or advance payment");
  }

  if (hasInvalidDate) {
    suggestedNextSteps.push("Correct the date format to ISO (YYYY-MM-DD)");
    suggestedNextSteps.push("Verify the original document date");
  }

  if (hasMissingCurrency) {
    suggestedNextSteps.push("Add currency information to the record");
    suggestedNextSteps.push("Verify currency with vendor");
  }

  if (feasibilityScore < 50) {
    suggestedNextSteps.push("Review record details for accuracy");
    suggestedNextSteps.push("Verify vendor information");
    suggestedNextSteps.push("Check compliance with company policies");
  }

  if (suggestedNextSteps.length === 0) {
    suggestedNextSteps.push("Standard processing");
    suggestedNextSteps.push("Archive record");
  }

  const analysis: AuditAnalysis = {
    summary: `Audit record of type "${auditData.type || "unknown"}"${
      auditData.vendor ? ` from ${auditData.vendor}` : ""
    }${
      auditData.amount
        ? ` with amount ${auditData.amount} ${auditData.currency || ""}`
        : ""
    }${auditData.date ? `. Date: ${auditData.date}` : ""}.`,
    riskScore: feasibilityScore, // Store as feasibility score (field name kept for backward compatibility)
    reasons,
    suggestedNextSteps,
    confidence: 60,
    policyFlags: auditData.riskFlags || [],
  };

  const metadata: AnalysisMetadata = {
    model: "fallback",
    promptVersion: "fallback-1.0",
    promptHash: "fallback",
    inputHash: crypto
      .createHash("sha256")
      .update(JSON.stringify(auditData))
      .digest("hex"),
    analysisTimestamp: new Date().toISOString(),
    confidence: 60,
    rulesScore,
    llmScore: feasibilityScore,
  };

  return { analysis, metadata };
}

export async function analyzeAudit(
  auditData: AuditExtracted,
  rulesScore?: number
): Promise<{ analysis: AuditAnalysis; metadata: AnalysisMetadata }> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  // Cache disabled - always perform new analysis
  // This ensures fresh analysis every time

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const model = ai.getGenerativeModel({ model: modelName });

  const prompt = `
You are an expert procurement and compliance auditor. Analyze the following audit record and provide a comprehensive assessment.

AUDIT RECORD DATA:
${JSON.stringify(auditData, null, 2)}

TASK:
1. Provide a brief summary (2-3 sentences) of what this audit record represents
2. Calculate a feasibility score from 0-100 where:
   - 81-100: Highly feasible (normal operations, low risk)
   - 61-80: Feasible (minor issues, needs attention)
   - 31-60: Moderately feasible (some concerns, requires review)
   - 0-30: Not feasible (high risk, urgent action required)
   Note: Feasibility score is the inverse of risk (100 - risk). Higher score = more feasible/less risky.
3. List specific reasons for the feasibility score (be specific and actionable)
4. Suggest concrete next steps (what should be done)
5. Assess your confidence level (0-100) in this analysis
6. Identify any policy compliance flags if present

Consider:
- Payment terms and delays
- Amount discrepancies
- Vendor reliability indicators
- Delivery issues
- Contract compliance
- Risk flags mentioned in the record
- Industry best practices

Return your analysis as a structured JSON object.
`;

  try {
    const analysisSchema = {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "Brief summary of the audit record (2-3 sentences)",
        },
        riskScore: {
          type: "number",
          description:
            "Feasibility score from 0 (not feasible) to 100 (highly feasible). Higher = more feasible/less risky.",
          minimum: 0,
          maximum: 100,
        },
        reasons: {
          type: "array",
          items: { type: "string" },
          description: "List of specific reasons for the feasibility score",
        },
        suggestedNextSteps: {
          type: "array",
          items: { type: "string" },
          description: "Recommended actions to take",
        },
        confidence: {
          type: "number",
          description: "AI confidence level in the analysis",
          minimum: 0,
          maximum: 100,
        },
        policyFlags: {
          type: "array",
          items: { type: "string" },
          description: "Any policy compliance flags",
        },
      },
      required: ["summary", "riskScore", "reasons", "suggestedNextSteps"],
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    } as any);

    const response = result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    const validated = AuditAnalysisSchema.parse(parsed);

    // Generate Responsible AI metadata
    const inputHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(auditData))
      .digest("hex");

    const metadata: AnalysisMetadata = {
      model: modelName,
      promptVersion: "1.0",
      promptHash: crypto
        .createHash("sha256")
        .update(prompt)
        .digest("hex")
        .substring(0, 16),
      inputHash,
      analysisTimestamp: new Date().toISOString(),
      confidence: validated.confidence,
      rulesScore,
      llmScore: validated.riskScore,
    };

    // Cache disabled - return fresh result
    return { analysis: validated, metadata };
  } catch (error: any) {
    // Handle quota/rate limit errors - still use fallback if API fails
    if (
      error.message?.includes("429") ||
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      console.warn("⚠️  Gemini API quota exceeded. Using fallback analysis.");
      return fallbackAnalyzeAudit(auditData, rulesScore || 0);
    }

    console.error("Gemini analysis error:", error);
    throw new Error(`Failed to analyze audit: ${error.message}`);
  }
}
