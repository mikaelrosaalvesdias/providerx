"use client";

import { useEffect, useRef, useState } from "react";

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  format?: (v: number) => string;
}

export function Slider({ label, value, onChange, min, max, step = 1, suffix, prefix, format }: SliderProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const savedRef = useRef(value);

  useEffect(() => {
    if (!focused) setDraft(String(value));
  }, [value, focused]);

  const commit = (raw: string) => {
    const normalized = raw.replace(",", ".");
    const n = parseFloat(normalized);
    if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
    else setDraft(String(value));
  };

  const displayValue = focused
    ? draft
    : format
    ? format(value).replace(prefix ?? "", "").trim()
    : String(value);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 10 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: focused ? "var(--bg-elev-2)" : "transparent",
            border: `1px solid ${focused ? "rgba(44,233,255,0.6)" : "var(--line)"}`,
            borderRadius: 6,
            padding: "3px 8px",
            boxShadow: focused ? "0 0 0 3px rgba(44,233,255,0.10)" : "none",
            minWidth: 90,
            justifyContent: "flex-end",
            transition: "border-color 150ms, box-shadow 150ms",
          }}
        >
          {prefix && (
            <span style={{ fontSize: 10, marginRight: 4, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
              {prefix}
            </span>
          )}
          <input
            type="text"
            value={displayValue}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={(e) => {
              setFocused(true);
              savedRef.current = value;
              setDraft(String(value));
              e.target.select();
            }}
            onBlur={() => {
              setFocused(false);
              commit(draft);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.currentTarget.blur(); }
              if (e.key === "Escape") {
                setFocused(false);
                onChange(savedRef.current);
                setDraft(String(savedRef.current));
                e.currentTarget.blur();
              }
            }}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              width: 64,
              textAlign: "right",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          />
          {suffix && (
            <span style={{ fontSize: 10, marginLeft: 3, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
              {suffix}
            </span>
          )}
        </div>
      </div>
      <input
        className="slider-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}
