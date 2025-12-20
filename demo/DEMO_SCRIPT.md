# ProcurePilot Demo Script (2 Minutes)

## 0:00–0:15 - Introduction
"ProcurePilot: Teklif PDF'lerini yükleyip 30 saniyede normalize ediyor, riskleri çıkarıyor, öneri veriyor. Her adım audit log ve Hyperledger Fabric ledger'da immutable olarak saklanıyor."

## 0:15–0:45 - RFQ Workspace: Upload & Analyze
1. **Upload 3 PDFs:**
   - `offer_A_TechSolutions.pdf` (cheapest but risky)
   - `offer_B_NovaSupply.pdf` (balanced)
   - `offer_C_AnkaProcure.pdf` (premium but safe)

2. **Click "Analyze"**
   - Show extracted fields for each offer
   - Highlight missing fields (Offer A: penalty clause, KVKK/GDPR missing)

## 0:45–1:10 - Comparison Table + Weight Sliders
1. **Show comparison table:**
   - Price: A ($14,900) < B ($15,500) < C ($17,200)
   - Lead Time: C (10 days) < B (14 days) < A (21 days)
   - Risk Flags: A (3 flags) > B (0 flags) = C (0 flags)

2. **Adjust weight sliders:**
   - **"Price weight ↑"** → Recommendation shifts to B/A
   - **"Risk weight ↑"** → Recommendation shifts to C/B

## 1:10–1:35 - Red Flags + Evidence Snippets
1. **Show red flags for Offer A:**
   - "Penalty clause missing"
   - Evidence snippet: "No penalty clause for delivery delays"
   - "No GDPR/KVKK compliance"
   - Evidence snippet: "No GDPR/KVKK compliance documentation provided"

2. **Show compliance for Offer B & C:**
   - Offer B: "GDPR/KVKK: ✅ Full compliance"
   - Offer C: "GDPR/KVKK: ✅ Full compliance + ISO 27001 + SOC 2"

## 1:35–2:00 - Store to Ledger
1. **Click "Store to Ledger"**
   - Show: "Analysis stored ✅"
   - Navigate to `/audits/:id`
   - Show data retrieved from Fabric ledger
   - Highlight immutable audit trail

## Key Points to Emphasize:
- ✅ **30-second extraction** from unstructured PDFs
- ✅ **Normalized schema** - all offers in same format
- ✅ **Evidence snippets** - traceable to source document
- ✅ **Weighted scoring** - customizable decision criteria
- ✅ **Immutable audit trail** - stored on Hyperledger Fabric
- ✅ **Risk detection** - automatic flagging of compliance issues

