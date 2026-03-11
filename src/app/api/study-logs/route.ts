import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { studyLogs, lobsterProfiles } from "@/lib/db/schema-lobster";
import { eq } from "drizzle-orm";
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

// GET - 获取学习记录
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 获取龙虾档案
    const [profile] = await db
      .select()
      .from(lobsterProfiles)
      .where(eq(lobsterProfiles.userId, user.id))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ logs: [] });
    }

    const logs = await db
      .select()
      .from(studyLogs)
      .where(eq(studyLogs.profileId, profile.id))
      .limit(20);

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("Get study logs error:", error);
    return NextResponse.json(
      { error: error.message || "获取学习记录失败" },
      { status: 500 }
    );
  }
}

// POST - 创建学习记录
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await request.json();
    const { taskName, taskType, duration, deliverable, deliverableUrl, capabilityId } = body;

    // 验证
    if (!taskName || !taskType || !duration) {
      return NextResponse.json(
        { error: "缺少必要字段" },
        { status: 400 }
      );
    }

    // 获取龙虾档案
    const [profile] = await db
      .select()
      .from(lobsterProfiles)
      .where(eq(lobsterProfiles.userId, user.id))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ error: "请先入学" }, { status: 400 });
    }

    // 创建学习记录
    const [log] = await db
      .insert(studyLogs)
      .values({
        id: nanoid(),
        profileId: profile.id,
        taskName,
        taskType,
        duration,
        deliverable,
        deliverableUrl,
        capabilityId,
        status: "completed",
        studiedAt: new Date(),
      })
      .returning();

    // 更新学习统计
    await db
      .update(lobsterProfiles)
      .set({
        totalStudyTime: (profile.totalStudyTime || 0) + duration,
        completedTasks: (profile.completedTasks || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(lobsterProfiles.id, profile.id));

    return NextResponse.json({
      success: true,
      log: {
        id: log.id,
        taskName: log.taskName,
        duration: log.duration,
      },
    });
  } catch (error: any) {
    console.error("Create study log error:", error);
    return NextResponse.json(
      { error: error.message || "创建学习记录失败" },
      { status: 500 }
    );
  }
}
