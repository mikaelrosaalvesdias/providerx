export const PRODUCTS: Record<string, { name: string; short: string; color: string; desc: string }> = {
  "vigia-amigo": { name: "Vigia Amigo", short: "VG", color: "#2ce9ff", desc: "Monitoramento e segurança inteligente" },
  "wi-facil":    { name: "Wi-Fácil",    short: "WF", color: "#4fffa6", desc: "Gestão Wi-Fi para clientes finais" },
  "atendai":     { name: "AtendAI",     short: "AI", color: "#a685ff", desc: "Atendimento WhatsApp com IA" },
  "pixel-facil": { name: "Pixel Fácil", short: "PX", color: "#ffd166", desc: "TV corporativa e mídia indoor" },
  "123-encarte": { name: "123 Encarte", short: "EN", color: "#ff5bb8", desc: "Encartes integrados ao ERP" },
};

interface ProductMarkProps {
  slug?: string;
  color?: string;
  short?: string;
  name?: string;
  size?: number;
  radius?: number;
}

export function ProductMark({ slug, color: colorProp, short: shortProp, name, size = 36, radius = 8 }: ProductMarkProps) {
  const meta = slug ? PRODUCTS[slug] : null;
  const c = colorProp ?? meta?.color ?? "#9aa4b8";
  const init = shortProp ?? meta?.short ?? (name ? name.slice(0, 2).toUpperCase() : "??");

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        color: c,
        background: `linear-gradient(155deg, ${c}22, ${c}08 60%, transparent)`,
        border: `1px solid ${c}40`,
        boxShadow: `inset 0 1px 0 ${c}30, 0 0 0 1px rgba(0,0,0,0.4)`,
        font: `600 ${Math.round(size * 0.34)}px/1 var(--font-mono)`,
        letterSpacing: "-0.02em",
      }}
    >
      {init}
    </div>
  );
}
