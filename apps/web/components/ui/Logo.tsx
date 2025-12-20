"use client";

interface LogoProps {
  showText?: boolean;
  className?: string;
  withShadow?: boolean;
  style?: React.CSSProperties;
}

export default function Logo({
  showText = false,
  className = "",
  withShadow = false,
  style = {},
}: LogoProps) {
  const shadowStyle = withShadow
    ? {
        filter:
          "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.2))",
      }
    : {};

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: showText ? "0.5rem" : "0",
        padding: 0,
        margin: 0,
      }}
    >
      <img
        src="/images/logos/logo.png"
        alt="ProcurePilot Logo"
        className={className}
        style={{
          objectFit: "contain",
          ...shadowStyle,
          padding: 0,
          margin: 0,
          display: "block",
          width: "auto",
          ...style,
        }}
      />
      {showText && (
        <span
          style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "inherit",
          }}
        >
          ProcurePilot
        </span>
      )}
    </div>
  );
}
