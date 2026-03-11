import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, studentCourses, courseProgress } from "@/lib/db/schema-lobster";
import { lobsterProfiles } from "@/lib/db/schema-lobster";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

// GET /api/courses - 获取课程列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get("module");
    const level = searchParams.get("level");
    
    let query = db.select().from(courses).where(eq(courses.published, true));
    
    if (module) {
      query = db.select().from(courses).where(
        and(eq(courses.published, true), eq(courses.module, module))
      );
    }
    
    const allCourses = await query.orderBy(courses.order);
    
    return NextResponse.json({
      success: true,
      courses: allCourses.map(c => ({
        id: c.id,
        name: c.name,
        code: c.code,
        description: c.description,
        module: c.module,
        category: c.category,
        duration: c.duration,
        level: c.level,
        objectives: JSON.parse(c.objectives || "[]"),
        prerequisites: JSON.parse(c.prerequisites || "[]"),
        enrollCount: c.enrollCount,
        completionRate: c.completionRate,
      })),
    });
  } catch (error) {
    console.error("获取课程列表失败:", error);
    return NextResponse.json(
      { error: "获取课程列表失败" },
      { status: 500 }
    );
  }
}

// POST /api/courses/enroll - 报名课程
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, courseId } = body;
    
    if (!profileId || !courseId) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }
    
    // 检查是否已报名
    const existing = await db.select()
      .from(studentCourses)
      .where(
        and(
          eq(studentCourses.profileId, profileId),
          eq(studentCourses.courseId, courseId)
        )
      )
      .limit(1);
    
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "已报名该课程" },
        { status: 409 }
      );
    }
    
    // 检查课程是否存在
    const course = await db.select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);
    
    if (course.length === 0) {
      return NextResponse.json(
        { error: "课程不存在" },
        { status: 404 }
      );
    }
    
    // 创建报名记录
    const studentCourseId = nanoid();
    await db.insert(studentCourses).values({
      id: studentCourseId,
      profileId,
      courseId,
      status: "enrolled",
      progress: 0,
    });
    
    // 更新课程报名数
    await db.update(courses)
      .set({ enrollCount: (course[0].enrollCount || 0) + 1 })
      .where(eq(courses.id, courseId));
    
    return NextResponse.json({
      success: true,
      message: "报名成功",
      studentCourseId,
    });
  } catch (error) {
    console.error("报名失败:", error);
    return NextResponse.json(
      { error: "报名失败" },
      { status: 500 }
    );
  }
}
