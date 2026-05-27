import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function uploadRoot() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAnyPermission(["proposals.manage"]);
  const { id } = await params;
  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      company: true,
      items: { include: { product: true, plan: true } },
      pages: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: { imageAsset: true, product: true } },
      representative: true,
      salesPerson: true,
      partner: true,
    },
  });

  if (!proposal) {
    return new Response("Proposta nao encontrada", { status: 404 });
  }

  const doc = new PDFDocument({ size: "A4", margin: 48 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<void>((resolve) => doc.on("end", resolve));

  doc.fontSize(20).text("ProviderX Playbook Comercial", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(16).text(`Proposta ${proposal.code}`);
  doc.moveDown();
  doc.fontSize(10).fillColor("#444").text(`Empresa: ${proposal.company.tradeName || proposal.company.legalName}`);
  doc.text(`Responsavel: ${proposal.responsibleName || proposal.company.contactName || "-"}`);
  doc.text(`CNPJ: ${proposal.cnpj || proposal.company.cnpj || "-"}`);
  doc.text(`Status: ${proposal.status}`);
  doc.text(`Representante: ${proposal.representative?.name || "-"}`);
  doc.text(`Vendedor: ${proposal.salesPerson?.name || "-"}`);
  doc.text(`Parceiro: ${proposal.partner?.tradeName || proposal.partner?.legalName || "-"}`);
  doc.moveDown();

  doc.fillColor("#000").fontSize(13).text("Itens");
  doc.moveDown(0.5);
  proposal.items.forEach((item, index) => {
    doc.fontSize(11).text(`${index + 1}. ${item.product.name}${item.plan ? ` - ${item.plan.name}` : ""}`);
    doc.fontSize(10).text(`Licencas: ${item.licenseQuantity}`);
    doc.text(`Setup: ${money(item.setupValue)} | Mensal: ${money(item.monthlyValue)} | Desconto: ${money(item.discountValue)}`);
    doc.text(`Comissao vendedor: ${money(item.salesPersonCommissionValue)} | Comissao representante: ${money(item.representativeCommissionValue)}`);
    doc.text(`Repasse parceiro: ${money(item.partnerShareValue)}`);
    doc.moveDown(0.7);
  });

  doc.moveDown();
  doc.fontSize(13).text("Totais");
  doc.fontSize(11).text(`Setup: ${money(proposal.setupTotal)}`);
  doc.text(`Mensalidade: ${money(proposal.monthlyTotal)}`);
  doc.text(`Desconto: ${money(proposal.discountAmount)}`);
  doc.text(`Comissao prevista: ${money(proposal.commissionTotal)}`);
  doc.text(`Repasse parceiro: ${money(proposal.partnerShareTotal)}`);

  if (proposal.notes) {
    doc.moveDown();
    doc.fontSize(13).text("Observacoes");
    doc.fontSize(10).text(proposal.notes);
  }

  if (proposal.commercialCondition) {
    doc.moveDown();
    doc.fontSize(13).text("Condicao comercial");
    doc.fontSize(10).text(proposal.commercialCondition);
  }

  for (const page of proposal.pages) {
    doc.addPage();
    doc.fillColor("#000").fontSize(18).text(page.title);
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor("#555").text(`${page.pageType}${page.product ? ` | ${page.product.name}` : ""}`);
    doc.moveDown();

    if (page.imageAsset) {
      const root = path.resolve(uploadRoot());
      const fullPath = path.resolve(root, page.imageAsset.storageKey);
      if (fullPath.startsWith(root) && fs.existsSync(fullPath) && page.imageAsset.mimeType.startsWith("image/")) {
        doc.image(fullPath, 48, 110, { fit: [500, 680], align: "center", valign: "center" });
      } else {
        doc.fillColor("#333").fontSize(10).text(`Arquivo vinculado: ${page.imageAsset.originalName}`);
      }
    }

    if (page.content) {
      doc.fillColor("#111").fontSize(11).text(page.content, { align: "left", lineGap: 4 });
    }
  }

  doc.end();
  await done;

  return new Response(Buffer.concat(chunks), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${proposal.code}.pdf"`,
    },
  });
}
