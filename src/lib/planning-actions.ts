"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/format";

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function numberValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim().replace(",", ".");
  return value ? Number(value) : 0;
}

function listValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) return [];
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function nextSectionVersion(sectionId: string) {
  const result = await prisma.businessPlanVersion.aggregate({
    where: { sectionId },
    _max: { version: true },
  });
  return (result._max.version ?? 0) + 1;
}

export async function updateBusinessPlanSection(formData: FormData) {
  const user = await requireUser();
  const sectionId = String(formData.get("sectionId") || "");
  const content = String(formData.get("content") || "").trim();
  const title = String(formData.get("title") || "").trim();

  if (!sectionId || !title || !content) {
    throw new Error("Secao, titulo e conteudo sao obrigatorios.");
  }

  const current = await prisma.businessPlanSection.findUnique({ where: { id: sectionId } });
  if (!current) throw new Error("Secao do plano nao encontrada.");

  await prisma.businessPlanVersion.create({
    data: {
      sectionId,
      version: await nextSectionVersion(sectionId),
      title: current.title,
      content: current.content,
      createdById: user.id,
    },
  });

  const updated = await prisma.businessPlanSection.update({
    where: { id: sectionId },
    data: { title, content, updatedById: user.id },
  });

  await logAudit({
    userId: user.id,
    action: "business_plan_section.update",
    entity: "businessPlanSection",
    entityId: sectionId,
    metadata: {
      old: { title: current.title, content: current.content },
      new: { title: updated.title, content: updated.content },
    },
  });

  revalidatePath("/business-plan");
}

export async function restoreBusinessPlanVersion(formData: FormData) {
  const user = await requireUser();
  const versionId = String(formData.get("versionId") || "");
  if (!versionId) throw new Error("Versao obrigatoria.");

  const version = await prisma.businessPlanVersion.findUnique({
    where: { id: versionId },
    include: { section: true },
  });
  if (!version) throw new Error("Versao nao encontrada.");

  await prisma.businessPlanVersion.create({
    data: {
      sectionId: version.sectionId,
      version: await nextSectionVersion(version.sectionId),
      title: version.section.title,
      content: version.section.content,
      createdById: user.id,
    },
  });

  await prisma.businessPlanSection.update({
    where: { id: version.sectionId },
    data: { title: version.title, content: version.content, updatedById: user.id },
  });

  await logAudit({
    userId: user.id,
    action: "business_plan_section.restore",
    entity: "businessPlanSection",
    entityId: version.sectionId,
    metadata: { restoredVersion: version.version },
  });

  revalidatePath("/business-plan");
}

export async function createFinancialScenarioAction(formData: FormData) {
  const user = await requireUser();
  const name = text(formData, "name");
  const providerCount = numberValue(formData, "providerCount");
  const averageTicket = numberValue(formData, "averageTicket");
  const estimatedCosts = numberValue(formData, "estimatedCosts");
  const monthlyRevenue = providerCount * averageTicket;
  const annualRevenue = monthlyRevenue * 12;
  const estimatedMargin = monthlyRevenue - estimatedCosts;

  if (!name || providerCount <= 0 || averageTicket <= 0) {
    throw new Error("Nome, quantidade de provedores e ticket medio sao obrigatorios.");
  }

  const record = await prisma.financialScenario.create({
    data: {
      name,
      providerCount,
      averageTicket,
      monthlyRevenue,
      annualRevenue,
      estimatedCosts,
      estimatedMargin,
      scenarioType: text(formData, "scenarioType") ?? "custom",
      notes: text(formData, "notes"),
      status: "PUBLISHED",
    },
  });

  await logAudit({
    userId: user.id,
    action: "financial_scenario.create",
    entity: "financialScenario",
    entityId: record.id,
    metadata: { monthlyRevenue, annualRevenue, estimatedMargin },
  });

  revalidatePath("/financial-projections");
  redirect("/financial-projections");
}

export async function createDecisionAction(formData: FormData) {
  const user = await requireUser();
  const title = text(formData, "title");
  const decision = text(formData, "decision");
  if (!title || !decision) throw new Error("Titulo e decisao sao obrigatorios.");

  const record = await prisma.strategicDecision.create({
    data: {
      title,
      decision,
      relatedArea: text(formData, "relatedArea"),
      context: text(formData, "context"),
      reason: text(formData, "reason"),
      expectedImpact: text(formData, "expectedImpact"),
      responsible: text(formData, "responsible"),
      tags: listValue(formData, "tags"),
      status: "PUBLISHED",
    },
  });

  await logAudit({
    userId: user.id,
    action: "strategic_decision.create",
    entity: "strategicDecision",
    entityId: record.id,
    metadata: { title, decision },
  });

  revalidatePath("/decisions");
  redirect("/decisions");
}

export async function createMaterialAction(formData: FormData) {
  const user = await requireUser();
  const title = text(formData, "title");
  if (!title) throw new Error("Titulo obrigatorio.");

  const uploadRoot = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
  const file = formData.get("file");
  let fileName: string | null = null;
  let filePath: string | null = null;

  if (file instanceof File && file.size > 0) {
    const ext = path.extname(file.name);
    const storageName = `${slugify(title)}-${randomUUID()}${ext}`;
    const relativePath = path.join("materials", storageName);
    const absolutePath = path.join(uploadRoot, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));
    fileName = file.name;
    filePath = relativePath.replaceAll(path.sep, "/");
  }

  const record = await prisma.strategicMaterial.create({
    data: {
      title,
      materialType: String(formData.get("materialType") || "DOCUMENT") as never,
      verticalId: text(formData, "verticalId"),
      productId: text(formData, "productId"),
      fileName,
      filePath,
      externalUrl: text(formData, "externalUrl"),
      description: text(formData, "description"),
      version: text(formData, "version") ?? "1.0",
      status: String(formData.get("status") || "DRAFT") as never,
      tags: listValue(formData, "tags"),
      isOfficial: formData.get("isOfficial") === "on",
      createdById: user.id,
    },
  });

  await logAudit({
    userId: user.id,
    action: "strategic_material.create",
    entity: "strategicMaterial",
    entityId: record.id,
    metadata: { title, fileName, filePath },
  });

  revalidatePath("/materials");
  redirect("/materials");
}
