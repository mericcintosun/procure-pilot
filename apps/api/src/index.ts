import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { auditsRouter } from "./routes/audits";
import { aiRouter } from "./routes/ai";
import { rfqRouter } from "./routes/rfq";
import { closeFabric, getFabric } from "./fabric/gateway";
import { startAutoAnalysis, stopAutoAnalysis } from "./fabric/events";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", async (_req, res) => {
  try {
    // Fabric bağlantısını da validate etmek istersen:
    await getFabric();
    res.json({ ok: true });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ ok: false, error: "Fabric connection failed" });
  }
});

app.use("/audits", auditsRouter);
app.use("/ai", aiRouter);
app.use("/rfq", rfqRouter);

const port = Number(process.env.PORT ?? 4000);
const server = app.listen(port, async () => {
  console.log(`API listening on http://localhost:${port}`);
  
  // Start auto-analysis polling for automatic analysis
  if (process.env.AUTO_ANALYZE !== "false") {
    try {
      await startAutoAnalysis();
      console.log("✅ Auto-analysis enabled: New audits will be analyzed automatically");
    } catch (error) {
      console.warn("⚠️  Auto-analysis disabled:", error);
    }
  }
});

async function shutdown() {
  console.log("Shutting down...");
  stopAutoAnalysis();
  server.close();
  await closeFabric();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

