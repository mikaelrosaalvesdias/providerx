"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  Binary,
  Boxes,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  History,
  LayoutDashboard,
  LogOut,
  Network,
  Orbit,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { appVersionLabel } from "@/lib/app-version";
import { logoutAction } from "@/lib/session-actions";
import { Avatar } from "@/components/ui/avatar";
import { CommandPalette } from "@/components/ui/command-palette";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  permissions?: string[];
  badge?: number;
};

const workspaceNav: NavItem[] = [
  { href: "/dashboard", label: "Central", icon: LayoutDashboard, permissions: ["dashboard.view"] },
  { href: "/business-plan", label: "Plano de Negocios", icon: FileText, permissions: ["planning.view"] },
  { href: "/verticals", label: "Verticais", icon: Boxes, permissions: ["planning.view"] },
  { href: "/products", label: "Produtos", icon: Orbit, permissions: ["planning.view"] },
  { href: "/revenue", label: "Modelo de Receita", icon: BriefcaseBusiness, permissions: ["planning.view"] },
];

const planningNav: NavItem[] = [
  { href: "/financial-projections", label: "Projecoes", icon: TrendingUp, permissions: ["planning.view"] },
  { href: "/strategy", label: "Estrategia", icon: Target, permissions: ["planning.view"] },
  { href: "/org-chart", label: "Organograma", icon: Network, permissions: ["planning.view"] },
  { href: "/materials", label: "Materiais", icon: FolderKanban, permissions: ["planning.view"] },
  { href: "/decisions", label: "Decisoes", icon: Sparkles, permissions: ["planning.view"] },
];

const adminNav: NavItem[] = [
  { href: "/reports", label: "Relatorios", icon: BarChart3, permissions: ["reports.view"] },
  { href: "/admin", label: "Admin", icon: Settings, permissions: ["admin.manage"] },
  { href: "/logs", label: "Logs", icon: History, permissions: ["logs.view", "admin.manage"] },
  { href: "/version", label: "Versao", icon: Binary, permissions: ["dashboard.view"] },
];

function isAllowed(item: NavItem, perms: Set<string>) {
  if (!item.permissions?.length) return true;
  return item.permissions.some((p) => perms.has(p));
}

function NavGroup({ label, items, perms, pathname }: { label: string; items: NavItem[]; perms: Set<string>; pathname: string }) {
  const visible = items.filter((i) => isAllowed(i, perms));
  if (!visible.length) return null;

  return (
    <div>
      <div className="h-eyebrow" style={{ padding: "0 12px", marginBottom: 6 }}>{label}</div>
      {visible.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "nav-link nav-link-active" : "nav-link"}
            style={{ marginBottom: 2 }}
          >
            <Icon size={16} strokeWidth={1.6} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge != null && (
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  background: "rgba(44,233,255,0.14)",
                  color: "var(--neon-cyan)",
                  borderRadius: 99,
                  padding: "1px 6px",
                }}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
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
  const pathname = usePathname();
  const perms = new Set(permissionList);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "248px 1fr",
        minHeight: "100vh",
        background: `
          linear-gradient(90deg, rgba(2, 6, 23, 0.98), rgba(3, 7, 18, 0.72) 22rem, transparent),
          radial-gradient(circle at 90% 0%, rgba(44,233,255,0.07), transparent 26rem)
        `,
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--line)",
          background: "rgba(3, 7, 18, 0.72)",
          backdropFilter: "blur(20px)",
          padding: "20px 12px 16px",
          overflow: "hidden auto",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 4px", marginBottom: 20 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(145deg, rgba(44,233,255,0.18), rgba(138,92,255,0.1))",
                border: "1px solid rgba(44,233,255,0.3)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                color: "#c7fbff",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              PX
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>ProviderX</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
                PLANNING HUB · {appVersionLabel}
              </div>
            </div>
          </Link>
        </div>

        {/* ⌘K search trigger */}
        <button
          onClick={() => setPaletteOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid var(--line-strong)",
            background: "rgba(255,255,255,0.03)",
            color: "var(--text-muted)",
            fontSize: 13,
            cursor: "pointer",
            marginBottom: 20,
            textAlign: "left",
          }}
        >
          <Search size={14} strokeWidth={1.6} />
          <span style={{ flex: 1 }}>Buscar ou pular para…</span>
          <kbd className="kbd">⌘K</kbd>
        </button>

        {/* Nav groups */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          <NavGroup label="Planejamento" items={workspaceNav} perms={perms} pathname={pathname} />
          <NavGroup label="Estrategia" items={planningNav} perms={perms} pathname={pathname} />
          <NavGroup label="Gestao" items={adminNav} perms={perms} pathname={pathname} />
        </nav>

        {/* User card */}
        <div
          style={{
            marginTop: 20,
            borderTop: "1px solid var(--line)",
            paddingTop: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Avatar name={user.name} size={30} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </div>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                width: "100%",
                padding: "7px 10px",
                borderRadius: 7,
                border: "1px solid var(--line-strong)",
                background: "transparent",
                color: "var(--text-secondary)",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <LogOut size={14} strokeWidth={1.6} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <div
          style={{
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 28px",
            borderBottom: "1px solid var(--line)",
            background: "rgba(7, 9, 15, 0.72)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>ProviderX Planning Hub</span>
          <button
            style={{
              display: "grid",
              placeItems: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid var(--line)",
              background: "transparent",
              color: "var(--text-secondary)",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <Bell size={16} strokeWidth={1.6} />
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--neon-cyan)",
              }}
            />
          </button>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px 32px" }}>
          {children}
        </main>
      </div>

      {/* Command palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
