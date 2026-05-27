"use client";

import { useActionState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { loginAction } from "@/app/login/actions";

const products = [
  ["Vigia Amigo", "#2ce9ff"],
  ["Wi-Facil", "#63ff9a"],
  ["AtendAI", "#8a5cff"],
  ["Pixel Facil", "#ffd166"],
  ["123 Encarte", "#ff3df2"],
];

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <main className="login-stage min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100vh-48px)] w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="login-brand-panel">
          <div className="brand-lockup">
            <div className="brand-mark large">PX</div>
            <div>
              <div className="brand-wordmark text-2xl">ProviderX</div>
              <div className="text-sm text-slate-400">Playbook Comercial</div>
            </div>
          </div>

          <div className="mt-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-300/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-cyan-100">
              <Sparkles size={15} />
              Operacao comercial interna
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Central de produtos, vendas e estrategia ProviderX.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Organize playbooks, propostas, comissoes, materiais e treinamento em uma base unica para vender produtos white-label com consistencia.
            </p>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
            <div className="login-metric">
              <ShieldCheck size={18} />
              <span>Precos, custos e comissoes editaveis no Admin</span>
            </div>
            <div className="login-metric">
              <LockKeyhole size={18} />
              <span>Acesso interno com sessao segura</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {products.map(([name, color]) => (
              <span className="product-chip" key={name} style={{ borderColor: `${color}66`, color }}>
                {name}
              </span>
            ))}
          </div>
        </div>

        <section className="login-card">
          <div className="mb-8">
            <div className="text-sm font-medium text-cyan-100">Acesso restrito</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">Entrar no ProviderX</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Use seu usuario interno para acessar a central comercial.</p>
          </div>

          <form action={formAction} className="space-y-4">
            <label className="block text-sm text-slate-200">
              E-mail
              <input className="mt-2" name="email" type="email" autoComplete="email" required />
            </label>
            <label className="block text-sm text-slate-200">
              Senha
              <input className="mt-2" name="password" type="password" autoComplete="current-password" required />
            </label>

            {state?.error ? <div className="form-alert">{state.error}</div> : null}

            <button className="primary-action" type="submit" disabled={pending}>
              {pending ? "Entrando..." : "Entrar"}
              <ArrowRight size={18} />
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
