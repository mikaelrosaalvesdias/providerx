"use client";

import { useMemo, useState } from "react";
import { money } from "@/lib/format";

export function FinancialProjectionClient() {
  const [providers, setProviders] = useState(10);
  const [ticket, setTicket] = useState(1500);
  const [costs, setCosts] = useState(0);

  const result = useMemo(() => {
    const monthly = providers * ticket;
    const annual = monthly * 12;
    const margin = monthly - costs;
    const marginPct = monthly > 0 ? (margin / monthly) * 100 : 0;
    return { monthly, annual, margin, marginPct };
  }, [providers, ticket, costs]);

  return (
    <div className="neon-card rounded-lg p-5">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Simulador estrategico</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Novo cenario financeiro</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm text-slate-300">
          <span className="mb-2 block">Provedores parceiros</span>
          <input min={0} type="number" value={providers} onChange={(event) => setProviders(Number(event.target.value))} />
        </label>
        <label className="text-sm text-slate-300">
          <span className="mb-2 block">Ticket medio ProviderX</span>
          <input min={0} step="100" type="number" value={ticket} onChange={(event) => setTicket(Number(event.target.value))} />
        </label>
        <label className="text-sm text-slate-300">
          <span className="mb-2 block">Custos mensais estimados</span>
          <input min={0} step="100" type="number" value={costs} onChange={(event) => setCosts(Number(event.target.value))} />
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {[
          ["Receita mensal", money(result.monthly), "text-cyan-100"],
          ["Receita anual", money(result.annual), "text-green-100"],
          ["Margem mensal", money(result.margin), "text-fuchsia-100"],
          ["Margem estimada", `${result.marginPct.toFixed(1)}%`, "text-amber-100"],
        ].map(([label, value, color]) => (
          <div className="rounded-md border border-slate-700/70 bg-slate-950/30 p-4" key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`mt-2 font-mono text-xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
