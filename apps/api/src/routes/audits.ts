import { Router, type IRouter } from "express";
import { getFabric } from "../fabric/gateway";
import { analyzeAudit } from "../ai/gemini";
import { validateAuditRules } from "../ai/rules";

export const auditsRouter: IRouter = Router();

// Helper: Extract chaincode error message from Fabric Gateway errors
function extractChaincodeError(error: any): string {
  // Fabric Gateway hatalarında mesaj details array'inde olabilir
  let errorMessage = error?.message || String(error);

  if (
    error?.details &&
    Array.isArray(error.details) &&
    error.details.length > 0
  ) {
    const chaincodeMessage = error.details[0]?.message;
    if (chaincodeMessage) {
      // "chaincode response 500, The audit record..." formatından sadece mesajı al
      const match = chaincodeMessage.match(/chaincode response \d+, (.+)/);
      errorMessage = match ? match[1] : chaincodeMessage;
    }
  }

  return errorMessage;
}

// GET /audits
auditsRouter.get("/", async (_req, res) => {
  try {
    const { contract } = await getFabric();
    const resultBytes = await contract.evaluateTransaction(
      "GetAllAuditRecords"
    );
    const json = Buffer.from(resultBytes).toString("utf8");
    res.json(JSON.parse(json));
  } catch (error: any) {
    const errorMessage = extractChaincodeError(error);
    console.error("Error fetching audits:", errorMessage);
    res.status(500).json({
      error: "Failed to fetch audits",
      message: errorMessage,
    });
  }
});

// GET /audits/:id/analysis - Get existing analysis for audit record (must come before /:id)
auditsRouter.get("/:id/analysis", async (req, res) => {
  try {
    const { id } = req.params;
    const analysisKey = `analysis::${id}`;

    const { contract } = await getFabric();

    try {
      const resultBytes = await contract.evaluateTransaction(
        "ReadAuditRecord",
        analysisKey
      );
      const json = Buffer.from(resultBytes).toString("utf8");
      const analysisRecord = JSON.parse(json);

      // Return the analysis data in a consistent format
      res.status(200).json({
        auditId: id,
        analysis: analysisRecord.Data?.analysis || analysisRecord.Data,
        metadata: analysisRecord.Data?.metadata,
        analyzedAt: analysisRecord.Data?.analyzedAt || analysisRecord.Timestamp,
        exists: true,
      });
    } catch (error: any) {
      const errorMessage = extractChaincodeError(error);

      // If analysis doesn't exist, return 404
      if (errorMessage.includes("does not exist")) {
        return res.status(404).json({
          error: "Analysis not found",
          message: "No analysis exists for this audit record yet",
          exists: false,
        });
      }

      throw error;
    }
  } catch (error: any) {
    const errorMessage = extractChaincodeError(error);
    console.error(`Error reading analysis for ${req.params.id}:`, errorMessage);
    res.status(500).json({
      error: "Failed to read analysis",
      message: errorMessage,
    });
  }
});

// POST /audits/:id/analyze - AI analysis of audit record (must come before /:id)
auditsRouter.post("/:id/analyze", async (req, res) => {
  try {
    const { id } = req.params;

    // Read audit record from Fabric
    const { contract } = await getFabric();
    const resultBytes = await contract.evaluateTransaction(
      "ReadAuditRecord",
      id
    );
    const json = Buffer.from(resultBytes).toString("utf8");
    const auditRecord = JSON.parse(json);

    // Run deterministic rules first
    const rulesResult = validateAuditRules(auditRecord.Data);

    // Analyze with Gemini (includes Responsible AI metadata)
    const { analysis, metadata } = await analyzeAudit(
      auditRecord.Data,
      rulesResult.score
    );

    // Combine rule-based and LLM feasibility scores
    // Convert rules score (risk) to feasibility: feasibility = 100 - risk
    const rulesFeasibilityScore = 100 - rulesResult.score;
    const combinedFeasibilityScore = Math.min(
      rulesFeasibilityScore,
      analysis.riskScore // Already feasibility score from Gemini
    );

    // Store analysis in Fabric with full metadata
    const analysisKey = `analysis::${id}`;
    const analysisRecord = {
      auditId: id,
      analysis: {
        ...analysis,
        riskScore: combinedFeasibilityScore, // Store as feasibility score (field name kept for backward compatibility)
        rulesResult,
      },
      metadata,
      analyzedAt: new Date().toISOString(),
    };

    try {
      // Use StoreAnalysis which is idempotent (returns existing if already exists)
      await contract.submitTransaction(
        "StoreAnalysis",
        id,
        JSON.stringify(analysisRecord)
      );
    } catch (error: any) {
      const errorMessage = extractChaincodeError(error);

      // If analysis already exists (from auto-analysis), that's okay
      if (
        errorMessage?.includes("already exists") ||
        errorMessage?.includes("MVCC")
      ) {
        console.log(
          `ℹ️  Analysis for ${id} already exists, returning existing`
        );
      } else if (
        errorMessage?.includes("function that does not exist") ||
        errorMessage?.includes("ABORTED")
      ) {
        // Chaincode function not found - need to redeploy
        console.warn(
          `⚠️  StoreAnalysis function not found. Please redeploy chaincode with version 1.3 and sequence 5.`
        );
        console.warn(`   Error: ${errorMessage}`);
      } else {
        console.warn(`Could not store analysis in Fabric: ${errorMessage}`);
      }
    }

    res.status(200).json({
      auditId: id,
      auditRecord,
      analysis: {
        ...analysis,
        riskScore: combinedFeasibilityScore, // Feasibility score (field name kept for backward compatibility)
        rulesResult,
      },
      metadata,
      storedInFabric: true,
    });
  } catch (error: any) {
    const errorMessage = extractChaincodeError(error);
    console.error("Error analyzing audit:", errorMessage);
    res.status(500).json({
      error: "Failed to analyze audit",
      message: errorMessage,
    });
  }
});

// GET /audits/:id
auditsRouter.get("/:id", async (req, res) => {
  try {
    const { contract } = await getFabric();
    const resultBytes = await contract.evaluateTransaction(
      "ReadAuditRecord",
      req.params.id
    );
    const json = Buffer.from(resultBytes).toString("utf8");
    res.json(JSON.parse(json));
  } catch (error: any) {
    const errorMessage = extractChaincodeError(error);
    console.error(`Error reading audit ${req.params.id}:`, errorMessage);
    res.status(404).json({
      error: "Audit record not found",
      message: errorMessage,
    });
  }
});

// POST /audits  body: { id: "audit2", data: {...} }
auditsRouter.post("/", async (req, res) => {
  try {
    const { id, data } = req.body ?? {};
    if (!id) return res.status(400).json({ error: "id is required" });

    const { contract } = await getFabric();

    // Chaincode tarafında string bekliyorsan JSON.stringify gönder.
    const payload =
      typeof data === "string" ? data : JSON.stringify(data ?? {});
    const resultBytes = await contract.submitTransaction(
      "CreateAuditRecord",
      String(id),
      payload
    );

    const json = Buffer.from(resultBytes).toString("utf8");
    res.status(201).json(JSON.parse(json));
  } catch (error: any) {
    const errorMessage = extractChaincodeError(error);

    // Eğer kayıt zaten varsa, mevcut kaydı döndür (idempotent davranış)
    if (errorMessage.includes("already exists")) {
      console.info(
        `Audit record already exists, returning existing record: ${req.body?.id}`
      );

      // Mevcut kaydı oku ve döndür (200 OK - idempotent)
      try {
        const { contract } = await getFabric();
        const existingBytes = await contract.evaluateTransaction(
          "ReadAuditRecord",
          String(req.body?.id)
        );
        const existingJson = Buffer.from(existingBytes).toString("utf8");
        const existingRecord = JSON.parse(existingJson);

        // 200 OK döndür - kayıt zaten var, mevcut kaydı göster
        return res.status(200).json({
          ...existingRecord,
          _message: "Record already exists, returning existing record",
        });
      } catch (readError: any) {
        // Eğer mevcut kaydı okuyamazsak, 409 Conflict döndür
        const readErrorMessage = extractChaincodeError(readError);
        console.error("Error reading existing record:", readErrorMessage);
        return res.status(409).json({
          error: "Audit record already exists",
          message: errorMessage,
        });
      }
    }

    console.error("Error creating audit:", errorMessage);
    res.status(500).json({
      error: "Failed to create audit record",
      message: errorMessage,
    });
  }
});

// DELETE /audits - Clear all audit records
auditsRouter.delete("/", async (_req, res) => {
  try {
    const { contract } = await getFabric();
    const resultBytes = await contract.submitTransaction(
      "ClearAllAuditRecords"
    );
    const json = Buffer.from(resultBytes).toString("utf8");
    const result = JSON.parse(json);

    console.info(`Cleared ${result.deletedCount} audit records`);
    res.status(200).json(result);
  } catch (error: any) {
    const errorMessage = extractChaincodeError(error);
    console.error("Error clearing audits:", errorMessage);
    res.status(500).json({
      error: "Failed to clear audit records",
      message: errorMessage,
    });
  }
});
