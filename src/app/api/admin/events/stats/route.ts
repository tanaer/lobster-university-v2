import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { statsDaily } from "@/lib/db/schema-events";
import { desc, sql } from "drizzle-orm";

// GET: 实时统计 + 最近 7 天每日统计
export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    // 从 Redis 读取今日实时数据
    let todayTotal = 0;
    let todayActions: Record<string, string> = {};
    let todayUniqueActors = 0;

    try {
      const [total, actions, actors] = await Promise.all([
        redis.get(`lobster:stats:${today}:total`),
        redis.hgetall(`lobster:stats:${today}:actions`),
        redis.pfcount(`lobster:stats:${today}:actors`),
      ]);
      todayTotal = parseInt(total || "0");
      todayActions = actions || {};
      todayUniqueActors = actors;
    } catch {
      // Redis 不可用，降级返回空
    }

    // 从 stats_daily 表读取最近 7 天
    const dailyStats = await db
      .select()
      .from(statsDaily)
      .orderBy(desc(statsDaily.date))
      .limit(7);

    return NextResponse.json({
      today: {
        date: today,
        total: todayTotal,
        actions: todayActions,
        uniqueActors: todayUniqueActors,
      },
      dailyStats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "获取统计失败" },
      { status: 500 }
    );
  }
}
