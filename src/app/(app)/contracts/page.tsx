import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dateBR, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ContractsPage() {
  await requireAnyPermission(["contracts.manage"]);

  const contracts = await prisma.contract.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      company: true,
      partner: true,
      representative: true,
      salesPerson: true,
      items: { include: { product: true } },
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Contratos</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Contratos convertidos</h1>
        <p className="mt-2 text-sm text-slate-300">Contrato, empresa, produto, vigencia, licencas, setup, mensalidade, parceiro e comissao.</p>
      </header>

      <section className="neon-card rounded-lg p-5">
        <div className="table-scroll">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="py-3 pr-4">Codigo</th>
                <th className="py-3 pr-4">Empresa</th>
                <th className="py-3 pr-4">Produtos</th>
                <th className="py-3 pr-4">Inicio</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Setup</th>
                <th className="py-3 pr-4">Mensal</th>
                <th className="py-3 pr-4">Comissao</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr className="border-b border-slate-800" key={contract.id}>
                  <td className="py-4 pr-4 font-medium text-cyan-100">{contract.code}</td>
                  <td className="py-4 pr-4 text-slate-300">{contract.company.tradeName || contract.company.legalName}</td>
                  <td className="py-4 pr-4 text-slate-300">{contract.items.map((item) => item.product.name).join(", ")}</td>
                  <td className="py-4 pr-4 text-slate-300">{dateBR(contract.startDate)}</td>
                  <td className="py-4 pr-4 text-slate-300">{contract.status}</td>
                  <td className="py-4 pr-4 text-slate-300">{money(contract.setupValue)}</td>
                  <td className="py-4 pr-4 text-slate-300">{money(contract.monthlyValue)}</td>
                  <td className="py-4 pr-4 text-slate-300">{money(contract.commissionValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
