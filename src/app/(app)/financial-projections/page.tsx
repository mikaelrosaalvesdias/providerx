import { TrendingUp } from "lucide-react";
import { FinancialProjectionClient } from "@/components/FinancialProjectionClient";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";
import { createFinancialScenarioAction } from "@/lib/planning-actions";

export const dynamic = "force-dynamic";

function toNumber(value: unknown) {
  return Number(value || 0);
}

export default async function FinancialProjectionsPage() {
  await requireAnyPermission(["planning.view", "admin.manage"]);
  const scenarios = await prisma.financialScenario.findMany({ orderBy: { monthlyRevenue: "asc" } });
  const maxMonthly = Math.max(...scenarios.map((scenario) => toNumber(scenario.monthlyRevenue)), 1);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Projecoes financeiras</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Cenarios de crescimento</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Simulador estrategico para comparar provedores parceiros, ticket medio, custos estimados, receita mensal, receita anual e margem.
        </p>
      </header>

      <FinancialProjectionClient />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="neon-card rounded-lg p-5">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="text-cyan-100" size={20} />
            <h2 className="text-xl font-semibold text-white">Comparacao entre cenarios</h2>
          </div>
          <div className="space-y-4">
            {scenarios.map((scenario) => {
              const monthly = toNumber(scenario.monthlyRevenue);
              return (
                <div key={scenario.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-white">{scenario.name}</span>
                    <span className="font-mono text-cyan-100">{money(monthly)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-green-300 to-fuchsia-300"
                      style={{ width: `${Math.max(4, (monthly / maxMonthly) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {scenario.providerCount} provedores · ticket {money(scenario.averageTicket)} · anual {money(scenario.annualRevenue)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="neon-card rounded-lg p-5">
          <h2 className="text-xl font-semibold text-white">Salvar novo cenario</h2>
          <form action={createFinancialScenarioAction} className="mt-4 grid gap-4">
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Nome do cenario</span>
              <input name="name" required />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Provedores</span>
                <input name="providerCount" required type="number" />
              </label>
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Ticket medio</span>
                <input name="averageTicket" required step="0.01" type="number" />
              </label>
            </div>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Custos mensais estimados</span>
              <input name="estimatedCosts" step="0.01" type="number" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Tipo</span>
              <input name="scenarioType" placeholder="conservador, base, agressivo..." />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Observacoes</span>
              <textarea name="notes" />
            </label>
            <button className="primary-action" type="submit">Salvar cenario</button>
          </form>
        </div>
      </section>
    </div>
  );
}
