import Link from "next/link";
import { Boxes, ArrowRight } from "lucide-react";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  return {
    IDEA: "Ideia",
    ANALYSIS: "Em analise",
    STRUCTURING: "Em estruturacao",
    READY: "Pronto para apresentacao",
    VALIDATION: "Em validacao",
    ACTIVE: "Ativo",
    PAUSED: "Pausado",
  }[status] ?? status;
}

export default async function VerticalsPage() {
  await requireAnyPermission(["planning.view", "admin.manage"]);
  const verticals = await prisma.vertical.findMany({
    orderBy: { sortOrder: "asc" },
    include: { products: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Mapa estrategico</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Verticais ProviderX</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Organizacao das frentes ProviderX Home, Comércios e Serviços Locais, Varejo e futuras linhas do negocio.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {verticals.map((vertical) => (
          <article
            className="rounded-lg border bg-slate-950/25 p-5"
            key={vertical.id}
            style={{ borderColor: `${vertical.color}55`, boxShadow: `0 0 34px ${vertical.color}12` }}
          >
            <div className="flex items-start justify-between">
              <Boxes size={22} style={{ color: vertical.color }} />
              <span className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400">{statusLabel(vertical.status)}</span>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-white">{vertical.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{vertical.description}</p>
            {vertical.targetAudience ? <p className="mt-3 text-sm leading-6 text-slate-500">{vertical.targetAudience}</p> : null}
            <div className="mt-5 space-y-2">
              {vertical.products.map((product) => (
                <Link
                  className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm text-slate-300"
                  href="/products"
                  key={product.id}
                >
                  {product.name}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
