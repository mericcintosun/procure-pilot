export interface Document {
  filename: string;
  text: string;
  pages?: number;
}

export interface Evidence {
  field: string;
  page?: number | null;
  snippet: string;
  section?: string;
}

export interface FeasibilityScoreComponents {
  leadTime: number;
  paymentTerms: number;
  penaltyClause: number;
  gdprCompliance: number;
  redFlags: number;
  priceOutlier: number;
  missingFields: number;
}

export interface FeasibilityScoreEvidence {
  field: string;
  page: number;
  quote: string;
  component: keyof FeasibilityScoreComponents;
  contribution: number;
}

export interface FeasibilityScoreDetails {
  feasibilityScore: number; // 0-100, higher = more feasible/less risky
  components: FeasibilityScoreComponents;
  evidence: FeasibilityScoreEvidence[];
}

export interface Offer {
  filename: string;
  vendor?: string;
  totalPrice?: number;
  currency?: string;
  leadTimeDays?: number;
  paymentTermsDays?: number;
  penaltyClause?: {
    exists: boolean;
    details?: string;
    capPercent?: number;
  };
  validityDays?: number;
  kvkkGdpr?: {
    exists: boolean;
    details?: string;
  };
  redFlags?: string[];
  evidence?: Evidence[];
  scores?: {
    price: number;
    risk: number; // 0-100, higher = more feasible (kept as "risk" for backward compatibility in UI)
    speed: number;
    weighted: number;
  };
  riskScoreDetails?: FeasibilityScoreDetails; // Kept name for backward compatibility
  error?: string;
}

export interface Weights {
  price: number;
  risk: number;
  speed: number;
}

export interface EvidenceState {
  offerIdx: number;
  field: string;
}

export type WeightPreset =
  | "cost-first"
  | "risk-first"
  | "speed-first"
  | "custom";

export const WEIGHT_PRESETS: Record<WeightPreset, Weights> = {
  "cost-first": { price: 0.6, risk: 0.2, speed: 0.2 },
  "risk-first": { price: 0.2, risk: 0.6, speed: 0.2 },
  "speed-first": { price: 0.2, risk: 0.2, speed: 0.6 },
  custom: { price: 0.4, risk: 0.4, speed: 0.2 },
};
