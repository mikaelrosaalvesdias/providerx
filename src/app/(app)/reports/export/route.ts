import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function csv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  await requireUser();
  const proposals = await prisma.proposal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: true,
      representative: true,
      salesPerson: true,
      partner: true,
      items: { include: { product: true } },
    },
  });

  const rows = [
    ["codigo", "empresa", "status", "produtos", "setup", "mensal", "desconto", "comissao", "repasse_parceiro", "representante", "vendedor", "parceiro"],
    ...proposals.map((proposal) => [
      proposal.code,
      proposal.company.tradeName || proposal.company.legalName,
      proposal.status,
      proposal.items.map((item) => item.product.name).join("; "),
      proposal.setupTotal,
      proposal.monthlyTotal,
      proposal.discountAmount,
      proposal.commissionTotal,
      proposal.partnerShareTotal,
      proposal.representative?.name || "",
      proposal.salesPerson?.name || "",
      proposal.partner?.tradeName || proposal.partner?.legalName || "",
    ]),
  ];

  const content = rows.map((row) => row.map(csv).join(",")).join("\n");
  return new Response(content, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=providerx-relatorio-propostas.csv",
    },
  });
}
