import Link from "next/link";
import { ProposalForm } from "@/components/ProposalForm";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function formOptions() {
  const [companies, products, plans, partners, representatives, sellers] = await Promise.all([
    prisma.company.findMany({ orderBy: { legalName: "asc" }, select: { id: true, legalName: true, tradeName: true } }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.productPlan.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.partnerCompany.findMany({ orderBy: { legalName: "asc" }, select: { id: true, legalName: true, tradeName: true } }),
    prisma.representative.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.salesPerson.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return {
    companies: companies.map((item) => ({ id: item.id, label: item.tradeName || item.legalName })),
    products: products.map((item) => ({ id: item.id, label: item.name })),
    plans: plans.map((item) => ({ id: item.id, label: item.name })),
    partners: partners.map((item) => ({ id: item.id, label: item.tradeName || item.legalName })),
    representatives: representatives.map((item) => ({ id: item.id, label: item.name })),
    sellers: sellers.map((item) => ({ id: item.id, label: item.name })),
  };
}

export default async function NewProposalPage() {
  await requireAnyPermission(["proposals.manage"]);
  const options = await formOptions();

  return (
    <div className="space-y-6">
      <header>
        <Link href="/proposals" className="text-sm text-cyan-200 hover:text-cyan-100">
          Propostas
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-white">Nova proposta</h1>
        <p className="mt-2 text-sm text-slate-300">Crie uma proposta com produto, licencas, setup, mensalidade, comissoes e repasse.</p>
      </header>
      <ProposalForm {...options} />
    </div>
  );
}
