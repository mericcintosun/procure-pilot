/**
 * PDF Page-by-Page Text Extraction
 * Uses pdfjs-dist to extract text from each page separately for evidence tracking
 */

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export type PdfPageText = {
  page: number;
  text: string;
};

/**
 * Extract text from each page of a PDF separately
 * Returns array of { page: number, text: string } for evidence tracking
 */
export async function extractPdfPages(buffer: Buffer): Promise<PdfPageText[]> {
  const uint8 = new Uint8Array(buffer);
  
  try {
    const doc = await pdfjsLib.getDocument({ data: uint8 }).promise;
    const pages: PdfPageText[] = [];

    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      
      // Extract text from all text items on the page
      const text = content.items
        .map((it: any) => (typeof it.str === "string" ? it.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      pages.push({ page: p, text });
    }

    return pages;
  } catch (error: any) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract PDF pages: ${error.message}`);
  }
}

