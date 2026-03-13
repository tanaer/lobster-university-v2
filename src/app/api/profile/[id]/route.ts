import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lobsterProfiles } from "@/lib/db/schema-lobster";
import { eq } from "drizzle-orm";

// GET /api/profile/[id] - 获取龙虾档案
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: profileId } = await params;

    const profile = await db
      .select()
      .from(lobsterProfiles)
      .where(eq(lobsterProfiles.id, profileId))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json(
        { success: false, error: "档案不存在" },
        { status: 404 }
      );
    }

    const p = profile[0];

    return NextResponse.json({
      success: true,
      profile: {
        id: p.id,
        name: p.name,
        studentId: p.studentId,
        avatar: p.avatar,
        accessToken: p.accessToken,
        careerTrackId: p.careerTrackId,
        status: p.status,
        totalStudyTime: p.totalStudyTime,
        completedTasks: p.completedTasks,
        portfolioItems: p.portfolioItems,
      },
    });
  } catch (error) {
    console.error("获取档案失败:", error);
    return NextResponse.json(
      { success: false, error: "获取档案失败" },
      { status: 500 }
    );
  }
}
