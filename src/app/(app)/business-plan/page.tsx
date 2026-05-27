import Link from "next/link";
import { Download, RotateCcw } from "lucide-react";
import { AdminDialog } from "@/components/AdminDialog";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dateBR } from "@/lib/format";
import { restoreBusinessPlanVersion, updateBusinessPlanSection } from "@/lib/planning-actions";

export const dynamic = "force-dynamic";

export default async function BusinessPlanPage() {
  await requireAnyPermission(["planning.view", "admin.manage"]);

  const sections = await prisma.businessPlanSection.findMany({
    orderBy: { sortOrder: "asc" },
    include: { versions: { orderBy: { version: "desc" }, take: 3 } },
  });

  return (
    <div className="space-y-6">
      <header className="command-surface rounded-lg border border-cyan-300/20 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Documento vivo</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Plano de Negocios ProviderX</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Estrategia, verticais, modelo de receita, estrutura operacional, tecnologia, projecoes e visao de longo prazo em secoes versionadas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="subtle-button" href="/business-plan/export/markdown">
              <Download size={15} /> Markdown
            </Link>
            <Link className="subtle-button" href="/business-plan/export/pdf">
              <Download size={15} /> PDF simples
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4">
        {sections.map((section) => (
          <article className="neon-card rounded-lg p-5" key={section.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{section.key}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{section.title}</h2>
              </div>
              <AdminDialog title={`Editar ${section.title}`} triggerLabel="Editar secao" variant="subtle">
                <form action={updateBusinessPlanSection} className="grid gap-4">
                  <input name="sectionId" type="hidden" value={section.id} />
                  <label className="text-sm text-slate-300">
                    <span className="mb-2 block">Titulo</span>
                    <input name="title" defaultValue={section.title} required />
                  </label>
                  <label className="text-sm text-slate-300">
                    <span className="mb-2 block">Conteudo</span>
                    <textarea name="content" defaultValue={section.content} rows={10} required />
                  </label>
                  <button className="primary-action md:w-auto" type="submit">Salvar versao</button>
                </form>
              </AdminDialog>
            </div>
            <div className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-300">{section.content}</div>

            {section.versions.length ? (
              <div className="mt-5 border-t border-slate-800 pt-4">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Historico recente</p>
                <div className="grid gap-2">
                  {section.versions.map((version) => (
                    <div className="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-950/30 px-3 py-2" key={version.id}>
                      <span className="text-sm text-slate-300">v{version.version} · {dateBR(version.createdAt)}</span>
                      <form action={restoreBusinessPlanVersion}>
                        <input name="versionId" type="hidden" value={version.id} />
                        <button className="subtle-button" type="submit">
                          <RotateCcw size={14} /> Restaurar
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
