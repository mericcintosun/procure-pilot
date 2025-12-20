/**
 * Deterministic rule engine for audit validation
 * Runs before LLM analysis to catch obvious issues
 */

export interface RuleResult {
  rule: string;
  passed: boolean;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface AuditData {
  type?: string;
  amount?: number;
  currency?: string;
  vendor?: string;
  date?: string;
  notes?: string;
  riskFlags?: string[];
}

export function validateAuditRules(data: AuditData): {
  passed: boolean;
  score: number; // 0-100, higher = more issues
  results: RuleResult[];
} {
  const results: RuleResult[] = [];
  let issuesFound = 0;

  // Rule 1: Negative amount
  if (data.amount !== undefined && data.amount < 0) {
    results.push({
      rule: "negative_amount",
      passed: false,
      message: "Amount cannot be negative",
      severity: "critical",
    });
    issuesFound += 10;
  }

  // Rule 2: Missing currency with amount
  if (data.amount !== undefined && data.amount > 0 && !data.currency) {
    results.push({
      rule: "missing_currency",
      passed: false,
      message: "Currency is required when amount is present",
      severity: "high",
    });
    issuesFound += 5;
  }

  // Rule 3: Future date
  if (data.date) {
    try {
      // Try to parse various date formats
      let recordDate: Date;
      const dateStr = String(data.date).trim();
      
      // Try ISO format first (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        recordDate = new Date(dateStr);
      } else {
        // Try other formats (e.g., "January 5, 2026")
        recordDate = new Date(dateStr);
      }
      
      // Check if date is valid
      if (!isNaN(recordDate.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for comparison
        recordDate.setHours(0, 0, 0, 0);
        
        if (recordDate > today) {
          results.push({
            rule: "future_date",
            passed: false,
            message: `Date ${data.date} is in the future`,
            severity: "high", // Changed from medium to high
          });
          issuesFound += 8; // Increased from 3 to 8
        }
      }
    } catch (e) {
      // Date parsing failed, will be caught by invalid_date_format rule
    }
  }

  // Rule 4: Very large amount (potential typo)
  if (data.amount !== undefined && data.amount > 1000000) {
    results.push({
      rule: "unusually_large_amount",
      passed: false,
      message: "Amount exceeds $1M - please verify",
      severity: "high",
    });
    issuesFound += 5;
  }

  // Rule 5: Missing vendor for invoice/PO
  if (
    (data.type === "invoice" || data.type === "purchase_order") &&
    !data.vendor
  ) {
    results.push({
      rule: "missing_vendor",
      passed: false,
      message: "Vendor is required for invoices and purchase orders",
      severity: "high",
    });
    issuesFound += 5;
  }

  // Rule 6: Date format validation
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    results.push({
      rule: "invalid_date_format",
      passed: false,
      message: "Date must be in ISO format (YYYY-MM-DD)",
      severity: "medium",
    });
    issuesFound += 3;
  }

  // Rule 7: Empty type
  if (!data.type || data.type.trim() === "") {
    results.push({
      rule: "missing_type",
      passed: false,
      message: "Record type is required",
      severity: "critical",
    });
    issuesFound += 10;
  }

  // All rules passed
  if (results.length === 0) {
    results.push({
      rule: "all_checks_passed",
      passed: true,
      message: "All validation rules passed",
      severity: "low",
    });
  }

  // Score: 0 = perfect, 100 = critical issues
  const score = Math.min(100, issuesFound);

  return {
    passed: results.every((r) => r.passed),
    score,
    results,
  };
}

