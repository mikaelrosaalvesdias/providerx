import Link from "next/link";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

function toNumber(value: unknown) {
  return Number(value || 0);
}

export default async function ReportsPage() {
  await requireAnyPermission(["reports.view"]);

  const [proposalsByStatus, proposalItems, contracts, commissions] = await Promise.all([
    prisma.proposal.groupBy({ by: ["status"], _count: { _all: true }, _sum: { setupTotal: true, monthlyTotal: true } }),
    prisma.proposalItem.findMany({ include: { product: true } }),
    prisma.contract.findMany({ include: { company: true, partner: true, representative: true, salesPerson: true, items: { include: { product: true } } } }),
    prisma.proposal.aggregate({ _sum: { commissionTotal: true, partnerShareTotal: true, setupTotal: true, monthlyTotal: true } }),
  ]);

  const productTotals = proposalItems.reduce<Record<string, { name: string; setup: number; monthly: number; licenses: number }>>((acc, item) => {
    const current = acc[item.productId] ?? { name: item.product.name, setup: 0, monthly: 0, licenses: 0 };
    current.setup += toNumber(item.setupValue);
    current.monthly += toNumber(item.monthlyValue);
    current.licenses += item.licenseQuantity;
    acc[item.productId] = current;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Relatorios</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Resultados comerciais</h1>
          <p className="mt-2 text-sm text-slate-300">Vendas por periodo, produto, representante, parceiro, comissoes, recorrencia e conversao.</p>
        </div>
        <Link className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950" href="/reports/export">
          Exportar CSV
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="neon-card rounded-lg p-5">
          <div className="text-sm text-slate-400">Setup</div>
          <div className="mt-2 text-2xl font-semibold text-white">{money(commissions._sum.setupTotal)}</div>
        </div>
        <div className="neon-card rounded-lg p-5">
          <div className="text-sm text-slate-400">Recorrencia</div>
          <div className="mt-2 text-2xl font-semibold text-white">{money(commissions._sum.monthlyTotal)}</div>
        </div>
        <div className="neon-card rounded-lg p-5">
          <div className="text-sm text-slate-400">Comissoes</div>
          <div className="mt-2 text-2xl font-semibold text-white">{money(commissions._sum.commissionTotal)}</div>
        </div>
        <div className="neon-card rounded-lg p-5">
          <div className="text-sm text-slate-400">Repasse parceiro</div>
          <div className="mt-2 text-2xl font-semibold text-white">{money(commissions._sum.partnerShareTotal)}</div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Propostas por status</h2>
          <div className="mt-4 space-y-3">
            {proposalsByStatus.map((item) => (
              <div className="rounded-md border border-slate-700 p-3" key={item.status}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{item.status}</span>
                  <span className="text-white">{item._count._all}</span>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Setup {money(item._sum.setupTotal)} | Mensal {money(item._sum.monthlyTotal)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Vendas por produto</h2>
          <div className="mt-4 space-y-3">
            {Object.values(productTotals).map((item) => (
              <div className="rounded-md border border-slate-700 p-3" key={item.name}>
                <div className="font-medium text-white">{item.name}</div>
                <div className="mt-2 text-sm text-slate-400">
                  Licencas {item.licenses} | Setup {money(item.setup)} | Mensal {money(item.monthly)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Contratos ativos</h2>
        <div className="mt-4 table-scroll">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="py-3 pr-4">Contrato</th>
                <th className="py-3 pr-4">Empresa</th>
                <th className="py-3 pr-4">Produto</th>
                <th className="py-3 pr-4">Representante</th>
                <th className="py-3 pr-4">Parceiro</th>
                <th className="py-3 pr-4">Mensal</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr className="border-b border-slate-800" key={contract.id}>
                  <td className="py-3 pr-4 text-cyan-100">{contract.code}</td>
                  <td className="py-3 pr-4 text-slate-300">{contract.company.tradeName || contract.company.legalName}</td>
                  <td className="py-3 pr-4 text-slate-300">{contract.items.map((item) => item.product.name).join(", ")}</td>
                  <td className="py-3 pr-4 text-slate-300">{contract.representative?.name || "-"}</td>
                  <td className="py-3 pr-4 text-slate-300">{contract.partner?.tradeName || contract.partner?.legalName || "-"}</td>
                  <td className="py-3 pr-4 text-slate-300">{money(contract.monthlyValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
