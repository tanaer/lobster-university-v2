import { CourseGrid } from "@/components/course/course-grid";

const allCourses = [
  {
    id: "1",
    title: "OpenClaw 基础入门",
    description: "从零开始学习 OpenClaw，掌握 AI Agent 开发的核心技能。",
    coverImage: null,
    category: "OpenClaw",
    level: "beginner",
    duration: 120,
    studentCount: 1234,
    rating: 4.9,
  },
  {
    id: "2",
    title: "MCP Tools 开发实战",
    description: "学习如何开发 MCP 工具，让你的 Agent 拥有更强大的能力。",
    coverImage: null,
    category: "MCP",
    level: "intermediate",
    duration: 180,
    studentCount: 892,
    rating: 4.8,
  },
  {
    id: "3",
    title: "Claude Code 高级技巧",
    description: "深入探索 Claude Code 的高级功能，提升开发效率。",
    coverImage: null,
    category: "Claude",
    level: "advanced",
    duration: 240,
    studentCount: 567,
    rating: 4.9,
  },
  {
    id: "4",
    title: "AI Agent 自动化工作流",
    description: "学习如何设计和实现自动化工作流。",
    coverImage: null,
    category: "自动化",
    level: "intermediate",
    duration: 150,
    studentCount: 789,
    rating: 4.7,
  },
  {
    id: "5",
    title: "数据处理与清洗",
    description: "掌握 AI Agent 的数据处理能力。",
    coverImage: null,
    category: "数据处理",
    level: "beginner",
    duration: 90,
    studentCount: 1456,
    rating: 4.6,
  },
  {
    id: "6",
    title: "Web 自动化与爬虫",
    description: "学习使用 Playwright 进行 Web 自动化。",
    coverImage: null,
    category: "自动化",
    level: "intermediate",
    duration: 200,
    studentCount: 1023,
    rating: 4.8,
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            全部课程
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            探索 {allCourses.length} 门优质课程
          </p>
        </div>

        <CourseGrid courses={allCourses} />
      </div>
    </div>
  );
}
