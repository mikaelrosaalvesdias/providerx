import { SimulatorClient } from "@/components/SimulatorClient";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SimulatorPage() {
  await requireAnyPermission(["proposals.manage", "commissions.manage"]);
  const products = await prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Simulador</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Comissao, meta, margem e repasse</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Calcule receita bruta, receita liquida, custo, margem, comissoes, repasse parceiro e projecoes.
        </p>
      </header>
      <SimulatorClient products={products} />
    </div>
  );
}
