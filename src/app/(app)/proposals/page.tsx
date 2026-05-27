import Link from "next/link";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dateBR, money } from "@/lib/format";

export const dynamic = "force-dynamic";

const labels: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviada",
  NEGOTIATION: "Em negociacao",
  APPROVED: "Aprovada",
  LOST: "Perdida",
  CANCELED: "Cancelada",
  CONVERTED: "Convertida",
};

export default async function ProposalsPage() {
  await requireAnyPermission(["proposals.manage"]);

  const proposals = await prisma.proposal.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { company: true },
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Propostas</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Pipeline comercial</h1>
          <p className="mt-2 text-sm text-slate-300">Crie, edite, versiona, duplique e converta propostas em contratos.</p>
        </div>
        <Link className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950" href="/proposals/new">
          Nova proposta
        </Link>
      </header>

      <section className="neon-card rounded-lg p-5">
        <div className="table-scroll">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="py-3 pr-4">Codigo</th>
                <th className="py-3 pr-4">Empresa</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Setup</th>
                <th className="py-3 pr-4">Mensal</th>
                <th className="py-3 pr-4">Validade</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr className="border-b border-slate-800" key={proposal.id}>
                  <td className="py-4 pr-4">
                    <Link className="font-medium text-cyan-100" href={`/proposals/${proposal.id}`}>
                      {proposal.code}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-slate-300">{proposal.company.tradeName || proposal.company.legalName}</td>
                  <td className="py-4 pr-4 text-slate-300">{labels[proposal.status] ?? proposal.status}</td>
                  <td className="py-4 pr-4 text-slate-300">{money(proposal.setupTotal)}</td>
                  <td className="py-4 pr-4 text-slate-300">{money(proposal.monthlyTotal)}</td>
                  <td className="py-4 pr-4 text-slate-300">{dateBR(proposal.validityDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
