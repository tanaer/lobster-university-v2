"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 所有能力课程
const allCourses = [
  // 客户服务专员
  { id: "cs-01", title: "能处理客户在线咨询", category: "客户服务", level: "beginner", duration: 60, rating: 4.9, track: "customer-support" },
  { id: "cs-02", title: "能完成工单全流程", category: "客户服务", level: "beginner", duration: 45, rating: 4.8, track: "customer-support" },
  { id: "cs-03", title: "能维护常见问题库", category: "客户服务", level: "beginner", duration: 30, rating: 4.9, track: "customer-support" },
  
  // 数据录入员
  { id: "de-01", title: "能完成数据录入", category: "数据处理", level: "beginner", duration: 45, rating: 4.8, track: "data-entry" },
  { id: "de-02", title: "能清洗脏数据", category: "数据处理", level: "beginner", duration: 60, rating: 4.7, track: "data-entry" },
  { id: "de-03", title: "能批量处理文档", category: "数据处理", level: "beginner", duration: 30, rating: 4.9, track: "data-entry" },
  
  // 内容创作专员
  { id: "cw-01", title: "能产出 SEO 优化文章", category: "内容创作", level: "intermediate", duration: 90, rating: 4.8, track: "content-writer" },
  { id: "cw-02", title: "能撰写产品描述", category: "内容创作", level: "beginner", duration: 60, rating: 4.9, track: "content-writer" },
  { id: "cw-03", title: "能运营社交媒体账号", category: "内容创作", level: "intermediate", duration: 120, rating: 4.7, track: "content-writer" },
  
  // 电商运营专员
  { id: "ec-01", title: "能独立完成店铺日常运营", category: "电商运营", level: "intermediate", duration: 90, rating: 4.9, track: "ecommerce-ops" },
  { id: "ec-02", title: "能生成销售日报", category: "电商运营", level: "beginner", duration: 45, rating: 4.8, track: "ecommerce-ops" },
  { id: "ec-03", title: "能策划店铺促销活动", category: "电商运营", level: "intermediate", duration: 60, rating: 4.7, track: "ecommerce-ops" },
  
  // 数据分析专员
  { id: "da-01", title: "能完成数据清洗工作", category: "数据分析", level: "intermediate", duration: 75, rating: 4.8, track: "data-analyst" },
  { id: "da-02", title: "能制作数据看板", category: "数据分析", level: "intermediate", duration: 90, rating: 4.9, track: "data-analyst" },
  { id: "da-03", title: "能输出趋势分析报告", category: "数据分析", level: "advanced", duration: 120, rating: 4.8, track: "data-analyst" },
  
  // 行政助理
  { id: "aa-01", title: "能管理领导日程", category: "行政助理", level: "beginner", duration: 45, rating: 4.8, track: "admin-assistant" },
  { id: "aa-02", title: "能组织安排会议", category: "行政助理", level: "beginner", duration: 30, rating: 4.9, track: "admin-assistant" },
  { id: "aa-03", title: "能处理日常邮件", category: "行政助理", level: "beginner", duration: 45, rating: 4.7, track: "admin-assistant" },
];

const trackNames: Record<string, string> = {
  "customer-support": "客户服务专员",
  "data-entry": "数据录入员",
  "content-writer": "内容创作专员",
  "ecommerce-ops": "电商运营专员",
  "data-analyst": "数据分析专员",
  "admin-assistant": "行政助理",
};

const trackIcons: Record<string, string> = {
  "customer-support": "💬",
  "data-entry": "📝",
  "content-writer": "✍️",
  "ecommerce-ops": "🛒",
  "data-analyst": "📊",
  "admin-assistant": "📋",
};

const levelColors: Record<string, string> = {
  "beginner": "bg-green-500/20 text-green-400 border-green-500/30",
  "intermediate": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "advanced": "bg-red-500/20 text-red-400 border-red-500/30",
};

const levelNames: Record<string, string> = {
  "beginner": "入门",
  "intermediate": "进阶",
  "advanced": "高级",
};

export default function CoursesPage() {
  // 按职业方向分组
  const groupedCourses = allCourses.reduce((acc, course) => {
    const track = course.track;
    if (!acc[track]) acc[track] = [];
    acc[track].push(course);
    return acc;
  }, {} as Record<string, typeof allCourses>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎯 能力课程
          </h1>
          <p className="text-lg text-slate-400 mb-6">
            每门课程对应一个"能做什么"，完成后产出可交付成果
          </p>
          <Link href="/enroll">
            <Button size="lg" className="text-lg">
              🦞 立即入学
            </Button>
          </Link>
        </div>

        {/* 按职业方向分组显示 */}
        {Object.entries(groupedCourses).map(([track, courses]) => (
          <div key={track} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{trackIcons[track]}</span>
              <h2 className="text-2xl font-bold text-white">
                {trackNames[track]}
              </h2>
              <Badge variant="outline" className="bg-slate-700 text-slate-300">
                {courses.length} 门课程
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors cursor-pointer"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={levelColors[course.level]}>
                        {levelNames[course.level]}
                      </Badge>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <span>{course.duration}分钟</span>
                        <span>⭐ {course.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* 底部 CTA */}
        <div className="text-center mt-12 p-8 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">
            找到适合你的方向了吗？
          </h3>
          <p className="text-slate-400 mb-6">
            选择一个职业方向，系统会自动为你规划学习路径
          </p>
          <Link href="/enroll">
            <Button size="lg" className="text-lg px-8">
              🦞 立即入学
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
