import PDFDocument from "pdfkit";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireAnyPermission(["planning.view", "admin.manage"]);
  const sections = await prisma.businessPlanSection.findMany({ orderBy: { sortOrder: "asc" } });
  const doc = new PDFDocument({ margin: 48, size: "A4" });
  const chunks: Buffer[] = [];
  const done = new Promise<void>((resolve) => {
    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve());
  });

  doc.fontSize(22).text("ProviderX Planning Hub", { align: "left" });
  doc.moveDown(0.4);
  doc.fontSize(11).fillColor("#555").text("Plano de negocios interno", { align: "left" });
  doc.moveDown(1.2);

  for (const section of sections) {
    doc.fillColor("#111").fontSize(15).text(section.title);
    doc.moveDown(0.3);
    doc.fillColor("#333").fontSize(10).text(section.content, { lineGap: 3 });
    doc.moveDown(1);
  }

  doc.end();
  await done;

  return new Response(Buffer.concat(chunks), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="providerx-plano-de-negocios.pdf"',
    },
  });
}
