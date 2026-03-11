import { db } from "@/lib/db";
import { lobsterProfiles, reminderSettings, streakRecords, studyLogs, careerTracks } from "@/lib/db/schema-lobster";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

// 格式化日期为 YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// 获取今日日期字符串
function getTodayString(): string {
  return formatDate(new Date());
}

// 获取昨日日期字符串
function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}

// 计算连续学习天数
export async function calculateStreak(profileId: string): Promise<number> {
  // 获取所有学习记录的日期（去重）
  const records = await db
    .select({
      date: streakRecords.date,
      goalMet: streakRecords.goalMet,
    })
    .from(streakRecords)
    .where(eq(streakRecords.profileId, profileId))
    .orderBy(desc(streakRecords.date));

  if (records.length === 0) {
    return 0;
  }

  const today = getTodayString();
  const yesterday = getYesterdayString();

  // 检查今天或昨天是否有学习记录
  const todayRecord = records.find(r => r.date === today);
  const yesterdayRecord = records.find(r => r.date === yesterday);

  if (!todayRecord && !yesterdayRecord) {
    // 如果今天和昨天都没有学习，streak 断了
    return 0;
  }

  // 从最近的学习日期开始计算
  let streak = 0;
  let currentDate = todayRecord ? today : yesterday;

  // 获取所有达到目标的日期
  const goalMetDates = new Set(
    records.filter(r => r.goalMet).map(r => r.date)
  );

  // 向前遍历计算连续天数
  const allDates = new Set(records.map(r => r.date));
  
  while (true) {
    if (allDates.has(currentDate)) {
      streak++;
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      currentDate = formatDate(d);
    } else {
      break;
    }
  }

  return streak;
}

// 更新学习记录
export async function updateStudyRecord(profileId: string, studyMinutes: number) {
  const today = getTodayString();
  const profile = await db
    .select()
    .from(lobsterProfiles)
    .where(eq(lobsterProfiles.id, profileId))
    .then(rows => rows[0]);

  const dailyGoal = profile?.dailyStudyMinutes || 30;
  const goalMet = studyMinutes >= dailyGoal;

  // 检查今日是否已有记录
  const [existing] = await db
    .select()
    .from(streakRecords)
    .where(
      and(
        eq(streakRecords.profileId, profileId),
        eq(streakRecords.date, today)
      )
    );

  if (existing) {
    // 更新现有记录
    await db
      .update(streakRecords)
      .set({
        studyMinutes,
        goalMet,
      })
      .where(eq(streakRecords.id, existing.id));
  } else {
    // 创建新记录
    await db.insert(streakRecords).values({
      id: nanoid(),
      profileId,
      date: today,
      studyMinutes,
      goalMet,
    });
  }

  return { studyMinutes, goalMet, streak: await calculateStreak(profileId) };
}

// 获取今日学习统计
export async function getTodayStats(profileId: string) {
  const today = getTodayString();
  
  const [record] = await db
    .select()
    .from(streakRecords)
    .where(
      and(
        eq(streakRecords.profileId, profileId),
        eq(streakRecords.date, today)
      )
    );

  const profile = await db
    .select()
    .from(lobsterProfiles)
    .where(eq(lobsterProfiles.id, profileId))
    .then(rows => rows[0]);

  const dailyGoal = profile?.dailyStudyMinutes || 30;

  return {
    todayStudyMinutes: record?.studyMinutes || 0,
    dailyGoal,
    goalMet: record?.goalMet || false,
    progress: Math.min(100, Math.round(((record?.studyMinutes || 0) / dailyGoal) * 100)),
  };
}

// 生成每日学习建议
export async function generateDailySuggestion(profileId: string): Promise<{
  message: string;
  type: "encourage" | "challenge" | "remind" | "celebrate";
  action?: string;
}> {
  const profile = await db
    .select()
    .from(lobsterProfiles)
    .where(eq(lobsterProfiles.id, profileId))
    .then(rows => rows[0]);

  if (!profile) {
    return {
      message: "开始你的学习之旅吧！",
      type: "encourage",
    };
  }

  const streak = await calculateStreak(profileId);
  const todayStats = await getTodayStats(profileId);
  const careerTrack = profile.careerTrackId
    ? await db.select().from(careerTracks).where(eq(careerTracks.id, profile.careerTrackId)).then(rows => rows[0])
    : null;

  // 根据不同情况生成建议
  if (todayStats.goalMet) {
    // 今日目标已完成
    const messages = [
      `太棒了！今天的学习目标已经达成 🎉`,
      `今天表现出色，继续保持！`,
      `今天的学习任务圆满完成，给自己点个赞！`,
    ];
    return {
      message: messages[Math.floor(Math.random() * messages.length)],
      type: "celebrate",
      action: streak >= 7 ? "你已经连续学习一周了，考虑挑战更高目标？" : undefined,
    };
  }

  if (streak === 0) {
    // 没有连续学习记录
    return {
      message: "开始你的学习打卡吧，每一步都算数！",
      type: "encourage",
      action: `今日目标：${todayStats.dailyGoal}分钟`,
    };
  }

  if (streak >= 7) {
    // 连续学习7天以上
    return {
      message: `你已经连续学习${streak}天了，自律达人！`,
      type: "challenge",
      action: `今日还需学习${todayStats.dailyGoal - todayStats.todayStudyMinutes}分钟`,
    };
  }

  if (streak >= 3) {
    // 连续学习3天以上
    return {
      message: `连续${streak}天学习，势头很好！`,
      type: "encourage",
      action: `继续加油，离7天成就还差${7 - streak}天`,
    };
  }

  // 默认建议
  return {
    message: `${careerTrack?.name || "学习"}路上，坚持就是胜利！`,
    type: "remind",
    action: `今日进度：${todayStats.progress}%`,
  };
}

// 获取提醒设置
export async function getReminderSettings(profileId?: string) {
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

  const [settings] = await db
    .select()
    .from(reminderSettings)
    .where(eq(reminderSettings.profileId, targetProfileId));

  return settings || {
    enabled: true,
    reminderTime: "09:00",
    notifyBeforeGoal: true,
  };
}

// 更新提醒设置
export async function updateReminderSettings(data: {
  enabled?: boolean;
  reminderTime?: string;
  notifyBeforeGoal?: boolean;
}) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("未登录");
  }

  const profile = await getProfile(user.id);
  if (!profile) {
    throw new Error("未找到档案");
  }

  const existing = await getReminderSettings(profile.id);

  if (existing.id) {
    // 更新
    const [updated] = await db
      .update(reminderSettings)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(reminderSettings.id, existing.id))
      .returning();
    return updated;
  } else {
    // 创建
    const [created] = await db
      .insert(reminderSettings)
      .values({
        id: nanoid(),
        profileId: profile.id,
        ...data,
      })
      .returning();
    return created;
  }
}

// 获取完整提醒数据（供 Dashboard 使用）
export async function getDailyReminderData() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const profile = await getProfile(user.id);
  if (!profile) {
    return null;
  }

  const [streak, todayStats, suggestion, settings] = await Promise.all([
    calculateStreak(profile.id),
    getTodayStats(profile.id),
    generateDailySuggestion(profile.id),
    getReminderSettings(profile.id),
  ]);

  return {
    streak,
    todayStats,
    suggestion,
    settings,
    profile: {
      name: profile.name,
      careerTrackId: profile.careerTrackId,
    },
  };
}

// 获取学习目标完成情况
export async function getWeeklyProgress(profileId: string): Promise<{
  days: Array<{
    date: string;
    dayName: string;
    studyMinutes: number;
    goal: number;
    completed: boolean;
  }>;
  totalDays: number;
  completedDays: number;
}> {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = formatDate(date);

    const [record] = await db
      .select()
      .from(streakRecords)
      .where(
        and(
          eq(streakRecords.profileId, profileId),
          eq(streakRecords.date, dateString)
        )
      );

    const profile = await db
      .select()
      .from(lobsterProfiles)
      .where(eq(lobsterProfiles.id, profileId))
      .then(rows => rows[0]);

    const dailyGoal = profile?.dailyStudyMinutes || 30;

    days.push({
      date: dateString,
      dayName: ["日", "一", "二", "三", "四", "五", "六"][date.getDay()],
      studyMinutes: record?.studyMinutes || 0,
      goal: dailyGoal,
      completed: record?.goalMet || false,
    });
  }

  return {
    days,
    totalDays: 7,
    completedDays: days.filter(d => d.completed).length,
  };
}
