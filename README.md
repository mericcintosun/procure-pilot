# ProcurePilot (Hackathon MVP)

**ProcurePilot** is a procurement copilot that compares multiple supplier quotations (PDFs), extracts structured terms, highlights risks ("red flags"), and recommends the best option with evidence — while writing an audit trail to **Hyperledger Fabric** (hash + decision metadata) for tamper-resistant accountability.

## What you can demo in 3 minutes

1. Upload 1–3 supplier quote PDFs
2. Click **Analyze** → the app extracts price/lead time/payment/penalties, etc. into a normalized table
3. See **Red Flags** + **Recommendation Card** (winner + rationale)
4. Click **Generate negotiation email** (copy-only; no sending)
5. Open **Audit Log** → shows decision hash + metadata stored on Fabric ledger

---

## MVP Features (2-day scope)

- Upload RFQ/quote PDFs (1–3 files)
- LLM-based extraction into a strict JSON schema (normalized fields)
- Side-by-side comparison table + missing-field warnings
- Simple weighted scoring (Price / Lead Time / Risk) with sliders
- Red flags list + evidence snippets (page/section references)
- Recommendation card (winner + rationale + next steps)
- Negotiation email draft (human-in-the-loop; copy only)
- PII masking (email/phone/IBAN-like patterns) in UI output
- Audit trail to Hyperledger Fabric (store only hashes + decision metadata, not documents)

---

## Architecture

- **Web (Next.js)** → calls backend APIs
- **API (Node.js)**
  - parses PDFs / prepares text chunks
  - calls **Gemini** for structured extraction and summaries
  - submits **audit transactions** to **Fabric** using the Gateway client API
- **Fabric test-network** (local Docker) + **chaincode** `procureaudit`

> Note: Fabric "test-network" is for local learning/testing and not a production network. [oai_citation:0‡Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html?utm_source=chatgpt.com)

---

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind, shadcn/ui, TanStack Table
- **Backend:** Node.js (Fastify/Express), multipart upload, PDF parsing, Zod (schema validation)
- **LLM:** Google Gemini API via `@google/genai` (server-side only)
- **Blockchain (audit):** Hyperledger Fabric test-network + chaincode (JavaScript) + `@hyperledger/fabric-gateway`

Fabric Gateway is the recommended approach for client apps on modern Fabric networks. [oai_citation:1‡Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/en/latest/gateway.html?utm_source=chatgpt.com)  
Gemini requires an API key (create in Google AI Studio). [oai_citation:2‡Google AI for Developers](https://ai.google.dev/gemini-api/docs/api-key?utm_source=chatgpt.com)

---

## Repo Layout

```txt
procurepilot/
  apps/
    web/                  # Next.js UI
    api/                  # Node API (Gemini + Fabric Gateway)
  fabric/
    install-fabric.sh
    fabric-samples/       # test-network lives here (downloaded by install script)
    chaincode/
      procure-audit/      # Fabric chaincode (JS) for audit log
  pnpm-workspace.yaml
  package.json
```

---

## Prerequisites

- Docker Desktop (running)
- Node.js 18+ (recommended)
- pnpm (via Corepack)
- macOS/Linux (Windows possible but not documented here)

---

## Quickstart (Local)

### 1) Start Docker Desktop

```bash
open -a Docker
```

Wait until Docker is Running:

```bash
docker version
```

### 2) Install Fabric + samples (local)

From project root:

```bash
mkdir -p fabric && cd fabric

curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
chmod +x install-fabric.sh

# Downloads Fabric binaries + images + fabric-samples
./install-fabric.sh d s b
```

The official Fabric docs describe what install-fabric.sh downloads and sets up.

### 3) Bring up Fabric test-network + channel

```bash
cd fabric-samples/test-network
./network.sh down
./network.sh up createChannel -c mychannel -ca
```

The Fabric docs cover the test-network and scripts like network.sh.

### 4) Deploy chaincode

```bash
cd fabric-samples/test-network

./network.sh deployCC -c mychannel \
  -ccn procureaudit \
  -ccp ../../chaincode/procure-audit \
  -ccl javascript
```

### 5) Install dependencies (pnpm workspace)

From repo root:

```bash
corepack enable
pnpm install
```

### 6) Configure environment variables

Create `apps/api/.env`:

```env
# Gemini
GEMINI_API_KEY=YOUR_KEY_HERE

# Fabric
FABRIC_CHANNEL=mychannel
FABRIC_CHAINCODE=procureaudit

# Connection profile + identity (Org1 / User1 from test-network)
FABRIC_CCP=../../fabric/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
FABRIC_CERT=../../fabric/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/cert.pem
FABRIC_KEY=../../fabric/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/<YOUR_KEY_FILE>.pem
```

**Tip:** the keystore filename changes each time you recreate crypto; list it with:

```bash
ls ../../fabric/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore
```

### 7) Run the app

In separate terminals:

**API**

```bash
cd apps/api
pnpm dev
```

**Web**

```bash
cd apps/web
pnpm dev
```

Open the UI and test the full flow.

---

## API (suggested minimal endpoints)

- **POST /rfq/upload**
  - multipart: files[] (PDFs)
  - returns: rfqId, uploaded file metadata
- **POST /rfq/:rfqId/analyze**
  - runs extraction + scoring + risk flags
  - returns: normalized comparison JSON + recommendation
- **POST /rfq/:rfqId/audit**
  - submits Fabric transaction RecordDecision(...)
  - returns: txId + ledger key
- **GET /audit/:decisionId**
  - reads from Fabric ReadDecision(decisionId)

---

## Chaincode (procureaudit) – MVP contract surface

- `RecordDecision(decisionId, rfqHash, supplierIds, weights, winner, createdAt, summaryHash)`
- `ReadDecision(decisionId)`
- `QueryDecisionsByRfqHash(rfqHash)` (optional)

Store on-chain: hashes + metadata only (no PDFs).  
Store off-chain (local backend): PDFs + parsed text chunks.

---

## Responsible AI / Safety

- **Human-in-the-loop:** never send emails automatically; provide drafts only.
- **PII handling:** mask obvious identifiers before displaying/logging.
- **Evidence-first UX:** show which clause/page supports each red flag and recommendation.
- **Auditability:** write a minimal, immutable decision trail to Fabric.

Also: do not expose Gemini API keys in the browser; use server-side calls. Google explicitly warns about key security when calling from web/mobile clients.

---

## Troubleshooting

- **Docker not running:** `docker version` fails → open Docker Desktop and wait.
- **Fabric network stuck:** run `./network.sh down` then `./network.sh up createChannel ...`
- **Wrong key path:** keystore filename changes; re-check `FABRIC_KEY`.
- **"Cannot connect to gateway":** verify `FABRIC_CCP` path and that test-network containers are up.

---

## License

MIT (or hackathon default)
