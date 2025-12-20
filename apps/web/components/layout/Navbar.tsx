"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiZap, FiHome, FiBarChart2, FiFile, FiPlus, FiArrowRight, FiMenu, FiX, FiStar, FiTrendingUp, FiTarget } from "react-icons/fi";
import Button from "../ui/Button";
import Logo from "../ui/Logo";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.25, 0, 1] as [number, number, number, number] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border-primary)",
        padding: "1rem 0",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--spacing-md)",
          flexWrap: "nowrap",
          overflow: "hidden",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            color: "inherit",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          <Logo size={32} showText={true} />
        </Link>

        {/* Desktop Navigation */}
        <div
          className="nav-items"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-xs)",
            flex: "1 1 auto",
            justifyContent: "center",
            minWidth: 0,
            overflow: "hidden",
            flexWrap: "nowrap",
          }}
        >
          <Link
            href="/"
            style={{
              padding: "0.5rem 0.75rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.8125rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiHome style={{ fontSize: "0.8125rem", flexShrink: 0 }} />
            Home
          </Link>
          <Link
            href="/rfq"
            style={{
              padding: "0.5rem 0.75rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.8125rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiBarChart2 style={{ fontSize: "0.8125rem", flexShrink: 0 }} />
            RFQ Workspace
          </Link>
          <Link
            href="/audits"
            style={{
              padding: "0.5rem 0.75rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.8125rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiFile style={{ fontSize: "0.8125rem", flexShrink: 0 }} />
            Audits
          </Link>
          <Link
            href="/features"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 0.75rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.8125rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiStar style={{ fontSize: "0.8125rem", flexShrink: 0 }} />
            Features
          </Link>
          <Link
            href="/market-findings"
            style={{
              padding: "0.5rem 0.75rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.8125rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiTrendingUp style={{ fontSize: "0.8125rem", flexShrink: 0 }} />
            Market Findings
          </Link>
          <Link
            href="/next-steps"
            style={{
              padding: "0.5rem 0.75rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.8125rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiTarget style={{ fontSize: "0.8125rem", flexShrink: 0 }} />
            Next Steps
          </Link>
        </div>

        {/* Desktop CTA Buttons */}
        <div
          className="nav-cta"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          <Button
            href="/audits/new"
            variant="success"
            size="sm"
            icon={<FiPlus style={{ fontSize: "0.875rem" }} />}
          >
            Create Audit
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "var(--radius-md)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--bg-secondary)",
              borderTop: "1px solid var(--border-primary)",
              boxShadow: "var(--shadow-lg)",
              padding: "var(--spacing-md)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-sm)",
              zIndex: 99,
              overflow: "hidden",
            }}
          >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: "0.75rem 1rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiHome style={{ fontSize: "1rem" }} />
            Home
          </Link>
          <Link
            href="/rfq"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: "0.75rem 1rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiBarChart2 style={{ fontSize: "1rem" }} />
            RFQ Workspace
          </Link>
          <Link
            href="/audits"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: "0.75rem 1rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiFile style={{ fontSize: "1rem" }} />
            Audits
          </Link>
          <Link
            href="/features"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: "0.75rem 1rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiStar style={{ fontSize: "1rem" }} />
            Features
          </Link>
          <Link
            href="/market-findings"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: "0.75rem 1rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiTrendingUp style={{ fontSize: "1rem" }} />
            Market Findings
          </Link>
          <Link
            href="/next-steps"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: "0.75rem 1rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <FiTarget style={{ fontSize: "1rem" }} />
            Next Steps
          </Link>
          <div
            style={{
              marginTop: "var(--spacing-sm)",
              paddingTop: "var(--spacing-sm)",
              borderTop: "1px solid var(--border-primary)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-xs)",
            }}
          >
            <Button
              href="/audits/new"
              variant="success"
              size="sm"
              icon={<FiPlus style={{ fontSize: "0.875rem" }} />}
              openInNewTab={false}
            >
              Create Audit
            </Button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

