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

async function createImageAsset(file: File, proposalId: string, userId: string) {
  const extension = path.extname(file.name);
  const fileName = `${randomUUID()}${extension}`;
  const storageKey = `proposal-pages/${fileName}`;
  const fullDir = path.join(uploadRoot(), "proposal-pages");

  await mkdir(fullDir, { recursive: true });
  await writeFile(path.join(fullDir, fileName), Buffer.from(await file.arrayBuffer()));

  return prisma.uploadedAsset.create({
    data: {
      proposalId,
      uploadedById: userId,
      fileName,
      originalName: safeName(file.name),
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      storageKey,
      assetType: "IMAGE",
      tags: ["proposal-page", "a4"],
    },
  });
}

async function createProposalVersion(proposalId: string, userId: string, action: string) {
  const current = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { items: true, pages: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }, versions: true },
  });

  if (!current) throw new Error("Proposta nao encontrada.");

  await prisma.proposalVersion.create({
    data: {
      proposalId,
      version: current.versions.length + 1,
      createdById: userId,
      snapshot: {
        action,
        proposal: current,
        items: current.items,
        pages: current.pages,
        changedAt: new Date().toISOString(),
      },
    },
  });
}

export async function addProposalPage(formData: FormData) {
  const user = await requireUser();
  const proposalId = String(formData.get("proposalId") || "");
  const pageType = String(formData.get("pageType") || "FREE_TEXT") as "COVER" | "INSTITUTIONAL" | "PRODUCT" | "PRICING" | "COMMERCIAL_TERMS" | "FREE_TEXT" | "A4_IMAGE" | "ACCEPTANCE";
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim() || null;
  const productId = String(formData.get("productId") || "") || null;
  const file = formData.get("image");

  if (!proposalId || !title) throw new Error("Proposta e titulo sao obrigatorios.");
  await createProposalVersion(proposalId, user.id, "proposal_page_create");

  const lastPage = await prisma.proposalPage.findFirst({
    where: { proposalId },
    orderBy: { sortOrder: "desc" },
  });

  const imageAsset = file instanceof File && file.size > 0 ? await createImageAsset(file, proposalId, user.id) : null;

  const page = await prisma.proposalPage.create({
    data: {
      proposalId,
      pageType,
      title,
      content,
      productId,
      imageAssetId: imageAsset?.id,
      sortOrder: (lastPage?.sortOrder ?? -1) + 1,
    },
  });

  await logAudit({ userId: user.id, action: "proposal_page_create", entity: "proposal_pages", entityId: page.id, metadata: { proposalId, pageType } });
  revalidatePath(`/proposals/${proposalId}`);
}

export async function updateProposalPage(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const proposalId = String(formData.get("proposalId") || "");
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!id || !proposalId || !title) throw new Error("Pagina invalida.");
  await createProposalVersion(proposalId, user.id, "proposal_page_update");

  await prisma.proposalPage.update({
    where: { id },
    data: { title, content, sortOrder },
  });

  await logAudit({ userId: user.id, action: "proposal_page_update", entity: "proposal_pages", entityId: id, metadata: { proposalId, sortOrder } });
  revalidatePath(`/proposals/${proposalId}`);
}

export async function duplicateProposalPage(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const source = await prisma.proposalPage.findUnique({ where: { id } });
  if (!source) throw new Error("Pagina nao encontrada.");
  await createProposalVersion(source.proposalId, user.id, "proposal_page_duplicate");

  const page = await prisma.proposalPage.create({
    data: {
      proposalId: source.proposalId,
      pageType: source.pageType,
      title: `${source.title} (copia)`,
      content: source.content,
      imageAssetId: source.imageAssetId,
      productId: source.productId,
      sortOrder: source.sortOrder + 1,
      settings: source.settings ?? undefined,
    },
  });

  await logAudit({ userId: user.id, action: "proposal_page_duplicate", entity: "proposal_pages", entityId: page.id, metadata: { sourceId: id } });
  revalidatePath(`/proposals/${source.proposalId}`);
}

export async function deleteProposalPage(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const proposalId = String(formData.get("proposalId") || "");
  if (!id || !proposalId) throw new Error("Pagina invalida.");
  await createProposalVersion(proposalId, user.id, "proposal_page_delete");

  await prisma.proposalPage.delete({ where: { id } });
  await logAudit({ userId: user.id, action: "proposal_page_delete", entity: "proposal_pages", entityId: id, metadata: { proposalId } });
  revalidatePath(`/proposals/${proposalId}`);
}
