import { Target } from "lucide-react";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function priorityLabel(value: string) {
  return { LOW: "Baixa", MEDIUM: "Media", HIGH: "Alta", CRITICAL: "Critica" }[value] ?? value;
}

export default async function StrategyPage() {
  await requireAnyPermission(["planning.view", "admin.manage"]);
  const [section, channels, differentials, audiences] = await Promise.all([
    prisma.businessPlanSection.findUnique({ where: { key: "estrategia-comercial" } }),
    prisma.acquisitionChannel.findMany({ orderBy: [{ priority: "desc" }, { channel: "asc" }] }),
    prisma.competitiveDifferential.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.targetAudience.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <header className="command-surface rounded-lg border border-cyan-300/20 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Estrategia comercial</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Como a ProviderX entra no mercado</h1>
        <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-300">{section?.content}</p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="neon-card rounded-lg p-5">
          <div className="mb-5 flex items-center gap-2">
            <Target className="text-cyan-100" size={20} />
            <h2 className="text-xl font-semibold text-white">Canais de aquisicao</h2>
          </div>
          <div className="grid gap-3">
            {channels.map((channel) => (
              <div className="rounded-md border border-slate-800 bg-slate-950/30 p-4" key={channel.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">{channel.channel}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{channel.description}</p>
                  </div>
                  <span className="rounded-md border border-cyan-300/20 bg-cyan-300/5 px-2 py-1 text-xs text-cyan-100">
                    {priorityLabel(channel.priority)}
                  </span>
                </div>
                {channel.responsible ? <p className="mt-3 text-xs text-slate-500">Responsavel: {channel.responsible}</p> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="neon-card rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white">Publico-alvo</h2>
            <div className="mt-4 space-y-3">
              {audiences.map((audience) => (
                <div className="rounded-md border border-slate-800 bg-slate-950/30 p-3" key={audience.id}>
                  <p className="text-sm font-medium text-white">{audience.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{audience.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="neon-card rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white">Diferenciais</h2>
            <div className="mt-4 space-y-3">
              {differentials.map((item) => (
                <div className="rounded-md border border-slate-800 bg-slate-950/30 p-3" key={item.id}>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
