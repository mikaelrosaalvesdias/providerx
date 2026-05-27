import { Shell } from "@/components/Shell";
import { requireUser, userPermissions } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <Shell user={{ name: user.name, email: user.email }} permissions={Array.from(userPermissions(user))}>{children}</Shell>;
}
