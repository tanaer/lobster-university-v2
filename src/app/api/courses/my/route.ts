import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { studentCourses, courseProgress, courses } from "@/lib/db/schema-lobster";
import { eq, and } from "drizzle-orm";

// GET /api/courses/my - 获取我的课程列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    
    if (!profileId) {
      return NextResponse.json(
        { error: "缺少 profileId" },
        { status: 400 }
      );
    }
    
    // 获取学员的所有课程
    const myCourses = await db.select({
      sc: studentCourses,
      c: courses,
    })
      .from(studentCourses)
      .innerJoin(courses, eq(studentCourses.courseId, courses.id))
      .where(eq(studentCourses.profileId, profileId))
      .orderBy(studentCourses.enrolledAt);
    
    return NextResponse.json({
      success: true,
      courses: myCourses.map(({ sc, c }) => ({
        studentCourseId: sc.id,
        courseId: c.id,
        name: c.name,
        code: c.code,
        module: c.module,
        level: c.level,
        status: sc.status,
        progress: sc.progress,
        enrolledAt: sc.enrolledAt,
        startedAt: sc.startedAt,
        completedAt: sc.completedAt,
      })),
    });
  } catch (error) {
    console.error("获取我的课程失败:", error);
    return NextResponse.json(
      { error: "获取我的课程失败" },
      { status: 500 }
    );
  }
}
