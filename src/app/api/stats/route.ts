import { db } from "@/lib/db";
import { skillCourses, users } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [courseCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(skillCourses);

    const [categoryCount] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${skillCourses.category})` })
      .from(skillCourses);

    const [userCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users);

    return NextResponse.json({
      courses: courseCount?.count ?? 0,
      categories: categoryCount?.count ?? 0,
      users: userCount?.count ?? 0,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { courses: 0, categories: 0, users: 0 },
      { status: 500 }
    );
  }
}
