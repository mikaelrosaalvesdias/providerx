import { Orbit } from "lucide-react";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  return {
    IDEA: "Ideia",
    ANALYSIS: "Em analise",
    STRUCTURING: "Em estruturacao",
    READY: "Pronto para apresentacao",
    VALIDATION: "Em validacao",
    ACTIVE: "Ativo",
    PAUSED: "Pausado",
  }[status] ?? status;
}

export default async function ProductsPage() {
  await requireAnyPermission(["planning.view", "admin.manage"]);
  const products = await prisma.productSolution.findMany({
    orderBy: [{ vertical: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    include: { vertical: true },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Produtos e solucoes</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Portfólio ProviderX</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Cada solucao nasce vinculada a uma vertical, com dor resolvida, publico-alvo, beneficio e modelo white-label.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article className="neon-card rounded-lg p-5" key={product.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-md border p-2" style={{ borderColor: `${product.vertical.color}55`, color: product.vertical.color }}>
                <Orbit size={20} />
              </div>
              <span className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400">{statusLabel(product.status)}</span>
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.18em]" style={{ color: product.vertical.color }}>{product.vertical.name}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{product.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{product.shortDescription || product.description}</p>
            <div className="mt-4 grid gap-3 text-sm">
              {product.painSolved ? (
                <div className="rounded-md border border-slate-800 bg-slate-950/30 p-3">
                  <p className="text-xs text-slate-500">Dor resolvida</p>
                  <p className="mt-1 text-slate-300">{product.painSolved}</p>
                </div>
              ) : null}
              {product.mainBenefit ? (
                <div className="rounded-md border border-slate-800 bg-slate-950/30 p-3">
                  <p className="text-xs text-slate-500">Beneficio principal</p>
                  <p className="mt-1 text-slate-300">{product.mainBenefit}</p>
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.features.slice(0, 5).map((feature) => (
                <span className="rounded-md border border-slate-700/80 px-2 py-1 text-xs text-slate-300" key={feature}>{feature}</span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
