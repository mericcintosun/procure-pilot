import Link from "next/link";
import AuditAnalysis from "./AuditAnalysis";
import AuditSummary from "./AuditSummary";
import RawDataAccordion from "./RawDataAccordion";
import Logo from "../../../components/ui/Logo";

export const dynamic = 'force-dynamic';

async function getAudit(id: string) {
  const r = await fetch(`http://localhost:3000/api/audits/${id}`, { cache: "no-store" });
  if (!r.ok) return null;
  return r.json();
}

async function getAnalysis(id: string) {
  try {
    const r = await fetch(`http://localhost:3000/api/audits/${id}/analysis`, { cache: "no-store" });
    if (r.ok) {
      const data = await r.json();
      return data.exists ? data.analysis : null;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function AuditDetailPage({ params }: { params: { id: string } }) {
  const audit = await getAudit(params.id);
  if (!audit) return <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>Not found</div>;

  // Load existing analysis if available
  const analysis = await getAnalysis(params.id);

  return (
    <div className="container" style={{ padding: "clamp(1rem, 4vw, var(--spacing-xl)) clamp(1rem, 4vw, 2rem)", maxWidth: "1200px", margin: "0 auto" }}>
      <Link 
        href="/audits" 
        style={{ 
          textDecoration: "none", 
          color: "var(--primary)",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "var(--spacing-md)",
          fontSize: "clamp(0.875rem, 2vw, 1rem)",
        }}
      >
        ← Back to Audits
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", marginTop: "var(--spacing-sm)", marginBottom: "var(--spacing-xl)", flexWrap: "wrap" }}>
        <Logo size={40} withShadow={true} />
        <h1 style={{ margin: 0, fontSize: "clamp(1.5rem, 5vw, 2rem)", wordBreak: "break-word" }}>
          Audit Record: {audit.ID}
        </h1>
      </div>
      
      {/* Audit Summary Cards */}
      <AuditSummary auditData={audit.Data} auditId={audit.ID} analysis={analysis} />
      
      <div style={{ marginTop: "var(--spacing-2xl)", display: "grid", gap: "var(--spacing-xl)" }}>
        {/* AI Analysis Section */}
        <AuditAnalysis auditId={params.id} auditData={audit.Data} />
        
        {/* Raw Data Section - Collapsed */}
        <RawDataAccordion audit={audit} />
      </div>
    </div>
  );
}
