"use client";

import { motion } from "framer-motion";
import Hero from "../components/sections/Hero";
import Problem from "../components/sections/Problem";
import HowItWorks from "../components/sections/HowItWorks";
import TrustLayer from "../components/sections/TrustLayer";
import ValueProposition from "../components/sections/ValueProposition";
import AuditCTA from "../components/sections/AuditCTA";
import RFQCTA from "../components/sections/RFQCTA";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
      }}
    >
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <TrustLayer />
        <ValueProposition />
        <AuditCTA />
        <RFQCTA />
      </main>
    </motion.div>
  );
}
