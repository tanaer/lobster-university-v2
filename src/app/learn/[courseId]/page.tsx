"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Loader2,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from "react-markdown";

interface Course {
  id: string;
  name: string;
  description: string;
  duration: number;
  level: string;
  lessons: Array<{ title: string; duration: number }>;
  skillContent: string | null;
}

interface LessonProgress {
  [key: number]: {
    status: string;
    completedAt?: string;
  };
}

interface EnrollmentInfo {
  studentCourseId: string;
  status: string;
  progress: number;
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentInfo | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      // 获取报名信息
      const profileId = localStorage.getItem("lobster_profile_id");
      if (profileId) {
        const myCoursesRes = await fetch(`/api/courses/my?profileId=${profileId}`);
        const myCoursesData = await myCoursesRes.json();
        
        if (myCoursesData.success) {
          const enrolledCourse = myCoursesData.courses.find(
            (c: { courseId: string }) => c.courseId === courseId
          );
          if (enrolledCourse) {
            setEnrollment({
              studentCourseId: enrolledCourse.studentCourseId,
              status: enrolledCourse.status,
              progress: enrolledCourse.progress,
            });
          } else {
            setError("您还未报名此课程");
          }
        }
      } else {
        setError("请先登录");
      }
    } catch (err) {
      console.error("加载课程失败:", err);
      setError("加载课程失败");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!enrollment || !course) return;

    try {
      setSaving(true);
      const lesson = course.lessons[currentLesson];
      
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentCourseId: enrollment.studentCourseId,
          lessonIndex: currentLesson,
          lessonTitle: lesson?.title || `第${currentLesson + 1}课`,
          status: "completed",
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setLessonProgress(prev => ({
          ...prev,
          [currentLesson]: { status: "completed", completedAt: new Date().toISOString() }
        }));
        
        setEnrollment(prev => prev ? { ...prev, progress: data.progress } : null);
        
        // 自动跳转到下一课
        if (currentLesson < (course.lessons?.length || 0) - 1) {
          setCurrentLesson(currentLesson + 1);
        }
      }
    } catch (err) {
      console.error("更新进度失败:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLessonClick = (index: number) => {
    setCurrentLesson(index);
    setSidebarOpen(false);
  };

  const isLessonCompleted = (index: number) => {
    return lessonProgress[index]?.status === "completed";
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

  if (error || !course) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
              {error || "课程不存在"}
            </p>
            {error === "请先登录" ? (
              <Link href="/login">
                <Button>去登录</Button>
              </Link>
            ) : error === "您还未报名此课程" ? (
              <Link href={`/courses/${courseId}`}>
                <Button>去报名</Button>
              </Link>
            ) : (
              <Link href="/courses">
                <Button>返回课程列表</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalLessons = course.lessons?.length || 0;
  const completedLessons = Object.values(lessonProgress).filter(
    p => p.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/my-courses"
                className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-orange-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold text-neutral-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {course.name}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-neutral-500">进度</span>
                <Progress value={enrollment?.progress || 0} className="w-24" />
                <span className="text-sm font-medium">{enrollment?.progress || 0}%</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* 侧边栏：课程目录 */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 z-30 w-72 h-[calc(100vh-4rem)]
            bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800
            transform transition-transform duration-200 lg:transform-none
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-4 h-full overflow-y-auto">
            <div className="mb-4 sm:hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-neutral-500">进度</span>
                <Progress value={enrollment?.progress || 0} className="flex-1" />
                <span className="text-sm font-medium">{enrollment?.progress || 0}%</span>
              </div>
            </div>
            
            <h2 className="font-semibold text-neutral-900 dark:text-white mb-4">
              课程目录
            </h2>
            
            <div className="space-y-1">
              {course.lessons?.map((lesson, index) => (
                <button
                  key={index}
                  onClick={() => handleLessonClick(index)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-colors
                    flex items-center gap-3
                    ${currentLesson === index
                      ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    }
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs
                    ${isLessonCompleted(index)
                      ? "bg-green-500 text-white"
                      : currentLesson === index
                        ? "bg-orange-500 text-white"
                        : "bg-neutral-200 dark:bg-neutral-700"
                    }
                  `}>
                    {isLessonCompleted(index) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-medium">
                      {lesson.title}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <Clock className="h-3 w-3" />
                      <span>{lesson.duration} 分钟</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 当前课时信息 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  第 {currentLesson + 1} / {totalLessons} 课
                </Badge>
                {isLessonCompleted(currentLesson) && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    已完成
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {course.lessons?.[currentLesson]?.title || "课程内容"}
              </h2>
            </div>

            {/* Markdown 内容 */}
            <Card className="mb-8">
              <CardContent className="p-6">
                {course.skillContent ? (
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <ReactMarkdown>{course.skillContent}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-neutral-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>课程内容加载中或暂无内容</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 底部操作栏 */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => currentLesson > 0 && setCurrentLesson(currentLesson - 1)}
                disabled={currentLesson === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                上一课
              </Button>

              <div className="flex items-center gap-2">
                {!isLessonCompleted(currentLesson) && (
                  <Button
                    onClick={handleMarkComplete}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    标记完成
                  </Button>
                )}
              </div>

              <Button
                onClick={() => currentLesson < totalLessons - 1 && setCurrentLesson(currentLesson + 1)}
                disabled={currentLesson === totalLessons - 1}
              >
                下一课
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
