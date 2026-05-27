import Link from "next/link";
import { BarChart3, Download } from "lucide-react";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

function toNumber(value: unknown) {
  return Number(value || 0);
}

export default async function ReportsPage() {
  await requireAnyPermission(["reports.view", "admin.manage"]);
  const [verticals, products, scenarios, costs, materials, decisions, departments] = await Promise.all([
    prisma.vertical.findMany({ include: { products: true }, orderBy: { sortOrder: "asc" } }),
    prisma.productSolution.findMany({ orderBy: { status: "asc" } }),
    prisma.financialScenario.findMany({ orderBy: { monthlyRevenue: "desc" } }),
    prisma.costItem.findMany({ orderBy: { category: "asc" } }),
    prisma.strategicMaterial.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.strategicDecision.findMany({ orderBy: { decisionDate: "desc" } }),
    prisma.department.findMany({ include: { positions: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const monthlyRevenue = scenarios.reduce((max, scenario) => Math.max(max, toNumber(scenario.monthlyRevenue)), 0);
  const monthlyCosts = costs.reduce((sum, cost) => sum + toNumber(cost.estimatedValue), 0);

  const metrics = [
    ["Verticais", verticals.length],
    ["Produtos/solucoes", products.length],
    ["Maior cenario mensal", money(monthlyRevenue)],
    ["Custos planejados", money(monthlyCosts)],
    ["Materiais", materials.length],
    ["Decisoes", decisions.length],
    ["Departamentos", departments.length],
  ];

  return (
    <div className="space-y-6">
      <header className="command-surface rounded-lg border border-cyan-300/20 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Relatorios executivos</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Visao estrategica ProviderX</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Relatorios de plano, verticais, produtos, projecoes, custos, materiais, decisoes e estrutura operacional.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="subtle-button" href="/reports/export?format=csv"><Download size={15} /> CSV</Link>
            <Link className="subtle-button" href="/reports/export?format=markdown"><Download size={15} /> Markdown</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
        {metrics.map(([label, value]) => (
          <div className="neon-card rounded-lg p-4" key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-2 font-mono text-xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="neon-card rounded-lg p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="text-cyan-100" size={20} />
            <h2 className="text-xl font-semibold text-white">Produtos por status</h2>
          </div>
          <div className="grid gap-3">
            {Object.entries(
              products.reduce<Record<string, number>>((acc, product) => {
                acc[product.status] = (acc[product.status] ?? 0) + 1;
                return acc;
              }, {}),
            ).map(([status, count]) => (
              <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/30 px-4 py-3" key={status}>
                <span className="text-sm text-slate-300">{status}</span>
                <span className="font-mono text-cyan-100">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="neon-card rounded-lg p-5">
          <h2 className="text-xl font-semibold text-white">Cenarios de receita</h2>
          <div className="mt-4 space-y-3">
            {scenarios.map((scenario) => (
              <div className="rounded-md border border-slate-800 bg-slate-950/30 p-4" key={scenario.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-white">{scenario.name}</span>
                  <span className="font-mono text-green-100">{money(scenario.monthlyRevenue)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Anual: {money(scenario.annualRevenue)} · Margem: {money(scenario.estimatedMargin)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
