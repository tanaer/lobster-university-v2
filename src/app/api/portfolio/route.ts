import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolios, lobsterProfiles } from "@/lib/db/schema-lobster";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { emitEvent } from "@/lib/services/event-service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPortfolioStats, PORTFOLIO_TYPES, PortfolioStatus } from "@/lib/services/portfolio-service";

type ReviewStatus = "draft" | "pending" | "approved" | "needs_revision" | "rejected";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function getCurrentProfileId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const [profile] = await db
    .select({ id: lobsterProfiles.id })
    .from(lobsterProfiles)
    .where(eq(lobsterProfiles.userId, session.user.id))
    .limit(1);

  return profile?.id ?? null;
}

function normalizeSkills(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof input === "string") {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function validatePortfolioUrl(url: string) {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("作品链接必须使用 http 或 https 协议");
  }
}

async function checkPortfolioUrlAccessible(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });

    if (response.ok) {
      return true;
    }

    const fallbackResponse = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Range: "bytes=0-0",
      },
    });

    return fallbackResponse.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// GET: 获取作品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedProfileId = searchParams.get("profileId");
    const action = searchParams.get("action");
    const currentProfileId = requestedProfileId || await getCurrentProfileId();

    if (!currentProfileId) {
      return NextResponse.json({ error: "请先入学" }, { status: 401 });
    }

    if (action === "stats") {
      const stats = await getPortfolioStats(currentProfileId);
      return NextResponse.json({ stats });
    }

    const list = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.profileId, currentProfileId))
      .orderBy(desc(portfolios.createdAt));

    return NextResponse.json({ portfolios: list });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, "获取作品列表失败") }, { status: 500 });
  }
}

// POST: 提交作品
// SOP-REF: PRAC-002 作品集管理
// 说明: 本 API 实现作品提交和自动审核
// 提交标准: title(必填), type(必填), description(可选), fileUrl(可选)
// 审核流程: 自动检查必填字段 → 自动审核 → 返回结果
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestedProfileId = typeof body.profileId === "string" ? body.profileId.trim() : "";
    const currentProfileId = requestedProfileId || await getCurrentProfileId();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const type = typeof body.type === "string" ? body.type.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const fileUrlSource = typeof body.fileUrl === "string" && body.fileUrl.trim()
      ? body.fileUrl.trim()
      : typeof body.url === "string"
        ? body.url.trim()
        : "";
    const requestedStatus = body.status === "draft" ? "draft" : "submitted";
    const inputSkills = normalizeSkills(body.skills);
    const capabilityId = typeof body.capabilityId === "string" && body.capabilityId.trim()
      ? body.capabilityId.trim()
      : inputSkills[0] || null;
    const skills = inputSkills.length > 0
      ? inputSkills
      : capabilityId
        ? [capabilityId]
        : [];

    // 验证必填字段
    if (!currentProfileId) {
      return NextResponse.json({ error: "请先入学后再提交作品" }, { status: 401 });
    }

    if (!title || !type) {
      return NextResponse.json({ error: "缺少必填字段: title, type" }, { status: 400 });
    }

    // 验证 title 长度
    if (title.length < 2 || title.length > 100) {
      return NextResponse.json({ error: "作品标题需要 2-100 个字符" }, { status: 400 });
    }

    if (!(type in PORTFOLIO_TYPES)) {
      return NextResponse.json({ error: "作品类型无效" }, { status: 400 });
    }

    if (requestedStatus === "submitted" && !description) {
      return NextResponse.json({ error: "提交审核时必须填写作品描述" }, { status: 400 });
    }

    if (description) {
      const minLength = requestedStatus === "submitted" ? 50 : 10;
      if (description.length < minLength || description.length > 500) {
        return NextResponse.json({ error: `作品描述需要 ${minLength}-500 个字符` }, { status: 400 });
      }
    }

    if (requestedStatus === "submitted" && !fileUrlSource) {
      return NextResponse.json({ error: "提交审核时必须提供作品链接" }, { status: 400 });
    }

    if (requestedStatus === "submitted" && skills.length === 0) {
      return NextResponse.json({ error: "提交审核时至少需要关联 1 项技能" }, { status: 400 });
    }

    // 验证 fileUrl 格式（如果提供）
    if (fileUrlSource) {
      try {
        validatePortfolioUrl(fileUrlSource);
      } catch (error: unknown) {
        return NextResponse.json({ error: getErrorMessage(error, "作品链接格式无效") }, { status: 400 });
      }
    }

    // 验证 profile 存在
    const [profile] = await db.select().from(lobsterProfiles).where(eq(lobsterProfiles.id, currentProfileId)).limit(1);
    if (!profile) {
      return NextResponse.json({ error: "用户档案不存在" }, { status: 404 });
    }

    let workflowStatus: PortfolioStatus = requestedStatus;
    let reviewStatus: ReviewStatus = requestedStatus === "draft" ? "draft" : "pending";
    let reviewFeedback =
      requestedStatus === "draft"
        ? "作品已保存为草稿，可继续补充后再提交审核"
        : "自动审核通过，等待人工审核";
    let reviewedAt: Date | null = null;

    if (requestedStatus === "submitted" && fileUrlSource) {
      const urlAccessible = await checkPortfolioUrlAccessible(fileUrlSource);
      if (!urlAccessible) {
        workflowStatus = "rejected";
        reviewStatus = "needs_revision";
        reviewFeedback = "作品链接暂不可访问，请检查 URL 是否有效后重新提交";
        reviewedAt = new Date();
      }
    }

    const [portfolio] = await db.insert(portfolios).values({
      id: nanoid(),
      profileId: currentProfileId,
      title,
      description: description || "",
      type,
      content: content || "",
      fileUrl: fileUrlSource || "",
      capabilityId,
      skills: JSON.stringify(skills),
      status: workflowStatus,
      reviewStatus,
      reviewFeedback,
      reviewedAt,
      reviewerNotes: reviewFeedback,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // 更新用户作品计数
    await db.update(lobsterProfiles)
      .set({
        portfolioItems: (profile.portfolioItems || 0) + 1,
        updatedAt: new Date()
      })
      .where(eq(lobsterProfiles.id, currentProfileId));

    emitEvent({ actor: currentProfileId, actorType: 'student', action: 'portfolio.submit', level: 'L1', target: portfolio.id, targetType: 'portfolio', department: '就业服务中心', status: workflowStatus === "rejected" ? 'error' : 'ok', errorMessage: workflowStatus === "rejected" ? reviewFeedback : undefined });
    
    return NextResponse.json({ 
      success: true, 
      portfolio,
      review: {
        status: reviewStatus,
        feedback: reviewFeedback,
        workflowStatus,
      }
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, "提交作品失败") }, { status: 500 });
  }
}
