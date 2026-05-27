"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

function uploadRoot() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 140);
}

export async function uploadPresentation(formData: FormData) {
  const user = await requireUser();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Arquivo obrigatorio.");
  }

  const productId = String(formData.get("productId") || "") || null;
  const notes = String(formData.get("notes") || "") || null;
  const assetType = String(formData.get("assetType") || "PRESENTATION") as "PRESENTATION" | "PDF" | "VIDEO" | "IMAGE" | "ATTACHMENT" | "CONTRACT" | "LOGO" | "LINK";
  const extension = path.extname(file.name);
  const fileName = `${randomUUID()}${extension}`;
  const storageKey = `presentations/${fileName}`;
  const fullDir = path.join(uploadRoot(), "presentations");
  const fullPath = path.join(fullDir, fileName);

  await mkdir(fullDir, { recursive: true });
  await writeFile(fullPath, Buffer.from(await file.arrayBuffer()));

  const asset = await prisma.uploadedAsset.create({
    data: {
      productId,
      uploadedById: user.id,
      fileName,
      originalName: safeName(file.name),
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      storageKey,
      assetType,
      notes,
      status: "PUBLISHED",
    },
  });

  if (assetType === "LOGO" && productId) {
    await prisma.product.update({ where: { id: productId }, data: { logoAssetId: asset.id } });
  }

  await logAudit({ userId: user.id, action: "upload", entity: "uploaded_assets", entityId: asset.id, metadata: { productId, assetType } });
  revalidatePath("/presentations");
}
