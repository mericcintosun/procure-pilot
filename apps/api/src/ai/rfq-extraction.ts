/**
 * RFQ Offer Extraction using Gemini
 * Extracts normalized offer data from PDF text with page-by-page evidence
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { OfferExtractionSchema, type OfferExtracted, type Evidence } from "./rfq-schema";
import { checkRateLimit, incrementRateLimit } from "./gemini";
import type { PdfPageText } from "../pdf/extractPages";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Fallback extraction using regex patterns when API quota is exceeded
 */
function fallbackExtractOfferFromPDF(pdfText: string, filename?: string): OfferExtracted {
  // Try to detect page number from text (e.g., "PAGE 1:", "--- PAGE 2 ---")
  const pageMatch = pdfText.match(/(?:PAGE|page)\s+(\d+)/i);
  const detectedPage = pageMatch ? parseInt(pageMatch[1], 10) : 1;

  const extracted: OfferExtracted = {
    vendor: {
      value: "Unknown Vendor",
      evidence: [{ page: detectedPage, quote: "Vendor name not found in document", section: "Header" }],
    },
    redFlags: [],
    evidence: [],
  };

  // Extract vendor name - handle markdown formatting (**Vendor:**) and plain text
  const vendorPatterns = [
    /\*\*Vendor:\*\*\s+([A-Z][A-Za-z\s&.,()]+?)(?:\n|$|\*\*)/i,
    /(?:^|\n)\*\*Vendor:\*\*\s+([A-Z][A-Za-z\s&.,()]+?)(?:\n|$)/i,
    /(?:\*\*)?(?:Vendor|Company|Supplier)(?:\*\*)?[\s:]+([A-Z][A-Za-z\s&.,()]+?)(?:\n|$|\.|\*\*)/i,
    /^OFFER\s+[A-Z]\s*-\s*([A-Za-z\s&.,()]+)/m,
  ];

  for (const pattern of vendorPatterns) {
    const vendorMatch = pdfText.match(pattern);
    if (vendorMatch && vendorMatch[1]) {
      const vendorName = vendorMatch[1].trim().replace(/\*\*/g, "").replace(/^[\s*]+|[\s*]+$/g, "");
      if (vendorName.length > 2) {
        extracted.vendor = {
          value: vendorName,
          evidence: [
            {
              page: detectedPage,
              quote: vendorMatch[0].substring(0, 200),
              section: "Header",
            },
          ],
        };
        break;
      }
    }
  }

  // If still not found, try to extract from filename
  if (extracted.vendor.value === "Unknown Vendor" && filename) {
    const filenameMatch = filename.match(/(?:offer[_\s-]?[A-Z][_\s-]?)?([A-Za-z]+)/i);
    if (filenameMatch && filenameMatch[1] && filenameMatch[1].length > 2) {
      extracted.vendor = {
        value: filenameMatch[1],
        evidence: [{ page: 1, quote: `Extracted from filename: ${filename}`, section: "Metadata" }],
      };
    }
  }

  // Extract price - handle markdown formatting
  const pricePatterns = [
    /(?:\*\*)?(?:Total\s+Price|Price|Amount)(?:\*\*)?[\s:]*\$?([\d,]+\.?\d*)/i,
    /\$([\d,]+\.?\d*)\s*(?:USD|EUR|GBP|TRY)/i,
  ];
  
  for (const pattern of pricePatterns) {
    const priceMatch = pdfText.match(pattern);
    if (priceMatch && priceMatch[1]) {
      const priceValue = parseFloat(priceMatch[1].replace(/,/g, ""));
      extracted.totalPrice = {
        value: priceValue,
        evidence: [
          {
            page: detectedPage,
            quote: priceMatch[0].substring(0, 200),
            section: "Pricing",
          },
        ],
      };
      break;
    }
  }

  // Extract currency
  const currencyMatch = pdfText.match(/\b(USD|EUR|GBP|TRY|JPY|CNY)\b/i);
  if (currencyMatch) {
    extracted.currency = {
      value: currencyMatch[1].toUpperCase(),
      evidence: [
        {
          page: detectedPage,
          quote: currencyMatch[0],
          section: "Pricing",
        },
      ],
    };
  }

  // Extract lead time - handle markdown formatting
  const leadTimeMatch = pdfText.match(/(?:\*\*)?(?:Lead\s+Time|Delivery\s+Time)(?:\*\*)?[\s:]*(\d+)\s*(?:calendar\s+)?days?/i);
  if (leadTimeMatch) {
    extracted.leadTimeDays = {
      value: parseInt(leadTimeMatch[1], 10),
      evidence: [
        {
          page: detectedPage,
          quote: leadTimeMatch[0].substring(0, 200),
          section: "Delivery Terms",
        },
      ],
    };
  }

  // Extract payment terms
  const paymentMatch = pdfText.match(/Net\s+(\d+)\s*days?/i);
  if (paymentMatch) {
    extracted.paymentTermsDays = {
      value: parseInt(paymentMatch[1], 10),
      evidence: [
        {
          page: detectedPage,
          quote: paymentMatch[0].substring(0, 200),
          section: "Payment Terms",
        },
      ],
    };
  }

  // Check for penalty clause - handle multi-line formatting
  const penaltySection = pdfText.match(/(?:penalty|delay.*penalty|late.*fee)[\s\S]{0,500}/i);
  if (penaltySection) {
    const capMatch = penaltySection[0].match(/(?:cap|maximum)[\s:]*(\d+)%/i);
    extracted.penaltyClause = {
      exists: true,
      details: "Penalty clause found in document",
      capPercent: capMatch ? parseInt(capMatch[1], 10) : undefined,
      evidence: [
        {
          page: detectedPage,
          quote: penaltySection[0].substring(0, 200),
          section: "Penalty Clause",
        },
      ],
    };
  } else {
    extracted.penaltyClause = { exists: false };
    extracted.redFlags?.push({
      flag: "Missing penalty clause",
      evidence: [{ page: detectedPage, quote: "No penalty clause found in document", section: "Terms" }],
    });
  }

  // Check for GDPR/KVKK - handle markdown checkmarks
  if (/GDPR|KVKK|compliance|data\s+processing\s+agreement|✅.*GDPR|✅.*KVKK/i.test(pdfText)) {
    const gdprMatch = pdfText.match(/(?:GDPR|KVKK|compliance|data\s+processing)[\s\S]{0,200}/i);
    extracted.kvkkGdpr = {
      exists: true,
      details: "GDPR/KVKK compliance mentioned",
      evidence: gdprMatch
        ? [
            {
              page: detectedPage,
              quote: gdprMatch[0].substring(0, 200),
              section: "Compliance",
            },
          ]
        : [{ page: detectedPage, quote: "GDPR/KVKK compliance mentioned", section: "Compliance" }],
    };
  } else {
    extracted.kvkkGdpr = { exists: false };
    // Only add red flag if it's a real document, not a demo
    if (pdfText.length > 100) {
      extracted.redFlags?.push({
        flag: "No GDPR/KVKK compliance documentation",
        evidence: [{ page: detectedPage, quote: "No GDPR/KVKK compliance found", section: "Compliance" }],
      });
    }
  }

  // Extract validity
  const validityMatch = pdfText.match(/(?:valid|validity)[\s:]*(\d+)\s*days?/i);
  if (validityMatch) {
    extracted.validityDays = {
      value: parseInt(validityMatch[1], 10),
      evidence: [
        {
          page: detectedPage,
          quote: validityMatch[0].substring(0, 200),
          section: "Offer Validity",
        },
      ],
    };
  }

  return extracted;
}

/**
 * Extract offer from PDF pages with evidence
 * Uses page-by-page context to provide accurate page numbers and quotes
 */
export async function extractOfferFromPDFPages(
  pages: PdfPageText[],
  filename?: string
): Promise<OfferExtracted> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  // Check rate limit
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    console.warn(`⚠️  Rate limit exceeded. Using fallback extraction for ${filename}. Resets in ${rateLimit.resetIn} minutes.`);
    // Fallback: combine all pages into single text
    const combinedText = pages.map((p) => `PAGE ${p.page}: ${p.text}`).join("\n\n");
    return fallbackExtractOfferFromPDF(combinedText, filename);
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";
  const model = ai.getGenerativeModel({ model: modelName });

  // Build page-by-page context
  const pageContext = pages
    .map((p) => `--- PAGE ${p.page} ---\n${p.text}`)
    .join("\n\n");

  const prompt = `
You are an expert procurement analyst. Extract structured procurement offer information from the following PDF pages.

CRITICAL RULES:
1. Every extracted field MUST include at least 1 evidence item with (page, quote, section?)
2. quote must be a short verbatim snippet (50-200 chars) from that specific page
3. page must be the exact page number where the information was found
4. section is optional but helpful (e.g., "Pricing", "Delivery Terms", "Compliance")
5. If a field is not found, omit it (do not include null values)
6. For redFlags: include evidence showing why it's a risk

FIELDS TO EXTRACT (each with evidence):
- vendor: Company/vendor name (with evidence)
- totalPrice: Total price amount, numeric only (with evidence)
- currency: Currency code like USD, EUR (with evidence)
- leadTimeDays: Lead time in calendar days (with evidence)
- paymentTermsDays: Payment terms in days, e.g., "Net 30" = 30 (with evidence)
- penaltyClause: Object with exists, details, capPercent, and evidence array
- validityDays: Offer validity period in days (with evidence)
- kvkkGdpr: Object with exists, details, and evidence array
- redFlags: Array of { flag: string, evidence: array } - risk flags with evidence

PDF PAGES:
${pageContext}

Extract the offer information and return it as a structured JSON object following the schema.
Every field must have evidence with page number and quote.
`;

  try {
    const schema = {
      type: "object",
      properties: {
        vendor: {
          type: "object",
          properties: {
            value: { type: "string", description: "Vendor/company name" },
            evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  page: { type: "integer", description: "Page number" },
                  quote: { type: "string", description: "Verbatim text snippet (50-200 chars)" },
                  section: { type: "string", description: "Section name if identifiable" },
                },
                required: ["page", "quote"],
              },
              minItems: 1,
            },
          },
          required: ["value", "evidence"],
        },
        totalPrice: {
          type: "object",
          properties: {
            value: { type: "number", description: "Total price amount" },
            evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  quote: { type: "string" },
                  section: { type: "string" },
                },
                required: ["page", "quote"],
              },
              minItems: 1,
            },
          },
          required: ["value", "evidence"],
        },
        currency: {
          type: "object",
          properties: {
            value: { type: "string", description: "Currency code" },
            evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  quote: { type: "string" },
                  section: { type: "string" },
                },
                required: ["page", "quote"],
              },
              minItems: 1,
            },
          },
          required: ["value", "evidence"],
        },
        leadTimeDays: {
          type: "object",
          properties: {
            value: { type: "number", description: "Lead time in calendar days" },
            evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  quote: { type: "string" },
                  section: { type: "string" },
                },
                required: ["page", "quote"],
              },
              minItems: 1,
            },
          },
          required: ["value", "evidence"],
        },
        paymentTermsDays: {
          type: "object",
          properties: {
            value: { type: "number", description: "Payment terms in days" },
            evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  quote: { type: "string" },
                  section: { type: "string" },
                },
                required: ["page", "quote"],
              },
              minItems: 1,
            },
          },
          required: ["value", "evidence"],
        },
        penaltyClause: {
          type: "object",
          properties: {
            exists: { type: "boolean" },
            details: { type: "string" },
            capPercent: { type: "number" },
            evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  quote: { type: "string" },
                  section: { type: "string" },
                },
                required: ["page", "quote"],
              },
            },
          },
          required: ["exists"],
        },
        validityDays: {
          type: "object",
          properties: {
            value: { type: "number", description: "Offer validity period in days" },
            evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  quote: { type: "string" },
                  section: { type: "string" },
                },
                required: ["page", "quote"],
              },
              minItems: 1,
            },
          },
          required: ["value", "evidence"],
        },
        kvkkGdpr: {
          type: "object",
          properties: {
            exists: { type: "boolean" },
            details: { type: "string" },
            evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  quote: { type: "string" },
                  section: { type: "string" },
                },
                required: ["page", "quote"],
              },
            },
          },
          required: ["exists"],
        },
        redFlags: {
          type: "array",
          items: {
            type: "object",
            properties: {
              flag: { type: "string", description: "Risk flag description" },
              evidence: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    page: { type: "integer" },
                    quote: { type: "string" },
                    section: { type: "string" },
            },
                  required: ["page", "quote"],
                },
              },
            },
            required: ["flag"],
          },
        },
      },
      required: ["vendor"],
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    } as any);

    const response = result.response;
    const text = response.text();
    
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (parseError: any) {
      console.warn("⚠️  Failed to parse Gemini response as JSON. Using fallback extraction.");
      console.warn("Response text:", text.substring(0, 500));
      const combinedText = pages.map((p) => `PAGE ${p.page}: ${p.text}`).join("\n\n");
      return fallbackExtractOfferFromPDF(combinedText, filename);
    }

    let validated: OfferExtracted;
    try {
      validated = OfferExtractionSchema.parse(parsed);
    } catch (validationError: any) {
      console.warn("⚠️  Gemini response validation failed. Using fallback extraction.");
      console.warn("Validation error:", validationError.message);
      console.warn("Parsed data:", JSON.stringify(parsed, null, 2));
      const combinedText = pages.map((p) => `PAGE ${p.page}: ${p.text}`).join("\n\n");
      return fallbackExtractOfferFromPDF(combinedText, filename);
    }

    // Ensure vendor is not empty
    if (!validated.vendor?.value || validated.vendor.value.trim().length === 0) {
      console.warn("⚠️  Gemini extracted empty vendor. Using fallback extraction.");
      const combinedText = pages.map((p) => `PAGE ${p.page}: ${p.text}`).join("\n\n");
      return fallbackExtractOfferFromPDF(combinedText, filename);
    }

    incrementRateLimit();
    return validated;
  } catch (error: any) {
    console.error("Gemini RFQ extraction error:", error);
    
    // Handle quota/rate limit errors
    if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("rate limit")) {
      console.warn("⚠️  Gemini API quota exceeded. Using fallback extraction.");
      const combinedText = pages.map((p) => `PAGE ${p.page}: ${p.text}`).join("\n\n");
      return fallbackExtractOfferFromPDF(combinedText, filename);
    }

    // If validation fails, try fallback
    if (error.message?.includes("parse") || error.message?.includes("validation") || error.message?.includes("schema")) {
      console.warn("⚠️  Extraction validation failed. Using fallback extraction.");
      const combinedText = pages.map((p) => `PAGE ${p.page}: ${p.text}`).join("\n\n");
      return fallbackExtractOfferFromPDF(combinedText, filename);
    }

    // For any other error, try fallback before throwing
    console.warn("⚠️  Unexpected error during extraction. Attempting fallback extraction.");
    try {
      const combinedText = pages.map((p) => `PAGE ${p.page}: ${p.text}`).join("\n\n");
      return fallbackExtractOfferFromPDF(combinedText, filename);
    } catch (fallbackError: any) {
      throw new Error(`Failed to extract offer data: ${error.message}. Fallback also failed: ${fallbackError.message}`);
  }
  }
}

/**
 * Legacy function: Extract offer from combined PDF text (backward compatibility)
 * For new code, use extractOfferFromPDFPages() instead
 */
export async function extractOfferFromPDF(
  pdfText: string,
  filename?: string
): Promise<OfferExtracted> {
  // For backward compatibility, treat as single page
  return extractOfferFromPDFPages([{ page: 1, text: pdfText }], filename);
}

