import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courseProgress, studentCourses, skillCourses } from "@/lib/db/schema-lobster";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { emitEvent } from "@/lib/services/event-service";

// POST /api/courses/progress - 更新课程进度
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentCourseId, lessonIndex, lessonTitle, status, exerciseResult, passed, profileId } = body;
    
    if (!studentCourseId || lessonIndex === undefined || !profileId) {
      return NextResponse.json(
        { error: "缺少必要参数（需要 studentCourseId, lessonIndex, profileId）" },
        { status: 400 }
      );
    }

    // 验证 studentCourse 存在并获取关联的 courseId
    const [studentCourse] = await db.select()
      .from(studentCourses)
      .where(eq(studentCourses.id, studentCourseId))
      .limit(1);

    if (!studentCourse) {
      return NextResponse.json({ error: "选课记录不存在" }, { status: 404 });
    }

    // 认证：profileId 必须匹配
    if (studentCourse.profileId !== profileId) {
      return NextResponse.json({ error: "无权修改此课程进度" }, { status: 403 });
    }

    // 获取课程总课时数
    const [course] = await db.select({ lessons: skillCourses.lessons })
      .from(skillCourses)
      .where(eq(skillCourses.id, studentCourse.courseId))
      .limit(1);

    let totalLessons = 1;
    try {
      const lessons = JSON.parse(course?.lessons || "[]");
      totalLessons = Math.max(1, lessons.length);
    } catch {
      totalLessons = 1;
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
    
    // 用课程总课时数计算进度
    const allProgress = await db.select()
      .from(courseProgress)
      .where(eq(courseProgress.studentCourseId, studentCourseId));
    
    const completedCount = allProgress.filter(p => p.status === "completed").length;
    const progressPercent = Math.round((completedCount / totalLessons) * 100);
    
    await db.update(studentCourses)
      .set({
        progress: progressPercent,
        status: progressPercent === 100 ? "completed" : "in_progress",
        completedAt: progressPercent === 100 ? new Date() : undefined,
      })
      .where(eq(studentCourses.id, studentCourseId));
    
    emitEvent({ actor: profileId, actorType: 'student', action: 'course.progress', level: 'L2', target: studentCourseId, targetType: 'studentCourse', department: '教务处', status: 'ok', metadata: { progress: progressPercent, completedLessons: completedCount, totalLessons } });
    if (status === 'completed') {
      emitEvent({ actor: profileId, actorType: 'student', action: 'chapter.complete', level: 'L1', target: studentCourseId, targetType: 'studentCourse', department: '教务处', status: 'ok', metadata: { lessonIndex, lessonTitle } });
    }
    return NextResponse.json({
      success: true,
      message: "进度更新成功",
      progress: progressPercent,
      completedLessons: completedCount,
      totalLessons,
    });
  } catch (error) {
    console.error("更新进度失败:", error);
    return NextResponse.json(
      { error: "更新进度失败" },
      { status: 500 }
    );
  }
}
