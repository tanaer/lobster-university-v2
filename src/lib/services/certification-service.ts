import { db } from "@/lib/db";
import { certifications, certificates, lobsterProfiles, portfolios, careerTracks, assessments } from "@/lib/db/schema-lobster";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export const CERTIFICATION_LEVELS = {
  1: { name: "学员", icon: "🎓", color: "text-gray-500" },
  2: { name: "实习生", icon: "🌱", color: "text-green-500" },
  3: { name: "助理", icon: "⭐", color: "text-blue-500" },
  4: { name: "专员", icon: "🏆", color: "text-purple-500" },
  5: { name: "专家", icon: "👑", color: "text-yellow-500" },
} as const;

export const CERTIFICATION_REQUIREMENTS = {
  1: { name: "学员", requirements: [{ key: "enrolled", label: "完成入学", check: true }] },
  2: { name: "实习生", requirements: [{ key: "tasks", label: "完成 3 个任务", min: 3, type: "tasks" }] },
  3: { name: "助理", requirements: [{ key: "portfolios", label: "提交 5 个作品", min: 5, type: "portfolios" }, { key: "verified", label: "至少 3 个作品被验证", min: 3, type: "verified" }, { key: "assessment", label: "通过五维能力评估", type: "assessment" }] },
  4: { name: "专员", requirements: [{ key: "portfolios", label: "提交 10 个作品", min: 10, type: "portfolios" }, { key: "verified", label: "至少 5 个作品被验证", min: 5, type: "verified" }, { key: "level3", label: "获得助理认证", type: "prev_level" }] },
  5: { name: "专家", requirements: [{ key: "portfolios", label: "提交 20 个作品", min: 20, type: "portfolios" }, { key: "verified", label: "至少 10 个作品被验证", min: 10, type: "verified" }, { key: "level4", label: "获得专员认证", type: "prev_level" }] },
} as const;

export async function checkCertificationEligibility(profileId: string, level: number) {
  const [profile] = await db.select().from(lobsterProfiles).where(eq(lobsterProfiles.id, profileId)).limit(1);
  if (!profile) return { eligible: false, requirements: [] };
  const allPortfolios = await db.select().from(portfolios).where(eq(portfolios.profileId, profileId));
  const portfolioCount = allPortfolios.length;
  const verifiedCount = allPortfolios.filter(p => p.status === "verified").length;
  const assessmentResults = await db.select().from(assessments).where(eq(assessments.profileId, profileId));
  const assessmentDimensions = new Set(assessmentResults.map(a => a.dimension));
  const assessmentComplete = assessmentDimensions.size >= 5;
  const existingCertifications = await db.select().from(certifications).where(and(eq(certifications.profileId, profileId), eq(certifications.status, "approved")));
  const certifiedLevels = new Set(existingCertifications.map(c => c.level));
  const requirements = CERTIFICATION_REQUIREMENTS[level as keyof typeof CERTIFICATION_REQUIREMENTS];
  if (!requirements) return { eligible: false, requirements: [] };
  const checks = requirements.requirements.map(req => {
    let met = false, current = 0;
    const reqType = 'type' in req ? (req as any).type : undefined;
    const reqMin = 'min' in req ? (req as any).min : 0;
    const reqCheck = 'check' in req ? (req as any).check : false;
    switch (reqType) {
      case "tasks": current = profile.completedTasks || 0; met = current >= reqMin; break;
      case "portfolios": current = portfolioCount; met = current >= reqMin; break;
      case "verified": current = verifiedCount; met = current >= reqMin; break;
      case "assessment": met = assessmentComplete; current = assessmentDimensions.size; break;
      case "prev_level": met = level > 1 && certifiedLevels.has(level - 1); current = met ? 1 : 0; break;
      default: met = reqCheck === true;
    }
    return { key: req.key, label: req.label, met, current, min: reqMin || (reqType === "assessment" ? 5 : reqCheck ? 1 : 0) };
  });
  return { eligible: checks.every(c => c.met), requirements: checks };
}

export async function applyForCertification(profileId: string, trackId: string, level: number) {
  const { eligible } = await checkCertificationEligibility(profileId, level);
  if (!eligible) throw new Error("不满足认证条件");
  const [existing] = await db.select().from(certifications).where(and(eq(certifications.profileId, profileId), eq(certifications.level, level))).limit(1);
  if (existing) throw new Error("已申请过该等级认证");
  const [certification] = await db.insert(certifications).values({ id: nanoid(), profileId, trackId, level, status: "pending", appliedAt: new Date() }).returning();
  return certification;
}

export async function getCertificationStatus(profileId: string) {
  const allCertifications = await db.select().from(certifications).where(eq(certifications.profileId, profileId)).orderBy(desc(certifications.level));
  const approvedCerts = allCertifications.filter(c => c.status === "approved");
  const currentLevel = approvedCerts.length > 0 ? Math.max(...approvedCerts.map(c => c.level)) : 1;
  const nextLevel = Math.min(currentLevel + 1, 5);
  const eligibility = await checkCertificationEligibility(profileId, nextLevel);
  return { currentLevel, certifications: allCertifications, eligibility, nextLevel };
}

export async function generateCertificate(certificationId: string) {
  const [certification] = await db.select().from(certifications).where(eq(certifications.id, certificationId)).limit(1);
  if (!certification) throw new Error("认证不存在");
  if (certification.status !== "approved") throw new Error("认证未通过");
  const [existing] = await db.select().from(certificates).where(eq(certificates.certificationId, certificationId)).limit(1);
  if (existing) return existing;
  const certificateId = `CERT-${nanoid(12).toUpperCase()}`;
  const verifyUrl = `${process.env.NEXT_PUBLIC_URL || "https://lobster.university"}/certification/verify/${certificateId}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  const [certificate] = await db.insert(certificates).values({ id: certificateId, certificationId, profileId: certification.profileId, trackId: certification.trackId, level: certification.level, issuedAt: now, expiresAt, verifyUrl }).returning();
  await db.update(certifications).set({ certificateId }).where(eq(certifications.id, certificationId));
  return certificate;
}

export async function verifyCertificate(certificateId: string) {
  const [certificate] = await db.select().from(certificates).where(eq(certificates.id, certificateId)).limit(1);
  if (!certificate) return { valid: false, error: "证书不存在" };
  const now = new Date();
  const expired = certificate.expiresAt && certificate.expiresAt < now;
  const [certification] = await db.select().from(certifications).where(eq(certifications.id, certificate.certificationId)).limit(1);
  const [profile] = await db.select().from(lobsterProfiles).where(eq(lobsterProfiles.id, certificate.profileId)).limit(1);
  const [track] = await db.select().from(careerTracks).where(eq(careerTracks.id, certificate.trackId)).limit(1);
  const levelInfo = CERTIFICATION_LEVELS[certificate.level as keyof typeof CERTIFICATION_LEVELS];
  return { valid: !expired, expired, certificate: { id: certificate.id, level: certificate.level, levelName: levelInfo?.name || `Lv.${certificate.level}`, icon: levelInfo?.icon || "📜", issuedAt: certificate.issuedAt, expiresAt: certificate.expiresAt }, profile: profile ? { name: profile.name, studentId: profile.studentId } : null, track: track ? { name: track.name, icon: track.icon } : null };
}

export async function approveCertification(certificationId: string, approved: boolean, notes?: string) {
  const [updated] = await db.update(certifications).set({ status: approved ? "approved" : "rejected", notes: notes || null, approvedAt: approved ? new Date() : null }).where(eq(certifications.id, certificationId)).returning();
  return updated;
}
