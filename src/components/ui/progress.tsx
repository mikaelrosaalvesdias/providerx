interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  className?: string;
}

export function Progress({ value, max = 100, color = "var(--neon-cyan)", height = 4, className }: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const isVar = typeof color === "string" && color.startsWith("var");
  const glow = isVar ? "rgba(44,233,255,0.35)" : `${color}55`;

  return (
    <div
      className={className}
      style={{ height, borderRadius: height / 2, background: "var(--bg-elev-3)", overflow: "hidden" }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
          boxShadow: `0 0 12px ${glow}`,
          transition: "width 600ms var(--ease-out)",
          borderRadius: height / 2,
        }}
      />
    </div>
  );
}
