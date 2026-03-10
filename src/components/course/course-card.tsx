"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  category: string;
  level: string;
  duration: number | null;
  studentCount: number;
  rating: number;
}

interface CourseCardProps {
  course: Course;
  index?: number;
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

const levelLabels: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/courses/${course.id}`}>
        <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
          <div className="relative aspect-video overflow-hidden">
            {course.coverImage ? (
              <Image
                src={course.coverImage}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                <span className="text-4xl">🦞</span>
              </div>
            )}
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className={levelColors[course.level] || levelColors.beginner}
              >
                {levelLabels[course.level] || "入门"}
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-2">
            <div className="text-sm text-neutral-500 mb-1">{course.category}</div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
              {course.title}
            </h3>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
              {course.description}
            </p>

            <div className="flex items-center justify-between text-sm text-neutral-500">
              <div className="flex items-center gap-4">
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}分钟</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.studentCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating.toFixed(1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
