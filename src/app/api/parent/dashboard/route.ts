import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  parentStudentBindings,
  lobsterProfiles,
  careerTracks,
  studyLogs,
  studentCourses,
  portfolios,
  streakRecords,
} from "@/lib/db/schema-lobster";
import { eq, desc, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const userId = session.user.id;

    // 获取绑定的学员
    const bindings = await db
      .select()
      .from(parentStudentBindings)
      .where(eq(parentStudentBindings.parentId, userId));

    if (bindings.length === 0) {
      return NextResponse.json({ students: [] });
    }

    const students = [];

    for (const binding of bindings) {
      // 获取学员档案
      const [profile] = await db
        .select()
        .from(lobsterProfiles)
        .where(eq(lobsterProfiles.id, binding.studentId))
        .limit(1);

      if (!profile) continue;

      // 获取职业方向
      let careerTrackName: string | undefined;
      if (profile.careerTrackId) {
        const [track] = await db
          .select({ name: careerTracks.name })
          .from(careerTracks)
          .where(eq(careerTracks.id, profile.careerTrackId))
          .limit(1);
        careerTrackName = track?.name;
      }

      // 获取课程统计
      const courseStats = await db
        .select({
          status: studentCourses.status,
          count: sql<number>`count(*)`,
        })
        .from(studentCourses)
        .where(eq(studentCourses.profileId, profile.id))
        .groupBy(studentCourses.status);

      const completedCourses = courseStats.find((s) => s.status === "completed")?.count || 0;
      const inProgressCourses =
        courseStats.find((s) => s.status === "in_progress")?.count ||
        courseStats.find((s) => s.status === "enrolled")?.count ||
        0;

      // 获取作品集数量
      const [portfolioCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(portfolios)
        .where(eq(portfolios.profileId, profile.id));

      // 获取连续学习天数
      const recentStreaks = await db
        .select()
        .from(streakRecords)
        .where(
          and(
            eq(streakRecords.profileId, profile.id),
            eq(streakRecords.goalMet, true)
          )
        )
        .orderBy(desc(streakRecords.date))
        .limit(30);

      let streak = 0;
      const today = new Date().toISOString().split("T")[0];
      for (let i = 0; i < recentStreaks.length; i++) {
        const expected = new Date();
        expected.setDate(expected.getDate() - i);
        const expectedDate = expected.toISOString().split("T")[0];
        if (recentStreaks[i].date === expectedDate) {
          streak++;
        } else {
          break;
        }
      }

      // 获取最近学习记录
      const recentLogs = await db
        .select({
          taskName: studyLogs.taskName,
          taskType: studyLogs.taskType,
          duration: studyLogs.duration,
          studiedAt: studyLogs.studiedAt,
        })
        .from(studyLogs)
        .where(eq(studyLogs.profileId, profile.id))
        .orderBy(desc(studyLogs.studiedAt))
        .limit(5);

      students.push({
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar,
        studentId: profile.studentId,
        careerTrack: careerTrackName,
        level: 1, // 可以从 users 表获取
        status: profile.status || "active",
        stats: {
          totalStudyTime: profile.totalStudyTime || 0,
          completedCourses: Number(completedCourses),
          inProgressCourses: Number(inProgressCourses),
          portfolioItems: Number(portfolioCount?.count || 0),
          streak,
        },
        recentLogs: recentLogs.map((log) => ({
          taskName: log.taskName,
          taskType: log.taskType,
          duration: log.duration,
          studiedAt: log.studiedAt ? new Date(log.studiedAt).toISOString() : "",
        })),
      });
    }

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Parent dashboard error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
