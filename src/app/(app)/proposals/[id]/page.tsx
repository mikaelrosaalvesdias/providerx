import Link from "next/link";
import { notFound } from "next/navigation";
import { ProposalForm } from "@/components/ProposalForm";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dateBR } from "@/lib/format";
import { addProposalPage, deleteProposalPage, duplicateProposalPage, updateProposalPage } from "@/lib/proposal-page-actions";

export const dynamic = "force-dynamic";

async function formOptions() {
  const [companies, products, plans, partners, representatives, sellers] = await Promise.all([
    prisma.company.findMany({ orderBy: { legalName: "asc" }, select: { id: true, legalName: true, tradeName: true } }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.productPlan.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.partnerCompany.findMany({ orderBy: { legalName: "asc" }, select: { id: true, legalName: true, tradeName: true } }),
    prisma.representative.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.salesPerson.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return {
    companies: companies.map((item) => ({ id: item.id, label: item.tradeName || item.legalName })),
    products: products.map((item) => ({ id: item.id, label: item.name })),
    plans: plans.map((item) => ({ id: item.id, label: item.name })),
    partners: partners.map((item) => ({ id: item.id, label: item.tradeName || item.legalName })),
    representatives: representatives.map((item) => ({ id: item.id, label: item.name })),
    sellers: sellers.map((item) => ({ id: item.id, label: item.name })),
  };
}

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAnyPermission(["proposals.manage"]);
  const { id } = await params;
  const [proposal, options] = await Promise.all([
    prisma.proposal.findUnique({
      where: { id },
      include: {
        items: true,
        pages: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: { imageAsset: true, product: true } },
        versions: { orderBy: { version: "desc" } },
        company: true,
      },
    }),
    formOptions(),
  ]);

  if (!proposal) notFound();
  const item = proposal.items[0];

  return (
    <div className="space-y-6">
      <header>
        <Link href="/proposals" className="text-sm text-cyan-200 hover:text-cyan-100">
          Propostas
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-white">{proposal.code}</h1>
        <p className="mt-2 text-sm text-slate-300">
          {proposal.company.tradeName || proposal.company.legalName} | atualizado em {dateBR(proposal.updatedAt)}
        </p>
      </header>

      <ProposalForm proposal={proposal} item={item} {...options} />

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Construtor de paginas da proposta</h2>
        <form action={addProposalPage} className="mt-4 grid gap-4 md:grid-cols-2">
          <input name="proposalId" type="hidden" value={proposal.id} />
          <label className="block text-sm text-slate-200">
            <span className="mb-2 block">Tipo de pagina</span>
            <select name="pageType" defaultValue="FREE_TEXT">
              <option value="COVER">Capa</option>
              <option value="INSTITUTIONAL">Institucional</option>
              <option value="PRODUCT">Produto</option>
              <option value="PRICING">Preco</option>
              <option value="COMMERCIAL_TERMS">Condicoes comerciais</option>
              <option value="FREE_TEXT">Texto livre</option>
              <option value="A4_IMAGE">Imagem A4</option>
              <option value="ACCEPTANCE">Aceite futuro</option>
            </select>
          </label>
          <label className="block text-sm text-slate-200">
            <span className="mb-2 block">Produto relacionado</span>
            <select name="productId">
              <option value="">Geral</option>
              {options.products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-slate-200 md:col-span-2">
            <span className="mb-2 block">Titulo</span>
            <input name="title" required />
          </label>
          <label className="block text-sm text-slate-200 md:col-span-2">
            <span className="mb-2 block">Texto/bloco da pagina</span>
            <textarea name="content" />
          </label>
          <label className="block text-sm text-slate-200 md:col-span-2">
            <span className="mb-2 block">Imagem A4</span>
            <input name="image" type="file" accept="image/*,.pdf" />
          </label>
          <div className="md:col-span-2">
            <button className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950" type="submit">
              Adicionar pagina
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {proposal.pages.length ? (
            proposal.pages.map((page) => (
              <article className="rounded-md border border-slate-700/80 p-4" key={page.id}>
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">{page.pageType}</div>
                    <h3 className="mt-1 font-semibold text-white">{page.sortOrder}. {page.title}</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{page.content}</p>
                    {page.imageAsset ? (
                      <a className="mt-2 inline-flex text-sm text-cyan-100" href={`/files/${page.imageAsset.storageKey}`} target="_blank">
                        Ver imagem/anexo A4
                      </a>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <form action={duplicateProposalPage}>
                      <input name="id" type="hidden" value={page.id} />
                      <button className="rounded-md border border-violet-300/30 px-3 py-2 text-sm text-violet-100" type="submit">
                        Duplicar
                      </button>
                    </form>
                    <form action={deleteProposalPage}>
                      <input name="id" type="hidden" value={page.id} />
                      <input name="proposalId" type="hidden" value={proposal.id} />
                      <button className="rounded-md border border-rose-300/30 px-3 py-2 text-sm text-rose-100" type="submit">
                        Remover
                      </button>
                    </form>
                  </div>
                </div>
                <form action={updateProposalPage} className="mt-4 grid gap-3 md:grid-cols-[90px_1fr_2fr_auto]">
                  <input name="id" type="hidden" value={page.id} />
                  <input name="proposalId" type="hidden" value={proposal.id} />
                  <input name="sortOrder" type="number" defaultValue={page.sortOrder} />
                  <input name="title" defaultValue={page.title} />
                  <textarea name="content" defaultValue={page.content || ""} />
                  <button className="rounded-md border border-cyan-300/30 px-3 py-2 text-sm text-cyan-100" type="submit">
                    Atualizar
                  </button>
                </form>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-400">Nenhuma pagina adicionada. Use o formulario acima para montar a proposta.</p>
          )}
        </div>
      </section>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Historico de versoes</h2>
        <div className="mt-4 space-y-3">
          {proposal.versions.map((version) => (
            <div className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300" key={version.id}>
              Versao {version.version} | {dateBR(version.createdAt)}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
