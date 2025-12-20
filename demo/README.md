# ProcurePilot Demo Package

## Quick Start

### 1. Install Dependencies
```bash
cd apps/api
pnpm add multer pdf-parse
pnpm add -D @types/multer
```

### 2. Create PDFs from Markdown
1. Open each `.md` file in `demo/pdfs/`:
   - `offer_A_TechSolutions.md`
   - `offer_B_NovaSupply.md`
   - `offer_C_AnkaProcure.md`
2. Copy content to Google Docs
3. Export as PDF
4. Save PDFs in `demo/pdfs/` directory

### 3. Seed Demo Data
```bash
# Make sure backend is running
cd apps/api && pnpm dev

# In another terminal
node scripts/seed-demo.js
```

### 4. Test RFQ Endpoints

#### Upload PDFs
```bash
curl -X POST http://localhost:4000/rfq/upload \
  -F "files=@demo/pdfs/offer_A_TechSolutions.pdf" \
  -F "files=@demo/pdfs/offer_B_NovaSupply.pdf" \
  -F "files=@demo/pdfs/offer_C_AnkaProcure.pdf"
```

#### Analyze Offers
```bash
curl -X POST http://localhost:4000/rfq/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [
      {"filename": "offer_A_TechSolutions.pdf", "text": "..."},
      {"filename": "offer_B_NovaSupply.pdf", "text": "..."},
      {"filename": "offer_C_AnkaProcure.pdf", "text": "..."}
    ],
    "weights": {"price": 0.4, "risk": 0.4, "speed": 0.2}
  }'
```

## Demo Script

See `DEMO_SCRIPT.md` for the 2-minute presentation script.

## File Structure

```
demo/
├── pdfs/
│   ├── offer_A_TechSolutions.md (→ export to PDF)
│   ├── offer_B_NovaSupply.md (→ export to PDF)
│   └── offer_C_AnkaProcure.md (→ export to PDF)
├── seed/
│   └── audits.seed.json
├── DEMO_SCRIPT.md
└── README.md

scripts/
└── seed-demo.js
```

## Offer Comparison

| Feature | Offer A (TechSolutions) | Offer B (NovaSupply) | Offer C (AnkaProcure) |
|---------|------------------------|---------------------|----------------------|
| Price | $14,900 | $15,500 | $17,200 |
| Lead Time | 21 days | 14 days | 10 days |
| Payment Terms | Net 60 | Net 30 | Net 15 |
| Penalty Clause | ❌ Missing | ✅ 0.5%/day, cap 10% | ✅ 0.3%/day, cap 5% |
| GDPR/KVKK | ❌ Missing | ✅ Yes | ✅ Yes + ISO 27001 |
| Validity | 7 days | 30 days | 45 days |
| Red Flags | 3 | 0 | 0 |

## Next Steps

1. Create PDFs from markdown files
2. Test RFQ upload endpoint
3. Test RFQ analyze endpoint
4. Practice demo script
5. Prepare frontend UI for RFQ workspace (optional)

