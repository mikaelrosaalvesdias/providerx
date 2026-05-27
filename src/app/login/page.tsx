"use client";

import { useActionState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/login/actions";
import { appVersionLabel } from "@/lib/app-version";

const VERTICALS = [
  { name: "ProviderX Home", color: "#2ce9ff" },
  { name: "Comércios e Serviços Locais", color: "#4fffa6" },
  { name: "ProviderX Varejo", color: "#ff5bb8" },
];

const STATS = [
  { value: "3", label: "Verticais" },
  { value: "R$ 225k", label: "Cenario mensal" },
  { value: "100%", label: "White label" },
];

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        background: "var(--bg-base)",
      }}
    >
      {/* Brand panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 60px",
          background:
            "linear-gradient(135deg, rgba(44,233,255,0.08), transparent 34%), linear-gradient(225deg, rgba(255,61,242,0.07), transparent 36%), var(--bg-canvas)",
          borderRight: "1px solid var(--line)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(145deg, rgba(44,233,255,0.18), rgba(138,92,255,0.1))",
              border: "1px solid rgba(44,233,255,0.3)",
              color: "#c7fbff",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            PX
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>ProviderX</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
              PLANNING HUB · {appVersionLabel}
            </div>
          </div>
        </div>

        {/* Hero headline */}
        <div>
          <h1
            className="h-display"
            style={{ fontSize: 56, color: "var(--text-primary)", maxWidth: 540, marginBottom: 24 }}
          >
            Escale serviços. Multiplique receitas.
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 440, marginBottom: 36 }}>
            Central interna para planejar verticais, produtos white-label, modelo de receita, estrutura operacional, materiais e decisoes estrategicas.
          </p>

          {/* Mini stats */}
          <div style={{ display: "flex", gap: 32, marginBottom: 40 }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: "var(--neon-cyan)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Feature pills */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { Icon: ShieldCheck, label: "Plano de negocios vivo" },
              { Icon: LockKeyhole, label: "Acesso interno seguro" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--line-strong)",
                  background: "rgba(255,255,255,0.03)",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                <Icon size={14} strokeWidth={1.6} style={{ color: "var(--neon-cyan)" }} />
                {label}
              </div>
            ))}
          </div>

          {/* Product chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {VERTICALS.map(({ name, color }) => (
              <span
                key={name}
                style={{
                  padding: "5px 12px",
                  borderRadius: 99,
                  border: `1px solid ${color}55`,
                  color,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
          <span className="pulse-dot" />
          <span style={{ fontFamily: "var(--font-mono)" }}>providerx.cariap.com.br</span>
        </div>
      </div>

      {/* Login card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          background: "var(--bg-canvas)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            background: "var(--bg-elev-1)",
            border: "1px solid var(--line-strong)",
            borderRadius: 16,
            padding: 32,
            boxShadow: "var(--sh-pop)",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <div
              className="h-eyebrow"
              style={{ color: "var(--neon-cyan)", marginBottom: 8 }}
            >
              Acesso restrito
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              Entrar no Planning Hub
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Use seu usuario interno para acessar o hub estrategico ProviderX.
            </p>
          </div>

          <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
              E-mail
              <input name="email" type="email" autoComplete="email" required placeholder="seu@email.com" />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
              Senha
              <input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
            </label>

            {state?.error ? (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(255,94,108,0.1)",
                  border: "1px solid rgba(255,94,108,0.3)",
                  fontSize: 13,
                  color: "var(--danger)",
                }}
              >
                {state.error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 20px",
                borderRadius: 9,
                border: "1px solid rgba(44,233,255,0.4)",
                background: "linear-gradient(135deg, rgba(44,233,255,0.22), rgba(79,255,166,0.1))",
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: 14,
                cursor: pending ? "not-allowed" : "pointer",
                opacity: pending ? 0.7 : 1,
                marginTop: 4,
              }}
            >
              <span className={pending ? "shimmer-text" : ""}>{pending ? "Entrando..." : "Entrar"}</span>
              <ArrowRight size={16} strokeWidth={1.6} />
            </button>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 24,
              paddingTop: 16,
              borderTop: "1px solid var(--line)",
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span>ProviderX Planning Hub</span>
            <span>{appVersionLabel}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
