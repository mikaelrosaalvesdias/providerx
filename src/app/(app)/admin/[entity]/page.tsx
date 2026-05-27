import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDialog } from "@/components/AdminDialog";
import { deleteAdminRecord, saveAdminRecord } from "@/lib/admin-actions";
import { AdminField, getResource } from "@/lib/admin-config";
import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type OptionMap = Record<string, { label: string; value: string }[]>;

function modelDelegate(model: string) {
  return (prisma as unknown as Record<string, { findMany(args?: unknown): Promise<Record<string, unknown>[]> }>)[model];
}

async function loadRelationOptions(): Promise<OptionMap> {
  const [
    businessPlanSections,
    departments,
    orgChartNodes,
    productSolutions,
    revenueModels,
    users,
    roles,
    verticals,
  ] = await Promise.all([
    prisma.businessPlanSection.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, title: true } }),
    prisma.department.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.orgChartNode.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, label: true } }),
    prisma.productSolution.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.revenueModel.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.user.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, email: true } }),
    prisma.role.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.vertical.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  return {
    businessPlanSection: businessPlanSections.map((item) => ({ label: item.title, value: item.id })),
    department: departments.map((item) => ({ label: item.name, value: item.id })),
    orgChartNode: orgChartNodes.map((item) => ({ label: item.label, value: item.id })),
    productSolution: productSolutions.map((item) => ({ label: item.name, value: item.id })),
    revenueModel: revenueModels.map((item) => ({ label: item.name, value: item.id })),
    user: users.map((item) => ({ label: `${item.name} <${item.email}>`, value: item.id })),
    role: roles.map((item) => ({ label: item.name, value: item.id })),
    vertical: verticals.map((item) => ({ label: item.name, value: item.id })),
  };
}

function valueForInput(value: unknown, type: string) {
  if (value === null || value === undefined) return "";
  if (type === "date") return value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
  if (type === "array") return Array.isArray(value) ? value.join("\n") : String(value);
  if (type === "json") return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return String(value);
}

function FieldInput({ field, record, options }: { field: AdminField; record?: Record<string, unknown>; options: OptionMap }) {
  const value = record ? record[field.name] : undefined;
  const common = {
    id: field.name,
    name: field.name,
    required: field.required,
  };

  if (field.type === "textarea" || field.type === "array" || field.type === "json") {
    return <textarea {...common} defaultValue={valueForInput(value, field.type)} rows={field.type === "json" ? 5 : 3} />;
  }

  if (field.type === "select") {
    const choices = field.relation ? options[field.relation] ?? [] : field.options ?? [];
    return (
      <select {...common} defaultValue={valueForInput(value, field.type)}>
        <option value="">Selecione</option>
        {choices.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-slate-300">
        <input className="h-4 min-h-0 w-4" name={field.name} type="checkbox" defaultChecked={Boolean(value ?? true)} />
        Ativo
      </label>
    );
  }

  return (
    <input
      {...common}
      defaultValue={field.type === "password" ? "" : valueForInput(value, field.type)}
      step={field.type === "number" ? "0.01" : undefined}
      type={field.type === "password" ? "password" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
    />
  );
}

function AdminForm({
  entity,
  fields,
  record,
  options,
}: {
  entity: string;
  fields: AdminField[];
  record?: Record<string, unknown>;
  options: OptionMap;
}) {
  const action = saveAdminRecord.bind(null, entity);
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      {record?.id ? <input name="id" type="hidden" value={String(record.id)} /> : null}
      {fields.map((field) => (
        <label className="block text-sm text-slate-200" key={field.name}>
          <span className="mb-2 block">{field.label}</span>
          <FieldInput field={field} record={record} options={options} />
          {field.help ? <span className="mt-1 block text-xs text-slate-500">{field.help}</span> : null}
        </label>
      ))}
      <div className="md:col-span-2">
        <button className="primary-action md:w-auto" type="submit">
          {record?.id ? "Salvar alteracoes" : "Criar registro"}
        </button>
      </div>
    </form>
  );
}

function displayValue(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (value instanceof Date) return value.toLocaleDateString("pt-BR");
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") {
    if ("toString" in value && value.constructor?.name === "Decimal") return value.toString();
    return JSON.stringify(value);
  }
  return String(value);
}

export default async function AdminEntityPage({ params }: { params: Promise<{ entity: string }> }) {
  await requireAnyPermission(["admin.manage"]);
  const { entity } = await params;
  const resource = getResource(entity);
  if (!resource) notFound();

  const delegate = modelDelegate(resource.model);
  const records = await delegate.findMany({
    take: 50,
    orderBy: resource.orderBy ?? { id: "desc" },
  });
  const options = await loadRelationOptions();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href="/admin" className="text-sm text-cyan-200 hover:text-cyan-100">
            Admin
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-white">{resource.label}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{resource.description}</p>
        </div>
        <AdminDialog title={`Novo registro em ${resource.label}`} description={resource.description} triggerLabel="Novo registro">
          <AdminForm entity={entity} fields={resource.fields} options={options} />
        </AdminDialog>
      </header>

      <section className="neon-card rounded-lg p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Registros</h2>
            <p className="mt-1 text-sm text-slate-500">Ultimos 50 itens cadastrados.</p>
          </div>
        </div>
        <div className="table-scroll">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="py-3 pr-4">Titulo</th>
                {resource.fields.slice(0, 4).map((field) => (
                  <th className="py-3 pr-4" key={field.name}>
                    {field.label}
                  </th>
                ))}
                <th className="py-3 pr-4">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr className="border-b border-slate-800 align-top" key={String(record.id)}>
                  <td className="max-w-xs py-4 pr-4 font-medium text-white">{displayValue(record[resource.titleField])}</td>
                  {resource.fields.slice(0, 4).map((field) => (
                    <td className="max-w-xs py-4 pr-4 text-slate-300" key={field.name}>
                      <span className="line-clamp-3">{displayValue(record[field.name])}</span>
                    </td>
                  ))}
                  <td className="py-4 pr-4">
                    <AdminDialog title={`Editar ${displayValue(record[resource.titleField])}`} triggerLabel="Editar" variant="subtle">
                      <div>
                        <AdminForm entity={entity} fields={resource.fields} options={options} record={record} />
                        <form action={deleteAdminRecord.bind(null, entity)} className="mt-4">
                          <input name="id" type="hidden" value={String(record.id)} />
                          <button className="rounded-md border border-rose-400/40 px-3 py-2 text-sm text-rose-100" type="submit">
                            Excluir
                          </button>
                        </form>
                      </div>
                    </AdminDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
