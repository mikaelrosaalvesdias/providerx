import "server-only";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export async function logAudit(input: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: unknown;
}) {
  try {
    const headerStore = await headers();
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        metadata: input.metadata === undefined ? undefined : (input.metadata as object),
        ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        userAgent: headerStore.get("user-agent"),
      },
    });
  } catch (error) {
    console.error("audit_log_failed", error);
  }
}
