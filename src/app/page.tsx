import { Hero } from "@/components/home/hero";
import { Motto } from "@/components/home/motto";
import { CoreAdvantages } from "@/components/home/core-advantages";
import { Departments } from "@/components/home/departments";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 热门课程方向（按实际课程体系）
const hotCourses = [
  {
    title: "Agent 开发",
    icon: "🤖",
    desc: "掌握 Agent 编排、记忆系统、多 Agent 协作协议，构建智能体应用",
    lessons: 6,
  },
  {
    title: "MCP 工具",
    icon: "🔌",
    desc: "深入理解 MCP 协议，开发自定义 Server，连接 AI 与外部世界",
    lessons: 5,
  },
  {
    title: "AI 开发工具",
    icon: "🧠",
    desc: "精通 Claude Code、Codex、RAG 检索增强、Prompt Engineering",
    lessons: 7,
  },
  {
    title: "DevOps 自动化",
    icon: "🚀",
    desc: "Docker 容器化、CI/CD 流水线、GitHub Actions、基础设施即代码",
    lessons: 5,
  },
  {
    title: "前端开发",
    icon: "⚛️",
    desc: "React 19、Next.js 15、性能优化、现代前端工程化实践",
    lessons: 5,
  },
  {
    title: "数据科学",
    icon: "📊",
    desc: "数据可视化、Google Analytics、金融数据分析、智能报表生成",
    lessons: 6,
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
                  <span>📚 {course.lessons} 门课程</span>
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
