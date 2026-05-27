import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  BookOpen,
  CalendarClock,
  FileText,
  GraduationCap,
  HandCoins,
  Layers3,
  PackageCheck,
  Presentation,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { requireUser, userPermissions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  DRAFT: "Rascunho",
  REVIEW: "Em revisao",
  SENT: "Enviada",
  NEGOTIATION: "Em negociacao",
  APPROVED: "Aprovada",
  LOST: "Perdida",
  CANCELED: "Cancelada",
  CONVERTED: "Convertida",
};

const quickActions = [
  { href: "/proposals/new", label: "Nova proposta", detail: "Construtor comercial", icon: FileText, tone: "text-cyan-100 border-cyan-300/30 bg-cyan-300/10", permissions: ["proposals.manage"] },
  { href: "/simulator", label: "Simulador", detail: "Margem, meta e comissao", icon: SlidersHorizontal, tone: "text-green-100 border-green-300/30 bg-green-300/10", permissions: ["proposals.manage", "commissions.manage"] },
  { href: "/playbook/vigia-amigo", label: "Playbook", detail: "Discurso padronizado", icon: BookOpen, tone: "text-violet-100 border-violet-300/30 bg-violet-300/10" },
  { href: "/presentations", label: "Materiais", detail: "PDFs, PPTs e imagens", icon: Presentation, tone: "text-amber-100 border-amber-300/30 bg-amber-300/10" },
  { href: "/knowledge", label: "Conhecimento", detail: "Trilhas e provas", icon: GraduationCap, tone: "text-fuchsia-100 border-fuchsia-300/30 bg-fuchsia-300/10" },
];

const commandPillars = [
  "Estrategia de venda",
  "Treinamento interno",
  "Proposta rapida",
  "Margem e comissao",
  "Materiais oficiais",
  "Performance comercial",
];

function toNumber(value: unknown) {
  return Number(value || 0);
}

function formatDate(value: Date | null) {
  if (!value) return "-";
  return value.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function hasAnyPermission(permissions: Set<string>, keys?: string[]) {
  if (!keys?.length) return true;
  return keys.some((key) => permissions.has(key));
}

function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof FileText;
  tone: string;
}) {
  return (
    <div className="neon-card rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className={`rounded-md border p-2 ${tone}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-400">{detail}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const permissions = userPermissions(user);
  const canManageAdmin = permissions.has("admin.manage");
  const canManageProposals = permissions.has("proposals.manage");
  const visibleQuickActions = quickActions.filter((item) => hasAnyPermission(permissions, item.permissions));
  const commandLinks = [
    canManageAdmin
      ? {
          href: "/admin/commissionBases",
          title: "Regras modulares",
          detail: "Precos, custos, bases de comissao, repasses e regras por produto.",
          icon: Users,
          tone: "text-cyan-100 hover:border-cyan-300/50",
        }
      : null,
    canManageAdmin
      ? {
          href: "/admin/proposalTemplates",
          title: "Padrao de proposta",
          detail: "Modelos, paginas A4, blocos comerciais e condicoes reutilizaveis.",
          icon: FileText,
          tone: "text-violet-100 hover:border-violet-300/50",
        }
      : null,
    permissions.has("reports.view")
      ? {
          href: "/reports",
          title: "Performance",
          detail: "Vendas, conversao, comissoes, margens, metas e produtos trabalhados.",
          icon: Trophy,
          tone: "text-amber-100 hover:border-amber-300/50",
        }
      : null,
  ].filter(Boolean) as { href: string; title: string; detail: string; icon: typeof FileText; tone: string }[];

  const [
    openCount,
    negotiationCount,
    approvedCount,
    wonCount,
    lostCount,
    predicted,
    recurring,
    setup,
    commissions,
    margin,
    stalledProposals,
    expiringContracts,
    goals,
    proposalItems,
    productCatalog,
    representatives,
    partners,
    statusGroups,
  ] = await Promise.all([
    prisma.proposal.count({ where: { status: { in: ["DRAFT", "REVIEW", "SENT", "NEGOTIATION"] } } }),
    prisma.proposal.count({ where: { status: "NEGOTIATION" } }),
    prisma.proposal.count({ where: { status: "APPROVED" } }),
    prisma.proposal.count({ where: { status: { in: ["APPROVED", "CONVERTED"] } } }),
    prisma.proposal.count({ where: { status: "LOST" } }),
    prisma.proposal.aggregate({ _sum: { setupTotal: true, monthlyTotal: true }, where: { status: { in: ["REVIEW", "SENT", "NEGOTIATION", "APPROVED"] } } }),
    prisma.contract.aggregate({ _sum: { monthlyValue: true }, where: { status: "ACTIVE" } }),
    prisma.proposal.aggregate({ _sum: { setupTotal: true }, where: { status: { in: ["APPROVED", "CONVERTED"] } } }),
    prisma.proposal.aggregate({ _sum: { commissionTotal: true }, where: { status: { in: ["APPROVED", "CONVERTED"] } } }),
    prisma.proposal.aggregate({ _sum: { estimatedMargin: true }, where: { status: { in: ["APPROVED", "CONVERTED"] } } }),
    prisma.proposal.findMany({
      where: {
        status: { in: ["SENT", "NEGOTIATION", "REVIEW"] },
        updatedAt: { lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
      },
      orderBy: { updatedAt: "asc" },
      take: 5,
      include: { company: true },
    }),
    prisma.contract.findMany({
      where: {
        status: { in: ["ACTIVE", "RENEWAL_PENDING"] },
        endDate: { lte: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45), gte: new Date() },
      },
      orderBy: { endDate: "asc" },
      take: 5,
      include: { company: true },
    }),
    prisma.goal.findMany({ orderBy: { periodEnd: "desc" }, take: 5 }),
    prisma.proposalItem.findMany({ include: { product: true }, take: 500 }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { plans: true, modules: true, playbookSections: true, knowledgeContents: true, uploadedAssets: true } },
      },
    }),
    prisma.proposal.groupBy({ by: ["representativeId"], _sum: { monthlyTotal: true }, where: { representativeId: { not: null } } }),
    prisma.proposal.groupBy({ by: ["partnerId"], _sum: { monthlyTotal: true }, where: { partnerId: { not: null } } }),
    prisma.proposal.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const productTotals = proposalItems.reduce<Record<string, { name: string; total: number; worked: number }>>((acc, item) => {
    const current = acc[item.productId] ?? { name: item.product.name, total: 0, worked: 0 };
    current.total += toNumber(item.monthlyValue) + toNumber(item.setupValue);
    current.worked += 1;
    acc[item.productId] = current;
    return acc;
  }, {});

  const productCards = productCatalog.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    color: product.primaryColor,
    category: product.category || "Produto ProviderX",
    description: product.shortDescription || product.description || "Produto comercial modular.",
    total: productTotals[product.id]?.total ?? 0,
    worked: productTotals[product.id]?.worked ?? 0,
    assets: product._count.uploadedAssets,
    playbook: product._count.playbookSections,
    knowledge: product._count.knowledgeContents,
    modules: product._count.modules,
  }));
  const topProducts = Object.values(productTotals).sort((a, b) => b.total - a.total).slice(0, 5);
  const topRepresentatives = representatives.sort((a, b) => toNumber(b._sum.monthlyTotal) - toNumber(a._sum.monthlyTotal)).slice(0, 5);
  const topPartners = partners.sort((a, b) => toNumber(b._sum.monthlyTotal) - toNumber(a._sum.monthlyTotal)).slice(0, 5);
  const [representativeNames, partnerNames] = await Promise.all([
    prisma.representative.findMany({
      where: { id: { in: topRepresentatives.map((item) => item.representativeId).filter(Boolean) as string[] } },
      select: { id: true, name: true },
    }),
    prisma.partnerCompany.findMany({
      where: { id: { in: topPartners.map((item) => item.partnerId).filter(Boolean) as string[] } },
      select: { id: true, tradeName: true, legalName: true },
    }),
  ]);
  const representativeNameMap = new Map(representativeNames.map((item) => [item.id, item.name]));
  const partnerNameMap = new Map(partnerNames.map((item) => [item.id, item.tradeName || item.legalName]));
  const maxProduct = Math.max(...topProducts.map((item) => item.total), 1);

  return (
    <div className="space-y-6">
      <header className="command-surface overflow-hidden rounded-lg border border-cyan-300/20 p-5 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
              <Sparkles size={16} />
              ProviderX Comercial
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">Central de comando comercial</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Produtos, playbooks, propostas, simulacoes, materiais, treinamento e performance em uma operacao interna unica.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {commandPillars.map((item) => (
                <span className="rounded-md border border-slate-700/80 bg-slate-950/40 px-3 py-2 text-xs text-slate-300" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {visibleQuickActions.map((item) => {
              const Icon = item.icon;
              return (
                <Link className={`group rounded-lg border p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/50 ${item.tone}`} href={item.href} key={item.href}>
                  <div className="flex items-center justify-between gap-3">
                    <Icon size={20} />
                    <ArrowUpRight className="opacity-70 transition group-hover:opacity-100" size={16} />
                  </div>
                  <div className="mt-3 font-semibold text-white">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-300">{item.detail}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <section>
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-xl font-semibold text-white">Produtos ProviderX</h2>
            <p className="mt-1 text-sm text-slate-400">Carteira ativa, materiais, playbook e tracao comercial por produto.</p>
          </div>
          {canManageAdmin ? (
            <Link className="inline-flex items-center gap-2 text-sm text-cyan-100" href="/admin/products">
              Organizar produtos
              <ArrowRight size={16} />
            </Link>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {productCards.map((product) => (
            <Link
              className="product-card group rounded-lg border bg-slate-950/50 p-4 transition hover:-translate-y-1"
              href={`/playbook/${product.slug}`}
              key={product.id}
              style={{ borderColor: product.color, boxShadow: `0 0 28px ${product.color}24` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-slate-950/70" style={{ borderColor: product.color, color: product.color }}>
                  <PackageCheck size={20} />
                </div>
                <span className="rounded-md border border-slate-700/80 px-2 py-1 text-xs text-slate-300">{product.category}</span>
              </div>
              <h3 className="mt-4 font-semibold text-white">{product.name}</h3>
              <p className="mt-2 line-clamp-3 min-h-16 text-sm leading-5 text-slate-300">{product.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400">
                <span>{product.modules} modulos</span>
                <span>{product.playbook} playbooks</span>
                <span>{product.assets} materiais</span>
                <span>{product.knowledge} aulas</span>
              </div>
              <div className="mt-4 border-t border-slate-800 pt-3">
                <div className="text-xs uppercase text-slate-500">Pipeline trabalhado</div>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <span className="text-lg font-semibold text-white">{money(product.total)}</span>
                  <span className="text-xs text-slate-400">{product.worked} itens</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Propostas abertas" value={String(openCount)} detail={`${negotiationCount} em negociacao`} icon={FileText} tone="border-cyan-300/30 bg-cyan-300/10 text-cyan-100" />
        <KpiCard label="Aprovadas" value={String(approvedCount)} detail={`${lostCount} perdidas registradas`} icon={Trophy} tone="border-green-300/30 bg-green-300/10 text-green-100" />
        <KpiCard label="Receita prevista" value={money(toNumber(predicted._sum.setupTotal) + toNumber(predicted._sum.monthlyTotal))} detail="Setup + mensal em pipeline" icon={BadgeDollarSign} tone="border-blue-300/30 bg-blue-300/10 text-blue-100" />
        <KpiCard label="Receita recorrente" value={money(recurring._sum.monthlyValue)} detail="Contratos ativos" icon={BadgeDollarSign} tone="border-violet-300/30 bg-violet-300/10 text-violet-100" />
        <KpiCard label="Setup vendido" value={money(setup._sum.setupTotal)} detail="Propostas aprovadas/convertidas" icon={Target} tone="border-amber-300/30 bg-amber-300/10 text-amber-100" />
        <KpiCard label="Comissao prevista" value={money(commissions._sum.commissionTotal)} detail="Base em propostas ganhas" icon={HandCoins} tone="border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-100" />
        <KpiCard label="Margem estimada" value={money(margin._sum.estimatedMargin)} detail={`${wonCount} propostas ganhas/convertidas`} icon={ShieldCheck} tone="border-emerald-300/30 bg-emerald-300/10 text-emerald-100" />
        <KpiCard label="Produtos ativos" value={String(productCatalog.length)} detail="Carteira comercial cadastrada" icon={Layers3} tone="border-cyan-300/30 bg-cyan-300/10 text-cyan-100" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Top produtos</h2>
          <div className="mt-5 space-y-4">
            {topProducts.length ? (
              topProducts.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-cyan-100">{money(item.total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400"
                      style={{ width: `${Math.max((item.total / maxProduct) * 100, 6)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Sem itens de proposta ainda.</p>
            )}
          </div>
        </div>

        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Propostas por status</h2>
          <div className="mt-4 space-y-3">
            {statusGroups.map((group) => (
              <div className="flex items-center justify-between rounded-md border border-slate-700/70 px-3 py-2 text-sm" key={group.status}>
                <span className="text-slate-300">{statusLabels[group.status] ?? group.status}</span>
                <span className="font-semibold text-white">{group._count._all}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="neon-card rounded-lg p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-200" size={18} />
            <h2 className="text-lg font-semibold text-white">Propostas paradas</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {stalledProposals.length ? (
              stalledProposals.map((proposal) => (
                <Link
                  className="flex items-center justify-between gap-3 rounded-md border border-slate-700/70 px-3 py-2 hover:border-amber-300/50"
                  href={canManageProposals ? `/proposals/${proposal.id}` : "/dashboard"}
                  key={proposal.id}
                >
                  <span className="text-slate-300">{proposal.company.tradeName || proposal.company.legalName}</span>
                  <span className="text-amber-100">{formatDate(proposal.updatedAt)}</span>
                </Link>
              ))
            ) : (
              <p className="text-slate-400">Sem propostas paradas ha mais de 14 dias.</p>
            )}
          </div>
        </div>

        <div className="neon-card rounded-lg p-5">
          <div className="flex items-center gap-2">
            <CalendarClock className="text-cyan-200" size={18} />
            <h2 className="text-lg font-semibold text-white">Contratos vencendo</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {expiringContracts.length ? (
              expiringContracts.map((contract) => (
                <div className="flex items-center justify-between gap-3 rounded-md border border-slate-700/70 px-3 py-2" key={contract.id}>
                  <span className="text-slate-300">{contract.company.tradeName || contract.company.legalName}</span>
                  <span className="text-cyan-100">{formatDate(contract.endDate)}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400">Sem contratos vencendo nos proximos 45 dias.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Meta x realizado</h2>
          <div className="mt-4 space-y-3">
            {goals.length ? (
              goals.map((goal) => {
                const target = toNumber(goal.targetAmount);
                const achieved = toNumber(goal.achievedAmount);
                return (
                  <div key={goal.id}>
                    <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                      <span className="text-slate-300">{goal.name}</span>
                      <span className="text-slate-100">{Math.round(target > 0 ? (achieved / target) * 100 : 0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className="h-2 rounded-full bg-green-300" style={{ width: `${Math.min(target > 0 ? (achieved / target) * 100 : 0, 100)}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400">{canManageAdmin ? "Cadastre metas no Admin." : "Sem metas cadastradas."}</p>
            )}
          </div>
        </div>

        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Top representantes</h2>
          <div className="mt-4 space-y-3 text-sm">
            {topRepresentatives.length ? topRepresentatives.map((item) => (
              <div className="flex items-center justify-between rounded-md border border-slate-700/70 px-3 py-2" key={item.representativeId}>
                <span className="text-slate-300">{item.representativeId ? representativeNameMap.get(item.representativeId) || item.representativeId.slice(0, 10) : "-"}</span>
                <span className="text-cyan-100">{money(item._sum.monthlyTotal)}</span>
              </div>
            )) : <p className="text-slate-400">Sem dados.</p>}
          </div>
        </div>

        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Top parceiros</h2>
          <div className="mt-4 space-y-3 text-sm">
            {topPartners.length ? topPartners.map((item) => (
              <div className="flex items-center justify-between rounded-md border border-slate-700/70 px-3 py-2" key={item.partnerId}>
                <span className="text-slate-300">{item.partnerId ? partnerNameMap.get(item.partnerId) || item.partnerId.slice(0, 10) : "-"}</span>
                <span className="text-cyan-100">{money(item._sum.monthlyTotal)}</span>
              </div>
            )) : <p className="text-slate-400">Sem dados.</p>}
          </div>
        </div>
      </section>

      {commandLinks.length ? (
        <section className="grid gap-4 md:grid-cols-3">
          {commandLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link className={`neon-card rounded-lg p-5 transition ${item.tone}`} href={item.href} key={item.href}>
                <Icon size={20} />
                <h2 className="mt-3 font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
              </Link>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}
