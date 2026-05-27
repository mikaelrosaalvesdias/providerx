"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Boxes, FileText, FolderKanban, LayoutDashboard, Network, Search, Sparkles, Target, TrendingUp } from "lucide-react";

interface PaletteItem {
  id: string;
  group: string;
  label: string;
  sub?: string;
  icon: React.ReactNode;
  shortcut?: string;
  href?: string;
  action?: () => void;
}

const STATIC_ITEMS: PaletteItem[] = [
  { id: "plan", group: "Acoes rapidas", label: "Editar plano de negocios", icon: <FileText size={15} strokeWidth={1.6} />, shortcut: "P", href: "/business-plan" },
  { id: "projection", group: "Acoes rapidas", label: "Simular projecao financeira", icon: <TrendingUp size={15} strokeWidth={1.6} />, shortcut: "F", href: "/financial-projections" },
  { id: "decision", group: "Acoes rapidas", label: "Registrar decisao estrategica", icon: <Sparkles size={15} strokeWidth={1.6} />, shortcut: "D", href: "/decisions" },
  { id: "nav-dashboard", group: "Pular para", label: "Central", icon: <LayoutDashboard size={15} strokeWidth={1.6} />, href: "/dashboard" },
  { id: "nav-verticals", group: "Pular para", label: "Verticais e produtos", icon: <Boxes size={15} strokeWidth={1.6} />, href: "/verticals" },
  { id: "nav-strategy", group: "Pular para", label: "Estrategia comercial", icon: <Target size={15} strokeWidth={1.6} />, href: "/strategy" },
  { id: "nav-org", group: "Pular para", label: "Organograma", icon: <Network size={15} strokeWidth={1.6} />, href: "/org-chart" },
  { id: "nav-materials", group: "Pular para", label: "Materiais", icon: <FolderKanban size={15} strokeWidth={1.6} />, href: "/materials" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allItems = STATIC_ITEMS;

  const filtered = query.trim()
    ? allItems.filter((it) => it.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter" && filtered[active]) { select(filtered[active]); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, active, filtered]); // eslint-disable-line react-hooks/exhaustive-deps

  const select = (item: PaletteItem) => {
    onClose();
    if (item.action) item.action();
    else if (item.href) router.push(item.href);
  };

  if (!open) return null;

  const groups = Array.from(new Set(filtered.map((i) => i.group)));

  let cursor = 0;
  const groupedWithIndex: { group: string; items: (PaletteItem & { idx: number })[] }[] = groups.map((g) => ({
    group: g,
    items: filtered
      .filter((i) => i.group === g)
      .map((i) => ({ ...i, idx: cursor++ })),
  }));

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(2, 4, 10, 0.62)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        paddingTop: 120,
        animation: "overlay-in 180ms var(--ease-out)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 620,
          maxWidth: "calc(100vw - 32px)",
          height: "fit-content",
          maxHeight: "calc(100vh - 160px)",
          background: "var(--bg-elev-2)",
          border: "1px solid var(--line-strong)",
          borderRadius: 14,
          boxShadow: "var(--sh-pop)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "modal-in 220ms var(--ease-out)",
        }}
      >
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
          <Search size={16} strokeWidth={1.6} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar ou pular para…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 15,
              color: "var(--text-primary)",
            }}
          />
          <kbd className="kbd" style={{ fontSize: 11 }}>esc</kbd>
        </div>

        {/* Results */}
        <div style={{ overflowY: "auto", maxHeight: 420 }}>
          {groupedWithIndex.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Nenhum resultado para &ldquo;{query}&rdquo;
            </div>
          ) : (
            groupedWithIndex.map(({ group, items }) => (
              <div key={group}>
                <div className="h-eyebrow" style={{ padding: "10px 16px 4px" }}>{group}</div>
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => select(item)}
                    onMouseEnter={() => setActive(item.idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "9px 16px",
                      background: item.idx === active ? "var(--bg-elev-3)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 100ms",
                    }}
                  >
                    <span style={{ color: item.idx === active ? "var(--neon-cyan)" : "var(--text-secondary)", flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <span style={{ flex: 1, fontSize: 14, color: "var(--text-primary)", fontWeight: 500 }}>{item.label}</span>
                    {item.sub && (
                      <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{item.sub}</span>
                    )}
                    {item.shortcut && (
                      <kbd className="kbd">{item.shortcut}</kbd>
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
            borderTop: "1px solid var(--line)",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <span><kbd className="kbd">↑↓</kbd> navegar</span>
            <span><kbd className="kbd">↵</kbd> selecionar</span>
            <span><kbd className="kbd">esc</kbd> fechar</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)" }}>
            <span className="pulse-dot" />
            Planning Hub
          </div>
        </div>
      </div>
    </div>
  );
}
