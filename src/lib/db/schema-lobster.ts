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
  type: text("type").notNull(), // report/document/code/design/media/case_study/etc
  capabilityId: text("capability_id"), // 对应的能力
  
  // 内容
  content: text("content"), // 作品内容或描述
  fileUrl: text("file_url"), // 文件链接
  
  // 状态
  status: text("status").default("draft"), // draft/submitted/verified/rejected
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
  reviewerNotes: text("reviewer_notes"),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 认证申请表
export const certifications = sqliteTable("certifications", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => lobsterProfiles.id, { onDelete: "cascade" }),
  trackId: text("track_id")
    .notNull()
    .references(() => careerTracks.id),
  level: integer("level").notNull(), // 1-5
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  appliedAt: integer("applied_at", { mode: "timestamp" }).notNull(),
  approvedAt: integer("approved_at", { mode: "timestamp" }),
  certificateId: text("certificate_id"),
  notes: text("notes"), // 审核备注
});

// 证书表
export const certificates = sqliteTable("certificates", {
  id: text("id").primaryKey(),
  certificationId: text("certification_id")
    .notNull()
    .references(() => certifications.id),
  profileId: text("profile_id").notNull(),
  trackId: text("track_id").notNull(),
  level: integer("level").notNull(),
  issuedAt: integer("issued_at", { mode: "timestamp" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  verifyUrl: text("verify_url").notNull(),
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

// 课程表
export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // web-search-basics, excel-basics
  description: text("description").notNull(),
  
  // 分类
  module: text("module").notNull(), // 搜索与知识获取, 办公文件全自动化, etc.
  category: text("category").notNull(), // 基础能力, 专项技能
  
  // 元数据
  duration: integer("duration").notNull(), // 预计学习时长(分钟)
  level: text("level").notNull(), // 初级, 中级, 高级
  skillPath: text("skill_path").notNull(), // Skill 文件路径
  
  // 课程内容
  objectives: text("objectives").notNull(), // JSON array - 学习目标
  lessons: text("lessons"), // JSON array - 课程列表
  
  // 关联
  prerequisites: text("prerequisites"), // JSON array - 前置课程 ID
  
  // 统计
  enrollCount: integer("enroll_count").default(0),
  completionRate: integer("completion_rate").default(0),
  
  order: integer("order").default(0),
  published: integer("published", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 学员选课记录
export const studentCourses = sqliteTable("student_courses", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => lobsterProfiles.id, { onDelete: "cascade" }),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  
  status: text("status").notNull().default("enrolled"), // enrolled, in_progress, completed, dropped
  progress: integer("progress").default(0), // 0-100
  
  enrolledAt: integer("enrolled_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  startedAt: integer("started_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  
  // 学习记录
  notes: text("notes"), // 学习笔记
  feedback: text("feedback"), // 课程反馈
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 课程进度详情
export const courseProgress = sqliteTable("course_progress", {
  id: text("id").primaryKey(),
  studentCourseId: text("student_course_id")
    .notNull()
    .references(() => studentCourses.id, { onDelete: "cascade" }),
  
  lessonIndex: integer("lesson_index").notNull(), // 课程序号
  lessonTitle: text("lesson_title").notNull(),
  
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed
  completedAt: integer("completed_at", { mode: "timestamp" }),
  
  // 练习/考核结果
  exerciseResult: text("exercise_result"), // JSON
  passed: integer("passed", { mode: "boolean" }).default(false),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 类型导出
export type CareerTrack = typeof careerTracks.$inferSelect;
export type LobsterProfile = typeof lobsterProfiles.$inferSelect;
export type StudyLog = typeof studyLogs.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type ReminderSettings = typeof reminderSettings.$inferSelect;
export type StreakRecord = typeof streakRecords.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type StudentCourse = typeof studentCourses.$inferSelect;
export type CourseProgress = typeof courseProgress.$inferSelect;
