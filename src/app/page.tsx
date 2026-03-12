import { Hero } from "@/components/home/hero";
import { CourseGrid } from "@/components/course/course-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 热门能力课程（静态数据）
const featuredCourses = [
  {
    id: "ec-01",
    title: "能独立完成店铺日常运营",
    description: "掌握电商店铺的日常运营流程和技巧。",
    coverImage: null,
    category: "电商运营",
    level: "intermediate" as const,
    duration: 90,
    studentCount: 3245,
    rating: 4.9,
  },
  {
    id: "de-01",
    title: "能完成数据录入",
    description: "掌握高精度数据录入技巧，确保数据准确无误。",
    coverImage: null,
    category: "数据处理",
    level: "beginner" as const,
    duration: 45,
    studentCount: 2341,
    rating: 4.8,
  },
  {
    id: "cw-01",
    title: "能产出 SEO 优化文章",
    description: "学习 SEO 写作技巧，创作高排名的内容。",
    coverImage: null,
    category: "内容创作",
    level: "intermediate" as const,
    duration: 90,
    studentCount: 1876,
    rating: 4.8,
  },
];

// 按职业方向分类的课程
const coursesByTrack = [
  {
    track: "客户服务专员",
    icon: "💬",
    courses: ["处理客户咨询", "完成工单全流程", "维护FAQ知识库"],
  },
  {
    track: "数据录入员",
    icon: "📝",
    courses: ["完成数据录入", "清洗脏数据", "批量处理文档"],
  },
  {
    track: "内容创作专员",
    icon: "✍️",
    courses: ["产出SEO文章", "撰写产品文案", "运营社媒账号"],
  },
  {
    track: "电商运营专员",
    icon: "🛒",
    courses: ["完成店铺运营", "生成销售日报", "策划促销活动"],
  },
  {
    track: "数据分析专员",
    icon: "📊",
    courses: ["完成数据清洗", "制作数据看板", "输出趋势报告"],
  },
  {
    track: "行政助理",
    icon: "📋",
    courses: ["管理领导日程", "组织安排会议", "处理日常邮件"],
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* 热门能力课程 */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              🔥 热门能力课程
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              每门课程对应一个"能做什么"，学完即可产出可交付成果
            </p>
          </div>
          <CourseGrid courses={featuredCourses} />
          <div className="text-center mt-8">
            <Link href="/courses">
              <Button size="lg" variant="outline">
                查看全部 67 门课程 →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 职业方向 */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              🎯 职业方向
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              选择一个职业方向，系统自动规划学习路径
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesByTrack.map((track, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{track.icon}</span>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    {track.track}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {track.courses.map((course, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400"
                    >
                      <span className="text-green-500">✓</span>
                      能{course}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/enroll">
              <Button size="lg" className="text-lg px-8">
                🦞 立即入学，选择职业方向
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 理念说明 */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
            💡 我们的理念
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                不是学工具
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                不学 Excel、Python、SQL<br />
                学的是"能做什么"
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                产出可交付成果
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                每门课程都有明确产出<br />
                作品集就是能力证明
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                学完就能上岗
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                课程按岗位 JD 设计<br />
                毕业即就业
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
