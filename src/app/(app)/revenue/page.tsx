import { BriefcaseBusiness } from "lucide-react";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RevenuePage() {
  await requireAnyPermission(["planning.view", "admin.manage"]);
  const [models, items] = await Promise.all([
    prisma.revenueModel.findMany({ orderBy: { name: "asc" }, include: { items: { orderBy: { name: "asc" } } } }),
    prisma.revenueItem.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalMonthly = items
    .filter((item) => item.periodicity.toLowerCase().includes("month") || item.periodicity.toLowerCase().includes("mensal"))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="space-y-6">
      <header className="command-surface rounded-lg border border-cyan-300/20 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Modelo de receita</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Receita planejada ProviderX</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Planejamento editavel de receita SaaS recorrente e receitas complementares como setup, implantacao, customizacao e suporte premium.
        </p>
        <div className="mt-5 inline-flex rounded-md border border-green-300/20 bg-green-300/5 px-4 py-3">
          <div>
            <p className="text-xs text-slate-400">Receita mensal planejada por item cadastrado</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-green-100">{money(totalMonthly)}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        {models.map((model) => (
          <article className="neon-card rounded-lg p-5" key={model.id}>
            <div className="flex items-start gap-3">
              <BriefcaseBusiness className="text-cyan-100" size={22} />
              <div>
                <h2 className="text-xl font-semibold text-white">{model.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{model.description}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {model.items.map((item) => (
                <div className="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-950/30 px-4 py-3" key={item.id}>
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.periodicity}</p>
                  </div>
                  <span className="font-mono text-sm text-cyan-100">{money(item.amount)}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
