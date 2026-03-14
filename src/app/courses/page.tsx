"use client";

import { useEffect, useState } from "react";
import { CoursesList } from "@/components/courses/courses-list";

// 职业路径静态数据（API 不可用时的 fallback）
const CAREER_PATHS = [
  {
    id: "ai-agent",
    icon: "🤖",
    title: "AI Agent 开发工程师",
    salary: "25k-50k",
    courseCount: 42,
    hours: 320,
    tags: ["AI Agent", "LLM", "MCP", "RAG", "Prompt Engineering"],
    gradient: "from-violet-500/20 to-purple-600/20",
    borderColor: "hover:border-violet-500",
  },
  {
    id: "fullstack",
    icon: "⚛️",
    title: "全栈开发工程师",
    salary: "20k-40k",
    courseCount: 38,
    hours: 280,
    tags: ["React", "Next.js", "Node.js", "TypeScript", "数据库"],
    gradient: "from-cyan-500/20 to-blue-600/20",
    borderColor: "hover:border-cyan-500",
  },
  {
    id: "digital-marketing",
    icon: "📊",
    title: "数字营销专家",
    salary: "15k-30k",
    courseCount: 28,
    hours: 200,
    tags: ["SEO", "SEM", "GA4", "数据分析", "广告投放"],
    gradient: "from-orange-500/20 to-amber-600/20",
    borderColor: "hover:border-orange-500",
  },
  {
    id: "new-media",
    icon: "📱",
    title: "新媒体运营专家",
    salary: "12k-25k",
    courseCount: 24,
    hours: 180,
    tags: ["小红书", "抖音", "内容策划", "AI 写作", "社群运营"],
    gradient: "from-pink-500/20 to-rose-600/20",
    borderColor: "hover:border-pink-500",
  },
  {
    id: "devops",
    icon: "🚀",
    title: "DevOps 工程师",
    salary: "20k-40k",
    courseCount: 30,
    hours: 240,
    tags: ["Docker", "CI/CD", "GitHub Actions", "Linux", "监控"],
    gradient: "from-emerald-500/20 to-green-600/20",
    borderColor: "hover:border-emerald-500",
  },
  {
    id: "product-manager",
    icon: "💡",
    title: "产品经理",
    salary: "18k-35k",
    courseCount: 22,
    hours: 160,
    tags: ["需求分析", "原型设计", "数据驱动", "AI 产品", "用户研究"],
    gradient: "from-yellow-500/20 to-orange-600/20",
    borderColor: "hover:border-yellow-500",
  },
  {
    id: "sales",
    icon: "💰",
    title: "销售专家",
    salary: "15k-30k+提成",
    courseCount: 18,
    hours: 140,
    tags: ["客户开发", "谈判技巧", "CRM", "AI 销售工具", "行业分析"],
    gradient: "from-amber-500/20 to-yellow-600/20",
    borderColor: "hover:border-amber-500",
  },
  {
    id: "qa-engineer",
    icon: "🛡️",
    title: "测试工程师",
    salary: "15k-30k",
    courseCount: 24,
    hours: 200,
    tags: ["自动化测试", "Playwright", "性能测试", "安全测试", "CI 集成"],
    gradient: "from-sky-500/20 to-indigo-600/20",
    borderColor: "hover:border-sky-500",
  },
];

const BASE_SKILLS = [
  { icon: "📄", name: "文档处理", desc: "Word / Markdown / 在线协作" },
  { icon: "📊", name: "Excel", desc: "数据处理与分析基础" },
  { icon: "🤖", name: "AI 基础应用", desc: "ChatGPT / Claude 高效使用" },
  { icon: "🔍", name: "信息检索", desc: "高效搜索与信息甄别" },
  { icon: "🔒", name: "安全基础", desc: "密码管理 / 防钓鱼 / 数据安全" },
  { icon: "📋", name: "SOP 固化", desc: "流程标准化与自动化" },
  { icon: "🌱", name: "自我成长", desc: "时间管理 / 学习方法 / 职业规划" },
];

interface CareerPath {
  id: string;
  icon: string;
  title: string;
  salary: string;
  courseCount: number;
  hours: number;
  tags: string[];
  gradient?: string;
  borderColor?: string;
}

export default function CoursesPage() {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>(CAREER_PATHS);

  useEffect(() => {
    fetch("/api/career-paths")
      .then((res) => {
        if (!res.ok) throw new Error("API unavailable");
        return res.json();
      })
      .then((data: CareerPath[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // 合并 API 数据与本地渐变样式
          const merged = data.map((item, i) => ({
            ...CAREER_PATHS[i],
            ...item,
            gradient: CAREER_PATHS[i]?.gradient ?? "from-neutral-500/20 to-neutral-600/20",
            borderColor: CAREER_PATHS[i]?.borderColor ?? "hover:border-neutral-500",
          }));
          setCareerPaths(merged);
        }
      })
      .catch(() => {
        // API 不可用，使用静态数据
      });
  }, []);

  const totalCourses = careerPaths.reduce((sum, p) => sum + p.courseCount, 0);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 页面标题 */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            🎯 职业课程体系 — 学完即就业
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            8 大热门岗位，{totalCourses}+ 实战课程，对标 BOSS 直聘真实 JD
          </p>
        </div>

        {/* 职业路径卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {careerPaths.map((path) => (
            <CareerCard key={path.id} path={path} />
          ))}
        </div>

        {/* 基础技能包 */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              📦 基础技能包（所有岗位必修）
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              现代职场必备基础技能，无论哪个岗位都需要掌握
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            {BASE_SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 text-center hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
              >
                <div className="text-2xl mb-2">{skill.icon}</div>
                <div className="font-medium text-sm text-neutral-900 dark:text-white mb-1">
                  {skill.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {skill.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 课程列表 */}
        <CoursesList />
      </div>
    </div>
  );
}

function CareerCard({ path }: { path: CareerPath }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 ${path.borderColor} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
    >
      {/* 渐变背景 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient}`} />

      <div className="relative p-5 sm:p-6">
        {/* 图标 + 薪资 */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{path.icon}</span>
          <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {path.salary}
          </span>
        </div>

        {/* 岗位名称 */}
        <h3 className="font-bold text-neutral-900 dark:text-white mb-2 text-base">
          {path.title}
        </h3>

        {/* 课程数 + 学时 */}
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
          <span>{path.courseCount} 门课程</span>
          <span>·</span>
          <span>{path.hours} 学时</span>
        </div>

        {/* 技能标签 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {path.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 按钮 */}
        <button className="w-full text-sm font-medium py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity">
          查看课程体系 →
        </button>
      </div>
    </div>
  );
}
