import { prisma } from "@/lib/db";
import { money } from "@/lib/format";
import { requireAnyPermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await requireAnyPermission(["reports.view", "admin.manage"]);
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv";
  const [verticals, products, scenarios, decisions] = await Promise.all([
    prisma.vertical.findMany({ include: { products: true }, orderBy: { sortOrder: "asc" } }),
    prisma.productSolution.findMany({ include: { vertical: true }, orderBy: { name: "asc" } }),
    prisma.financialScenario.findMany({ orderBy: { monthlyRevenue: "desc" } }),
    prisma.strategicDecision.findMany({ orderBy: { decisionDate: "desc" } }),
  ]);

  if (format === "markdown") {
    const markdown = [
      "# Relatorio Executivo ProviderX",
      "",
      "## Verticais",
      ...verticals.map((vertical) => `- ${vertical.name}: ${vertical.products.length} produtos/solucoes`),
      "",
      "## Produtos",
      ...products.map((product) => `- ${product.name} (${product.vertical.name}) - ${product.status}`),
      "",
      "## Cenarios financeiros",
      ...scenarios.map((scenario) => `- ${scenario.name}: ${money(scenario.monthlyRevenue)}/mes; ${money(scenario.annualRevenue)}/ano`),
      "",
      "## Decisoes estrategicas",
      ...decisions.map((decision) => `- ${decision.title}: ${decision.decision}`),
      "",
    ].join("\n");

    return new Response(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="providerx-relatorio-executivo.md"',
      },
    });
  }

  const rows = [
    ["tipo", "nome", "grupo", "status", "valor_mensal"],
    ...verticals.map((vertical) => ["vertical", vertical.name, "", vertical.status, ""]),
    ...products.map((product) => ["produto", product.name, product.vertical.name, product.status, ""]),
    ...scenarios.map((scenario) => ["cenario", scenario.name, scenario.scenarioType, scenario.status, String(scenario.monthlyRevenue)]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="providerx-relatorio-executivo.csv"',
    },
  });
}
