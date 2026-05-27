import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Boxes,
  ChevronDown,
  FileText,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  Presentation,
  ReceiptText,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { logoutAction } from "@/lib/session-actions";

type NavigationItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  permissions?: string[];
};

const workspaceNavigation: NavigationItem[] = [
  { href: "/dashboard", label: "Central", icon: LayoutDashboard, permissions: ["dashboard.view"] },
  { href: "/playbook/vigia-amigo", label: "Playbook", icon: BookOpen, permissions: ["dashboard.view"] },
  { href: "/knowledge", label: "Conhecimento", icon: GraduationCap, permissions: ["dashboard.view"] },
  { href: "/presentations", label: "Materiais", icon: Presentation, permissions: ["dashboard.view"] },
];

const commercialNavigation: NavigationItem[] = [
  { href: "/proposals/new", label: "Nova proposta", icon: FileText, permissions: ["proposals.manage"] },
  { href: "/proposals", label: "Propostas", icon: FileText, permissions: ["proposals.manage"] },
  { href: "/simulator", label: "Simulador", icon: SlidersHorizontal, permissions: ["proposals.manage", "commissions.manage"] },
  { href: "/contracts", label: "Contratos", icon: ReceiptText, permissions: ["contracts.manage"] },
];

const adminNavigation: NavigationItem[] = [
  { href: "/admin", label: "Admin", icon: Settings, permissions: ["admin.manage"] },
  { href: "/reports", label: "Relatorios", icon: BarChart3, permissions: ["reports.view"] },
  { href: "/logs", label: "Logs", icon: History, permissions: ["admin.manage"] },
];

function isAllowed(item: NavigationItem, permissions: Set<string>) {
  if (!item.permissions?.length) return true;
  return item.permissions.some((permission) => permissions.has(permission));
}

function NavigationGroup({ title, items, permissions, defaultOpen = false }: { title: string; items: NavigationItem[]; permissions: Set<string>; defaultOpen?: boolean }) {
  const allowedItems = items.filter((item) => isAllowed(item, permissions));
  if (!allowedItems.length) return null;

  return (
    <details className="nav-group" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-md px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
        {title}
        <ChevronDown size={14} />
      </summary>
      <div className="mt-1 grid gap-1">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link className="nav-link" href={item.href} key={item.href}>
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </details>
  );
}

export function Shell({
  user,
  permissions: permissionList,
  children,
}: {
  user: { name: string; email: string };
  permissions: string[];
  children: React.ReactNode;
}) {
  const permissions = new Set(permissionList);

  return (
    <div className="app-shell min-h-screen lg:grid lg:grid-cols-[292px_1fr]">
      <aside className="sidebar-panel px-4 py-4 lg:sticky lg:top-0 lg:min-h-screen">
        <div className="flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="brand-mark">
              <Boxes size={22} />
            </div>
            <div>
              <div className="brand-wordmark">ProviderX</div>
              <div className="text-xs text-slate-500">Playbook Comercial</div>
            </div>
          </Link>
          <form action={logoutAction} className="lg:hidden">
            <button className="icon-button" title="Sair" type="submit">
              <LogOut size={18} />
            </button>
          </form>
        </div>

        <nav className="mt-7 space-y-5">
          <NavigationGroup title="Operacao" items={workspaceNavigation} permissions={permissions} defaultOpen />
          <NavigationGroup title="Comercial" items={commercialNavigation} permissions={permissions} defaultOpen={permissions.has("proposals.manage")} />
          <NavigationGroup title="Administracao" items={adminNavigation} permissions={permissions} />
        </nav>

        <div className="sidebar-user mt-8 hidden lg:block">
          <div className="text-sm font-medium text-white">{user.name}</div>
          <div className="mt-1 break-all text-xs text-slate-500">{user.email}</div>
          <form action={logoutAction} className="mt-4">
            <button className="subtle-button w-full justify-center" type="submit">
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
