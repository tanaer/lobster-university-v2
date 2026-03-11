"use client";

import { CourseGrid } from "@/components/course/course-grid";

// 基于职业方向的能力课程
const allCourses = [
  // 客户服务专员
  {
    id: "cs-01",
    title: "能处理客户在线咨询",
    description: "学习如何快速、专业地回复客户问题，提升客户满意度。",
    coverImage: null,
    category: "客户服务",
    level: "beginner",
    duration: 60,
    studentCount: 1234,
    rating: 4.9,
    capability: "处理客户咨询",
    deliverable: "客服对话记录 × 50 条",
    careerTrack: "customer-support",
  },
  {
    id: "cs-02",
    title: "能完成工单全流程",
    description: "掌握工单系统的完整操作流程，从创建到结案。",
    coverImage: null,
    category: "客户服务",
    level: "beginner",
    duration: 45,
    studentCount: 892,
    rating: 4.8,
    capability: "处理工单",
    deliverable: "工单处理记录 × 20 个",
    careerTrack: "customer-support",
  },
  {
    id: "cs-03",
    title: "能维护常见问题库",
    description: "学习如何整理和维护 FAQ 知识库，提高服务效率。",
    coverImage: null,
    category: "客户服务",
    level: "beginner",
    duration: 30,
    studentCount: 567,
    rating: 4.9,
    capability: "维护FAQ",
    deliverable: "FAQ 文档 × 30 条",
    careerTrack: "customer-support",
  },
  
  // 数据录入员
  {
    id: "de-01",
    title: "能完成数据录入",
    description: "掌握高精度数据录入技巧，确保数据准确无误。",
    coverImage: null,
    category: "数据处理",
    level: "beginner",
    duration: 45,
    studentCount: 2341,
    rating: 4.8,
    capability: "数据录入",
    deliverable: "数据录入 × 1000 条",
    careerTrack: "data-entry",
  },
  {
    id: "de-02",
    title: "能清洗脏数据",
    description: "学习识别和处理脏数据的方法，提高数据质量。",
    coverImage: null,
    category: "数据处理",
    level: "beginner",
    duration: 60,
    studentCount: 1567,
    rating: 4.7,
    capability: "数据清洗",
    deliverable: "清洗报告 × 3 个",
    careerTrack: "data-entry",
  },
  {
    id: "de-03",
    title: "能批量处理文档",
    description: "掌握批量处理文档的技巧，提升工作效率。",
    coverImage: null,
    category: "数据处理",
    level: "beginner",
    duration: 30,
    studentCount: 1234,
    rating: 4.9,
    capability: "批量处理",
    deliverable: "批处理脚本 × 1 个",
    careerTrack: "data-entry",
  },
  
  // 内容创作专员
  {
    id: "cw-01",
    title: "能产出 SEO 优化文章",
    description: "学习 SEO 写作技巧，创作高排名的内容。",
    coverImage: null,
    category: "内容创作",
    level: "intermediate",
    duration: 90,
    studentCount: 1876,
    rating: 4.8,
    capability: "SEO写作",
    deliverable: "SEO 文章 × 10 篇",
    careerTrack: "content-writer",
  },
  {
    id: "cw-02",
    title: "能撰写产品描述",
    description: "掌握产品文案写作技巧，提升转化率。",
    coverImage: null,
    category: "内容创作",
    level: "beginner",
    duration: 60,
    studentCount: 2134,
    rating: 4.9,
    capability: "产品文案",
    deliverable: "产品文案 × 20 个",
    careerTrack: "content-writer",
  },
  {
    id: "cw-03",
    title: "能运营社交媒体账号",
    description: "学习社媒运营策略，提升账号影响力。",
    coverImage: null,
    category: "内容创作",
    level: "intermediate",
    duration: 120,
    studentCount: 1567,
    rating: 4.7,
    capability: "社媒运营",
    deliverable: "运营记录 × 14 天",
    careerTrack: "content-writer",
  },
  
  // 电商运营专员
  {
    id: "ec-01",
    title: "能独立完成店铺日常运营",
    description: "掌握电商店铺的日常运营流程和技巧。",
    coverImage: null,
    category: "电商运营",
    level: "intermediate",
    duration: 90,
    studentCount: 3245,
    rating: 4.9,
    capability: "店铺运营",
    deliverable: "运营日志 × 7 天",
    careerTrack: "ecommerce-ops",
  },
  {
    id: "ec-02",
    title: "能生成销售日报",
    description: "学习销售数据分析和日报撰写方法。",
    coverImage: null,
    category: "电商运营",
    level: "beginner",
    duration: 45,
    studentCount: 2876,
    rating: 4.8,
    capability: "数据分析",
    deliverable: "销售日报 × 7 份",
    careerTrack: "ecommerce-ops",
  },
  {
    id: "ec-03",
    title: "能策划店铺促销活动",
    description: "掌握促销活动策划的完整流程。",
    coverImage: null,
    category: "电商运营",
    level: "intermediate",
    duration: 60,
    studentCount: 1987,
    rating: 4.7,
    capability: "活动策划",
    deliverable: "活动方案 × 1 个",
    careerTrack: "ecommerce-ops",
  },
  
  // 数据分析专员
  {
    id: "da-01",
    title: "能完成数据清洗工作",
    description: "学习数据清洗的完整流程和技巧。",
    coverImage: null,
    category: "数据分析",
    level: "intermediate",
    duration: 75,
    studentCount: 1543,
    rating: 4.8,
    capability: "数据清洗",
    deliverable: "清洗数据集 × 1 个",
    careerTrack: "data-analyst",
  },
  {
    id: "da-02",
    title: "能制作数据看板",
    description: "掌握数据可视化和看板设计技能。",
    coverImage: null,
    category: "数据分析",
    level: "intermediate",
    duration: 90,
    studentCount: 1234,
    rating: 4.9,
    capability: "可视化",
    deliverable: "数据看板 × 1 个",
    careerTrack: "data-analyst",
  },
  {
    id: "da-03",
    title: "能输出趋势分析报告",
    description: "学习数据趋势分析和报告撰写方法。",
    coverImage: null,
    category: "数据分析",
    level: "advanced",
    duration: 120,
    studentCount: 876,
    rating: 4.8,
    capability: "趋势分析",
    deliverable: "趋势报告 × 1 份",
    careerTrack: "data-analyst",
  },
  
  // 行政助理
  {
    id: "aa-01",
    title: "能管理领导日程",
    description: "掌握日程管理的最佳实践。",
    coverImage: null,
    category: "行政助理",
    level: "beginner",
    duration: 45,
    studentCount: 2134,
    rating: 4.8,
    capability: "日程管理",
    deliverable: "日程管理 × 14 天",
    careerTrack: "admin-assistant",
  },
  {
    id: "aa-02",
    title: "能组织安排会议",
    description: "学习会议组织的完整流程。",
    coverImage: null,
    category: "行政助理",
    level: "beginner",
    duration: 30,
    studentCount: 1876,
    rating: 4.9,
    capability: "会议组织",
    deliverable: "会议组织 × 10 次",
    careerTrack: "admin-assistant",
  },
  {
    id: "aa-03",
    title: "能处理日常邮件",
    description: "掌握邮件分类和自动处理的技巧。",
    coverImage: null,
    category: "行政助理",
    level: "beginner",
    duration: 45,
    studentCount: 2345,
    rating: 4.7,
    capability: "邮件处理",
    deliverable: "邮件处理 × 100 封",
    careerTrack: "admin-assistant",
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎯 能力课程
          </h1>
          <p className="text-slate-400">
            每门课程对应一个实际工作能力，学完即可产出可交付成果
          </p>
        </div>
        
        <div className="mb-6 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <p className="text-cyan-400 text-sm">
            💡 <strong>课程理念</strong>：不是学习工具，而是培养能力。每门课程都对应一个"能做什么"，完成后可以产出具体的可交付成果。
          </p>
        </div>
        
        <CourseGrid courses={allCourses} />
      </div>
    </div>
  );
}
