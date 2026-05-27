import Link from "next/link";
import { ArrowRight, GitBranch, ListChecks, Rocket } from "lucide-react";
import { appReleaseDate, appReleaseNotes, appVersionLabel } from "@/lib/app-version";
import { requireUser, userPermissions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const standards = [
  "Atualizar versao antes de deploy.",
  "Atualizar CHANGELOG.md com alteracoes do release.",
  "Rodar lint, typecheck e build.",
  "Commitar e fazer push no GitHub antes de publicar em producao.",
  "Depois do push, gerar imagem Docker e atualizar a stack.",
];

export default async function VersionPage() {
  const user = await requireUser();
  const permissions = userPermissions(user);
  const canViewAuditLogs = permissions.has("admin.manage") || permissions.has("logs.view");

  return (
    <div className="space-y-6">
      <header className="command-surface rounded-lg border border-cyan-300/20 p-6">
        <div className="inline-flex items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
          <GitBranch size={16} />
          Versao do app
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-white">ProviderX Planning Hub {appVersionLabel}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Registro interno de versao, changelog e padrao obrigatorio para publicacao em producao.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="neon-card rounded-lg p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Versao atual</p>
              <p className="mt-2 text-3xl font-semibold text-white">{appVersionLabel}</p>
              <p className="mt-2 text-sm text-slate-500">Release: {appReleaseDate}</p>
            </div>
            <div className="rounded-md border border-cyan-300/30 bg-cyan-300/10 p-3 text-cyan-100">
              <Rocket size={22} />
            </div>
          </div>
          {canViewAuditLogs ? (
            <Link className="subtle-button mt-5" href="/logs">
              Ver logs de auditoria
              <ArrowRight size={15} />
            </Link>
          ) : null}
        </div>

        <div className="neon-card rounded-lg p-5">
          <div className="flex items-center gap-2">
            <ListChecks className="text-green-100" size={18} />
            <h2 className="text-lg font-semibold text-white">Changelog deste release</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {appReleaseNotes.map((note) => (
              <li className="rounded-md border border-slate-700/70 px-3 py-2" key={note}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Padrao obrigatorio de deploy</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {standards.map((item, index) => (
            <div className="rounded-md border border-slate-700/70 bg-slate-950/30 p-3" key={item}>
              <div className="text-xs uppercase text-cyan-100">Passo {index + 1}</div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
