import { Sparkles } from "lucide-react";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dateBR } from "@/lib/format";
import { createDecisionAction } from "@/lib/planning-actions";

export const dynamic = "force-dynamic";

export default async function DecisionsPage() {
  await requireAnyPermission(["planning.view", "admin.manage"]);
  const decisions = await prisma.strategicDecision.findMany({
    orderBy: { decisionDate: "desc" },
    include: { product: { include: { vertical: true } } },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Registro executivo</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Decisoes estrategicas</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Historico de contexto, decisao tomada, motivo, impacto esperado e responsavel.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-xl font-semibold text-white">Registrar decisao</h2>
          <form action={createDecisionAction} className="mt-4 grid gap-4">
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Titulo</span>
              <input name="title" required />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Area relacionada</span>
              <input name="relatedArea" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Contexto</span>
              <textarea name="context" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Decisao tomada</span>
              <textarea name="decision" required />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Motivo</span>
              <textarea name="reason" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Impacto esperado</span>
              <textarea name="expectedImpact" />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Responsavel</span>
                <input name="responsible" />
              </label>
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Tags</span>
                <input name="tags" />
              </label>
            </div>
            <button className="primary-action" type="submit">Registrar</button>
          </form>
        </div>

        <div className="space-y-3">
          {decisions.map((decision) => (
            <article className="neon-card rounded-lg p-5" key={decision.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-100" />
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{decision.relatedArea || "Estrategia"}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white">{decision.title}</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-300">{decision.decision}</p>
                </div>
                <span className="whitespace-nowrap rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400">{dateBR(decision.decisionDate)}</span>
              </div>
              {decision.reason ? <p className="mt-4 text-sm leading-6 text-slate-500">Motivo: {decision.reason}</p> : null}
              {decision.expectedImpact ? <p className="mt-2 text-sm leading-6 text-slate-500">Impacto: {decision.expectedImpact}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {decision.tags.map((tag) => (
                  <span className="rounded-md border border-slate-700/80 px-2 py-1 text-xs text-slate-300" key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
