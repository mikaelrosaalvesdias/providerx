"use server";

import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function submitQuizAttempt(formData: FormData) {
  const user = await requireUser();
  const quizId = String(formData.get("quizId") || "");
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true, product: true, track: true } });
  if (!quiz) throw new Error("Quiz nao encontrado.");

  const answers: Record<string, string> = {};
  let score = 0;

  for (const question of quiz.questions) {
    const answer = String(formData.get(`question_${question.id}`) || "");
    answers[question.id] = answer;
    if (answer === question.correctAnswer) score += 1;
  }

  const maxScore = quiz.questions.length;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const passed = percentage >= quiz.passingScore;

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId,
      userId: user.id,
      score: percentage,
      maxScore: 100,
      passed,
      answers,
    },
  });

  if (passed) {
    const certificate = await prisma.certificate.create({
      data: {
        userId: user.id,
        trackId: quiz.trackId,
        productId: quiz.productId,
        quizAttemptId: attempt.id,
        title: `Certificado - ${quiz.track?.title || quiz.title}`,
        certificateText: `Certificamos que ${user.name} concluiu ${quiz.track?.title || quiz.title}${quiz.product ? ` do produto ${quiz.product.name}` : ""} com nota ${percentage}%.`,
        score: percentage,
        status: "ISSUED",
        appearance: {
          accentColor: quiz.product?.primaryColor || "#2ce9ff",
          product: quiz.product?.name || "ProviderX",
        },
      },
    });
    await logAudit({ userId: user.id, action: "certificate_issue", entity: "certificates", entityId: certificate.id, metadata: { quizId, attemptId: attempt.id } });
  }

  await logAudit({ userId: user.id, action: "quiz_attempt", entity: "quiz_attempts", entityId: attempt.id, metadata: { quizId, score: percentage, passed } });
  revalidatePath("/knowledge");
}
