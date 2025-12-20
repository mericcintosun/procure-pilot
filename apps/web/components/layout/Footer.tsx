"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiZap, FiGithub, FiMail } from "react-icons/fi";
import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="footer-with-bg"
      style={{
        padding: "var(--spacing-3xl) var(--spacing-lg) var(--spacing-xl)",
        backgroundImage: "url(/images/footer-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "var(--text-secondary)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.96)",
          zIndex: 0,
        }}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--spacing-2xl)",
            marginBottom: "var(--spacing-2xl)",
            paddingBottom: "var(--spacing-2xl)",
            borderBottom: "1px solid var(--border-primary)",
          }}
        >
          {/* Brand */}
          <div>
            <Logo size={28} showText={true} />
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-tertiary)",
                lineHeight: 1.6,
                marginBottom: "var(--spacing-md)",
              }}
            >
              Evidence-first procurement AI with blockchain audit trails.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-sm)",
              }}
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-tertiary)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-hover)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-secondary)";
                  e.currentTarget.style.color = "var(--gray-400)";
                }}
              >
                <FiGithub style={{ fontSize: "1rem" }} />
              </a>
              <a
                href="mailto:contact@procurepilot.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-tertiary)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-hover)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-secondary)";
                  e.currentTarget.style.color = "var(--gray-400)";
                }}
              >
                <FiMail style={{ fontSize: "1rem" }} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "white",
                marginBottom: "var(--spacing-md)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Navigation
            </h4>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-sm)",
              }}
            >
              <Link
                href="/"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-tertiary)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--gray-400)";
                }}
              >
                Home
              </Link>
              <Link
                href="/rfq"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-tertiary)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--gray-400)";
                }}
              >
                RFQ Workspace
              </Link>
              <Link
                href="/audits"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-tertiary)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--gray-400)";
                }}
              >
                Audits
              </Link>
              <Link
                href="/audits/new"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-tertiary)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--gray-400)";
                }}
              >
                Create Audit
              </Link>
              <a
                href="/features"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-tertiary)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--gray-400)";
                }}
              >
                Features
              </a>
            </nav>
          </div>

          {/* Product */}
          <div>
            <h4
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "white",
                marginBottom: "var(--spacing-md)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Product
            </h4>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-sm)",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                }}
              >
                Evidence Extraction
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                }}
              >
                Offer Comparison
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                }}
              >
                Audit Trails
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                }}
              >
                Blockchain Storage
              </span>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "white",
                marginBottom: "var(--spacing-md)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Information
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              PDFs are processed but not stored permanently. Audit records are
              stored on Hyperledger Fabric for compliance and traceability.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--spacing-md)",
            paddingTop: "var(--spacing-lg)",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--gray-500)",
            }}
          >
            © {new Date().getFullYear()} ProcurePilot. Built for procurement
            teams.
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--spacing-lg)",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#"
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--gray-500)";
              }}
            >
              Privacy
            </a>
            <a
              href="#"
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--gray-500)";
              }}
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
