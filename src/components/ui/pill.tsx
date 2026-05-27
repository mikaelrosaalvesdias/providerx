import clsx from "clsx";

export type PillTone = "default" | "cyan" | "green" | "violet" | "magenta" | "amber" | "danger";

interface PillProps {
  tone?: PillTone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Pill({ tone = "default", dot = false, children, className }: PillProps) {
  return (
    <span className={clsx("pill", tone !== "default" && `pill-${tone}`, className)}>
      {dot ? <span className="dot" /> : null}
      {children}
    </span>
  );
}

const STATUS_MAP: Record<string, { label: string; tone: PillTone }> = {
  DRAFT:       { label: "Rascunho",    tone: "default" },
  REVIEW:      { label: "Em revisão",  tone: "amber" },
  SENT:        { label: "Enviada",     tone: "cyan" },
  NEGOTIATION: { label: "Negociação",  tone: "violet" },
  APPROVED:    { label: "Aprovada",    tone: "green" },
  LOST:        { label: "Perdida",     tone: "danger" },
  CANCELED:    { label: "Cancelada",   tone: "default" },
  CONVERTED:   { label: "Convertida",  tone: "magenta" },
};

export function StatusBadge({ status }: { status: string }) {
  const { label, tone } = STATUS_MAP[status] ?? { label: status, tone: "default" as PillTone };
  return (
    <Pill tone={tone} dot>
      {label}
    </Pill>
  );
}
