import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skillCourses, studentCourses, courseProgress, lobsterProfiles } from "@/lib/db/schema-lobster";
import { eq, and, sql } from "drizzle-orm";
import { readFile } from "fs/promises";
import { join } from "path";

// 基于课程 ID 生成稳定的 mock 学习人数（不超过在读学员总数）
function getMockEnrollCount(courseId: string, realCount: number, totalStudents: number): number {
  if (realCount > 0) return realCount;
  const minCount = Math.max(10, Math.floor(totalStudents * 0.05));
  const maxCount = Math.max(minCount + 1, Math.floor(totalStudents * 0.6));
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = ((hash << 5) - hash + courseId.charCodeAt(i)) | 0;
  }
  return minCount + Math.abs(hash % (maxCount - minCount));
}

// GET /api/courses/[id] - 获取课程详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    
    // 获取课程信息
    const course = await db.select()
      .from(skillCourses)
      .where(eq(skillCourses.id, courseId))
      .limit(1);
    
    if (course.length === 0) {
      return NextResponse.json(
        { error: "课程不存在" },
        { status: 404 }
      );
    }
    
    const c = course[0];
    
    // 查询在读学员总数用于 mock 上限
    const [{ count: totalStudents }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(lobsterProfiles)
      .where(eq(lobsterProfiles.status, "active"));
    
    // 尝试读取 Skill 文件内容
    let skillContent = null;
    try {
      if (c.skillPath) {
        let skillFile = join(process.cwd(), c.skillPath);
        // 如果路径指向目录（没有 .md 后缀），自动追加 SKILL.md
        if (!skillFile.endsWith(".md")) {
          skillFile = join(skillFile, "SKILL.md");
        }
        skillContent = await readFile(skillFile, "utf-8");
      }
    } catch {
      // 文件不存在，返回 null
    }
    
    // 解析前置课程 ID，查询实际名称
    const prereqIds: string[] = JSON.parse(c.prerequisites || "[]");
    let prereqsWithNames: Array<{ id: string; name: string }> = [];
    if (prereqIds.length > 0) {
      const prereqCourses = await db.select({ id: skillCourses.id, name: skillCourses.name })
        .from(skillCourses)
        .where(sql`${skillCourses.id} IN (${sql.join(prereqIds.map(id => sql`${id}`), sql`, `)})`);
      const nameMap = new Map(prereqCourses.map(p => [p.id, p.name]));
      prereqsWithNames = prereqIds.map(id => ({ id, name: nameMap.get(id) || id }));
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
        prerequisites: prereqsWithNames,
        enrollCount: getMockEnrollCount(c.id, c.enrollCount || 0, totalStudents || 100),
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
