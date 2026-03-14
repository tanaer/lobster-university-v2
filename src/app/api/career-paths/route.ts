import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

interface CareerPathRow {
  id: string;
  name: string;
  description: string;
  salary_range: string | null;
  total_hours: number;
  job_keywords: string | null;
  course_ids: string | null;
  category_sequence: string | null;
  order_num: number;
  published: number;
}

export async function GET() {
  try {
    const rows = await db.all<CareerPathRow>(
      sql`SELECT * FROM career_paths WHERE published = 1 ORDER BY order_num ASC`
    );

    const paths = rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      salary_range: row.salary_range,
      total_hours: row.total_hours,
      job_keywords: safeJsonParse(row.job_keywords),
      course_ids: safeJsonParse(row.course_ids),
      category_sequence: safeJsonParse(row.category_sequence),
    }));

    return NextResponse.json({ career_paths: paths, total: paths.length });
  } catch (error) {
    console.error('Career paths API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function safeJsonParse(val: string | null): unknown[] {
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}
