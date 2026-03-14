"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Trophy, TrendingUp, Users, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StudentData {
  id: string;
  name: string;
  avatar?: string;
  studentId: string;
  careerTrack?: string;
  level: number;
  status: string;
  stats: {
    totalStudyTime: number;
    completedCourses: number;
    inProgressCourses: number;
    portfolioItems: number;
    streak: number;
  };
  recentLogs: {
    taskName: string;
    taskType: string;
    duration: number;
    studiedAt: string;
  }[];
}

export default function ParentDashboardPage() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/parent/dashboard");
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "加载失败");
          return;
        }
        setStudents(data.students || []);
      } catch {
        setError("网络错误，请刷新重试");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>重试</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Users className="h-7 w-7 text-orange-500" />
              家长面板
            </h1>
            <p className="text-neutral-500 mt-1">
              查看孩子的学习进度和成绩
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/parent/bind">
              <Plus className="h-4 w-4 mr-2" />
              绑定学员
            </Link>
          </Button>
        </div>

        {students.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-5xl mb-4">🦞</div>
              <h2 className="text-xl font-semibold mb-2">还没有绑定学员</h2>
              <p className="text-neutral-500 mb-6">
                使用邀请码绑定孩子的学习账户
              </p>
              <Button asChild>
                <Link href="/parent/bind">输入邀请码</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {students.map((student) => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/5 dark:to-red-500/5">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{student.avatar || "🦞"}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        {student.name}
                        <Badge variant="outline" className="text-xs">
                          Lv.{student.level}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-neutral-500 mt-1">
                        学籍号: {student.studentId}
                        {student.careerTrack && ` · ${student.careerTrack}`}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        student.status === "active"
                          ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          : "bg-neutral-50 text-neutral-500"
                      }
                    >
                      {student.status === "active" ? "在读" : student.status === "graduated" ? "已毕业" : "休学"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  {/* 统计卡片 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <BookOpen className="h-5 w-5 text-green-500 mx-auto mb-1" />
                      <div className="text-lg font-bold">{student.stats.completedCourses}</div>
                      <div className="text-xs text-neutral-500">已完成课程</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <TrendingUp className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                      <div className="text-lg font-bold">{student.stats.inProgressCourses}</div>
                      <div className="text-xs text-neutral-500">进行中课程</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <Trophy className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                      <div className="text-lg font-bold">{student.stats.portfolioItems}</div>
                      <div className="text-xs text-neutral-500">作品集</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <span className="text-lg block mb-1">🔥</span>
                      <div className="text-lg font-bold">{student.stats.streak}</div>
                      <div className="text-xs text-neutral-500">连续天数</div>
                    </div>
                  </div>

                  {/* 最近学习记录 */}
                  {student.recentLogs.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                        最近学习记录
                      </h3>
                      <div className="space-y-2">
                        {student.recentLogs.map((log, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm">
                                {log.taskType === "course" ? "📖" : log.taskType === "practice" ? "🎯" : "🛠️"}
                              </span>
                              <div>
                                <p className="text-sm font-medium">{log.taskName}</p>
                                <p className="text-xs text-neutral-400">
                                  {new Date(log.studiedAt).toLocaleDateString("zh-CN")}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs text-green-600 border-green-500/50">
                              已完成
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
