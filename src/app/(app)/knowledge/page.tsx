import { submitQuizAttempt } from "@/lib/quiz-actions";
import { prisma } from "@/lib/db";
import { dateBR } from "@/lib/format";

export const dynamic = "force-dynamic";

function optionsFromJson(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

export default async function KnowledgePage() {
  const [tracks, contents, quizzes, attempts, certificates] = await Promise.all([
    prisma.knowledgeTrack.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }], include: { product: true } }),
    prisma.knowledgeContent.findMany({ orderBy: { updatedAt: "desc" }, include: { product: true, track: true } }),
    prisma.quiz.findMany({ orderBy: { updatedAt: "desc" }, include: { product: true, questions: { orderBy: { sortOrder: "asc" } } } }),
    prisma.quizAttempt.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { quiz: true, user: true } }),
    prisma.certificate.findMany({ orderBy: { issuedAt: "desc" }, take: 20, include: { user: true, product: true, track: true } }),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Conhecimento</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Treinamento e provas</h1>
        <p className="mt-2 text-sm text-slate-300">Trilhas, conteudos por produto, quizzes e registro de pontuacao.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {tracks.map((track) => (
          <article className="neon-card rounded-lg p-5" key={track.id}>
            <div className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">{track.product?.name || "Geral"}</div>
            <h2 className="mt-2 text-lg font-semibold text-white">{track.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{track.description}</p>
          </article>
        ))}
      </section>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Conteudos</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {contents.map((content) => (
            <article className="rounded-md border border-slate-700/80 p-4" key={content.id}>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{content.contentType}</div>
              <h3 className="mt-2 font-semibold text-white">{content.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{content.description}</p>
              {content.url ? (
                <a className="mt-3 inline-flex text-sm text-cyan-100" href={content.url} target="_blank">
                  Abrir conteudo
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <form action={submitQuizAttempt} className="neon-card rounded-lg p-5" key={quiz.id}>
              <input name="quizId" type="hidden" value={quiz.id} />
              <div className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">{quiz.product?.name || "Geral"}</div>
              <h2 className="mt-2 text-lg font-semibold text-white">{quiz.title}</h2>
              <p className="mt-1 text-sm text-slate-400">Nota minima: {quiz.passingScore}%</p>
              <div className="mt-4 space-y-4">
                {quiz.questions.map((question) => (
                  <fieldset className="rounded-md border border-slate-700 p-4" key={question.id}>
                    <legend className="px-1 text-sm text-white">{question.prompt}</legend>
                    <div className="mt-3 space-y-2">
                      {optionsFromJson(question.options).map((option) => (
                        <label className="flex items-center gap-2 text-sm text-slate-300" key={option}>
                          <input className="h-4 min-h-0 w-4" type="radio" name={`question_${question.id}`} value={option} required />
                          {option}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              <button className="mt-4 rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950" type="submit">
                Enviar prova
              </button>
            </form>
          ))}
        </div>

        <aside className="neon-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Pontuacoes recentes</h2>
          <div className="mt-4 space-y-3">
            {attempts.map((attempt) => (
              <div className="rounded-md border border-slate-700 p-3 text-sm" key={attempt.id}>
                <div className="font-medium text-white">{attempt.quiz.title}</div>
                <div className="mt-1 text-slate-400">
                  {attempt.user.name} | {attempt.score}% | {attempt.passed ? "Aprovado" : "Reprovado"} | {dateBR(attempt.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="neon-card rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Certificados emitidos</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <article className="rounded-md border border-cyan-300/20 bg-cyan-300/5 p-4" key={certificate.id}>
              <div className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">{certificate.status}</div>
              <h3 className="mt-2 font-semibold text-white">{certificate.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{certificate.certificateText}</p>
              <p className="mt-3 text-xs text-slate-500">
                {certificate.user.name} | {certificate.product?.name || "Geral"} | {dateBR(certificate.issuedAt)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
