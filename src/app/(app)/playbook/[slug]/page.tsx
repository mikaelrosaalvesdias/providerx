import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PlaybookProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, products] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        playbookSections: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
        playbookContents: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
        pricingRules: { orderBy: [{ category: "asc" }, { minQuantity: "asc" }] },
        costRules: { orderBy: [{ category: "asc" }, { minQuantity: "asc" }] },
        modules: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
      },
    }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { slug: true, name: true, primaryColor: true } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Playbook comercial</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{product.name}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{product.description}</p>
        <p className="mt-2 text-sm text-slate-400">{product.category}</p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {products.map((item) => (
          <Link
            className="rounded-md border px-3 py-2 text-sm"
            href={`/playbook/${item.slug}`}
            key={item.slug}
            style={{
              borderColor: item.slug === slug ? item.primaryColor : "rgba(148, 163, 184, 0.25)",
              color: item.slug === slug ? item.primaryColor : "#cbd5e1",
            }}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Publico-alvo</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{product.targetAudience || "Cadastre no Admin."}</p>
        </div>
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Dores</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {product.pains.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Beneficios</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {product.benefits.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Scripts de WhatsApp</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {product.whatsappScripts.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Scripts de ligacao</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {product.callScripts.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Checklist de implantacao</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {product.implementationChecklist.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {product.playbookSections.map((section) => (
          <article className="neon-card rounded-lg p-5" key={section.id}>
            <div className="mb-2 text-xs uppercase tracking-[0.16em] text-cyan-200/70">{section.kind}</div>
            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{section.content}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {product.playbookContents.map((content) => (
          <article className="neon-card rounded-lg p-5" key={content.id}>
            <div className="mb-2 text-xs uppercase tracking-[0.16em] text-violet-200/70">
              {content.audience || "Geral"} | {content.salesStage || "Etapa livre"}
            </div>
            <h2 className="text-xl font-semibold text-white">{content.title}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{content.content}</p>
          </article>
        ))}
      </section>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Modulos do produto</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {product.modules.map((module) => (
            <div className="rounded-md border border-slate-700/80 p-4" key={module.id}>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{module.moduleType}</div>
              <h3 className="mt-2 font-semibold text-white">{module.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{module.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Tabela de venda cadastrada</h2>
        <div className="mt-4 table-scroll">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="py-3 pr-4">Categoria</th>
                <th className="py-3 pr-4">Faixa</th>
                <th className="py-3 pr-4">Preco unitario</th>
              </tr>
            </thead>
            <tbody>
              {product.pricingRules.map((rule) => (
                <tr className="border-b border-slate-800" key={rule.id}>
                  <td className="py-3 pr-4 text-slate-300">{rule.category}</td>
                  <td className="py-3 pr-4 text-slate-300">
                    {rule.minQuantity} a {rule.maxQuantity || "acima"}
                  </td>
                  <td className="py-3 pr-4 text-slate-300">R$ {String(rule.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Tabela de custo cadastrada</h2>
        <div className="mt-4 table-scroll">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="py-3 pr-4">Categoria</th>
                <th className="py-3 pr-4">Faixa</th>
                <th className="py-3 pr-4">Custo unitario</th>
              </tr>
            </thead>
            <tbody>
              {product.costRules.map((rule) => (
                <tr className="border-b border-slate-800" key={rule.id}>
                  <td className="py-3 pr-4 text-slate-300">{rule.category}</td>
                  <td className="py-3 pr-4 text-slate-300">
                    {rule.minQuantity} a {rule.maxQuantity || "acima"}
                  </td>
                  <td className="py-3 pr-4 text-slate-300">R$ {String(rule.unitCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
