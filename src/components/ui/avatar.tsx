const PALETTE = ["#2ce9ff", "#a685ff", "#4fffa6", "#ffd166", "#ff5bb8"];

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
}

export function Avatar({ name, size = 28, color }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase();
  const palette = color ?? PALETTE[initials.charCodeAt(0) % PALETTE.length];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        color: "#0a0d16",
        background: `linear-gradient(135deg, ${palette}, ${palette}aa)`,
        font: `600 ${Math.round(size * 0.4)}px/1 var(--font-sans)`,
        letterSpacing: "-0.02em",
        boxShadow: `0 0 0 1px ${palette}55`,
      }}
    >
      {initials}
    </div>
  );
}
