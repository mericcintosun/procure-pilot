/**
 * Feasibility Scoring System for RFQ Offers
 * Weighted, explainable feasibility calculation with evidence-based components
 * Feasibility score (0-100): Higher = more feasible/less risky
 */

import type { OfferExtracted } from "./rfq-schema";

export interface FeasibilityScoreComponents {
  leadTime: number;
  paymentTerms: number;
  penaltyClause: number;
  gdprCompliance: number;
  redFlags: number;
  priceOutlier: number;
  missingFields: number;
}

export interface FeasibilityScoreResult {
  feasibilityScore: number; // 0-100, higher = more feasible/less risky
  components: FeasibilityScoreComponents;
  evidence: Array<{
    field: string;
    page: number;
    quote: string;
    component: keyof FeasibilityScoreComponents;
    contribution: number;
  }>;
}

export interface NormalizedOfferData {
  leadTimeDays?: number;
  paymentTermsDays?: number;
  penaltyClauseExists: boolean;
  gdprComplianceExists: boolean;
  redFlagCount: number;
  totalPrice?: number;
  currency?: string;
  missingFieldsCount: number;
  totalExpectedFields: number;
  benchmarkPrice?: number; // Mean price from historical offers
}

/**
 * Default weights for risk factors
 * Total should sum to 1.0
 */
const DEFAULT_WEIGHTS = {
  leadTime: 0.2,
  paymentTerms: 0.15,
  penaltyClause: 0.1,
  gdprCompliance: 0.15,
  redFlags: 0.25,
  priceOutlier: 0.1,
  missingFields: 0.05,
} as const;

/**
 * Normalize lead time to 0-1 scale
 * normLeadTime = min(leadTimeDays / 90, 1)
 * 0 = ideal (short), 1 = risky (long)
 */
function normalizeLeadTime(leadTimeDays?: number): number {
  if (!leadTimeDays || leadTimeDays <= 0) return 0;
  return Math.min(leadTimeDays / 90, 1);
}

/**
 * Normalize payment terms to 0-1 scale (favorable score)
 * normPaymentFavorable = max(0, min((60 - paymentTermsDays) / 60, 1))
 * 1 = favorable (Net 15), 0 = unfavorable (Net 60+)
 * For risk: use (1 - normPaymentFavorable)
 */
function normalizePaymentTerms(paymentTermsDays?: number): number {
  if (!paymentTermsDays || paymentTermsDays <= 0) return 0;
  // Net 15 = 1.0 (most favorable), Net 60+ = 0.0 (least favorable)
  const favorable = Math.max(0, Math.min((60 - paymentTermsDays) / 60, 1));
  return favorable;
}

/**
 * Calculate price outlier score
 * If price is outside mean ± 20%, calculate outlier score
 */
function calculatePriceOutlierScore(
  price?: number,
  benchmarkPrice?: number
): number {
  if (!price || !benchmarkPrice || benchmarkPrice <= 0) return 0;

  const meanPrice = benchmarkPrice;
  const lowerBound = meanPrice * 0.8;
  const upperBound = meanPrice * 1.2;

  if (price >= lowerBound && price <= upperBound) {
    return 0; // Within normal range
  }

  // Calculate deviation from mean
  const deviation = Math.abs(price - meanPrice) / meanPrice;
  return Math.min(deviation, 1); // Cap at 1.0
}

/**
 * Calculate missing fields score
 */
function calculateMissingFieldsScore(
  missingCount: number,
  totalExpected: number
): number {
  if (totalExpected === 0) return 0;
  return Math.min(missingCount / totalExpected, 1);
}

/**
 * Normalize red flag count
 * normalizedRedFlagCount = min(redFlagCount / 5, 1)
 * 5+ flags = maximum risk
 */
function normalizeRedFlagCount(redFlagCount: number): number {
  return Math.min(redFlagCount / 5, 1);
}

/**
 * Extract normalized data from OfferExtracted
 */
function normalizeOfferData(
  offer: OfferExtracted,
  benchmarkPrice?: number
): NormalizedOfferData {
  const leadTimeDays =
    typeof offer.leadTimeDays === "object"
      ? offer.leadTimeDays.value
      : offer.leadTimeDays;
  const paymentTermsDays =
    typeof offer.paymentTermsDays === "object"
      ? offer.paymentTermsDays.value
      : offer.paymentTermsDays;
  const totalPrice =
    typeof offer.totalPrice === "object"
      ? offer.totalPrice.value
      : offer.totalPrice;

  const penaltyClauseExists = offer.penaltyClause?.exists ?? false;
  const gdprComplianceExists = offer.kvkkGdpr?.exists ?? false;
  const redFlagCount = offer.redFlags?.length || 0;

  // Count missing fields
  const expectedFields = [
    "vendor",
    "totalPrice",
    "currency",
    "leadTimeDays",
    "paymentTermsDays",
    "penaltyClause",
    "kvkkGdpr",
    "validityDays",
  ];

  let missingCount = 0;
  if (!offer.vendor) missingCount++;
  if (!offer.totalPrice) missingCount++;
  if (!offer.currency) missingCount++;
  if (!offer.leadTimeDays) missingCount++;
  if (!offer.paymentTermsDays) missingCount++;
  if (!offer.penaltyClause) missingCount++;
  if (!offer.kvkkGdpr) missingCount++;
  if (!offer.validityDays) missingCount++;

  return {
    leadTimeDays,
    paymentTermsDays,
    penaltyClauseExists,
    gdprComplianceExists,
    redFlagCount,
    totalPrice,
    currency:
      typeof offer.currency === "object"
        ? offer.currency.value
        : offer.currency,
    missingFieldsCount: missingCount,
    totalExpectedFields: expectedFields.length,
    benchmarkPrice,
  };
}

/**
 * Collect evidence for feasibility components from offer
 */
function collectEvidence(
  offer: OfferExtracted,
  components: FeasibilityScoreComponents,
  weights: typeof DEFAULT_WEIGHTS
): FeasibilityScoreResult["evidence"] {
  const evidence: FeasibilityScoreResult["evidence"] = [];

  // Lead time evidence
  if (offer.leadTimeDays) {
    const leadTimeEvidence =
      typeof offer.leadTimeDays === "object" ? offer.leadTimeDays.evidence : [];
    leadTimeEvidence.forEach((ev) => {
      evidence.push({
        field: "leadTimeDays",
        page: ev.page,
        quote: ev.quote,
        component: "leadTime",
        contribution: components.leadTime * weights.leadTime,
      });
    });
  }

  // Payment terms evidence
  if (offer.paymentTermsDays) {
    const paymentEvidence =
      typeof offer.paymentTermsDays === "object"
        ? offer.paymentTermsDays.evidence
        : [];
    paymentEvidence.forEach((ev) => {
      evidence.push({
        field: "paymentTermsDays",
        page: ev.page,
        quote: ev.quote,
        component: "paymentTerms",
        contribution: components.paymentTerms * weights.paymentTerms,
      });
    });
  }

  // Penalty clause evidence
  if (offer.penaltyClause?.evidence) {
    offer.penaltyClause.evidence.forEach((ev) => {
      evidence.push({
        field: "penaltyClause",
        page: ev.page,
        quote: ev.quote,
        component: "penaltyClause",
        contribution: components.penaltyClause * weights.penaltyClause,
      });
    });
  } else if (!offer.penaltyClause?.exists) {
    // Missing penalty clause
    evidence.push({
      field: "penaltyClause",
      page: 1,
      quote: "No penalty clause found in document",
      component: "penaltyClause",
      contribution: components.penaltyClause * weights.penaltyClause,
    });
  }

  // GDPR/KVKK evidence
  if (offer.kvkkGdpr?.evidence) {
    offer.kvkkGdpr.evidence.forEach((ev) => {
      evidence.push({
        field: "kvkkGdpr",
        page: ev.page,
        quote: ev.quote,
        component: "gdprCompliance",
        contribution: components.gdprCompliance * weights.gdprCompliance,
      });
    });
  } else if (!offer.kvkkGdpr?.exists) {
    evidence.push({
      field: "kvkkGdpr",
      page: 1,
      quote: "No GDPR/KVKK compliance found",
      component: "gdprCompliance",
      contribution: components.gdprCompliance * weights.gdprCompliance,
    });
  }

  // Red flags evidence
  if (offer.redFlags) {
    offer.redFlags.forEach((rf) => {
      const flagEvidence =
        typeof rf === "object" && rf.evidence ? rf.evidence : [];
      flagEvidence.forEach((ev) => {
        evidence.push({
          field: "redFlag",
          page: ev.page,
          quote: ev.quote,
          component: "redFlags",
          contribution:
            (components.redFlags * weights.redFlags) /
            Math.max(offer.redFlags.length, 1),
        });
      });
    });
  }

  return evidence;
}

/**
 * Calculate risk score with adaptive weights
 * Adjusts weights based on context (e.g., if lead time is very long, increase its weight)
 */
function calculateAdaptiveWeights(
  normalized: NormalizedOfferData
): typeof DEFAULT_WEIGHTS {
  const weights = { ...DEFAULT_WEIGHTS };

  // If lead time is very long (>60 days), increase its weight
  if (normalized.leadTimeDays && normalized.leadTimeDays > 60) {
    weights.leadTime += 0.05;
    // Reduce other weights proportionally
    weights.paymentTerms *= 0.95;
    weights.priceOutlier *= 0.95;
  }

  // If red flag count is high (>=3), increase red flag weight
  if (normalized.redFlagCount >= 3) {
    weights.redFlags += 0.1;
    // Reduce other weights proportionally
    const reduction = 0.9;
    weights.leadTime *= reduction;
    weights.paymentTerms *= reduction;
    weights.penaltyClause *= reduction;
    weights.gdprCompliance *= reduction;
    weights.priceOutlier *= reduction;
    weights.missingFields *= reduction;
  }

  // Normalize weights to sum to 1.0
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  if (total > 0) {
    Object.keys(weights).forEach((key) => {
      (weights as any)[key] /= total;
    });
  }

  return weights;
}

/**
 * Calculate comprehensive feasibility score for an offer
 *
 * HOW IT WORKS:
 * 1. Analyzes 7 key factors: lead time, payment terms, penalty clauses, GDPR compliance,
 *    red flags, price outliers, and missing fields
 * 2. Each factor is normalized (0-100) and weighted based on context
 * 3. Risk score is calculated as weighted sum of risk components
 * 4. Feasibility score = 100 - risk score (inverse relationship)
 *
 * SCORING:
 * - 81-100: Highly feasible (low risk, recommended)
 * - 61-80: Feasible (minor concerns, acceptable)
 * - 31-60: Moderately feasible (some risks, needs review)
 * - 0-30: Not feasible (high risk, not recommended)
 *
 * Higher score = more feasible/less risky offer
 */
export function calculateFeasibilityScore(
  offer: OfferExtracted,
  benchmarkPrice?: number
): FeasibilityScoreResult {
  // Normalize offer data
  const normalized = normalizeOfferData(offer, benchmarkPrice);

  // Calculate adaptive weights
  const weights = calculateAdaptiveWeights(normalized);

  // Calculate normalized component scores (0-1 scale)
  const normLeadTime = normalizeLeadTime(normalized.leadTimeDays);
  const normPaymentFavorable = normalizePaymentTerms(
    normalized.paymentTermsDays
  );
  const normPaymentRisk = 1 - normPaymentFavorable; // Invert for risk
  const penaltyClauseRisk = normalized.penaltyClauseExists ? 0 : 1;
  const gdprComplianceRisk = normalized.gdprComplianceExists ? 0 : 1;
  const normalizedRedFlagCount = normalizeRedFlagCount(normalized.redFlagCount);
  const priceOutlierScore = calculatePriceOutlierScore(
    normalized.totalPrice,
    normalized.benchmarkPrice
  );
  const missingFieldsScore = calculateMissingFieldsScore(
    normalized.missingFieldsCount,
    normalized.totalExpectedFields
  );

  // Calculate component contributions (0-100 scale) - these represent risk factors
  const riskComponents: FeasibilityScoreComponents = {
    leadTime: normLeadTime * 100,
    paymentTerms: normPaymentRisk * 100,
    penaltyClause: penaltyClauseRisk * 100,
    gdprCompliance: gdprComplianceRisk * 100,
    redFlags: normalizedRedFlagCount * 100,
    priceOutlier: priceOutlierScore * 100,
    missingFields: missingFieldsScore * 100,
  };

  // Calculate weighted risk score (0-100, higher = more risk)
  const riskScore =
    riskComponents.leadTime * weights.leadTime +
    riskComponents.paymentTerms * weights.paymentTerms +
    riskComponents.penaltyClause * weights.penaltyClause +
    riskComponents.gdprCompliance * weights.gdprCompliance +
    riskComponents.redFlags * weights.redFlags +
    riskComponents.priceOutlier * weights.priceOutlier +
    riskComponents.missingFields * weights.missingFields;

  // Convert risk score to feasibility score (inverse: 100 - risk)
  // Higher feasibility = less risk = more feasible
  const feasibilityScore = 100 - Math.max(0, Math.min(100, riskScore));

  // Convert risk components to feasibility components (inverse)
  const components: FeasibilityScoreComponents = {
    leadTime: 100 - riskComponents.leadTime,
    paymentTerms: 100 - riskComponents.paymentTerms,
    penaltyClause: 100 - riskComponents.penaltyClause,
    gdprCompliance: 100 - riskComponents.gdprCompliance,
    redFlags: 100 - riskComponents.redFlags,
    priceOutlier: 100 - riskComponents.priceOutlier,
    missingFields: 100 - riskComponents.missingFields,
  };

  // Collect evidence (using risk components for contribution calculation)
  const evidence = collectEvidence(offer, riskComponents, weights);

  return {
    feasibilityScore: Math.max(0, Math.min(100, feasibilityScore)),
    components,
    evidence,
  };
}

/**
 * Calculate benchmark price from multiple offers
 * Returns mean price for outlier detection
 */
export function calculateBenchmarkPrice(offers: OfferExtracted[]): number {
  const prices = offers
    .map((offer) => {
      const price =
        typeof offer.totalPrice === "object"
          ? offer.totalPrice.value
          : offer.totalPrice;
      return price;
    })
    .filter((p): p is number => p !== undefined && p > 0);

  if (prices.length === 0) return 0;

  const sum = prices.reduce((acc, p) => acc + p, 0);
  return sum / prices.length;
}
