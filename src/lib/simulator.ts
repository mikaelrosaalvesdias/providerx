export type SimulationInput = {
  licenses: number;
  setup: number;
  monthly: number;
  discount: number;
  internalCost: number;
  salesCommissionPercent: number;
  representativeCommissionPercent: number;
  partnerPercent: number;
  commissionType?: string;
  calculationBase?: "SETUP" | "MONTHLY" | "GROSS_REVENUE" | "NET_REVENUE" | "MARGIN";
  monthlyGoal: number;
  currentSales: number;
  periodMonths?: number;
};

export type SimulationResult = {
  grossRevenue: number;
  netRevenue: number;
  cost: number;
  margin: number;
  marginPercent: number;
  salesCommission: number;
  representativeCommission: number;
  partnerShare: number;
  providerxRevenue: number;
  goalPercent: number;
  missingToGoal: number;
  monthlyProjection: number;
  annualProjection: number;
  breakEvenLicenses: number;
  scenarioConservative: number;
  scenarioTarget: number;
  scenarioOptimistic: number;
};

export function calculateSimulation(input: SimulationInput): SimulationResult {
  const licenses = Math.max(input.licenses, 0);
  const monthlyRevenue = input.monthly * licenses;
  const grossRevenue = input.setup + monthlyRevenue;
  const netRevenue = Math.max(grossRevenue - input.discount, 0);
  const cost = input.internalCost * licenses;
  const margin = netRevenue - cost;
  const calculationBase =
    input.calculationBase === "SETUP"
      ? Math.max(input.setup - Math.min(input.discount, input.setup), 0)
      : input.calculationBase === "MONTHLY"
        ? monthlyRevenue
        : input.calculationBase === "GROSS_REVENUE"
          ? grossRevenue
          : input.calculationBase === "MARGIN"
            ? Math.max(margin, 0)
            : netRevenue;
  const rangeMultiplier = input.commissionType === "faixa" ? (licenses >= 1000 ? 1.2 : licenses >= 500 ? 1.1 : 1) : 1;
  const fixedCommission = input.commissionType === "fixa";
  const salesCommission = fixedCommission ? input.salesCommissionPercent : calculationBase * (input.salesCommissionPercent / 100) * rangeMultiplier;
  const representativeCommission = fixedCommission
    ? input.representativeCommissionPercent
    : calculationBase * (input.representativeCommissionPercent / 100) * rangeMultiplier;
  const partnerShare = fixedCommission ? input.partnerPercent : calculationBase * (input.partnerPercent / 100);
  const providerxRevenue = netRevenue - cost - salesCommission - representativeCommission - partnerShare;
  const marginPercent = netRevenue > 0 ? (margin / netRevenue) * 100 : 0;
  const totalWithCurrentSales = input.currentSales + netRevenue;
  const goalPercent = input.monthlyGoal > 0 ? (totalWithCurrentSales / input.monthlyGoal) * 100 : 0;
  const missingToGoal = Math.max(input.monthlyGoal - totalWithCurrentSales, 0);

  const unitContribution = Math.max(input.monthly - input.internalCost, 0);
  const breakEvenLicenses = unitContribution > 0 ? Math.ceil(Math.max(input.setup - input.discount, 0) / unitContribution) : 0;
  const periodMonths = Math.max(input.periodMonths || 1, 1);

  return {
    grossRevenue,
    netRevenue,
    cost,
    margin,
    marginPercent,
    salesCommission,
    representativeCommission,
    partnerShare,
    providerxRevenue,
    goalPercent,
    missingToGoal,
    monthlyProjection: netRevenue * periodMonths,
    annualProjection: netRevenue * 12,
    breakEvenLicenses,
    scenarioConservative: netRevenue * 0.8,
    scenarioTarget: netRevenue,
    scenarioOptimistic: netRevenue * 1.2,
  };
}
