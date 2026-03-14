import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolios, lobsterProfiles } from "@/lib/db/schema-lobster";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { emitEvent } from "@/lib/services/event-service";

// GET: 获取作品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");

    // 简单返回作品列表
    const list = profileId
      ? await db.select().from(portfolios).where(eq(portfolios.profileId, profileId)).orderBy(desc(portfolios.createdAt))
      : await db.select().from(portfolios).orderBy(desc(portfolios.createdAt));

    return NextResponse.json({ portfolios: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "获取作品列表失败" }, { status: 500 });
  }
}

// POST: 提交作品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, title, description, type, content, fileUrl, capabilityId } = body;

    if (!profileId || !title || !type) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    // 验证 profile 存在
    const [profile] = await db.select().from(lobsterProfiles).where(eq(lobsterProfiles.id, profileId)).limit(1);
    if (!profile) {
      return NextResponse.json({ error: "用户档案不存在" }, { status: 404 });
    }

    const [portfolio] = await db.insert(portfolios).values({
      id: nanoid(),
      profileId,
      title,
      description: description || "",
      type,
      content: content || "",
      fileUrl: fileUrl || "",
      capabilityId: capabilityId || null,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // 更新用户作品计数
    await db.update(lobsterProfiles)
      .set({
        portfolioItems: (profile.portfolioItems || 0) + 1,
        updatedAt: new Date()
      })
      .where(eq(lobsterProfiles.id, profileId));

    emitEvent({ actor: profileId, actorType: 'student', action: 'portfolio.submit', level: 'L1', target: portfolio.id, targetType: 'portfolio', department: '就业服务中心', status: 'ok' });
    return NextResponse.json({ success: true, portfolio });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "提交作品失败" }, { status: 500 });
  }
}
