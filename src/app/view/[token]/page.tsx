import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  lobsterProfiles,
  careerTracks,
  studyLogs,
  studentCourses,
  portfolios,
  streakRecords,
} from "@/lib/db/schema-lobster";
import { eq, desc, and, sql } from "drizzle-orm";
import Image from "next/image";

// 任务类型中文映射
const taskTypeMap: Record<string, string> = {
  course: "课程学习",
  practice: "练习",
  project: "项目实战",
};

// 格式化时长
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
}

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "今天";
  } else if (diffDays === 1) {
    return "昨天";
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return date.toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
    });
  }
}

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ViewPage({ params }: PageProps) {
  const { token } = await params;

  // 验证 token 格式
  if (!token || !token.startsWith("lobster_")) {
    return <ErrorPage message="访问链接无效" />;
  }

  // 查找学员档案
  const [profile] = await db
    .select()
    .from(lobsterProfiles)
    .where(eq(lobsterProfiles.accessToken, token))
    .limit(1);

  if (!profile) {
    return <ErrorPage message="访问链接不存在" />;
  }

  // 验证 token 是否过期
  if (profile.tokenExpiresAt) {
    const expiresAt = new Date(profile.tokenExpiresAt);
    if (expiresAt < new Date()) {
      return <ErrorPage message="访问链接已过期，请联系学员获取新链接" />;
    }
  }

  // 获取职业方向
  let careerTrackName: string | undefined;
  if (profile.careerTrackId) {
    const [track] = await db
      .select({ name: careerTracks.name })
      .from(careerTracks)
      .where(eq(careerTracks.id, profile.careerTrackId))
      .limit(1);
    careerTrackName = track?.name;
  }

  // 获取课程统计
  const courseStats = await db
    .select({
      status: studentCourses.status,
      count: sql<number>`count(*)`,
    })
    .from(studentCourses)
    .where(eq(studentCourses.profileId, profile.id))
    .groupBy(studentCourses.status);

  const completedCourses = Number(courseStats.find((s) => s.status === "completed")?.count || 0);
  const inProgressCourses = Number(
    courseStats.find((s) => s.status === "in_progress")?.count ||
    courseStats.find((s) => s.status === "enrolled")?.count ||
    0
  );

  // 获取作品集数量
  const [portfolioCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(portfolios)
    .where(eq(portfolios.profileId, profile.id));

  const portfolioItems = Number(portfolioCount?.count || 0);

  // 获取连续学习天数
  const recentStreaks = await db
    .select()
    .from(streakRecords)
    .where(
      and(
        eq(streakRecords.profileId, profile.id),
        eq(streakRecords.goalMet, true)
      )
    )
    .orderBy(desc(streakRecords.date))
    .limit(30);

  let streak = 0;
  for (let i = 0; i < recentStreaks.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    const expectedDate = expected.toISOString().split("T")[0];
    if (recentStreaks[i].date === expectedDate) {
      streak++;
    } else {
      break;
    }
  }

  // 获取最近学习记录
  const recentLogs = await db
    .select({
      taskName: studyLogs.taskName,
      taskType: studyLogs.taskType,
      duration: studyLogs.duration,
      studiedAt: studyLogs.studiedAt,
    })
    .from(studyLogs)
    .where(eq(studyLogs.profileId, profile.id))
    .orderBy(desc(studyLogs.studiedAt))
    .limit(10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 学员信息卡片 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            {/* 头像 */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500 text-sm">学籍号: {profile.studentId}</p>
              {careerTrackName && (
                <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {careerTrackName}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 学习统计 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">学习统计</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard
              label="总学习时长"
              value={formatDuration(profile.totalStudyTime || 0)}
              icon="⏱️"
            />
            <StatCard
              label="已完成课程"
              value={completedCourses.toString()}
              icon="✅"
            />
            <StatCard
              label="进行中课程"
              value={inProgressCourses.toString()}
              icon="📚"
            />
            <StatCard
              label="作品集数量"
              value={portfolioItems.toString()}
              icon="🎨"
            />
            <StatCard
              label="连续学习"
              value={`${streak}天`}
              icon="🔥"
              highlight={streak > 0}
            />
          </div>
        </div>

        {/* 最近学习记录 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近学习记录</h2>
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无学习记录</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{log.taskName}</p>
                    <p className="text-gray-500 text-sm">
                      {taskTypeMap[log.taskType] || log.taskType}
                      {log.studiedAt && ` · ${formatDate(new Date(log.studiedAt).toISOString())}`}
                    </p>
                  </div>
                  <div className="text-orange-600 font-medium text-sm">
                    {formatDuration(log.duration)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 页面底部品牌 */}
        <footer className="text-center py-6">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <span className="text-2xl">🦞</span>
            <span className="font-medium">龙虾大学</span>
          </div>
          <p className="text-gray-400 text-xs mt-2">陪伴每一位学员成长</p>
        </footer>
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl ${
        highlight
          ? "bg-gradient-to-br from-orange-100 to-amber-100"
          : "bg-gray-50"
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-xl font-bold ${highlight ? "text-orange-600" : "text-gray-900"}`}>
        {value}
      </div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

// 错误页面组件
function ErrorPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">无法查看学习进度</h1>
        <p className="text-gray-500">{message}</p>
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <span className="text-xl">🦞</span>
            <span className="font-medium">龙虾大学</span>
          </div>
        </div>
      </div>
    </div>
  );
}
