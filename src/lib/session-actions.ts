"use server";

import { redirect } from "next/navigation";
import { clearSession, getCurrentUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function logoutAction() {
  const user = await getCurrentUser();
  if (user) {
    await logAudit({ userId: user.id, action: "logout", entity: "users", entityId: user.id });
  }
  await clearSession();
  redirect("/login");
}
