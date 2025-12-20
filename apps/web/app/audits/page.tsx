import AuditsPageClient from "./AuditsPageClient";

export const dynamic = 'force-dynamic';

async function getAudits() {
  try {
    const r = await fetch("http://localhost:3000/api/audits", {
      cache: "no-store",
    });
    if (!r.ok) {
      const error = await r
        .json()
        .catch(() => ({ error: "Failed to fetch audits" }));
      throw new Error(error.message || error.error || "Failed to fetch audits");
    }
    return r.json();
  } catch (error: any) {
    console.error("Error fetching audits:", error);
    return [];
  }
}

export default async function AuditsPage() {
  const audits = await getAudits();
  return <AuditsPageClient audits={audits} />;
}
