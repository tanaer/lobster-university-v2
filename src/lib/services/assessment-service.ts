import { db } from "@/lib/db";
import { assessments, lobsterProfiles } from "@/lib/db/schema-lobster";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  ASSESSMENT_DIMENSIONS,
  ASSESSMENT_QUESTIONS,
  DimensionKey,
  calculateDimensionScore,
  generateRadarData,
  analyzeWeaknesses,
  getAssessmentQuestions,
} from "./assessment-shared";

// 重新导出共享类型和常量
export { ASSESSMENT_DIMENSIONS, ASSESSMENT_QUESTIONS, generateRadarData, analyzeWeaknesses, getAssessmentQuestions };
export type { DimensionKey };

// 获取当前用户
async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}

// 获取用户档案
async function getProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(lobsterProfiles)
    .where(eq(lobsterProfiles.userId, userId));
  return profile;
}

// 提交评估
export async function submitAssessment(data: {
  dimension: DimensionKey;
  answers: Record<string, number>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("未登录");
  }

  const profile = await getProfile(user.id);
  if (!profile) {
    throw new Error("未找到档案");
  }

  const answerValues = Object.values(data.answers);
  const score = calculateDimensionScore(answerValues);

  const [assessment] = await db
    .insert(assessments)
    .values({
      id: nanoid(),
      profileId: profile.id,
      dimension: data.dimension,
      score,
      answers: JSON.stringify(data.answers),
      assessedAt: new Date(),
    })
    .returning();

  return assessment;
}

// 获取最新评估报告
export async function getAssessmentReport(profileId?: string) {
  let targetProfileId = profileId;

  if (!targetProfileId) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("未登录");
    }
    const profile = await getProfile(user.id);
    if (!profile) {
      throw new Error("未找到档案");
    }
    targetProfileId = profile.id;
  }

  // 获取各维度最新评估
  const dimensions = Object.keys(ASSESSMENT_DIMENSIONS) as DimensionKey[];
  const report: Record<DimensionKey, { score: number; assessedAt: Date | null }> = {} as any;

  for (const dimension of dimensions) {
    const [latestAssessment] = await db
      .select()
      .from(assessments)
      .where(
        and(
          eq(assessments.profileId, targetProfileId!),
          eq(assessments.dimension, dimension)
        )
      )
      .orderBy(desc(assessments.assessedAt))
      .limit(1);

    report[dimension] = {
      score: latestAssessment?.score ?? 0,
      assessedAt: latestAssessment?.assessedAt ?? null,
    };
  }

  return report;
}

// 检查是否已完成所有维度评估
export async function checkAssessmentCompletion(profileId?: string) {
  const report = await getAssessmentReport(profileId);
  const completed = Object.values(report).filter(r => r.score > 0).length;
  const total = Object.keys(ASSESSMENT_DIMENSIONS).length;
  
  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
    isComplete: completed === total,
    missingDimensions: Object.entries(report)
      .filter(([, data]) => data.score === 0)
      .map(([key]) => key as DimensionKey),
  };
}
