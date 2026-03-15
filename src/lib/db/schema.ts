import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// 用户表
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),

  // 游戏化字段
  level: integer("level").default(1),
  exp: integer("exp").default(0),
  streak: integer("streak").default(0), // 连续学习天数
  totalStudyTime: integer("total_study_time").default(0), // 总学习时长(分钟)
  parentOnboardingCompleted: integer("parent_onboarding_completed", { mode: "boolean" }).default(false),
  parentReportSubscription: text("parent_report_subscription").default("weekly"),
});

// 会话表 (Better Auth)
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// 账户表 (Better Auth)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// 验证表 (Better Auth)
export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// 课程表
export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  category: text("category"),
  level: text("level"), // beginner/intermediate/advanced
  tags: text("tags"), // JSON array
  duration: integer("duration"), // 分钟
  chapterCount: integer("chapter_count").default(0),
  studentCount: integer("student_count").default(0),
  rating: real("rating").default(0),
  ratingCount: integer("rating_count").default(0),
  source: text("source"), // github/twitter/manual
  sourceUrl: text("source_url"),
  author: text("author"),
  published: integer("published", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// 章节表
export const chapters = sqliteTable("chapters", {
  id: text("id").primaryKey(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"), // MDX
  order: integer("order").notNull(),
  duration: integer("duration"), // 分钟
  isFree: integer("is_free", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// 学习进度表
export const progress = sqliteTable("progress", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  chapterId: text("chapter_id")
    .notNull()
    .references(() => chapters.id, { onDelete: "cascade" }),
  completed: integer("completed", { mode: "boolean" }).default(false),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  lastAccessedAt: integer("last_accessed_at", { mode: "timestamp" }),
});

// 课程注册表 (学生购买/加入课程)
export const enrollments = sqliteTable("enrollments", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  progress: integer("progress").default(0), // 完成百分比
  completedChapters: integer("completed_chapters").default(0),
  lastAccessedAt: integer("last_accessed_at", { mode: "timestamp" }),
  enrolledAt: integer("enrolled_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// 评价表
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5
  content: text("content"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// 成就表
export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // first_course/study_5h/10_reviews/etc
  metadata: text("metadata"), // JSON
  unlockedAt: integer("unlocked_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// 类型导出
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Progress = typeof progress.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
