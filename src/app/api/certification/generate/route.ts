import { NextRequest, NextResponse } from "next/server";
import { generateCertificate } from "@/lib/services/certification-service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { emitEvent } from "@/lib/services/event-service";

// POST: 生成证书
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await request.json();
    const { certificationId } = body;

    if (!certificationId) {
      return NextResponse.json(
        { error: "缺少认证ID" },
        { status: 400 }
      );
    }

    const certificate = await generateCertificate(certificationId);

    emitEvent({ actor: session.user.id, actorType: 'student', action: 'cert.issue', level: 'L1', target: certificationId, targetType: 'certification', department: '认证中心', status: 'ok' });
    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error: any) {
    console.error("Certificate generate error:", error);
    return NextResponse.json(
      { error: error.message || "生成证书失败" },
      { status: 500 }
    );
  }
}
