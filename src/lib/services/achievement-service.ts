import { db } from "@/lib/db";
import { achievements } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

// 成就定义
export const ACHIEVEMENTS = {
  // 入学成就
  enrollment: {
    id: "enrollment",
    name: "入学报到",
    description: "完成入学注册",
    icon: "🎒",
    exp: 100,
  },
  first_task: {
    id: "first_task",
    name: "初试身手",
    description: "完成第一个任务",
    icon: "🎯",
    exp: 150,
  },
  first_deliverable: {
    id: "first_deliverable",
    name: "成果交付",
    description: "提交第一个作品",
    icon: "📦",
    exp: 200,
  },
  first_course: {
    id: "first_course",
    name: "学有所成",
    description: "完成第一门课程",
    icon: "🎓",
    exp: 300,
  },

  // 连续学习成就
  streak_3: {
    id: "streak_3",
    name: "三天成习",
    description: "连续学习 3 天",
    icon: "🌱",
    exp: 100,
  },
  streak_7: {
    id: "streak_7",
    name: "自律达人",
    description: "连续学习 7 天",
    icon: "🔥",
    exp: 200,
  },
  streak_14: {
    id: "streak_14",
    name: "坚持不懈",
    description: "连续学习 14 天",
    icon: "💪",
    exp: 400,
  },
  streak_30: {
    id: "streak_30",
    name: "持之以恒",
    description: "连续学习 30 天",
    icon: "💎",
    exp: 800,
  },

  // 作品集成就
  portfolio_3: {
    id: "portfolio_3",
    name: "小有成就",
    description: "作品集达到 3 个",
    icon: "📁",
    exp: 300,
  },
  portfolio_5: {
    id: "portfolio_5",
    name: "作品收藏家",
    description: "作品集达到 5 个",
    icon: "🏆",
    exp: 500,
  },
  portfolio_10: {
    id: "portfolio_10",
    name: "多产创作者",
    description: "作品集达到 10 个",
    icon: "👑",
    exp: 1000,
  },

  // 学习时长成就
  study_1h: {
    id: "study_1h",
    name: "初露锋芒",
    description: "累计学习 1 小时",
    icon: "⏰",
    exp: 100,
  },
  study_10h: {
    id: "study_10h",
    name: "废寝忘食",
    description: "累计学习 10 小时",
    icon: "📚",
    exp: 500,
  },
  study_50h: {
    id: "study_50h",
    name: "学富五车",
    description: "累计学习 50 小时",
    icon: "📖",
    exp: 1500,
  },

  // 毕业成就
  graduated: {
    id: "graduated",
    name: "顺利毕业",
    description: "完成职业方向所有课程",
    icon: "🎓",
    exp: 2000,
  },
};

export type AchievementId = keyof typeof ACHIEVEMENTS;

// 解锁成就
export async function unlockAchievement(userId: string, achievementId: AchievementId) {
  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) {
    throw new Error(`Unknown achievement: ${achievementId}`);
  }

  // 检查是否已解锁
  const [existing] = await db
    .select()
    .from(achievements)
    .where(
      and(
        eq(achievements.userId, userId),
        eq(achievements.type, achievementId)
      )
    )
    .limit(1);

  if (existing) {
    return { alreadyUnlocked: true, achievement: existing };
  }

  // 解锁成就
  const [unlocked] = await db
    .insert(achievements)
    .values({
      id: nanoid(),
      userId,
      type: achievementId,
      metadata: JSON.stringify({
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        exp: achievement.exp,
      }),
      unlockedAt: new Date(),
    })
    .returning();

  return { alreadyUnlocked: false, achievement: unlocked };
}

// 获取用户所有成就
export async function getUserAchievements(userId: string) {
  const rows = await db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, userId));

  return rows.map((row) => ({
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : null,
  }));
}

// 检查并自动解锁成就
export async function checkAndUnlockAchievements(
  userId: string,
  stats: {
    completedTasks: number;
    portfolioItems: number;
    totalStudyTime: number; // 分钟
    streak: number;
    graduated: boolean;
  }
) {
  const unlocked: AchievementId[] = [];

  // 检查任务成就
  if (stats.completedTasks >= 1) {
    await unlockAchievement(userId, "first_task");
    unlocked.push("first_task");
  }

  // 检查作品集成就
  if (stats.portfolioItems >= 1) {
    await unlockAchievement(userId, "first_deliverable");
    unlocked.push("first_deliverable");
  }
  if (stats.portfolioItems >= 3) {
    await unlockAchievement(userId, "portfolio_3");
    unlocked.push("portfolio_3");
  }
  if (stats.portfolioItems >= 5) {
    await unlockAchievement(userId, "portfolio_5");
    unlocked.push("portfolio_5");
  }
  if (stats.portfolioItems >= 10) {
    await unlockAchievement(userId, "portfolio_10");
    unlocked.push("portfolio_10");
  }

  // 检查学习时长成就
  if (stats.totalStudyTime >= 60) {
    await unlockAchievement(userId, "study_1h");
    unlocked.push("study_1h");
  }
  if (stats.totalStudyTime >= 600) {
    await unlockAchievement(userId, "study_10h");
    unlocked.push("study_10h");
  }
  if (stats.totalStudyTime >= 3000) {
    await unlockAchievement(userId, "study_50h");
    unlocked.push("study_50h");
  }

  // 检查连续学习成就
  if (stats.streak >= 3) {
    await unlockAchievement(userId, "streak_3");
    unlocked.push("streak_3");
  }
  if (stats.streak >= 7) {
    await unlockAchievement(userId, "streak_7");
    unlocked.push("streak_7");
  }
  if (stats.streak >= 14) {
    await unlockAchievement(userId, "streak_14");
    unlocked.push("streak_14");
  }
  if (stats.streak >= 30) {
    await unlockAchievement(userId, "streak_30");
    unlocked.push("streak_30");
  }

  // 检查毕业成就
  if (stats.graduated) {
    await unlockAchievement(userId, "graduated");
    unlocked.push("graduated");
  }

  return unlocked;
}
