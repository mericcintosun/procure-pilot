/**
 * Fabric Chaincode Event Listener
 * Listens for AUDIT_CREATED events and triggers automatic analysis
 *
 * Note: Fabric Gateway event listening requires a persistent connection.
 * For MVP, we'll use polling or manual trigger instead of real-time events.
 */

import { getFabric } from "./gateway";
import { analyzeAudit } from "../ai/gemini";
import { validateAuditRules } from "../ai/rules";

let eventListenerActive = false;
let pollInterval: NodeJS.Timeout | null = null;

/**
 * Poll for new audits and auto-analyze them
 * This is a simpler approach than real-time event listening for MVP
 */
export async function startAutoAnalysis() {
  if (eventListenerActive) {
    console.log("Auto-analysis already active");
    return;
  }

  console.log("✅ Auto-analysis enabled (polling mode)");
  eventListenerActive = true;

  // Poll every 10 seconds for new audits without analysis
  pollInterval = setInterval(async () => {
    try {
      const { contract } = await getFabric();
      const allAuditsBytes = await contract.evaluateTransaction(
        "GetAllAuditRecords"
      );
      const allAudits = JSON.parse(
        Buffer.from(allAuditsBytes).toString("utf8")
      );

      for (const audit of allAudits) {
        // Skip if already analyzed or is an analysis record
        if (audit.ID.startsWith("analysis::")) continue;

        const analysisKey = `analysis::${audit.ID}`;

        // Check if analysis already exists
        try {
          await contract.evaluateTransaction("ReadAuditRecord", analysisKey);
          continue; // Analysis already exists
        } catch {
          // Analysis doesn't exist, create it
        }

        console.log(`🤖 Auto-analyzing audit: ${audit.ID}`);

        try {
          // Run rules validation
          const rulesResult = validateAuditRules(audit.Data);

          // Analyze with Gemini
          const { analysis, metadata } = await analyzeAudit(
            audit.Data,
            rulesResult.score
          );

          const combinedRiskScore = Math.max(
            rulesResult.score,
            analysis.riskScore
          );

          // Store analysis in Fabric using StoreAnalysis (idempotent)
          const analysisRecord = {
            auditId: audit.ID,
            analysis: {
              ...analysis,
              riskScore: combinedRiskScore,
              rulesResult,
            },
            metadata,
            analyzedAt: new Date().toISOString(),
            autoAnalyzed: true,
          };

          // Use StoreAnalysis which is idempotent (returns existing if already exists)
          try {
            await contract.submitTransaction(
              "StoreAnalysis",
              audit.ID,
              JSON.stringify(analysisRecord)
            );
          } catch (error: any) {
            const errorMsg = error.message || String(error);

            // If analysis already exists (from manual trigger), that's okay
            if (
              errorMsg.includes("already exists") ||
              errorMsg.includes("MVCC")
            ) {
              console.log(
                `ℹ️  Analysis for ${audit.ID} already exists, skipping`
              );
              continue;
            }

            // If function doesn't exist, log warning and skip (chaincode needs redeploy)
            if (
              errorMsg.includes("function that does not exist") ||
              errorMsg.includes("ABORTED")
            ) {
              console.warn(
                `⚠️  StoreAnalysis function not found for ${audit.ID}. Please redeploy chaincode with version 1.3 and sequence 5.`
              );
              continue; // Skip this audit, don't throw
            }

            // Other errors - log and skip
            console.error(
              `Error storing analysis for ${audit.ID}: ${errorMsg}`
            );
            continue;
          }

          console.log(
            `✅ Auto-analysis completed for ${audit.ID} (Risk: ${combinedRiskScore})`
          );
        } catch (error: any) {
          console.error(`Error auto-analyzing ${audit.ID}:`, error.message);
        }
      }
    } catch (error: any) {
      console.error("Error in auto-analysis polling:", error.message);
    }
  }, 10000); // Poll every 10 seconds
}

export function stopAutoAnalysis() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  eventListenerActive = false;
  console.log("Auto-analysis stopped");
}
