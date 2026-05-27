"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface SideSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  footer?: React.ReactNode;
  width?: number;
  children: React.ReactNode;
}

export function SideSheet({ open, onClose, title, eyebrow, footer, width = 540, children }: SideSheetProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        background: "rgba(2, 4, 10, 0.55)",
        backdropFilter: "blur(4px)",
        animation: "overlay-in 200ms var(--ease-out)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width,
          background: "var(--bg-elev-1)",
          borderLeft: "1px solid var(--line)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          animation: "sheet-in 260ms var(--ease-out)",
        }}
      >
        <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              {eyebrow && (
                <div className="h-eyebrow" style={{ marginBottom: 4 }}>{eyebrow}</div>
              )}
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid var(--line)",
                background: "var(--bg-elev-2)",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          {children}
        </div>

        {footer && (
          <div style={{ padding: "14px 22px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
