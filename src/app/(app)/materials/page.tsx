import Link from "next/link";
import { Download, FolderKanban, Link as LinkIcon } from "lucide-react";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createMaterialAction } from "@/lib/planning-actions";

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  await requireAnyPermission(["planning.view", "admin.manage"]);
  const [materials, verticals, products] = await Promise.all([
    prisma.strategicMaterial.findMany({ orderBy: { updatedAt: "desc" }, include: { product: { include: { vertical: true } } } }),
    prisma.vertical.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.productSolution.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Biblioteca</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Materiais estrategicos</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Apresentacoes, PDFs, imagens, videos, planilhas, documentos, links externos e referencias oficiais.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="neon-card rounded-lg p-5">
          <h2 className="text-xl font-semibold text-white">Cadastrar material</h2>
          <form action={createMaterialAction} className="mt-4 grid gap-4">
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Titulo</span>
              <input name="title" required />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Tipo</span>
                <select name="materialType" defaultValue="PRESENTATION">
                  <option value="PRESENTATION">Apresentacao</option>
                  <option value="PDF">PDF</option>
                  <option value="IMAGE">Imagem</option>
                  <option value="VIDEO">Video</option>
                  <option value="SPREADSHEET">Planilha</option>
                  <option value="DOCUMENT">Documento</option>
                  <option value="EXTERNAL_LINK">Link externo</option>
                  <option value="DESIGN_REFERENCE">Referencia de design</option>
                  <option value="INSTITUTIONAL">Institucional</option>
                </select>
              </label>
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Status</span>
                <select name="status" defaultValue="DRAFT">
                  <option value="DRAFT">Rascunho</option>
                  <option value="REVIEW">Em revisao</option>
                  <option value="APPROVED">Aprovado</option>
                  <option value="OFFICIAL">Oficial</option>
                  <option value="OBSOLETE">Obsoleto</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Vertical</span>
                <select name="verticalId">
                  <option value="">Nao vincular</option>
                  {verticals.map((vertical) => <option key={vertical.id} value={vertical.id}>{vertical.name}</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Produto</span>
                <select name="productId">
                  <option value="">Nao vincular</option>
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>
              </label>
            </div>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Arquivo</span>
              <input name="file" type="file" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Link externo</span>
              <input name="externalUrl" placeholder="https://" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Descricao</span>
              <textarea name="description" />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-300">
                <span className="mb-2 block">Versao</span>
                <input name="version" defaultValue="1.0" />
              </label>
              <label className="flex items-center gap-2 pt-7 text-sm text-slate-300">
                <input className="h-4 min-h-0 w-4" name="isOfficial" type="checkbox" />
                Material oficial
              </label>
            </div>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Tags</span>
              <input name="tags" placeholder="institucional, vendas, evento" />
            </label>
            <button className="primary-action" type="submit">Salvar material</button>
          </form>
        </div>

        <div className="grid gap-3">
          {materials.map((material) => (
            <article className="neon-card rounded-lg p-4" key={material.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <FolderKanban size={16} className="text-cyan-100" />
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{material.materialType}</span>
                    {material.isOfficial ? <span className="rounded-md border border-green-300/30 bg-green-300/10 px-2 py-1 text-[11px] text-green-100">Oficial</span> : null}
                  </div>
                  <h2 className="text-lg font-semibold text-white">{material.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{material.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {material.product?.vertical.name || "Sem vertical"} {material.product ? `· ${material.product.name}` : ""} · v{material.version}
                  </p>
                </div>
                <div className="flex gap-2">
                  {material.filePath ? (
                    <Link className="subtle-button" href={`/files/${material.filePath}`}>
                      <Download size={14} /> Download
                    </Link>
                  ) : null}
                  {material.externalUrl ? (
                    <Link className="subtle-button" href={material.externalUrl} target="_blank">
                      <LinkIcon size={14} /> Abrir
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
