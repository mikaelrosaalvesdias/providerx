import { prisma } from "@/lib/db";
import { requireAnyPermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireAnyPermission(["planning.view", "admin.manage"]);
  const sections = await prisma.businessPlanSection.findMany({ orderBy: { sortOrder: "asc" } });
  const markdown = [
    "# ProviderX Planning Hub",
    "",
    ...sections.flatMap((section) => [`## ${section.title}`, "", section.content, ""]),
  ].join("\n");

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="providerx-plano-de-negocios.md"',
    },
  });
}
