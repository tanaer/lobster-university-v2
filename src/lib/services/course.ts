import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";

export type CourseListItem = {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  category: string;
  level: string;
  duration: number | null;
  studentCount: number;
  rating: number;
};

function toCourseListItem(course: typeof courses.$inferSelect): CourseListItem {
  return {
    id: course.id,
    title: course.title,
    description: course.description ?? "",
    coverImage: course.coverImage,
    category: course.category ?? "未分类",
    level: course.level ?? "beginner",
    duration: course.duration,
    studentCount: course.studentCount ?? 0,
    rating: course.rating ?? 0,
  };
}

export async function getCourses(limit = 10): Promise<CourseListItem[]> {
  const rows = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true))
    .orderBy(desc(courses.createdAt))
    .limit(limit);

  return rows.map(toCourseListItem);
}

export async function getCourseById(id: string): Promise<CourseListItem | null> {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1);

  return course ? toCourseListItem(course) : null;
}

export async function getFeaturedCourses(): Promise<CourseListItem[]> {
  const rows = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true))
    .orderBy(desc(courses.rating))
    .limit(3);

  return rows.map(toCourseListItem);
}
