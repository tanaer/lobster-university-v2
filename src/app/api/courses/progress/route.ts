import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courseProgress, studentCourses } from "@/lib/db/schema-lobster";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

// POST /api/courses/progress - 更新课程进度
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentCourseId, lessonIndex, lessonTitle, status, exerciseResult, passed } = body;
    
    if (!studentCourseId || lessonIndex === undefined) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }
    
    // 检查是否已有进度记录
    const existing = await db.select()
      .from(courseProgress)
      .where(
        and(
          eq(courseProgress.studentCourseId, studentCourseId),
          eq(courseProgress.lessonIndex, lessonIndex)
        )
      )
      .limit(1);
    
    if (existing.length > 0) {
      // 更新现有记录
      await db.update(courseProgress)
        .set({
          status: status || existing[0].status,
          completedAt: status === "completed" ? new Date() : existing[0].completedAt,
          exerciseResult: exerciseResult ? JSON.stringify(exerciseResult) : existing[0].exerciseResult,
          passed: passed !== undefined ? passed : existing[0].passed,
          updatedAt: new Date(),
        })
        .where(eq(courseProgress.id, existing[0].id));
    } else {
      // 创建新记录
      await db.insert(courseProgress).values({
        id: nanoid(),
        studentCourseId,
        lessonIndex,
        lessonTitle: lessonTitle || `Lesson ${lessonIndex}`,
        status: status || "in_progress",
        completedAt: status === "completed" ? new Date() : null,
        exerciseResult: exerciseResult ? JSON.stringify(exerciseResult) : null,
        passed: passed || false,
      });
    }
    
    // 更新总进度
    const allProgress = await db.select()
      .from(courseProgress)
      .where(eq(courseProgress.studentCourseId, studentCourseId));
    
    const completedCount = allProgress.filter(p => p.status === "completed").length;
    const totalCount = allProgress.length || 1;
    const progressPercent = Math.round((completedCount / totalCount) * 100);
    
    await db.update(studentCourses)
      .set({
        progress: progressPercent,
        status: progressPercent === 100 ? "completed" : "in_progress",
        completedAt: progressPercent === 100 ? new Date() : undefined,
      })
      .where(eq(studentCourses.id, studentCourseId));
    
    return NextResponse.json({
      success: true,
      message: "进度更新成功",
      progress: progressPercent,
    });
  } catch (error) {
    console.error("更新进度失败:", error);
    return NextResponse.json(
      { error: "更新进度失败" },
      { status: 500 }
    );
  }
}
