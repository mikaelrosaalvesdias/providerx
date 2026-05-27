"use server";

import { redirect } from "next/navigation";
import { logAudit } from "@/lib/audit";
import { signInWithPassword } from "@/lib/auth";

export async function loginAction(_previousState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const user = await signInWithPassword(email, password);
  if (!user) {
    await logAudit({
      action: "login_failed",
      entity: "users",
      metadata: { email: email.trim().toLowerCase() },
    });
    return { error: "E-mail ou senha invalidos." };
  }

  await logAudit({ userId: user.id, action: "login", entity: "users", entityId: user.id });
  redirect("/dashboard");
}
