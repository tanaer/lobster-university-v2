import { NextRequest, NextResponse } from "next/server";
import {
  submitPortfolio,
  getPortfolios,
  getPortfolioStats,
  updatePortfolioStatus,
  PortfolioType,
  PortfolioStatus,
} from "@/lib/services/portfolio-service";
import { db } from "@/lib/db";
import { lobsterProfiles } from "@/lib/db/schema-lobster";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getCurrentProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) return null;
  const [profile] = await db.select().from(lobsterProfiles).where(eq(lobsterProfiles.userId, session.user.id)).limit(1);
  return profile;
}

export async function GET(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ portfolios: [], stats: { total: 0, draft: 0, submitted: 0, verified: 0, rejected: 0 } });
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as PortfolioStatus | null;
    const type = searchParams.get("type") as PortfolioType | null;
    const action = searchParams.get("action");
    if (action === "stats") {
      const stats = await getPortfolioStats(profile.id);
      return NextResponse.json({ stats });
    }
    const portfolios = await getPortfolios({ profileId: profile.id, status: status || undefined, type: type || undefined });
    return NextResponse.json({ portfolios });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "获取作品列表失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "请先入学" }, { status: 401 });
    const body = await request.json();
    const { title, description, type, capabilityId, content, fileUrl, status } = body;
    if (!title || !type) return NextResponse.json({ error: "标题和类型为必填项" }, { status: 400 });
    const portfolio = await submitPortfolio(profile.id, { title, description, type: type as PortfolioType, capabilityId, content, fileUrl, status: status as PortfolioStatus });
    return NextResponse.json({ success: true, portfolio });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "提交作品失败" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;
    if (!id || !status) return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    const portfolio = await updatePortfolioStatus(id, status as PortfolioStatus, notes);
    return NextResponse.json({ success: true, portfolio });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "更新状态失败" }, { status: 500 });
  }
}
