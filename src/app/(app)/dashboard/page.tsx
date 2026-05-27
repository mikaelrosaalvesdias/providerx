import Link from "next/link";
import { ArrowRight, Boxes, FileText, FolderKanban, Network, Sparkles, Target, TrendingUp } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    IDEA: "Ideia",
    ANALYSIS: "Em analise",
    STRUCTURING: "Em estruturacao",
    READY: "Pronto",
    VALIDATION: "Em validacao",
    ACTIVE: "Ativo",
    PAUSED: "Pausado",
  };
  return labels[status] ?? status;
}

export default async function DashboardPage() {
  await requireUser();

  const [
    slogan,
    overview,
    verticals,
    productsCount,
    initialScenario,
    scaledScenario,
    decisions,
    materials,
    departments,
    pendingProducts,
  ] = await Promise.all([
    prisma.businessPlanSection.findUnique({ where: { key: "slogan" } }),
    prisma.businessPlanSection.findUnique({ where: { key: "visao-geral" } }),
    prisma.vertical.findMany({
      orderBy: { sortOrder: "asc" },
      include: { products: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.productSolution.count(),
    prisma.financialScenario.findFirst({ where: { name: "Cenario inicial" } }),
    prisma.financialScenario.findFirst({ where: { name: "Cenario escalado - primeiro ano" } }),
    prisma.strategicDecision.findMany({ orderBy: { decisionDate: "desc" }, take: 4 }),
    prisma.strategicMaterial.findMany({ where: { isOfficial: true }, orderBy: { updatedAt: "desc" }, take: 4 }),
    prisma.department.findMany({ orderBy: { sortOrder: "asc" }, take: 6, include: { positions: { orderBy: { sortOrder: "asc" } } } }),
    prisma.productSolution.findMany({
      where: { status: { in: ["IDEA", "ANALYSIS", "STRUCTURING", "VALIDATION"] } },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { vertical: true },
    }),
  ]);

  const cards = [
    { href: "/business-plan", label: "Plano de negocios", icon: FileText, color: "var(--neon-cyan)" },
    { href: "/financial-projections", label: "Projecao financeira", icon: TrendingUp, color: "var(--neon-green)" },
    { href: "/strategy", label: "Estrategia comercial", icon: Target, color: "var(--neon-violet)" },
    { href: "/org-chart", label: "Organograma", icon: Network, color: "var(--neon-amber)" },
    { href: "/materials", label: "Materiais", icon: FolderKanban, color: "var(--neon-magenta)" },
    { href: "/decisions", label: "Decisoes", icon: Sparkles, color: "var(--neon-cyan)" },
  ];

  return (
    <div className="space-y-8">
      <section className="anim-in command-surface rounded-lg border border-cyan-300/20 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200/80">
              <span className="pulse-dot" />
              ProviderX Planning Hub
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white">
              {slogan?.content || "Escale servicos. Multiplique receitas."}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              {overview?.content ||
                "Hub interno para estruturar verticais, solucoes white-label, modelo de receita, projecoes financeiras, materiais e decisoes estrategicas."}
            </p>
          </div>
          <div className="grid min-w-[280px] grid-cols-2 gap-3">
            <div className="rounded-md border border-cyan-300/20 bg-cyan-300/5 p-4">
              <p className="text-xs text-slate-400">Cenario inicial</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-cyan-100">{money(initialScenario?.monthlyRevenue)}</p>
            </div>
            <div className="rounded-md border border-green-300/20 bg-green-300/5 p-4">
              <p className="text-xs text-slate-400">Cenario escalado</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-green-100">{money(scaledScenario?.monthlyRevenue)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map(({ href, label, icon: Icon, color }) => (
          <Link className="neon-card rounded-lg p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/40" href={href} key={href}>
            <Icon size={19} style={{ color }} />
            <p className="mt-4 text-sm font-medium text-white">{label}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              Abrir <ArrowRight size={13} />
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="neon-card rounded-lg p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Verticais</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Estrutura das solucoes ProviderX</h2>
            </div>
            <Link className="text-sm text-cyan-100" href="/verticals">Ver mapa</Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {verticals.map((vertical) => (
              <div
                className="rounded-lg border bg-slate-950/25 p-4"
                key={vertical.id}
                style={{ borderColor: `${vertical.color}55`, boxShadow: `0 0 28px ${vertical.color}14` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <Boxes size={20} style={{ color: vertical.color }} />
                  <span className="rounded-md border border-slate-700 px-2 py-1 text-[11px] text-slate-400">{statusLabel(vertical.status)}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{vertical.name}</h3>
                <p className="mt-2 min-h-20 text-sm leading-6 text-slate-400">{vertical.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {vertical.products.slice(0, 4).map((product) => (
                    <span className="rounded-md border border-slate-700/80 px-2 py-1 text-xs text-slate-300" key={product.id}>
                      {product.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="neon-card rounded-lg p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Resumo</p>
          <div className="mt-5 grid gap-3">
            {[
              ["Verticais", verticals.length],
              ["Produtos e solucoes", productsCount],
              ["Departamentos", departments.length],
              ["Materiais oficiais", materials.length],
            ].map(([label, value]) => (
              <div className="flex items-center justify-between rounded-md border border-slate-700/70 bg-slate-950/30 px-4 py-3" key={label}>
                <span className="text-sm text-slate-400">{label}</span>
                <span className="font-mono text-xl font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Ultimas decisoes</h2>
          <div className="mt-4 space-y-3">
            {decisions.length ? decisions.map((decision) => (
              <div className="rounded-md border border-slate-700/70 bg-slate-950/30 p-3" key={decision.id}>
                <p className="text-sm font-medium text-white">{decision.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{decision.decision}</p>
              </div>
            )) : <p className="text-sm text-slate-500">Sem decisoes registradas.</p>}
          </div>
        </div>

        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Materiais oficiais</h2>
          <div className="mt-4 space-y-3">
            {materials.length ? materials.map((material) => (
              <div className="rounded-md border border-slate-700/70 bg-slate-950/30 p-3" key={material.id}>
                <p className="text-sm font-medium text-white">{material.title}</p>
                <p className="mt-1 text-xs text-slate-500">{material.materialType} · v{material.version}</p>
              </div>
            )) : <p className="text-sm text-slate-500">Nenhum material oficial marcado ainda.</p>}
          </div>
        </div>

        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Pendencias de planejamento</h2>
          <div className="mt-4 space-y-3">
            {pendingProducts.length ? pendingProducts.map((product) => (
              <div className="rounded-md border border-slate-700/70 bg-slate-950/30 p-3" key={product.id}>
                <p className="text-sm font-medium text-white">{product.name}</p>
                <p className="mt-1 text-xs text-slate-500">{product.vertical.name} · {statusLabel(product.status)}</p>
              </div>
            )) : <p className="text-sm text-slate-500">Sem pendencias nos produtos cadastrados.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
