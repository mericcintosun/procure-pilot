#!/usr/bin/env node

/**
 * Seed Demo Data Script
 * Loads seed data from demo/seed/audits.seed.json into Fabric via API
 */

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const API = process.env.API_URL || process.env.API_BASE_URL || "http://localhost:4000";

async function upsertAudit(id, data) {
  try {
    const res = await fetch(`${API}/audits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data }),
    });

    const body = await res.text();
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = { raw: body };
    }

    if (!res.ok) {
      // If already exists (200 OK), that's fine
      if (res.status === 200) {
        console.log(`✅ ${id} (already exists)`);
        return;
      }
      throw new Error(`${res.status} ${JSON.stringify(parsed)}`);
    }

    console.log(`✅ ${id}`);
    return parsed;
  } catch (error) {
    console.error(`❌ ${id}:`, error.message);
    throw error;
  }
}

async function main() {
  const seedPath = join(rootDir, "demo/seed/audits.seed.json");
  
  if (!fs.existsSync(seedPath)) {
    console.error(`❌ Seed file not found: ${seedPath}`);
    process.exit(1);
  }

  const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  console.log(`📦 Loading ${seed.length} seed records...\n`);

  for (const item of seed) {
    await upsertAudit(item.id, item.data);
    // Small delay to avoid overwhelming the API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Seed data loaded successfully!`);
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});

