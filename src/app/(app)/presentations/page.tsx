import { uploadPresentation } from "@/lib/upload-actions";
import { prisma } from "@/lib/db";
import { dateBR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PresentationsPage() {
  const [products, assets] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.uploadedAsset.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { product: true, uploadedBy: true } }),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Apresentacoes</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Materiais comerciais</h1>
        <p className="mt-2 text-sm text-slate-300">Upload de PDF, PPT/PPTX, imagens, videos e logos oficiais por produto.</p>
      </header>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Novo upload</h2>
        <form action={uploadPresentation} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-slate-200">
            <span className="mb-2 block">Produto</span>
            <select name="productId">
              <option value="">Geral</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-slate-200">
            <span className="mb-2 block">Tipo</span>
            <select name="assetType" defaultValue="PRESENTATION">
              <option value="PRESENTATION">Apresentacao</option>
              <option value="PDF">PDF</option>
              <option value="IMAGE">Imagem</option>
              <option value="VIDEO">Video</option>
              <option value="LOGO">Logo oficial</option>
              <option value="ATTACHMENT">Anexo</option>
            </select>
          </label>
          <label className="block text-sm text-slate-200 md:col-span-2">
            <span className="mb-2 block">Arquivo</span>
            <input name="file" type="file" required />
          </label>
          <label className="block text-sm text-slate-200 md:col-span-2">
            <span className="mb-2 block">Notas/versionamento</span>
            <textarea name="notes" />
          </label>
          <div className="md:col-span-2">
            <button className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950" type="submit">
              Enviar material
            </button>
          </div>
        </form>
      </section>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Biblioteca</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <article className="rounded-md border border-slate-700/80 p-4" key={asset.id}>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{asset.assetType}</div>
              <h3 className="mt-2 break-words font-semibold text-white">{asset.originalName}</h3>
              <p className="mt-2 text-sm text-slate-400">
                {asset.product?.name || "Geral"} | v{asset.version} | {dateBR(asset.createdAt)}
              </p>
              <a className="mt-3 inline-flex text-sm text-cyan-100" href={`/files/${asset.storageKey}`} target="_blank">
                Visualizar/download
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
