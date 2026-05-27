import Link from "next/link";
import { convertProposalToContract, duplicateProposal, saveProposal } from "@/lib/proposal-actions";
import { money } from "@/lib/format";

type Option = { id: string; label: string };

type ProposalFormProps = {
  proposal?: Record<string, unknown>;
  item?: Record<string, unknown>;
  companies: Option[];
  products: Option[];
  plans: Option[];
  partners: Option[];
  representatives: Option[];
  sellers: Option[];
};

const statusOptions = [
  ["DRAFT", "Rascunho"],
  ["REVIEW", "Em revisao"],
  ["SENT", "Enviada"],
  ["NEGOTIATION", "Em negociacao"],
  ["APPROVED", "Aprovada"],
  ["LOST", "Perdida"],
  ["CANCELED", "Cancelada"],
  ["CONVERTED", "Convertida"],
];

function value(record: Record<string, unknown> | undefined, key: string, fallback = "") {
  const current = record?.[key];
  if (current === null || current === undefined) return fallback;
  if (current instanceof Date) return current.toISOString().slice(0, 10);
  return String(current);
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  options: Option[];
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-slate-200">
      <span className="mb-2 block">{label}</span>
      <select name={name} defaultValue={defaultValue || ""} required={required}>
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ProposalForm({ proposal, item, companies, products, plans, partners, representatives, sellers }: ProposalFormProps) {
  const monthlyTotal = Number(item?.monthlyValue || 0);
  const licenses = Number(item?.licenseQuantity || 0);
  const monthlyUnit = licenses > 0 ? monthlyTotal / licenses : 0;

  return (
    <div className="space-y-5">
      {proposal ? (
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-md border border-cyan-300/30 px-3 py-2 text-sm text-cyan-100" href={`/proposals/${String(proposal.id)}/pdf`} target="_blank">
            Gerar PDF
          </Link>
          <form action={duplicateProposal}>
            <input name="id" type="hidden" value={String(proposal.id)} />
            <button className="rounded-md border border-violet-300/30 px-3 py-2 text-sm text-violet-100" type="submit">
              Duplicar proposta
            </button>
          </form>
          <form action={convertProposalToContract}>
            <input name="id" type="hidden" value={String(proposal.id)} />
            <button className="rounded-md bg-green-300 px-3 py-2 text-sm font-semibold text-slate-950" type="submit">
              Converter em contrato
            </button>
          </form>
        </div>
      ) : null}

      <form action={saveProposal} className="neon-card grid gap-4 rounded-lg p-5 md:grid-cols-2">
        {proposal?.id ? <input name="id" type="hidden" value={String(proposal.id)} /> : null}

        <label className="block text-sm text-slate-200 md:col-span-2">
          <span className="mb-2 block">Titulo</span>
          <input name="title" required defaultValue={value(proposal, "title")} />
        </label>

        <SelectField label="Empresa/provedor" name="companyId" options={companies} defaultValue={value(proposal, "companyId")} required />
        <SelectField label="Produto" name="productId" options={products} defaultValue={value(item, "productId")} required />
        <SelectField label="Plano" name="planId" options={plans} defaultValue={value(item, "planId")} />
        <SelectField label="Parceiro" name="partnerId" options={partners} defaultValue={value(proposal, "partnerId")} />
        <SelectField label="Representante" name="representativeId" options={representatives} defaultValue={value(proposal, "representativeId")} />
        <SelectField label="Vendedor" name="salesPersonId" options={sellers} defaultValue={value(proposal, "salesPersonId")} />

        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Responsavel</span>
          <input name="responsibleName" defaultValue={value(proposal, "responsibleName")} />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">CNPJ</span>
          <input name="cnpj" defaultValue={value(proposal, "cnpj")} />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">E-mail responsavel</span>
          <input name="responsibleEmail" defaultValue={value(proposal, "responsibleEmail")} />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Telefone responsavel</span>
          <input name="responsiblePhone" defaultValue={value(proposal, "responsiblePhone")} />
        </label>

        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Status</span>
          <select name="status" defaultValue={value(proposal, "status", "DRAFT")}>
            {statusOptions.map(([status, label]) => (
              <option key={status} value={status}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Validade</span>
          <input name="validityDate" type="date" defaultValue={value(proposal, "validityDate")} />
        </label>

        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Quantidade de licencas</span>
          <input name="licenseQuantity" type="number" min="0" step="1" defaultValue={value(item, "licenseQuantity", "100")} />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Setup</span>
          <input name="setupValue" type="number" step="0.01" defaultValue={value(item, "setupValue")} />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Mensalidade unitaria</span>
          <input name="monthlyUnit" type="number" step="0.01" defaultValue={monthlyUnit ? String(monthlyUnit) : ""} />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Desconto</span>
          <input name="discountValue" type="number" step="0.01" defaultValue={value(item, "discountValue", "0")} />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Custo interno unitario</span>
          <input name="internalCost" type="number" step="0.01" defaultValue={value(item, "internalCost")} />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Override % vendedor</span>
          <input name="salesPersonCommissionPercent" type="number" step="0.01" />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Override % representante</span>
          <input name="representativeCommissionPercent" type="number" step="0.01" />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Override % parceiro</span>
          <input name="partnerRevenuePercent" type="number" step="0.01" />
        </label>

        <label className="block text-sm text-slate-200 md:col-span-2">
          <span className="mb-2 block">Condicao comercial</span>
          <textarea name="commercialCondition" defaultValue={value(proposal, "commercialCondition")} />
        </label>
        <label className="block text-sm text-slate-200 md:col-span-2">
          <span className="mb-2 block">Observacoes da proposta</span>
          <textarea name="notes" defaultValue={value(proposal, "notes")} />
        </label>
        <label className="block text-sm text-slate-200 md:col-span-2">
          <span className="mb-2 block">Motivo de perda</span>
          <textarea name="lossReason" defaultValue={value(proposal, "lossReason")} />
        </label>
        <label className="block text-sm text-slate-200 md:col-span-2">
          <span className="mb-2 block">Observacoes do item</span>
          <textarea name="itemNotes" defaultValue={value(item, "notes")} />
        </label>

        {proposal ? (
          <div className="rounded-md border border-slate-700 p-4 text-sm text-slate-300 md:col-span-2">
            Totais atuais: setup {money(proposal.setupTotal)} | mensal {money(proposal.monthlyTotal)} | comissao {money(proposal.commissionTotal)} | parceiro {money(proposal.partnerShareTotal)} | margem {money(proposal.estimatedMargin)}
          </div>
        ) : null}

        <div className="md:col-span-2">
          <button className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950" type="submit">
            {proposal ? "Salvar e versionar" : "Criar proposta"}
          </button>
        </div>
      </form>
    </div>
  );
}
