import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, Star, BookOpen, ChevronLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

// 模拟课程数据
const courses = [
  {
    id: "1",
    title: "OpenClaw 基础入门",
    description: "从零开始学习 OpenClaw，掌握 AI Agent 开发的核心技能。包含工具调用、技能开发、部署等完整流程。",
    coverImage: null,
    category: "OpenClaw",
    level: "beginner",
    duration: 120,
    studentCount: 1234,
    rating: 4.9,
    ratingCount: 234,
    chapters: [
      { id: "1-1", title: "什么是 OpenClaw", duration: 10, isFree: true },
      { id: "1-2", title: "环境搭建", duration: 15, isFree: true },
      { id: "1-3", title: "第一个 Skill", duration: 25, isFree: false },
      { id: "1-4", title: "工具调用", duration: 30, isFree: false },
      { id: "1-5", title: "部署与发布", duration: 20, isFree: false },
    ],
  },
];

const levelLabels: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);

  if (!course) {
    notFound();
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
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center mb-6">
              <span className="text-8xl">🦞</span>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge
                  variant="secondary"
                  className={
                    course.level === "beginner"
                      ? "bg-green-100 text-green-800"
                      : course.level === "intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {levelLabels[course.level]}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                {course.description}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {course.rating}
                  </span>
                  <span className="text-neutral-500">
                    ({course.ratingCount} 评价)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-5 w-5 text-neutral-400" />
                  <span>{course.studentCount} 学员</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5 text-neutral-400" />
                  <span>{course.duration} 分钟</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                课程内容
              </h2>
              <div className="space-y-3">
                {course.chapters.map((chapter, index) => (
                  <Card key={chapter.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-sm font-medium text-orange-600">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{chapter.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                              <Clock className="h-4 w-4" />
                              <span>{chapter.duration} 分钟</span>
                              {chapter.isFree && (
                                <Badge variant="secondary" className="text-xs">
                                  免费试听
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant={chapter.isFree ? "default" : "outline"}>
                          <Play className="h-4 w-4 mr-1" />
                          {chapter.isFree ? "试听" : "学习"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                  免费
                </div>
                <Button className="w-full mb-4" size="lg">
                  <BookOpen className="h-5 w-5 mr-2" />
                  立即加入
                </Button>
                <p className="text-sm text-neutral-500 text-center">
                  加入后即可学习全部内容
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
