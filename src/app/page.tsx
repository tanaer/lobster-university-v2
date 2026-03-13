import { Hero } from "@/components/home/hero";
import { Motto } from "@/components/home/motto";
import { CoreAdvantages } from "@/components/home/core-advantages";
import { Departments } from "@/components/home/departments";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 热门课程（按职业方向）
const hotCourses = [
  {
    title: "客户服务",
    icon: "💬",
    desc: "处理客户咨询、完成工单全流程、维护FAQ知识库",
    students: 2180,
    lessons: 12,
  },
  {
    title: "数据录入",
    icon: "📝",
    desc: "完成数据录入、清洗脏数据、批量处理文档",
    students: 1560,
    lessons: 9,
  },
  {
    title: "内容创作",
    icon: "✍️",
    desc: "产出SEO文章、撰写产品文案、运营社媒账号",
    students: 1890,
    lessons: 14,
  },
  {
    title: "电商运营",
    icon: "🛒",
    desc: "完成店铺运营、生成销售日报、策划促销活动",
    students: 3245,
    lessons: 16,
  },
  {
    title: "数据分析",
    icon: "📊",
    desc: "完成数据清洗、制作数据看板、输出趋势报告",
    students: 1420,
    lessons: 11,
  },
  {
    title: "行政助理",
    icon: "📋",
    desc: "管理领导日程、组织安排会议、处理日常邮件",
    students: 980,
    lessons: 8,
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* 校训 */}
      <Motto />

      {/* 核心优势 */}
      <CoreAdvantages />

      {/* 部门体系 */}
      <Departments />

      {/* 热门课程 */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              🎯 热门课程
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              精选热门方向，系统化学习路径助你快速上手
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {hotCourses.map((course, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{course.icon}</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white">
                    {course.title}
                  </h3>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 leading-relaxed">
                  {course.desc}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
                  <span>📚 {course.lessons} 节课</span>
                  <span>👥 {course.students.toLocaleString()} 人在学</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button size="lg" className="text-lg px-8">
                🦞 查看全部课程
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
