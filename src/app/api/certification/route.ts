import { NextRequest, NextResponse } from "next/server";
import {
  getCertificationStatus,
  applyForCertification,
  checkCertificationEligibility,
} from "@/lib/services/certification-service";
import { db } from "@/lib/db";
import { lobsterProfiles } from "@/lib/db/schema-lobster";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { emitEvent } from "@/lib/services/event-service";

// 获取当前用户档案
async function getCurrentProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) {
    return null;
  }

  const [profile] = await db
    .select()
    .from(lobsterProfiles)
    .where(eq(lobsterProfiles.userId, session.user.id))
    .limit(1);

  return profile;
}

// GET: 获取认证状态和条件检查
export async function GET(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    
    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level");
    const action = searchParams.get("action");

    // 检查特定等级的资格
    if (action === "check" && level) {
      if (!profile) {
        return NextResponse.json({ error: "未登录" }, { status: 401 });
      }

      const eligibility = await checkCertificationEligibility(
        profile.id,
        parseInt(level)
      );
      return NextResponse.json({ eligibility });
    }

    if (!profile) {
      return NextResponse.json({
        status: {
          currentLevel: 1,
          certifications: [],
          eligibility: { eligible: false, requirements: [] },
          nextLevel: 2,
        },
      });
    }

    // 获取认证状态
    const status = await getCertificationStatus(profile.id);
    return NextResponse.json({ status });
  } catch (error: any) {
    console.error("Certification GET error:", error);
    return NextResponse.json(
      { error: error.message || "获取认证状态失败" },
      { status: 500 }
    );
  }
}

// POST: 申请认证
export async function POST(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    
    if (!profile) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await request.json();
    const { trackId, level } = body;

    if (!trackId || !level) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }

    const certification = await applyForCertification(
      profile.id,
      trackId,
      parseInt(level)
    );

    emitEvent({ actor: profile.id, actorType: 'student', action: 'cert.issue', level: 'L1', target: certification.id, targetType: 'certification', department: '认证中心', status: 'ok', metadata: { trackId, level } });
    return NextResponse.json({
      success: true,
      certification,
    });
  } catch (error: any) {
    console.error("Certification POST error:", error);
    return NextResponse.json(
      { error: error.message || "申请认证失败" },
      { status: 500 }
    );
  }
}
