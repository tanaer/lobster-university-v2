import { NextRequest, NextResponse } from "next/server";
import { getPortfolioById, deletePortfolio, updatePortfolio, getEvidenceChain } from "@/lib/services/portfolio-service";
import { PortfolioType } from "@/lib/services/portfolio-service";
import { db } from "@/lib/db";
import { lobsterProfiles } from "@/lib/db/schema-lobster";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getCurrentProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  const [profile] = await db.select().from(lobsterProfiles).where(eq(lobsterProfiles.userId, session.user.id)).limit(1);
  return profile;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeEvidence = searchParams.get("evidence") === "true";
    const portfolio = await getPortfolioById(id);
    if (!portfolio) return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    const evidence = includeEvidence ? await getEvidenceChain(id) : null;
    return NextResponse.json({ portfolio, evidence });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "获取作品详情失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "未登录" }, { status: 401 });
    await deletePortfolio(id, profile.id);
    return NextResponse.json({ success: true, message: "作品已删除" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "删除作品失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, type, capabilityId, content, fileUrl } = body;
    const portfolio = await updatePortfolio(id, { title, description, type: type as PortfolioType, capabilityId, content, fileUrl });
    return NextResponse.json({ success: true, portfolio });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "更新作品失败" }, { status: 500 });
  }
}
