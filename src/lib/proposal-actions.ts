"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { calculateCommercialValues } from "@/lib/commercial-rules";
import { prisma } from "@/lib/db";

function numberValue(value: FormDataEntryValue | null) {
  return Number(String(value || "0").replace(",", ".")) || 0;
}

function optionalNumberValue(value: FormDataEntryValue | null) {
  const parsed = String(value || "").trim();
  if (!parsed) return undefined;
  return Number(parsed.replace(",", ".")) || 0;
}

function textOrNull(value: FormDataEntryValue | null) {
  const parsed = String(value || "").trim();
  return parsed ? parsed : null;
}

function nextCode(prefix: string) {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 12);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${suffix}`;
}

async function proposalPayload(formData: FormData) {
  const licenses = Math.max(Math.trunc(numberValue(formData.get("licenseQuantity"))), 0);
  const discountValue = numberValue(formData.get("discountValue"));
  const productId = String(formData.get("productId") || "");
  const planId = textOrNull(formData.get("planId"));
  const partnerId = textOrNull(formData.get("partnerId"));
  const commercial = productId
    ? await calculateCommercialValues({
        productId,
        planId,
        partnerId,
        licenses,
        setupOverride: optionalNumberValue(formData.get("setupValue")),
        monthlyUnitOverride: optionalNumberValue(formData.get("monthlyUnit")),
        internalCostOverride: optionalNumberValue(formData.get("internalCost")),
        discountValue,
        salesPercentOverride: optionalNumberValue(formData.get("salesPersonCommissionPercent")),
        representativePercentOverride: optionalNumberValue(formData.get("representativeCommissionPercent")),
        partnerPercentOverride: optionalNumberValue(formData.get("partnerRevenuePercent")),
      })
    : null;

  return {
    proposal: {
      title: String(formData.get("title") || "").trim(),
      companyId: String(formData.get("companyId") || ""),
      partnerId,
      representativeId: textOrNull(formData.get("representativeId")),
      salesPersonId: textOrNull(formData.get("salesPersonId")),
      validityDate: textOrNull(formData.get("validityDate")) ? new Date(String(formData.get("validityDate"))) : null,
      status: String(formData.get("status") || "DRAFT") as "DRAFT" | "REVIEW" | "SENT" | "NEGOTIATION" | "APPROVED" | "LOST" | "CANCELED" | "CONVERTED",
      responsibleName: textOrNull(formData.get("responsibleName")),
      responsibleEmail: textOrNull(formData.get("responsibleEmail")),
      responsiblePhone: textOrNull(formData.get("responsiblePhone")),
      cnpj: textOrNull(formData.get("cnpj")),
      commercialCondition: textOrNull(formData.get("commercialCondition")),
      setupTotal: commercial?.setupValue ?? 0,
      monthlyTotal: commercial?.monthlyValue ?? 0,
      discountAmount: discountValue,
      commissionTotal: commercial?.commissionTotal ?? 0,
      partnerShareTotal: commercial?.partnerShareValue ?? 0,
      estimatedMargin: commercial?.estimatedMargin ?? 0,
      notes: textOrNull(formData.get("notes")),
      lossReason: textOrNull(formData.get("lossReason")),
    },
    item: {
      productId,
      planId,
      licenseQuantity: licenses,
      setupValue: commercial?.setupValue ?? 0,
      monthlyValue: commercial?.monthlyValue ?? 0,
      discountValue,
      internalCost: commercial?.internalCost ?? 0,
      salesPersonCommissionValue: commercial?.salesPersonCommissionValue ?? 0,
      representativeCommissionValue: commercial?.representativeCommissionValue ?? 0,
      partnerShareValue: commercial?.partnerShareValue ?? 0,
      notes: textOrNull(formData.get("itemNotes")),
    },
    percentages: commercial?.metadata ?? {},
  };
}

export async function saveProposal(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const payload = await proposalPayload(formData);

  if (!payload.proposal.title || !payload.proposal.companyId || !payload.item.productId) {
    throw new Error("Titulo, empresa e produto sao obrigatorios.");
  }

  if (id) {
    const current = await prisma.proposal.findUnique({
      where: { id },
      include: { items: true, versions: true },
    });
    if (!current) throw new Error("Proposta nao encontrada.");

    await prisma.proposalVersion.create({
      data: {
        proposalId: id,
        version: current.versions.length + 1,
        createdById: user.id,
        snapshot: {
          proposal: current,
          items: current.items,
          changedAt: new Date().toISOString(),
        },
      },
    });

    await prisma.proposal.update({
      where: { id },
      data: {
        ...payload.proposal,
        updatedById: user.id,
        items: {
          deleteMany: {},
          create: payload.item,
        },
      },
    });

    await logAudit({
      userId: user.id,
      action: "proposal_update",
      entity: "proposals",
      entityId: id,
      metadata: payload.percentages,
    });
    revalidatePath(`/proposals/${id}`);
    redirect(`/proposals/${id}`);
  }

  const proposal = await prisma.proposal.create({
    data: {
      ...payload.proposal,
      code: nextCode("PX"),
      createdById: user.id,
      updatedById: user.id,
      items: { create: payload.item },
    },
  });

  await prisma.proposalVersion.create({
    data: {
      proposalId: proposal.id,
      version: 1,
      createdById: user.id,
      snapshot: { proposal, item: payload.item, createdAt: new Date().toISOString() },
    },
  });

  await logAudit({
    userId: user.id,
    action: "proposal_create",
    entity: "proposals",
    entityId: proposal.id,
    metadata: payload.percentages,
  });

  redirect(`/proposals/${proposal.id}`);
}

export async function duplicateProposal(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const source = await prisma.proposal.findUnique({ where: { id }, include: { items: true, pages: true } });
  if (!source) throw new Error("Proposta nao encontrada.");

  const duplicate = await prisma.proposal.create({
    data: {
      code: nextCode("PX"),
      title: `${source.title} (copia)`,
      companyId: source.companyId,
      partnerId: source.partnerId,
      representativeId: source.representativeId,
      salesPersonId: source.salesPersonId,
      validityDate: source.validityDate,
      status: "DRAFT",
      responsibleName: source.responsibleName,
      responsibleEmail: source.responsibleEmail,
      responsiblePhone: source.responsiblePhone,
      cnpj: source.cnpj,
      commercialCondition: source.commercialCondition,
      setupTotal: source.setupTotal,
      monthlyTotal: source.monthlyTotal,
      discountAmount: source.discountAmount,
      commissionTotal: source.commissionTotal,
      partnerShareTotal: source.partnerShareTotal,
      estimatedMargin: source.estimatedMargin,
      notes: source.notes,
      createdById: user.id,
      updatedById: user.id,
      items: {
        create: source.items.map((item) => ({
          productId: item.productId,
          planId: item.planId,
          licenseQuantity: item.licenseQuantity,
          setupValue: item.setupValue,
          monthlyValue: item.monthlyValue,
          discountValue: item.discountValue,
          internalCost: item.internalCost,
          salesPersonCommissionValue: item.salesPersonCommissionValue,
          representativeCommissionValue: item.representativeCommissionValue,
          partnerShareValue: item.partnerShareValue,
          notes: item.notes,
        })),
      },
      pages: {
        create: source.pages.map((page) => ({
          pageType: page.pageType,
          title: page.title,
          content: page.content,
          imageAssetId: page.imageAssetId,
          productId: page.productId,
          sortOrder: page.sortOrder,
          settings: page.settings ?? undefined,
        })),
      },
    },
  });

  await logAudit({ userId: user.id, action: "proposal_duplicate", entity: "proposals", entityId: duplicate.id, metadata: { sourceId: id } });
  redirect(`/proposals/${duplicate.id}`);
}

export async function convertProposalToContract(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const proposal = await prisma.proposal.findUnique({ where: { id }, include: { items: true } });
  if (!proposal) throw new Error("Proposta nao encontrada.");

  const contract = await prisma.contract.create({
    data: {
      code: nextCode("CT"),
      proposalId: proposal.id,
      companyId: proposal.companyId,
      partnerId: proposal.partnerId,
      representativeId: proposal.representativeId,
      salesPersonId: proposal.salesPersonId,
      startDate: new Date(),
      setupValue: proposal.setupTotal,
      monthlyValue: proposal.monthlyTotal,
      licenses: proposal.items.reduce((sum, item) => sum + item.licenseQuantity, 0),
      commissionValue: proposal.commissionTotal,
      status: "IMPLEMENTATION",
      financialStatus: "pending",
      operationalStatus: "implementation",
      createdById: user.id,
      items: {
        create: proposal.items.map((item) => ({
          productId: item.productId,
          licenseQuantity: item.licenseQuantity,
          setupValue: item.setupValue,
          monthlyValue: item.monthlyValue,
          commissionValue: item.salesPersonCommissionValue.plus(item.representativeCommissionValue),
        })),
      },
    },
  });

  await prisma.proposal.update({ where: { id }, data: { status: "CONVERTED", updatedById: user.id } });
  await logAudit({ userId: user.id, action: "proposal_convert_contract", entity: "contracts", entityId: contract.id, metadata: { proposalId: id } });
  redirect(`/contracts`);
}
