import { readFile } from "fs/promises";
import path from "path";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function uploadRoot() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  await requireUser();
  const { path: parts } = await params;
  const storageKey = parts.join("/");
  const asset = await prisma.uploadedAsset.findFirst({ where: { storageKey } });
  if (!asset) return new Response("Arquivo nao encontrado", { status: 404 });

  const root = path.resolve(uploadRoot());
  const fullPath = path.resolve(root, storageKey);
  if (!fullPath.startsWith(root)) {
    return new Response("Caminho invalido", { status: 400 });
  }

  const file = await readFile(fullPath);
  await prisma.auditLog.create({
    data: {
      userId: null,
      action: "download",
      entity: "uploaded_assets",
      entityId: asset.id,
      metadata: { storageKey },
    },
  });

  return new Response(file, {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Disposition": `inline; filename="${asset.originalName}"`,
    },
  });
}
