import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type AccessScope =
  | { mode: "internal"; userId: string }
  | { mode: "representative"; userId: string; representativeId: string }
  | { mode: "partner"; userId: string; partnerId: string }
  | { mode: "client"; userId: string; companyId: string };

export async function resolveAccessScope(userId: string): Promise<AccessScope> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } } },
  });
  if (!user) return { mode: "internal", userId };

  const roleNames = new Set(user.roles.map((item) => item.role.name));

  if (roleNames.has("Representante Externo")) {
    const representative = await prisma.representative.findFirst({
      where: { OR: [{ email: user.email }, { contact: user.email }] },
      select: { id: true },
    });
    if (representative) return { mode: "representative", userId, representativeId: representative.id };
  }

  if (roleNames.has("Parceiro Externo")) {
    const partner = await prisma.partnerCompany.findFirst({
      where: { email: user.email },
      select: { id: true },
    });
    if (partner) return { mode: "partner", userId, partnerId: partner.id };
  }

  if (roleNames.has("Cliente Proposta")) {
    const company = await prisma.company.findFirst({
      where: { email: user.email },
      select: { id: true },
    });
    if (company) return { mode: "client", userId, companyId: company.id };
  }

  return { mode: "internal", userId };
}

export function scopedProposalWhere(scope: AccessScope): Prisma.ProposalWhereInput {
  if (scope.mode === "representative") return { representativeId: scope.representativeId };
  if (scope.mode === "partner") return { partnerId: scope.partnerId };
  if (scope.mode === "client") return { companyId: scope.companyId };
  return {};
}

export function scopedContractWhere(scope: AccessScope): Prisma.ContractWhereInput {
  if (scope.mode === "representative") return { representativeId: scope.representativeId };
  if (scope.mode === "partner") return { partnerId: scope.partnerId };
  if (scope.mode === "client") return { companyId: scope.companyId };
  return {};
}
