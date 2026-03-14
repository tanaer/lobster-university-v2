import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, enrollments } from '@/lib/db/schema';
import { skillCourses } from '@/lib/db/schema-lobster';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const [courseResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(skillCourses)
      .where(sql`${skillCourses.published} = 1`);

    const [userResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [enrollResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments);

    const statePath = path.join(process.cwd(), 'council-state.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

    // Calculate total SOPs from department sops arrays
    const totalSops = Object.values(state.departments).reduce((sum: number, dept: any) => {
      return sum + (dept.sops?.length ?? 0);
    }, 0);

    return NextResponse.json({
      stats: {
        total_courses: courseResult?.count ?? 0,
        total_students: userResult?.count ?? 0,
        total_enrollments: enrollResult?.count ?? 0,
        total_sops: totalSops,
        system_status: 'normal',
      },
      departments: state.departments,
      performance: state.performance ?? {},
      recent_logs: state.recent_logs,
    });
  } catch (error) {
    console.error('Council API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
