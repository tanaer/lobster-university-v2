import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema-events";
import { nanoid } from "nanoid";

const QUEUE_KEY = "lobster:events";
const DEAD_KEY = "lobster:events:dead";
const BATCH_SIZE = 100;
const FLUSH_INTERVAL_MS = 5000;

export interface EventInput {
  actor: string;
  actorType: "student" | "admin" | "agent" | "system";
  action: string;
  level: "L1" | "L2";
  target?: string;
  targetType?: string;
  department: string;
  metadata?: Record<string, unknown>;
  status: "ok" | "error";
  errorMessage?: string;
}

interface FullEvent extends EventInput {
  id: string;
  timestamp: string; // ISO 8601
}

// 非阻塞发送事件
export function emitEvent(event: EventInput): void {
  const full: FullEvent = {
    ...event,
    id: nanoid(),
    timestamp: new Date().toISOString(),
  };

  // fire-and-forget，不 await
  redis.lpush(QUEUE_KEY, JSON.stringify(full)).catch((err) => {
    console.error("[event-hook] Redis LPUSH failed, fallback to sync SQLite", err);
    syncInsertToSQLite(full);
  });

  // 实时计数（fire-and-forget）
  const date = full.timestamp.slice(0, 10);
  redis.incr(`lobster:stats:${date}:total`).catch(() => {});
  redis.hincrby(`lobster:stats:${date}:actions`, full.action, 1).catch(() => {});
  redis.pfadd(`lobster:stats:${date}:actors`, full.actor).catch(() => {});
}

// 同步写 SQLite（Redis 不可用时降级）
export function syncInsertToSQLite(event: FullEvent): void {
  db.insert(events)
    .values({
      id: event.id,
      timestamp: new Date(event.timestamp).getTime(),
      actor: event.actor,
      actorType: event.actorType,
      action: event.action,
      level: event.level,
      target: event.target,
      targetType: event.targetType,
      department: event.department,
      metadata: event.metadata ? JSON.stringify(event.metadata) : null,
      status: event.status,
      errorMessage: event.errorMessage,
    })
    .run()
    .catch((err) => {
      console.error("[event-hook] syncInsertToSQLite failed", err);
    });
}

// 批量从 Redis 取出并写入 SQLite
export async function flushToSQLite(): Promise<void> {
  const raw: string[] = [];

  // RPOP 批量取出最多 BATCH_SIZE 条
  for (let i = 0; i < BATCH_SIZE; i++) {
    const item = await redis.rpop(QUEUE_KEY).catch(() => null);
    if (!item) break;
    raw.push(item);
  }

  if (raw.length === 0) return;

  const rows: (typeof events.$inferInsert)[] = [];
  const failed: string[] = [];

  for (const item of raw) {
    try {
      const e: FullEvent = JSON.parse(item);
      rows.push({
        id: e.id,
        timestamp: new Date(e.timestamp).getTime(),
        actor: e.actor,
        actorType: e.actorType,
        action: e.action,
        level: e.level,
        target: e.target,
        targetType: e.targetType,
        department: e.department,
        metadata: e.metadata ? JSON.stringify(e.metadata) : null,
        status: e.status,
        errorMessage: e.errorMessage,
      });
    } catch {
      failed.push(item);
    }
  }

  if (rows.length > 0) {
    try {
      await db.insert(events).values(rows).onConflictDoNothing();
    } catch (err) {
      console.error("[event-hook] SQLite batch insert failed, re-queuing", err);
      // 写回 Redis，等待下次重试
      for (const item of raw) {
        await redis.lpush(QUEUE_KEY, item).catch(() => {
          redis.lpush(DEAD_KEY, item).catch(() => {});
        });
      }
      return;
    }
  }

  // 解析失败的移入死信队列
  for (const item of failed) {
    await redis.lpush(DEAD_KEY, item).catch(() => {});
  }
}

let consumerTimer: ReturnType<typeof setInterval> | null = null;

// 启动消费者定时器
export function startEventConsumer(): void {
  if (consumerTimer) return;
  consumerTimer = setInterval(() => {
    flushToSQLite().catch((err) => {
      console.error("[event-hook] flushToSQLite error", err);
    });
  }, FLUSH_INTERVAL_MS);
  console.log("[event-hook] consumer started (interval=5s)");
}

// 停止消费者定时器
export function stopEventConsumer(): void {
  if (consumerTimer) {
    clearInterval(consumerTimer);
    consumerTimer = null;
    console.log("[event-hook] consumer stopped");
  }
}
