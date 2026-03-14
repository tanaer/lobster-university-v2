"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, BookOpen, CheckCircle } from "lucide-react";

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  module: string;
  category: string;
  duration: number;
  level: string;
  objectives: string[];
  prerequisites: string[];
  enrollCount: number;
  completionRate: number;
  created_at?: string;
}

const PAGE_SIZE = 15;

// 基础能力课程分组配置
const BASE_SKILL_GROUPS = [
  {
    title: "办公文档",
    courses: ["Excel", "Word", "PDF"],
  },
  {
    title: "数据处理",
    courses: ["SQLite", "数据清洗", "向量数据库", "知识图谱"],
  },
  {
    title: "信息获取",
    courses: ["Web搜索", "网页内容提取", "信息整合报告", "学术研究"],
  },
  {
    title: "自动化",
    courses: ["Shell", "定时任务", "浏览器自动化", "Webhook", "错误处理"],
  },
];

export function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [latestCourses, setLatestCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
        // 获取最新6门课程
        const sorted = [...data.courses].sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
        setLatestCourses(sorted.slice(0, 6));
      }
    } catch (error) {
      console.error("获取课程失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const modules = [...new Set(courses.map((c) => c.module))];

  const filteredCourses = selectedModule
    ? courses.filter((c) => c.module === selectedModule)
    : courses;

  const displayedCourses = filteredCourses.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCourses.length;

  // 基础能力课程分组
  const baseSkillCourses = courses.filter((c) => c.category === "基础能力");
  const otherCourses = displayedCourses.filter((c) => c.category !== "基础能力");

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedModule]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-neutral-600">加载课程中...</p>
      </div>
    );
  }

  // 根据课程名称匹配分组
  const getGroupForCourse = (courseName: string) => {
    for (const group of BASE_SKILL_GROUPS) {
      if (group.courses.some((name) => courseName.includes(name))) {
        return group.title;
      }
    }
    return null;
  };

  // 按分组组织基础能力课程
  const groupedBaseSkills = BASE_SKILL_GROUPS.map((group) => ({
    title: group.title,
    courses: baseSkillCourses.filter((course) => getGroupForCourse(course.name) === group.title),
  })).filter((group) => group.courses.length > 0);

  return (
    <div>
      {/* 最新上线课程 */}
      {!selectedModule && latestCourses.length > 0 && (
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎉</span>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">最新上线</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-neutral-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {course.module}
                      </Badge>
                      <CardTitle className="text-base leading-tight">{course.name}</CardTitle>
                    </div>
                    <LevelBadge level={course.level} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration} 分钟
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.enrollCount || 0} 人
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-sm"
                    onClick={() => (window.location.href = `/courses/${course.id}`)}
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    开始学习
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 模块筛选 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={selectedModule === null ? "default" : "outline"}
          onClick={() => setSelectedModule(null)}
          className={selectedModule === null ? "bg-orange-500 hover:bg-orange-600" : ""}
        >
          全部
        </Button>
        {modules.map((module) => (
          <Button
            key={module}
            variant={selectedModule === module ? "default" : "outline"}
            onClick={() => setSelectedModule(module)}
            className={selectedModule === module ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {module}
          </Button>
        ))}
      </div>

      {/* 基础能力课程分组展示 */}
      {!selectedModule && groupedBaseSkills.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">基础技能包</h2>
          {groupedBaseSkills.map((group) => (
            <div key={group.title} className="mb-8">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.courses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {course.module}
                          </Badge>
                          <CardTitle className="text-lg">{course.name}</CardTitle>
                        </div>
                        <LevelBadge level={course.level} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration} 分钟
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.enrollCount || 0} 人已学
                        </span>
                      </div>

                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={() => (window.location.href = `/courses/${course.id}`)}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        开始学习
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 其他课程瀑布流展示 */}
      {otherCourses.length > 0 && (
        <>
          {!selectedModule && <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">职业课程</h2>}
          <div
            className="masonry-grid"
            style={{
              columns: 3,
              columnGap: "1.5rem",
            }}
          >
            <style jsx>{`
              @media (max-width: 768px) {
                .masonry-grid {
                  columns: 1 !important;
                }
              }
              @media (min-width: 769px) and (max-width: 1024px) {
                .masonry-grid {
                  columns: 2 !important;
                }
              }
            `}</style>
            {otherCourses.map((course) => (
              <div
                key={course.id}
                className="mb-6"
                style={{ breakInside: "avoid" }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {course.module}
                        </Badge>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                      </div>
                      <LevelBadge level={course.level} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      {course.description}
                    </p>

                    {/* 课程统计 */}
                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration} 分钟
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.enrollCount || 0} 人已学
                      </span>
                    </div>

                    {/* 完成率 */}
                    {course.completionRate > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                          <span>完成进度</span>
                          <span>{course.completionRate}%</span>
                        </div>
                        <Progress value={course.completionRate} className="h-2" />
                      </div>
                    )}

                    {/* 学习目标 */}
                    {course.objectives.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          学习目标
                        </p>
                        <ul className="space-y-1">
                          {course.objectives.slice(0, 3).map((obj, i) => (
                            <li key={i} className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-1">
                              <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      onClick={() => (window.location.href = `/courses/${course.id}`)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      开始学习
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 加载更多 */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-8"
          >
            加载更多（还有 {filteredCourses.length - visibleCount} 门课程）
          </Button>
        </div>
      )}
    </div>
  );
}

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    初级: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    中级: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    高级: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level] || colors["初级"]}`}>
      {level}
    </span>
  );
}
