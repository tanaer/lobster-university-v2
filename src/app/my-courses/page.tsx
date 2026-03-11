"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MyCourse {
  studentCourseId: string;
  courseId: string;
  name: string;
  code: string;
  module: string;
  level: string;
  status: string;
  progress: number;
  enrolledAt: string;
  startedAt?: string;
  completedAt?: string;
}

const statusLabels: Record<string, string> = {
  enrolled: "已报名",
  in_progress: "进行中",
  completed: "已完成",
  dropped: "已放弃",
};

const statusColors: Record<string, string> = {
  enrolled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  dropped: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const levelColors: Record<string, string> = {
  "入门": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "初级": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "中级": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "高级": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function MyCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      setLoading(true);
      const profileId = localStorage.getItem("lobster_profile_id");
      
      if (!profileId) {
        setError("请先登录");
        return;
      }

      const res = await fetch(`/api/courses/my?profileId=${profileId}`);
      const data = await res.json();

      if (data.success) {
        setCourses(data.courses);
      } else {
        setError(data.error || "加载失败");
      }
    } catch (err) {
      console.error("加载我的课程失败:", err);
      setError("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = (courseId: string) => {
    router.push(`/learn/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
              {error}
            </p>
            {error === "请先登录" ? (
              <Link href="/login">
                <Button>去登录</Button>
              </Link>
            ) : (
              <Button onClick={loadMyCourses}>重试</Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            我的课程
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            管理您的学习进度
          </p>
        </div>

        {courses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                还没有报名任何课程
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                探索我们的课程，开启您的学习之旅
              </p>
              <Link href="/courses">
                <Button size="lg">
                  浏览课程
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.studentCourseId}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleStartLearning(course.courseId)}
              >
                <CardContent className="p-6">
                  {/* 头部标签 */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {course.module}
                    </Badge>
                    <Badge className={`text-xs ${levelColors[course.level] || ""}`}>
                      {course.level}
                    </Badge>
                    <Badge className={`text-xs ${statusColors[course.status] || ""}`}>
                      {statusLabels[course.status] || course.status}
                    </Badge>
                  </div>

                  {/* 课程名称 */}
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2">
                    {course.name}
                  </h3>

                  {/* 进度条 */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-neutral-500">学习进度</span>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>

                  {/* 底部信息 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                      <Clock className="h-4 w-4" />
                      <span>
                        {course.status === "completed"
                          ? "已完成"
                          : course.status === "in_progress"
                          ? "学习中"
                          : "未开始"}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 统计信息 */}
        {courses.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {courses.length}
                </div>
                <div className="text-sm text-neutral-500">已报名</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {courses.filter(c => c.status === "in_progress").length}
                </div>
                <div className="text-sm text-neutral-500">进行中</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {courses.filter(c => c.status === "completed").length}
                </div>
                <div className="text-sm text-neutral-500">已完成</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)}%
                </div>
                <div className="text-sm text-neutral-500">平均进度</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
