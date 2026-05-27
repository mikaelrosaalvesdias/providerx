"use client";

import { useEffect } from "react";
import { AlertTriangle, Check } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
}: ConfirmModalProps) {
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
        zIndex: 60,
        background: "rgba(2, 4, 10, 0.62)",
        backdropFilter: "blur(8px)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        animation: "overlay-in 180ms var(--ease-out)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          maxWidth: "100%",
          background: "var(--bg-elev-2)",
          border: "1px solid var(--line-strong)",
          borderRadius: 14,
          boxShadow: "var(--sh-pop)",
          animation: "modal-in 220ms var(--ease-out)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "22px 22px 14px" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                background: danger ? "rgba(255,94,108,0.10)" : "rgba(44,233,255,0.10)",
                border: `1px solid ${danger ? "rgba(255,94,108,0.25)" : "rgba(44,233,255,0.25)"}`,
                color: danger ? "var(--danger)" : "var(--neon-cyan)",
              }}
            >
              {danger ? <AlertTriangle size={18} strokeWidth={1.6} /> : <Check size={18} strokeWidth={1.6} />}
            </div>
            <div>
              <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                {title}
              </h3>
              {body && (
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{body}</p>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "14px 22px 20px",
            borderTop: "1px solid var(--line)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${danger ? "btn-danger" : "btn-primary"} btn-sm`}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
