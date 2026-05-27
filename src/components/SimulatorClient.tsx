"use client";

import { useMemo, useState } from "react";
import { calculateSimulation } from "@/lib/simulator";
import { money, percent } from "@/lib/format";

const initial = {
  licenses: 100,
  setup: 5500,
  monthly: 3,
  discount: 0,
  internalCost: 0,
  salesCommissionPercent: 5,
  representativeCommissionPercent: 10,
  partnerPercent: 15,
  commissionType: "percentual",
  calculationBase: "NET_REVENUE" as const,
  monthlyGoal: 50000,
  currentSales: 0,
  periodMonths: 1,
};

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm text-slate-200">
      <span className="mb-2 block">{label}</span>
      <input type="number" step="0.01" value={value} onChange={(event) => onChange(Number(event.target.value || 0))} />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block text-sm text-slate-200">
      <span className="mb-2 block">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SimulatorClient({ products }: { products: { id: string; name: string }[] }) {
  const [values, setValues] = useState(initial);
  const result = useMemo(() => calculateSimulation(values), [values]);

  function setValue(key: keyof typeof values, value: number) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function setTextValue(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  const outputs = [
    ["Receita bruta", money(result.grossRevenue)],
    ["Receita liquida", money(result.netRevenue)],
    ["Custo", money(result.cost)],
    ["Margem", `${money(result.margin)} (${percent(result.marginPercent)})`],
    ["Comissao vendedor", money(result.salesCommission)],
    ["Comissao representante", money(result.representativeCommission)],
    ["Repasse parceiro", money(result.partnerShare)],
    ["Faturamento ProviderX", money(result.providerxRevenue)],
    ["% meta atingida", percent(result.goalPercent)],
    ["Valor faltante para meta", money(result.missingToGoal)],
    ["Projecao mensal", money(result.monthlyProjection)],
    ["Projecao anual", money(result.annualProjection)],
    ["Ponto de equilibrio", `${result.breakEvenLicenses} licencas`],
    ["Cenario conservador", money(result.scenarioConservative)],
    ["Cenario alvo", money(result.scenarioTarget)],
    ["Cenario otimista", money(result.scenarioOptimistic)],
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Entradas</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-slate-200 md:col-span-2">
            <span className="mb-2 block">Produto</span>
            <select>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <NumberField label="Licencas" value={values.licenses} onChange={(value) => setValue("licenses", value)} />
          <NumberField label="Setup" value={values.setup} onChange={(value) => setValue("setup", value)} />
          <NumberField label="Mensalidade unitaria" value={values.monthly} onChange={(value) => setValue("monthly", value)} />
          <NumberField label="Desconto" value={values.discount} onChange={(value) => setValue("discount", value)} />
          <NumberField label="Custo interno unitario" value={values.internalCost} onChange={(value) => setValue("internalCost", value)} />
          <NumberField label="% vendedor" value={values.salesCommissionPercent} onChange={(value) => setValue("salesCommissionPercent", value)} />
          <NumberField label="% representante" value={values.representativeCommissionPercent} onChange={(value) => setValue("representativeCommissionPercent", value)} />
          <NumberField label="% parceiro" value={values.partnerPercent} onChange={(value) => setValue("partnerPercent", value)} />
          <SelectField
            label="Tipo de comissao"
            value={values.commissionType}
            onChange={(value) => setTextValue("commissionType", value)}
            options={[
              { label: "Percentual", value: "percentual" },
              { label: "Fixa", value: "fixa" },
              { label: "Faixa", value: "faixa" },
              { label: "Personalizada", value: "personalizada" },
            ]}
          />
          <SelectField
            label="Base de calculo"
            value={values.calculationBase}
            onChange={(value) => setTextValue("calculationBase", value)}
            options={[
              { label: "Setup", value: "SETUP" },
              { label: "Mensalidade", value: "MONTHLY" },
              { label: "Receita bruta", value: "GROSS_REVENUE" },
              { label: "Receita liquida", value: "NET_REVENUE" },
              { label: "Margem", value: "MARGIN" },
            ]}
          />
          <NumberField label="Meta mensal" value={values.monthlyGoal} onChange={(value) => setValue("monthlyGoal", value)} />
          <NumberField label="Vendas ja feitas" value={values.currentSales} onChange={(value) => setValue("currentSales", value)} />
          <NumberField label="Periodo em meses" value={values.periodMonths} onChange={(value) => setValue("periodMonths", value)} />
        </div>
      </section>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Saidas</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {outputs.map(([label, value]) => (
            <div className="rounded-md border border-slate-700/80 bg-slate-950/40 p-4" key={label}>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
              <div className="mt-2 text-lg font-semibold text-white">{value}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
