import { requireAnyPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dateBR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  await requireAnyPermission(["admin.manage"]);

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Auditoria</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Logs de acoes criticas</h1>
        <p className="mt-2 text-sm text-slate-300">Login/logout, CRUDs, alteracoes comerciais, uploads, downloads, aprovacoes e conversoes.</p>
      </header>

      <section className="neon-card rounded-lg p-5">
        <div className="table-scroll">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="py-3 pr-4">Data</th>
                <th className="py-3 pr-4">Usuario</th>
                <th className="py-3 pr-4">Acao</th>
                <th className="py-3 pr-4">Entidade</th>
                <th className="py-3 pr-4">IP</th>
                <th className="py-3 pr-4">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr className="border-b border-slate-800 align-top" key={log.id}>
                  <td className="py-4 pr-4 text-slate-300">{dateBR(log.createdAt)}</td>
                  <td className="py-4 pr-4 text-slate-300">{log.user?.name || "-"}</td>
                  <td className="py-4 pr-4 font-medium text-cyan-100">{log.action}</td>
                  <td className="py-4 pr-4 text-slate-300">{log.entity}</td>
                  <td className="py-4 pr-4 text-slate-300">{log.ipAddress || "-"}</td>
                  <td className="max-w-md py-4 pr-4 text-xs text-slate-400">
                    <pre className="whitespace-pre-wrap">{log.metadata ? JSON.stringify(log.metadata, null, 2) : "-"}</pre>
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
