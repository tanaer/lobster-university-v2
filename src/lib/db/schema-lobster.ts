import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./schema";

// 职业方向表
export const careerTracks = sqliteTable("career_tracks", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // customer-support, data-entry, etc.
  icon: text("icon").notNull(), // emoji
  description: text("description").notNull(),
  riskLevel: text("risk_level").notNull(), // 极高/高/中
  marketDemand: text("market_demand"), // 市场需求描述
  studyDuration: integer("study_duration").notNull(), // 学习周期(天)
  difficulty: integer("difficulty").notNull(), // 1-3 星
  
  // 核心能力 (JSON array)
  capabilities: text("capabilities").notNull(),
  
  // 毕业作品集要求 (JSON array)
  portfolioRequirements: text("portfolio_requirements").notNull(),
  
  // 就业方向 (JSON array)
  jobDirections: text("job_directions").notNull(),
  
  order: integer("order").default(0),
  published: integer("published", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 龙虾档案表
export const lobsterProfiles = sqliteTable("lobster_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // 基本信息
  name: text("name").notNull(), // 龙虾名字
  avatar: text("avatar"), // 头像 URL
  
  // 学籍信息
  studentId: text("student_id").notNull().unique(), // 学籍号
  enrolledAt: integer("enrolled_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  
  // 职业方向
  careerTrackId: text("career_track_id")
    .references(() => careerTracks.id),
  
  // 学习设置
  dailyStudyMinutes: integer("daily_study_minutes").default(30), // 每日学习时长目标
  studyReminder: text("study_reminder"), // 提醒时间 "09:00"
  timezone: text("timezone").default("Asia/Shanghai"),
  
  // 学习统计
  totalStudyTime: integer("total_study_time").default(0), // 总学习时长(分钟)
  completedTasks: integer("completed_tasks").default(0), // 完成任务数
  portfolioItems: integer("portfolio_items").default(0), // 作品集项目数
  
  // 状态
  status: text("status").default("active"), // active/graduated/suspended
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 学习记录表
export const studyLogs = sqliteTable("study_logs", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => lobsterProfiles.id, { onDelete: "cascade" }),
  
  // 学习内容
  capabilityId: text("capability_id"), // 能力 ID
  taskName: text("task_name").notNull(), // 任务名称
  taskType: text("task_type").notNull(), // course/practice/project
  
  // 学习时长
  duration: integer("duration").notNull(), // 分钟
  
  // 产出
  deliverable: text("deliverable"), // 可交付成果描述
  deliverableUrl: text("deliverable_url"), // 成果链接
  
  // 状态
  status: text("status").default("completed"), // in_progress/completed/reviewed
  
  studiedAt: integer("studied_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 作品集表
export const portfolios = sqliteTable("portfolios", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => lobsterProfiles.id, { onDelete: "cascade" }),
  
  // 作品信息
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // report/document/code/design/etc
  capabilityId: text("capability_id"), // 对应的能力
  
  // 内容
  content: text("content"), // 作品内容或描述
  fileUrl: text("file_url"), // 文件链接
  
  // 状态
  status: text("status").default("draft"), // draft/submitted/reviewed/approved
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
  reviewerNotes: text("reviewer_notes"),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 能力评估表
export const assessments = sqliteTable("assessments", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => lobsterProfiles.id, { onDelete: "cascade" }),
  dimension: text("dimension").notNull(), // task_completion, portfolio_quality, learning_efficiency, autonomy, job_match
  score: integer("score").notNull(), // 0-100
  answers: text("answers"), // JSON
  assessedAt: integer("assessed_at", { mode: "timestamp" }).notNull(),
});

// 每日提醒设置表
export const reminderSettings = sqliteTable("reminder_settings", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => lobsterProfiles.id, { onDelete: "cascade" })
    .unique(),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  reminderTime: text("reminder_time").default("09:00"),
  notifyBeforeGoal: integer("notify_before_goal", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 学习连续记录表
export const streakRecords = sqliteTable("streak_records", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => lobsterProfiles.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  studyMinutes: integer("study_minutes").default(0),
  goalMet: integer("goal_met", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 类型导出
export type CareerTrack = typeof careerTracks.$inferSelect;
export type LobsterProfile = typeof lobsterProfiles.$inferSelect;
export type StudyLog = typeof studyLogs.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type ReminderSettings = typeof reminderSettings.$inferSelect;
export type StreakRecord = typeof streakRecords.$inferSelect;
