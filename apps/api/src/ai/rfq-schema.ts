/**
 * RFQ Offer Extraction Schema
 * Normalized schema for procurement offer extraction from PDFs
 * Includes evidence (page, quote, section) for each extracted field
 */

import { z } from "zod";

// Evidence schema for field-level citations
export const EvidenceSchema = z.object({
  page: z.number().describe("Page number where this information was found"),
  quote: z.string().describe("Verbatim text snippet from the document (short, 50-200 chars)"),
  section: z.string().optional().describe("Section name if identifiable (e.g., 'Pricing', 'Delivery Terms')"),
});

export type Evidence = z.infer<typeof EvidenceSchema>;

// Field with evidence wrapper
const FieldWithEvidence = <T extends z.ZodTypeAny>(fieldSchema: T) =>
  z.object({
    value: fieldSchema,
    evidence: z.array(EvidenceSchema).min(1).describe("At least one evidence item with page and quote"),
  });

export const OfferExtractionSchema = z.object({
  vendor: FieldWithEvidence(z.string()).describe("Vendor/company name with evidence"),
  totalPrice: FieldWithEvidence(z.number().optional()).optional().describe("Total price amount (numeric, no currency symbols) with evidence"),
  currency: FieldWithEvidence(z.string().optional()).optional().describe("Currency code (USD, EUR, etc.) with evidence"),
  leadTimeDays: FieldWithEvidence(z.number().optional()).optional().describe("Lead time in calendar days with evidence"),
  paymentTermsDays: FieldWithEvidence(z.number().optional()).optional().describe("Payment terms in days (e.g., Net 30 = 30) with evidence"),
  penaltyClause: z
    .object({
      exists: z.boolean(),
      details: z.string().optional(),
      capPercent: z.number().optional().describe("Maximum penalty cap as percentage"),
      evidence: z.array(EvidenceSchema).min(1).optional().describe("Evidence for penalty clause information"),
    })
    .optional(),
  validityDays: FieldWithEvidence(z.number().optional()).optional().describe("Offer validity period in days with evidence"),
  kvkkGdpr: z
    .object({
      exists: z.boolean(),
      details: z.string().optional(),
      evidence: z.array(EvidenceSchema).min(1).optional().describe("Evidence for GDPR/KVKK compliance information"),
    })
    .optional(),
  redFlags: z
    .array(
      z.object({
        flag: z.string().describe("Risk flag or compliance issue description"),
        evidence: z.array(EvidenceSchema).min(1).optional().describe("Evidence supporting this red flag"),
      })
    )
    .default([])
    .describe("List of risk flags with evidence"),
  // Legacy evidence array for backward compatibility (deprecated, use field-level evidence)
  evidence: z
    .array(
      z.object({
        field: z.string().describe("Field name this evidence supports"),
        page: z.number().nullable().optional().describe("Page number if available"),
        snippet: z.string().describe("Text snippet from document"),
      })
    )
    .default([])
    .optional()
    .describe("Legacy evidence format (deprecated, use field-level evidence)"),
});

export type OfferExtracted = z.infer<typeof OfferExtractionSchema>;

