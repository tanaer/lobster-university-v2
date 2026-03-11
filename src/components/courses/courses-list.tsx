"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
}

export function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-neutral-600">加载课程中...</p>
      </div>
    );
  }

  return (
    <div>
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

      {/* 课程网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
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
                    <div className="flex justify-between text-sm mb-1">
                      <span>完成率</span>
                      <span>{course.completionRate}%</span>
                    </div>
                    <Progress value={course.completionRate} className="h-2" />
                  </div>
                )}

                {/* 学习目标预览 */}
                <div className="space-y-1 mb-4">
                  {course.objectives.slice(0, 2).map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-600 dark:text-neutral-400">{obj}</span>
                    </div>
                  ))}
                </div>

                {/* 操作按钮 */}
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => (window.location.href = `/courses/${course.id}`)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  开始学习
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
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
