import { db } from "@/lib/db";
import { portfolios, lobsterProfiles, studyLogs } from "@/lib/db/schema-lobster";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export const PORTFOLIO_TYPES = {
  report: { label: "报告", icon: "📄" },
  document: { label: "文档", icon: "📝" },
  code: { label: "代码", icon: "💻" },
  design: { label: "设计", icon: "🎨" },
  media: { label: "多媒体", icon: "🎬" },
  case_study: { label: "案例分析", icon: "📊" },
  other: { label: "其他", icon: "📁" },
} as const;

export type PortfolioType = keyof typeof PORTFOLIO_TYPES;
export type PortfolioStatus = "draft" | "submitted" | "verified" | "rejected";

export async function submitPortfolio(profileId: string, data: {
  title: string;
  description?: string;
  type: PortfolioType;
  capabilityId?: string;
  content?: string;
  fileUrl?: string;
  status?: PortfolioStatus;
}) {
  const [portfolio] = await db.insert(portfolios).values({
    id: nanoid(),
    profileId,
    title: data.title,
    description: data.description || null,
    type: data.type,
    capabilityId: data.capabilityId || null,
    content: data.content || null,
    fileUrl: data.fileUrl || null,
    status: data.status || "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  const [profile] = await db.select().from(lobsterProfiles).where(eq(lobsterProfiles.id, profileId)).limit(1);
  if (profile) {
    await db.update(lobsterProfiles).set({ portfolioItems: (profile.portfolioItems || 0) + 1, updatedAt: new Date() }).where(eq(lobsterProfiles.id, profileId));
  }
  return portfolio;
}

export async function getPortfolios(options: { profileId: string; status?: PortfolioStatus; type?: PortfolioType; limit?: number }) {
  const conditions = [eq(portfolios.profileId, options.profileId)];
  if (options?.status) conditions.push(eq(portfolios.status, options.status));
  if (options?.type) conditions.push(eq(portfolios.type, options.type));
  return await db.select().from(portfolios).where(and(...conditions)).orderBy(desc(portfolios.createdAt)).limit(options?.limit || 50);
}

export async function getPortfolioById(id: string) {
  const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.id, id)).limit(1);
  return portfolio;
}

export async function updatePortfolioStatus(id: string, status: PortfolioStatus, notes?: string) {
  const [updated] = await db.update(portfolios).set({ status, reviewerNotes: notes || null, reviewedAt: status === "verified" || status === "rejected" ? new Date() : null, updatedAt: new Date() }).where(eq(portfolios.id, id)).returning();
  return updated;
}

export async function updatePortfolio(id: string, data: { title?: string; description?: string; type?: PortfolioType; capabilityId?: string; content?: string; fileUrl?: string }) {
  const [updated] = await db.update(portfolios).set({ ...data, updatedAt: new Date() }).where(eq(portfolios.id, id)).returning();
  return updated;
}

export async function deletePortfolio(id: string, profileId: string) {
  const portfolio = await getPortfolioById(id);
  if (!portfolio) throw new Error("作品不存在");
  if (portfolio.profileId !== profileId) throw new Error("无权删除此作品");
  if (portfolio.status !== "draft") throw new Error("只能删除草稿状态的作品");
  await db.delete(portfolios).where(eq(portfolios.id, id));
  const [profile] = await db.select().from(lobsterProfiles).where(eq(lobsterProfiles.id, profileId)).limit(1);
  if (profile) {
    await db.update(lobsterProfiles).set({ portfolioItems: Math.max(0, (profile.portfolioItems || 1) - 1), updatedAt: new Date() }).where(eq(lobsterProfiles.id, profileId));
  }
  return true;
}

export async function getEvidenceChain(portfolioId: string) {
  const portfolio = await getPortfolioById(portfolioId);
  if (!portfolio) return [];
  const logs = await db.select().from(studyLogs).where(and(eq(studyLogs.profileId, portfolio.profileId), portfolio.capabilityId ? eq(studyLogs.capabilityId, portfolio.capabilityId) : undefined)).orderBy(desc(studyLogs.studiedAt)).limit(10);
  return logs.map(log => ({ id: log.id, type: "study_log" as const, title: log.taskName, description: log.deliverable, url: log.deliverableUrl, date: log.studiedAt, status: log.status }));
}

export async function getPortfolioStats(profileId: string) {
  const allPortfolios = await db.select().from(portfolios).where(eq(portfolios.profileId, profileId));
  return { total: allPortfolios.length, draft: allPortfolios.filter(p => p.status === "draft").length, submitted: allPortfolios.filter(p => p.status === "submitted").length, verified: allPortfolios.filter(p => p.status === "verified").length, rejected: allPortfolios.filter(p => p.status === "rejected").length };
}
