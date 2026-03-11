import { NextRequest, NextResponse } from "next/server";
import {
  getDailyReminderData,
  getReminderSettings,
  updateReminderSettings,
  calculateStreak,
  getTodayStats,
  generateDailySuggestion,
  getWeeklyProgress,
  updateStudyRecord,
} from "@/lib/services/reminder-service";

// GET: 获取提醒数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case "settings":
        // 获取提醒设置
        const settings = await getReminderSettings();
        return NextResponse.json({ settings });

      case "streak":
        // 获取连续学习天数（需要 profileId 参数）
        const profileId = searchParams.get("profileId");
        if (!profileId) {
          return NextResponse.json(
            { error: "缺少 profileId 参数" },
            { status: 400 }
          );
        }
        const streak = await calculateStreak(profileId);
        return NextResponse.json({ streak });

      case "today":
        // 获取今日统计（需要 profileId 参数）
        const todayProfileId = searchParams.get("profileId");
        if (!todayProfileId) {
          return NextResponse.json(
            { error: "缺少 profileId 参数" },
            { status: 400 }
          );
        }
        const todayStats = await getTodayStats(todayProfileId);
        return NextResponse.json({ todayStats });

      case "suggestion":
        // 获取每日建议（需要 profileId 参数）
        const suggestionProfileId = searchParams.get("profileId");
        if (!suggestionProfileId) {
          return NextResponse.json(
            { error: "缺少 profileId 参数" },
            { status: 400 }
          );
        }
        const suggestion = await generateDailySuggestion(suggestionProfileId);
        return NextResponse.json({ suggestion });

      case "weekly":
        // 获取周进度（需要 profileId 参数）
        const weeklyProfileId = searchParams.get("profileId");
        if (!weeklyProfileId) {
          return NextResponse.json(
            { error: "缺少 profileId 参数" },
            { status: 400 }
          );
        }
        const weeklyProgress = await getWeeklyProgress(weeklyProfileId);
        return NextResponse.json({ weeklyProgress });

      default:
        // 默认返回完整的每日提醒数据
        const reminderData = await getDailyReminderData();
        if (!reminderData) {
          return NextResponse.json(
            { error: "未登录或未找到档案" },
            { status: 401 }
          );
        }
        return NextResponse.json(reminderData);
    }
  } catch (error: any) {
    console.error("Reminder GET error:", error);
    return NextResponse.json(
      { error: error.message || "获取提醒数据失败" },
      { status: 500 }
    );
  }
}

// POST: 更新提醒设置或学习记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case "updateSettings":
        // 更新提醒设置
        const settings = await updateReminderSettings({
          enabled: data.enabled,
          reminderTime: data.reminderTime,
          notifyBeforeGoal: data.notifyBeforeGoal,
        });
        return NextResponse.json({ success: true, settings });

      case "updateStudy":
        // 更新学习记录
        if (!data.profileId || typeof data.studyMinutes !== "number") {
          return NextResponse.json(
            { error: "缺少必要参数" },
            { status: 400 }
          );
        }
        const result = await updateStudyRecord(data.profileId, data.studyMinutes);
        return NextResponse.json({ success: true, ...result });

      default:
        return NextResponse.json(
          { error: "无效的操作" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Reminder POST error:", error);
    return NextResponse.json(
      { error: error.message || "操作失败" },
      { status: 500 }
    );
  }
}
