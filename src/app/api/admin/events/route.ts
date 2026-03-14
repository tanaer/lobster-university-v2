import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema-events";
import { eq, and, gte, lte, desc, sql, like } from "drizzle-orm";

// GET: 查询事件日志
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const department = searchParams.get("department");
    const level = searchParams.get("level");
    const actor = searchParams.get("actor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const offset = parseInt(searchParams.get("offset") || "0");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const conditions = [];
    if (action) conditions.push(eq(events.action, action));
    if (department) conditions.push(eq(events.department, department));
    if (level) conditions.push(eq(events.level, level));
    if (actor) conditions.push(eq(events.actor, actor));
    if (from) conditions.push(gte(events.timestamp, parseInt(from)));
    if (to) conditions.push(lte(events.timestamp, parseInt(to)));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(events)
        .where(where)
        .orderBy(desc(events.timestamp))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(events)
        .where(where),
    ]);

    return NextResponse.json({
      events: rows,
      total: countResult[0]?.count ?? 0,
      limit,
      offset,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "查询事件失败" },
      { status: 500 }
    );
  }
}
