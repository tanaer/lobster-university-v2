import { Metadata } from "next";
import { CoursesList } from "@/components/courses/courses-list";

export const metadata: Metadata = {
  title: "课程列表 - 龙虾大学",
  description: "六大能力模块，12门基础课程，让龙虾掌握核心技能",
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 页面标题 */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            🎓 课程体系
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            19 大课程分类，145 门实战课程，覆盖 AI Agent 开发全栈技能
            <br />
            <span className="text-sm text-neutral-500">
              学 · 练 · 考 三段式教学，实训中心全程护航
            </span>
          </p>
        </div>

        {/* 能力模块介绍 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <ModuleCard
            icon="🤖"
            title="Agent 开发"
            description="Agent 编排、记忆系统、多 Agent 协作"
            courses={6}
          />
          <ModuleCard
            icon="🔌"
            title="MCP 工具"
            description="MCP 协议、Server 开发、安全实践"
            courses={5}
          />
          <ModuleCard
            icon="🧠"
            title="AI 开发工具"
            description="Claude Code、RAG、Prompt Engineering"
            courses={4}
          />
          <ModuleCard
            icon="💡"
            title="AI 应用"
            description="小红书自动化、YouTube、金融分析"
            courses={7}
          />
          <ModuleCard
            icon="🚀"
            title="DevOps"
            description="Docker、CI/CD、GitHub Actions"
            courses={5}
          />
          <ModuleCard
            icon="⚛️"
            title="前端开发"
            description="React 19、Next.js 15、性能优化"
            courses={5}
          />
          <ModuleCard
            icon="📊"
            title="数据科学"
            description="数据可视化、GA4、SimilarWeb"
            courses={6}
          />
          <ModuleCard
            icon="🛡️"
            title="安全"
            description="API 密钥守护、安全审计、加固实践"
            courses={3}
          />
        </div>

        {/* 课程列表 */}
        <CoursesList />
      </div>
    </div>
  );
}

function ModuleCard({
  icon,
  title,
  description,
  courses,
}: {
  icon: string;
  title: string;
  description: string;
  courses: number;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 hover:border-orange-500 dark:hover:border-orange-500 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{description}</p>
      <span className="text-xs text-orange-500 font-medium">{courses} 门课程</span>
    </div>
  );
}
