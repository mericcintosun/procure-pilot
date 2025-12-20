"use client";

import Image from "next/image";
import { FiZap } from "react-icons/fi";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  withShadow?: boolean;
}

export default function Logo({ size = 32, showText = false, className = "", withShadow = false }: LogoProps) {
  const shadowStyle = withShadow
    ? {
        filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.2))",
      }
    : {};

  try {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className={className}>
        <Image
          src="/images/logos/logo.png"
          alt="ProcurePilot Logo"
          width={size}
          height={size}
          style={{ objectFit: "contain", ...shadowStyle }}
        />
        {showText && (
          <span style={{ fontSize: `${size * 0.75}px`, fontWeight: 700, color: "inherit" }}>
            ProcurePilot
          </span>
        )}
      </div>
    );
  } catch {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className={className}>
        <div style={shadowStyle}>
          <FiZap style={{ fontSize: `${size}px`, color: "inherit" }} />
        </div>
        {showText && (
          <span style={{ fontSize: `${size * 0.75}px`, fontWeight: 700, color: "inherit" }}>
            ProcurePilot
          </span>
        )}
      </div>
    );
  }
}

