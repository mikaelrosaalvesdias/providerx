interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
  className?: string;
}

export function SectionHead({ eyebrow, title, sub, right, className }: SectionHeadProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 20,
      }}
    >
      <div>
        {eyebrow && (
          <div className="h-eyebrow" style={{ marginBottom: 6 }}>
            {eyebrow}
          </div>
        )}
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        {sub && (
          <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>{sub}</div>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  );
}
