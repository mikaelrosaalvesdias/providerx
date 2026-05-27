import { Network } from "lucide-react";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OrgChartPage() {
  await requireAnyPermission(["planning.view", "admin.manage"]);
  const [departments, rootNodes] = await Promise.all([
    prisma.department.findMany({ orderBy: { sortOrder: "asc" }, include: { positions: { orderBy: { sortOrder: "asc" } } } }),
    prisma.orgChartNode.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: "asc" },
      include: { children: { orderBy: { sortOrder: "asc" } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Estrutura operacional</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Organograma ProviderX</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Dois modos de leitura: departamentos e responsabilidades, cargos por departamento.
        </p>
      </header>

      <section className="neon-card rounded-lg p-5">
        <div className="mb-5 flex items-center gap-2">
          <Network className="text-cyan-100" size={20} />
          <h2 className="text-xl font-semibold text-white">Departamentos e responsabilidades</h2>
        </div>
        <div className="space-y-6">
          {rootNodes.map((root) => (
            <div key={root.id}>
              <div className="mx-auto w-fit rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-center text-white">
                <p className="font-semibold">{root.label}</p>
                {root.description ? <p className="mt-1 max-w-md text-xs text-cyan-100/80">{root.description}</p> : null}
              </div>
              <div className="mx-auto h-8 w-px bg-slate-700" />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {root.children.map((node) => (
                  <div className="rounded-lg border border-slate-700/80 bg-slate-950/35 p-4 text-center" key={node.id}>
                    <p className="font-semibold text-white">{node.label}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{node.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((department) => (
          <article className="neon-card rounded-lg p-5" key={department.id}>
            <h2 className="text-lg font-semibold text-white">{department.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{department.responsibilities || department.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {department.positions.map((position) => (
                <span className="rounded-md border border-slate-700/80 px-2 py-1 text-xs text-slate-300" key={position.id}>
                  {position.title}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
