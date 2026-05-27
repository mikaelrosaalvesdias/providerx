import Link from "next/link";
import { adminResources } from "@/lib/admin-config";
import { requireAnyPermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await requireAnyPermission(["admin.manage"]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Admin modular</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Cadastros e regras comerciais</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Produtos, planos, precos, custos, comissoes, pessoas, conhecimento, permissoes, metas e configuracoes.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(adminResources).map(([key, resource]) => (
          <Link
            href={`/admin/${key}`}
            key={key}
            className="neon-card rounded-lg p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/40"
          >
            <div className="text-lg font-semibold text-white">{resource.label}</div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{resource.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
