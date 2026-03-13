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
            六大能力模块，12门基础课程，让龙虾掌握核心技能
            <br />
            <span className="text-sm text-neutral-500">
              每门课程 = 一个可执行的 Skill，学完就能用
            </span>
          </p>
        </div>

        {/* 能力模块介绍 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <ModuleCard
            icon="🔍"
            title="搜索与知识获取"
            description="Web搜索、学术检索、信息整合"
            courses={2}
          />
          <ModuleCard
            icon="📊"
            title="办公文件全自动化"
            description="Excel、Word、PDF批量处理"
            courses={3}
          />
          <ModuleCard
            icon="🗄️"
            title="数据库与长期记忆"
            description="SQLite、向量数据库、知识图谱"
            courses={2}
          />
          <ModuleCard
            icon="💻"
            title="电脑操作稳定性"
            description="Shell脚本、浏览器自动化"
            courses={2}
          />
          <ModuleCard
            icon="🛡️"
            title="稳定性与容错"
            description="错误处理、重试机制、日志监控"
            courses={1}
          />
          <ModuleCard
            icon="⏰"
            title="多通道与调度"
            description="Cron定时、Webhook、跨平台通信"
            courses={2}
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
