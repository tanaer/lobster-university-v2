import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lobsterProfiles, studentCourses, skillCourses, studyLogs } from "@/lib/db/schema-lobster";
import { sql, eq, and, desc } from "drizzle-orm";

// GET /api/admin/stats - 获取管理统计
export async function GET() {
  try {
    // 1. 统计总学员数
    const totalStudentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(lobsterProfiles);
    const totalStudents = totalStudentsResult[0]?.count || 0;

    // 2. 统计今日活跃学员
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Math.floor(today.getTime() / 1000);

    const activeTodayResult = await db
      .select({ count: sql<number>`count(distinct ${studyLogs.profileId})` })
      .from(studyLogs)
      .where(sql`${studyLogs.studiedAt} >= ${todayTimestamp}`);
    const activeToday = activeTodayResult[0]?.count || 0;

    // 3. 统计课程完成率
    const totalEnrollmentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(studentCourses);
    const totalEnrollments = totalEnrollmentsResult[0]?.count || 0;

    const completedEnrollmentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(studentCourses)
      .where(eq(studentCourses.status, "completed"));
    const completedEnrollments = completedEnrollmentsResult[0]?.count || 0;

    const completionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

    // 4. 统计最受欢迎课程（TOP 5）
    const topCoursesResult = await db
      .select({
        name: skillCourses.name,
        enrollCount: skillCourses.enrollCount,
      })
      .from(skillCourses)
      .where(eq(skillCourses.published, true))
      .orderBy(desc(skillCourses.enrollCount))
      .limit(5);

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: Number(totalStudents),
        activeToday: Number(activeToday),
        completionRate,
        topCourses: topCoursesResult.map(c => ({
          name: c.name,
          enrollCount: c.enrollCount || 0,
        })),
      },
    });
  } catch (error) {
    console.error("获取统计数据失败:", error);
    return NextResponse.json(
      { success: false, error: "获取统计数据失败" },
      { status: 500 }
    );
  }
}
