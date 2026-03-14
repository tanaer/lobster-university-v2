import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// 事件日志表
export const events = sqliteTable(
  "events",
  {
    id: text("id").primaryKey(),
    timestamp: integer("timestamp").notNull(), // unix ms
    actor: text("actor").notNull(),
    actorType: text("actor_type").notNull(), // student/admin/agent/system
    action: text("action").notNull(),
    level: text("level").notNull().default("L1"), // L1/L2
    target: text("target"),
    targetType: text("target_type"),
    department: text("department").notNull(),
    metadata: text("metadata"), // JSON
    status: text("status").notNull().default("ok"), // ok/error
    errorMessage: text("error_message"),
    createdAt: integer("created_at").$defaultFn(() =>
      Math.floor(Date.now() / 1000)
    ),
  },
  (t) => [
    index("idx_events_timestamp").on(t.timestamp),
    index("idx_events_actor").on(t.actor),
    index("idx_events_action").on(t.action),
    index("idx_events_level").on(t.level),
  ]
);

// 每日统计聚合表
export const statsDaily = sqliteTable("stats_daily", {
  id: text("id").primaryKey(),
  date: text("date").notNull().unique(), // "2026-03-14"
  totalEvents: integer("total_events").default(0),
  l1Events: integer("l1_events").default(0),
  l2Events: integer("l2_events").default(0),
  uniqueActors: integer("unique_actors").default(0),
  newEnrollments: integer("new_enrollments").default(0),
  coursesCompleted: integer("courses_completed").default(0),
  certsIssued: integer("certs_issued").default(0),
  errors: integer("errors").default(0),
  topActions: text("top_actions"), // JSON: [{action, count}]
  createdAt: integer("created_at").$defaultFn(() =>
    Math.floor(Date.now() / 1000)
  ),
});

// 类型导出
export type LobsterEvent = typeof events.$inferSelect;
export type StatsDaily = typeof statsDaily.$inferSelect;
