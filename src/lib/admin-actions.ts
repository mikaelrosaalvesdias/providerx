"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getResource } from "@/lib/admin-config";
import { logAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

function delegateFor(model: string) {
  return (prisma as unknown as Record<string, unknown>)[model] as {
    create(args: unknown): Promise<{ id: string }>;
    update(args: unknown): Promise<{ id: string }>;
    delete(args: unknown): Promise<{ id: string }>;
  };
}

function emptyToNull(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue === "" ? null : stringValue;
}

function parseJson(value: string) {
  if (!value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseField(type: string, value: FormDataEntryValue | null) {
  if (type === "boolean") return value === "on";
  if (type === "number") {
    const parsed = emptyToNull(value);
    return parsed === null ? null : String(parsed).replace(",", ".");
  }
  if (type === "date") {
    const parsed = emptyToNull(value);
    return parsed === null ? null : new Date(parsed);
  }
  if (type === "array") {
    const parsed = emptyToNull(value);
    if (parsed === null) return [];
    return parsed
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (type === "json") return parseJson(String(value ?? ""));
  return emptyToNull(value);
}

export async function saveAdminRecord(entity: string, formData: FormData) {
  const user = await requireUser();
  const resource = getResource(entity);
  if (!resource) throw new Error("Recurso administrativo invalido.");

  const id = String(formData.get("id") || "");
  const data: Record<string, unknown> = {};
  const roleId = String(formData.get("roleId") || "");

  for (const field of resource.fields) {
    if (field.name === "roleId") continue;
    if (field.type === "password") {
      const password = String(formData.get(field.name) || "");
      if (password) data.passwordHash = await bcrypt.hash(password, 12);
      continue;
    }
    const value = parseField(field.type, formData.get(field.name));
    if (value === null) continue;
    data[field.name] = value;
  }

  if (resource.model === "user" && !id && !data.passwordHash) {
    throw new Error("Senha obrigatoria para novo usuario.");
  }

  const delegate = delegateFor(resource.model);
  const record = id
    ? await delegate.update({ where: { id }, data })
    : await delegate.create({ data });

  if (resource.model === "user" && roleId) {
    await prisma.userRole.deleteMany({ where: { userId: record.id } });
    await prisma.userRole.create({ data: { userId: record.id, roleId } });
  }

  await logAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: resource.model,
    entityId: record.id,
    metadata: { adminEntity: entity },
  });

  revalidatePath(`/admin/${entity}`);
  redirect(`/admin/${entity}`);
}

export async function deleteAdminRecord(entity: string, formData: FormData) {
  const user = await requireUser();
  const resource = getResource(entity);
  if (!resource) throw new Error("Recurso administrativo invalido.");

  const id = String(formData.get("id") || "");
  if (!id) throw new Error("ID obrigatorio.");

  const delegate = delegateFor(resource.model);
  await delegate.delete({ where: { id } });
  await logAudit({ userId: user.id, action: "delete", entity: resource.model, entityId: id, metadata: { adminEntity: entity } });

  revalidatePath(`/admin/${entity}`);
  redirect(`/admin/${entity}`);
}
