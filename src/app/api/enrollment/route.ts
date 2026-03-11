import { NextRequest, NextResponse } from "next/server";
import { enrollLobster } from "@/lib/services/lobster-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, selectedTrack, dailyMinutes, reminderTime } = body;

    // 验证
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "龙虾名字至少需要2个字符" },
        { status: 400 }
      );
    }

    if (!selectedTrack) {
      return NextResponse.json(
        { error: "请选择职业方向" },
        { status: 400 }
      );
    }

    // 创建档案
    const profile = await enrollLobster({
      name: name.trim(),
      careerTrackId: selectedTrack,
      dailyStudyMinutes: dailyMinutes || 30,
      studyReminder: reminderTime,
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        name: profile.name,
        studentId: profile.studentId,
        careerTrackId: profile.careerTrackId,
      },
    });
  } catch (error: any) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: error.message || "入学失败" },
      { status: 500 }
    );
  }
}
