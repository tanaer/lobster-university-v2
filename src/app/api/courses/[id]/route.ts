import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, studentCourses, courseProgress } from "@/lib/db/schema-lobster";
import { eq, and } from "drizzle-orm";
import { readFile } from "fs/promises";
import { join } from "path";

// GET /api/courses/[id] - 获取课程详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    
    // 获取课程信息
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
    
    const c = course[0];
    
    // 尝试读取 Skill 文件内容
    let skillContent = null;
    try {
      if (c.skillPath) {
        const fullPath = join(process.cwd(), c.skillPath);
        skillContent = await readFile(fullPath, "utf-8");
      }
    } catch {
      // 文件不存在，返回 null
    }
    
    return NextResponse.json({
      success: true,
      course: {
        id: c.id,
        name: c.name,
        code: c.code,
        description: c.description,
        module: c.module,
        category: c.category,
        duration: c.duration,
        level: c.level,
        objectives: JSON.parse(c.objectives || "[]"),
        lessons: JSON.parse(c.lessons || "[]"),
        prerequisites: JSON.parse(c.prerequisites || "[]"),
        enrollCount: c.enrollCount,
        completionRate: c.completionRate,
        skillContent,
      },
    });
  } catch (error) {
    console.error("获取课程详情失败:", error);
    return NextResponse.json(
      { error: "获取课程详情失败" },
      { status: 500 }
    );
  }
}
