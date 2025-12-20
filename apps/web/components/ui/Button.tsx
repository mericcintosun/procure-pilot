"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  target?: "_blank" | "_self";
  className?: string;
  disabled?: boolean;
  openInNewTab?: boolean; // Default true for all buttons
}

export default function Button({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  icon,
  target,
  className = "",
  disabled = false,
  openInNewTab = true, // Default: open in new tab
}: ButtonProps) {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: 600,
    borderRadius: "var(--radius-lg)",
    transition: "all 0.2s ease",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };

  const sizeStyles = {
    sm: { padding: "0.5rem 1rem", fontSize: "0.875rem" },
    md: { padding: "0.75rem 1.5rem", fontSize: "1rem" },
    lg: { padding: "1rem 2.5rem", fontSize: "1rem" },
  };

  const variantStyles = {
    primary: {
      background: "var(--primary)",
      color: "white",
      boxShadow: "var(--shadow-md)",
    },
    secondary: {
      background: "rgba(255, 255, 255, 0.1)",
      color: "white",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
    },
    success: {
      background: "var(--success)",
      color: "white",
      boxShadow: "var(--shadow-md)",
    },
    outline: {
      background: "var(--bg-card)",
      color: "var(--primary-light)",
      boxShadow: "var(--shadow-lg)",
      border: "2px solid var(--border-primary)",
    },
  };

  const hoverStyles = {
    primary: {
      background: "var(--primary-dark)",
      transform: "translateY(-1px)",
      boxShadow: "var(--shadow-lg)",
    },
    secondary: {
      background: "rgba(255, 255, 255, 0.2)",
      transform: "translateY(-2px)",
    },
    success: {
      background: "#059669",
      transform: "translateY(-1px)",
      boxShadow: "var(--shadow-lg)",
    },
    outline: {
      transform: "translateY(-2px) scale(1.02)",
      boxShadow: "var(--shadow-xl)",
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const hover = hoverStyles[variant];
    Object.assign(e.currentTarget.style, hover);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    Object.assign(e.currentTarget.style, variantStyles[variant]);
    e.currentTarget.style.transform = "translateY(0) scale(1)";
  };

  if (href) {
    // All buttons open in new tab by default (unless explicitly set to _self)
    const finalTarget = target || (openInNewTab ? "_blank" : undefined);
    
    return (
      <motion.div
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        style={{ display: "inline-block" }}
      >
        <Link
          href={href}
          target={finalTarget}
          rel={finalTarget === "_blank" ? "noopener noreferrer" : undefined}
          style={combinedStyles}
          className={className}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {icon && <span>{icon}</span>}
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={combinedStyles}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}

