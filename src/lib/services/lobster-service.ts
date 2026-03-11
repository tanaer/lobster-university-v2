import { db } from "@/lib/db";
import { lobsterProfiles, careerTracks } from "@/lib/db/schema-lobster";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// 生成学籍号
function generateStudentId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LX${year}${random}`;
}

// 获取当前用户
async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}

// 获取所有职业方向
export async function getCareerTracks() {
  return await db.select().from(careerTracks).orderBy(careerTracks.order);
}

// 获取用户龙虾档案
export async function getLobsterProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(lobsterProfiles)
    .where(eq(lobsterProfiles.userId, userId));
  return profile;
}

// 创建龙虾档案（入学）
export async function enrollLobster(data: {
  name: string;
  careerTrackId: string;
  dailyStudyMinutes: number;
  studyReminder?: string;
}) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("未登录");
  }

  // 检查是否已有档案
  const existing = await getLobsterProfile(user.id);
  if (existing) {
    throw new Error("已经入学");
  }

  // 创建档案
  const [profile] = await db
    .insert(lobsterProfiles)
    .values({
      id: nanoid(),
      userId: user.id,
      name: data.name,
      studentId: generateStudentId(),
      careerTrackId: data.careerTrackId,
      dailyStudyMinutes: data.dailyStudyMinutes,
      studyReminder: data.studyReminder,
      enrolledAt: new Date(),
    })
    .returning();

  return profile;
}

// 更新龙虾档案
export async function updateLobsterProfile(
  userId: string,
  data: Partial<{
    name: string;
    careerTrackId: string;
    dailyStudyMinutes: number;
    studyReminder: string;
    avatar: string;
  }>
) {
  const [profile] = await db
    .update(lobsterProfiles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(lobsterProfiles.userId, userId))
    .returning();

  return profile;
}

// 获取龙虾学习统计
export async function getLobsterStats(userId: string) {
  const profile = await getLobsterProfile(userId);
  if (!profile) return null;

  return {
    totalStudyTime: profile.totalStudyTime,
    completedTasks: profile.completedTasks,
    portfolioItems: profile.portfolioItems,
  };
}
