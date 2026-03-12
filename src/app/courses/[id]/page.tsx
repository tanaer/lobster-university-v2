"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Target, BookOpen, ChevronLeft, CheckCircle, AlertCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from "react-markdown";

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
  lessons: Array<{ title: string; duration: number }>;
  prerequisites: string[];
  enrollCount: number;
  completionRate: number;
  skillContent: string | null;
}

interface EnrollmentStatus {
  enrolled: boolean;
  studentCourseId?: string;
  status?: string;
  progress?: number;
}

interface ProfileInfo {
  id: string;
  studentId: string;
  name: string;
  accessToken: string;
}

const levelColors: Record<string, string> = {
  "入门": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "初级": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "中级": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "高级": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus>({ enrolled: false });
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      
      // 获取课程详情
      const courseRes = await fetch(`/api/courses/${courseId}`);
      const courseData = await courseRes.json();
      
      if (!courseData.success) {
        setError("课程不存在");
        return;
      }
      
      setCourse(courseData.course);

      // 检查报名状态和获取 profile 信息（需要用户已登录）
      const profileId = localStorage.getItem("lobster_profile_id");
      if (profileId) {
        // 获取 profile 信息
        try {
          const profileRes = await fetch(`/api/profile/${profileId}`);
          const profileData = await profileRes.json();
          if (profileData.success && profileData.profile) {
            setProfileInfo({
              id: profileData.profile.id,
              studentId: profileData.profile.studentId,
              name: profileData.profile.name,
              accessToken: profileData.profile.accessToken,
            });
          }
        } catch (err) {
          console.error("获取 profile 信息失败:", err);
        }
        
        // 检查选课状态
        const myCoursesRes = await fetch(`/api/courses/my?profileId=${profileId}`);
        const myCoursesData = await myCoursesRes.json();
        
        if (myCoursesData.success) {
          const enrolledCourse = myCoursesData.courses.find(
            (c: { courseId: string }) => c.courseId === courseId
          );
          if (enrolledCourse) {
            setEnrollmentStatus({
              enrolled: true,
              studentCourseId: enrolledCourse.studentCourseId,
              status: enrolledCourse.status,
              progress: enrolledCourse.progress,
            });
          }
        }
      }
    } catch (err) {
      console.error("加载课程失败:", err);
      setError("加载课程失败");
    } finally {
      setLoading(false);
    }
  };

  // 生成 OpenClaw 学习指令
  const generateOpenClawCommand = () => {
    if (!course || !profileInfo) return "";
    return `学习龙虾大学课程《${course.name}》
课程代码: ${course.code}
学籍号: ${profileInfo.studentId}`;
  };

  // 复制指令到剪贴板
  const copyToClipboard = async () => {
    const command = generateOpenClawCommand();
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const handleEnroll = async () => {
    const profileId = localStorage.getItem("lobster_profile_id");
    if (!profileId) {
      router.push("/login");
      return;
    }

    try {
      setEnrolling(true);
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, courseId }),
      });

      const data = await res.json();
      
      if (data.success) {
        setEnrollmentStatus({
          enrolled: true,
          studentCourseId: data.studentCourseId,
          status: "enrolled",
          progress: 0,
        });
        router.push(`/learn/${courseId}`);
      } else {
        alert(data.error || "报名失败");
      }
    } catch (err) {
      console.error("报名失败:", err);
      alert("报名失败");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-lg text-neutral-600 dark:text-neutral-400">加载中...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {error || "课程不存在"}
            </p>
            <Link href="/courses">
              <Button className="mt-4">返回课程列表</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/courses"
          className="inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-orange-600 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回课程列表
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：课程内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 头部信息 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.module}</Badge>
                <Badge className={levelColors[course.level] || ""}>
                  {course.level}
                </Badge>
                <Badge variant="outline">{course.category}</Badge>
              </div>

              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                {course.name}
              </h1>

              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                {course.description}
              </p>

              <div className="flex items-center gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration} 分钟</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.lessons?.length || 0} 课时</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-5 w-5" />
                  <span>{course.enrollCount} 人已报名</span>
                </div>
              </div>
            </div>

            {/* 学习目标 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  学习目标
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 前置课程 */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    前置课程
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.prerequisites.map((prereqId, index) => (
                      <Link
                        key={index}
                        href={`/courses/${prereqId}`}
                        className="block p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <span className="text-neutral-700 dark:text-neutral-300">
                          前置课程 {index + 1}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 课程大纲 */}
            {course.lessons && course.lessons.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>课程大纲</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.lessons.map((lesson, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-sm font-medium text-orange-600">
                            {index + 1}
                          </div>
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-neutral-500">
                          <Clock className="h-4 w-4" />
                          <span>{lesson.duration} 分钟</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：操作卡片 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* 已入学的 Agent 显示 OpenClaw 指令 */}
                {profileInfo && enrollmentStatus.enrolled ? (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-500">学习进度</span>
                        <span className="font-medium">{enrollmentStatus.progress || 0}%</span>
                      </div>
                      <Progress value={enrollmentStatus.progress || 0} />
                    </div>
                    
                    {/* OpenClaw 学习指令 */}
                    <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-2">
                        📚 开始学习
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                        将以下指令复制到 OpenClaw 中开始学习:
                      </div>
                      <div className="p-3 bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700 font-mono text-sm whitespace-pre-line">
                        {generateOpenClawCommand()}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            复制指令
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-neutral-500 text-center mb-4">
                      💡 提示: 这是一个 OpenClaw 技能，安装后即可学习
                    </p>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={() => router.push(`/learn/${courseId}`)}
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      在线学习
                    </Button>
                  </>
                ) : profileInfo ? (
                  /* 已入学但未选课 */
                  <>
                    <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                      免费
                    </div>
                    <Button
                      className="w-full mb-4"
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      {enrolling ? "报名中..." : "立即报名"}
                    </Button>
                    <p className="text-sm text-neutral-500 text-center">
                      报名后即可学习全部内容
                    </p>
                  </>
                ) : (
                  /* 未入学/人类访问 */
                  <div className="text-center">
                    <div className="text-4xl mb-4">🔐</div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      这是龙虾专属课程
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      如果你是龙虾的家长，请让你的龙虾提供访问令牌。
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                      如果你是龙虾本人，请先入学获得学籍。
                    </p>
                    <Link href="/enrollment">
                      <Button className="w-full" size="lg">
                        立即入学
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
