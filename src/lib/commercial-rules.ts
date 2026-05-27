import { CommissionBaseType } from "@prisma/client";
import { prisma } from "@/lib/db";

type NullableNumber = number | null | undefined;

export type CommercialCalculationInput = {
  productId: string;
  planId?: string | null;
  partnerId?: string | null;
  licenses: number;
  setupOverride?: NullableNumber;
  monthlyUnitOverride?: NullableNumber;
  internalCostOverride?: NullableNumber;
  discountValue: number;
  salesPercentOverride?: NullableNumber;
  representativePercentOverride?: NullableNumber;
  partnerPercentOverride?: NullableNumber;
};

export type CommercialCalculationResult = {
  setupValue: number;
  monthlyUnit: number;
  monthlyValue: number;
  internalCost: number;
  grossRevenue: number;
  netRevenue: number;
  margin: number;
  salesPersonCommissionValue: number;
  representativeCommissionValue: number;
  partnerShareValue: number;
  commissionTotal: number;
  estimatedMargin: number;
  metadata: Record<string, unknown>;
};

function toNumber(value: unknown) {
  return Number(value || 0);
}

function hasValue(value: NullableNumber): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function baseAmount(baseType: CommissionBaseType, values: { setupValue: number; monthlyValue: number; grossRevenue: number; netRevenue: number; margin: number }) {
  if (baseType === "SETUP") return values.setupValue;
  if (baseType === "MONTHLY") return values.monthlyValue;
  if (baseType === "GROSS_REVENUE") return values.grossRevenue;
  if (baseType === "MARGIN") return Math.max(values.margin, 0);
  return values.netRevenue;
}

async function resolvePriceAndCost(input: CommercialCalculationInput) {
  const licenses = Math.max(Math.trunc(input.licenses), 0);
  const [plan, pricingRules, costRules] = await Promise.all([
    input.planId ? prisma.productPlan.findUnique({ where: { id: input.planId } }) : null,
    prisma.pricingRule.findMany({
      where: {
        productId: input.productId,
        active: true,
        minQuantity: { lte: Math.max(licenses, 1) },
        AND: [
          { OR: [{ maxQuantity: null }, { maxQuantity: { gte: Math.max(licenses, 1) } }] },
          input.planId ? { OR: [{ planId: input.planId }, { planId: null }] } : { planId: null },
        ],
      },
      orderBy: [{ planId: "desc" }, { minQuantity: "desc" }, { category: "asc" }],
      take: 20,
    }),
    prisma.costRule.findMany({
      where: {
        productId: input.productId,
        active: true,
        minQuantity: { lte: Math.max(licenses, 1) },
        AND: [
          { OR: [{ maxQuantity: null }, { maxQuantity: { gte: Math.max(licenses, 1) } }] },
          input.planId ? { OR: [{ planId: input.planId }, { planId: null }] } : { planId: null },
        ],
      },
      orderBy: [{ planId: "desc" }, { minQuantity: "desc" }, { category: "asc" }],
      take: 20,
    }),
  ]);

  const pricingRule = pricingRules[0];
  const costRule = costRules[0];
  const setupValue = hasValue(input.setupOverride) ? input.setupOverride : toNumber(plan?.setupPrice ?? pricingRule?.setupPrice);
  const monthlyUnit = hasValue(input.monthlyUnitOverride) ? input.monthlyUnitOverride : toNumber(pricingRule?.unitPrice ?? plan?.monthlyPrice);
  const internalCost = hasValue(input.internalCostOverride) ? input.internalCostOverride : toNumber(costRule?.unitCost);

  return { setupValue, monthlyUnit, internalCost, pricingRule, costRule, plan };
}

async function resolveCommissionRule(input: CommercialCalculationInput) {
  const rules = await prisma.commissionRule.findMany({
    where: {
      active: true,
      OR: [{ productId: input.productId }, { productId: null }],
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 100,
  });

  return (
    rules
      .filter((rule) => !rule.planId || !input.planId || rule.planId === input.planId)
      .filter((rule) => rule.minQuantity === null || input.licenses >= rule.minQuantity)
      .filter((rule) => rule.maxQuantity === null || input.licenses <= rule.maxQuantity)
      .sort((a, b) => {
        const aScore = (a.planId === input.planId ? 4 : 0) + (a.productId === input.productId ? 2 : 0) + (a.minQuantity ? 1 : 0);
        const bScore = (b.planId === input.planId ? 4 : 0) + (b.productId === input.productId ? 2 : 0) + (b.minQuantity ? 1 : 0);
        return bScore - aScore;
      })[0] ?? null
  );
}

export async function calculateCommercialValues(input: CommercialCalculationInput): Promise<CommercialCalculationResult> {
  const licenses = Math.max(Math.trunc(input.licenses), 0);
  const [{ setupValue, monthlyUnit, internalCost, pricingRule, costRule, plan }, rule, partner] = await Promise.all([
    resolvePriceAndCost(input),
    resolveCommissionRule(input),
    input.partnerId ? prisma.partnerCompany.findUnique({ where: { id: input.partnerId } }) : null,
  ]);

  const monthlyValue = monthlyUnit * licenses;
  const grossRevenue = setupValue + monthlyValue;
  const netRevenue = Math.max(grossRevenue - input.discountValue, 0);
  const cost = internalCost * licenses;
  const margin = netRevenue - cost;
  const commissionBase = rule?.commissionBase ?? "NET_REVENUE";
  const values = { setupValue, monthlyValue, grossRevenue, netRevenue, margin };
  const ruleBaseAmount = baseAmount(commissionBase, values);
  const partnerBase = partner?.billingBase ?? commissionBase;
  const partnerBaseAmount = baseAmount(partnerBase, values);
  const salesPercent = hasValue(input.salesPercentOverride) ? input.salesPercentOverride : toNumber(rule?.salesPersonCommissionPercent);
  const representativePercent = hasValue(input.representativePercentOverride) ? input.representativePercentOverride : toNumber(rule?.representativeCommissionPercent);
  const partnerPercent = hasValue(input.partnerPercentOverride)
    ? input.partnerPercentOverride
    : toNumber(rule?.partnerRevenuePercent || partner?.revenueSharePercent);
  const salesPersonCommissionValue = ruleBaseAmount * (salesPercent / 100);
  const representativeCommissionValue = ruleBaseAmount * (representativePercent / 100);
  const partnerShareValue = partnerBaseAmount * (partnerPercent / 100);

  return {
    setupValue,
    monthlyUnit,
    monthlyValue,
    internalCost,
    grossRevenue,
    netRevenue,
    margin,
    salesPersonCommissionValue,
    representativeCommissionValue,
    partnerShareValue,
    commissionTotal: salesPersonCommissionValue + representativeCommissionValue,
    estimatedMargin: margin,
    metadata: {
      pricingRuleId: pricingRule?.id ?? null,
      costRuleId: costRule?.id ?? null,
      planId: plan?.id ?? input.planId ?? null,
      commissionRuleId: rule?.id ?? null,
      commissionBase,
      partnerBase,
      salesPercent,
      representativePercent,
      partnerPercent,
      resolvedFromAdminRules: true,
    },
  };
}
