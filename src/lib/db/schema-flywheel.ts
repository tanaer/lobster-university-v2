/**
 * 教务自我迭代飞轮系统 - 数据库 Schema
 * 
 * 包含五个阶段的表结构：
 * 1. 教师招聘系统 - 内容源、教师
 * 2. 课程生产管道 - 生产任务、版本
 * 3. 课程实际检验 - 学习事件、反馈、实验
 * 4. 反馈改进闭环 - 健康度、改进任务、淘汰记录
 * 5. 飞轮系统配置 - 状态、报告、日志
 */

import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { users } from "./schema";
import { skillCourses, lobsterProfiles } from "./schema-lobster";

// ============================================
// 第一阶段：教师招聘系统
// ============================================

/**
 * 内容源配置表
 * 管理从哪里获取课程内容（ClawHub、SkillHub、GitHub 等）
 */
export const contentSources = sqliteTable("content_sources", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // ClawHub, SkillHub, GitHub
  type: text("type").notNull(), // api, git, manual
  endpoint: text("endpoint"), // API endpoint or git URL
  apiKey: text("api_key"), // 加密存储
  syncInterval: integer("sync_interval").default(86400), // 同步间隔(秒)
  lastSyncAt: integer("last_sync_at", { mode: "timestamp" }),
  lastSyncStatus: text("last_sync_status"), // success, failed, partial
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  config: text("config"), // JSON 额外配置
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 原始内容快照表
 * 存储从外部源抓取的原始 SKILL.md / README 内容
 */
export const rawContentSnapshots = sqliteTable("raw_content_snapshots", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull().references(() => contentSources.id),
  externalId: text("external_id").notNull(), // 外部系统的 ID
  sourceType: text("source_type").notNull(), // skill, repo, article
  rawContent: text("raw_content").notNull(), // 原始内容
  metadata: text("metadata"), // JSON: 作者、下载量、评分等
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  hash: text("hash"), // 内容哈希，用于检测变化
});

/**
 * 教师表
 * 存储教师/教授信息（包括 Skill 作者、AI Agent、社区贡献者）
 * 
 * 教师等级体系：
 * - ta (助教): 0-30 分
 * - lecturer (讲师): 31-50 分
 * - associate (副教授): 51-70 分
 * - professor (教授): 71-100 分
 */
export const teachers = sqliteTable("teachers", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id), // 可选：如果教师也是用户
  
  // 基本信息
  name: text("name").notNull(),
  email: text("email"),
  github: text("github"),
  twitter: text("twitter"),
  avatar: text("avatar"),
  bio: text("bio"),
  
  // 来源信息
  sourceType: text("source_type").notNull(), // clawhub, skillhub, github, manual
  sourceId: text("source_id"), // 外部系统 ID
  sourceUrl: text("source_url"), // 外部主页链接
  
  // 教师等级
  level: text("level").notNull().default("ta"), // ta, lecturer, associate, professor
  levelScore: integer("level_score").default(0), // 0-100
  
  // 统计数据
  totalCourses: integer("total_courses").default(0),
  totalStudents: integer("total_students").default(0),
  avgRating: real("avg_rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  
  // 邀请状态
  inviteStatus: text("invite_status").default("pending"), // pending, sent, accepted, declined
  invitedAt: integer("invited_at", { mode: "timestamp" }),
  acceptedAt: integer("accepted_at", { mode: "timestamp" }),
  
  // 状态
  status: text("status").default("active"), // active, inactive, suspended
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 教师等级历史记录
 * 追踪教师的晋升/降级历史
 */
export const teacherLevelHistory = sqliteTable("teacher_level_history", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
  fromLevel: text("from_level"),
  toLevel: text("to_level").notNull(),
  fromScore: integer("from_score"),
  toScore: integer("to_score").notNull(),
  reason: text("reason"), // 晋升/降级原因
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// 第二阶段：课程生产管道
// ============================================

/**
 * 课程生产任务表
 * 追踪从原始内容到发布课程的整个生产流程
 * 
 * 状态流转：
 * pending → parsing → enhancing → reviewing → published
 *                     ↓
 *                   failed
 */
export const courseProductionJobs = sqliteTable("course_production_jobs", {
  id: text("id").primaryKey(),
  
  // 来源
  sourceType: text("source_type").notNull(), // skill, manual, import
  sourceId: text("source_id"), // rawContentSnapshots.id 或其他
  teacherId: text("teacher_id").references(() => teachers.id),
  
  // 处理状态
  status: text("status").notNull().default("pending"), // pending, parsing, enhancing, reviewing, published, failed
  stage: text("stage"), // 当前处理阶段
  
  // 处理结果
  parsedContent: text("parsed_content"), // JSON: 解析后的结构化内容
  enhancedContent: text("enhanced_content"), // JSON: AI 增强后的内容
  generatedCourseId: text("generated_course_id"), // 最终生成的课程 ID
  
  // 质量评分
  qualityScore: integer("quality_score"), // 0-100
  qualityDetails: text("quality_details"), // JSON: 各维度评分
  
  // 审核信息
  reviewStatus: text("review_status"), // pending, approved, rejected, needs_revision
  reviewedBy: text("reviewed_by"),
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
  reviewNotes: text("review_notes"),
  
  // 错误处理
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").default(0),
  
  // 时间戳
  startedAt: integer("started_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 课程版本表
 * 管理课程的内容版本，支持 Skill 更新时同步
 */
export const courseVersions = sqliteTable("course_versions", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => skillCourses.id, { onDelete: "cascade" }),
  
  // 版本信息
  version: text("version").notNull(), // semver: 1.0.0
  previousVersion: text("previous_version"),
  
  // 变更信息
  changeType: text("change_type").notNull(), // major, minor, patch
  changelog: text("changelog"),
  changes: text("changes"), // JSON: 具体变更内容
  
  // 快照
  contentSnapshot: text("content_snapshot").notNull(), // JSON: 完整课程内容快照
  
  // 统计
  activeStudents: integer("active_students").default(0), // 此版本的活跃学员数
  
  // 状态
  status: text("status").default("active"), // draft, active, deprecated
  
  publishedAt: integer("published_at", { mode: "timestamp" }),
  deprecatedAt: integer("deprecated_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// 第三阶段：课程实际检验
// ============================================

/**
 * 学习行为事件表
 * 细粒度追踪学员的每一个学习动作
 */
export const learningEvents = sqliteTable("learning_events", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull(), // lobsterProfiles.id
  courseId: text("course_id").notNull(),
  
  // 事件信息
  eventType: text("event_type").notNull(), // start, pause, resume, complete, drop, retry
  lessonIndex: integer("lesson_index"),
  exerciseId: text("exercise_id"),
  
  // 时长
  duration: integer("duration"), // 秒
  
  // 结果
  result: text("result"), // JSON: 练习结果、分数等
  
  // 上下文
  deviceType: text("device_type"), // desktop, mobile, tablet
  sessionId: text("session_id"), // 学习会话 ID
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 退出点分析表
 * 统计每个课时的退出率，找出问题点
 */
export const dropoffPoints = sqliteTable("dropoff_points", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  lessonIndex: integer("lesson_index"),
  
  // 统计
  totalDrops: integer("total_drops").default(0),
  totalStarts: integer("total_starts").default(0),
  dropRate: real("drop_rate").default(0), // 退出率
  
  // 原因分析
  topReasons: text("top_reasons"), // JSON: 退出原因 Top N
  
  // 时间戳
  lastDropAt: integer("last_drop_at", { mode: "timestamp" }),
  analyzedAt: integer("analyzed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 课程反馈表
 * 扩展的反馈系统，支持多种反馈类型
 */
export const courseFeedbacks = sqliteTable("course_feedbacks", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull(),
  courseId: text("course_id").notNull(),
  
  // 反馈类型
  feedbackType: text("feedback_type").notNull(), // rating, comment, difficulty, bug, suggestion
  
  // 评分
  rating: integer("rating"), // 1-5
  
  // 内容
  content: text("content"),
  
  // 上下文
  lessonIndex: integer("lesson_index"),
  exerciseId: text("exercise_id"),
  
  // 标签 (AI 提取)
  tags: text("tags"), // JSON: ["too_hard", "unclear", "helpful"]
  sentiment: text("sentiment"), // positive, neutral, negative
  
  // 处理状态
  status: text("status").default("new"), // new, reviewed, addressed, dismissed
  addressedAt: integer("addressed_at", { mode: "timestamp" }),
  addressedBy: text("addressed_by"),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * A/B 测试表
 * 管理教学方式的对比实验
 */
export const experiments = sqliteTable("experiments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  
  // 实验配置
  courseId: text("course_id"), // null = 全局实验
  variantA: text("variant_a").notNull(), // JSON: A 组配置
  variantB: text("variant_b").notNull(), // JSON: B 组配置
  trafficSplit: integer("traffic_split").default(50), // A 组流量百分比
  
  // 目标指标
  primaryMetric: text("primary_metric").notNull(), // completion_rate, avg_rating, etc.
  secondaryMetrics: text("secondary_metrics"), // JSON
  
  // 统计显著性
  significanceLevel: real("significance_level").default(0.05),
  minSampleSize: integer("min_sample_size").default(100),
  
  // 状态
  status: text("status").default("draft"), // draft, running, paused, completed, archived
  winningVariant: text("winning_variant"), // a, b, none
  
  // 时间
  startedAt: integer("started_at", { mode: "timestamp" }),
  endedAt: integer("ended_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 实验分组表
 * 记录每个学员被分配到哪个实验组
 */
export const experimentAssignments = sqliteTable("experiment_assignments", {
  id: text("id").primaryKey(),
  experimentId: text("experiment_id").notNull().references(() => experiments.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull(),
  variant: text("variant").notNull(), // a, b
  assignedAt: integer("assigned_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 实验结果表
 * 存储实验的统计分析结果
 */
export const experimentResults = sqliteTable("experiment_results", {
  id: text("id").primaryKey(),
  experimentId: text("experiment_id").notNull().references(() => experiments.id, { onDelete: "cascade" }),
  
  // 分组统计
  variant: text("variant").notNull(), // a, b
  sampleSize: integer("sample_size").notNull(),
  
  // 指标值
  metricName: text("metric_name").notNull(),
  metricValue: real("metric_value").notNull(),
  confidenceInterval: text("confidence_interval"), // JSON: [lower, upper]
  
  // 显著性
  pValue: real("p_value"),
  isSignificant: integer("is_significant", { mode: "boolean" }),
  
  computedAt: integer("computed_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// 第四阶段：反馈改进闭环
// ============================================

/**
 * 课程健康度表
 * 每日快照存储课程的综合健康度评分
 * 
 * 健康度计算：
 * - ratingScore: 平均评分 * 20
 * - completionScore: 完成率 * 30
 * - dropoffScore: (1 - 退出率) * 20
 * - feedbackScore: 反馈得分 * 15
 * - updateScore: 更新频率得分 * 15
 */
export const courseHealthScores = sqliteTable("course_health_scores", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  
  // 综合健康度
  healthScore: integer("health_score").notNull(), // 0-100
  
  // 分项得分
  ratingScore: integer("rating_score"), // 评分维度得分
  completionScore: integer("completion_score"), // 完成率得分
  dropoffScore: integer("dropoff_score"), // 退出率得分 (反向)
  feedbackScore: integer("feedback_score"), // 反馈得分
  updateScore: integer("update_score"), // 更新频率得分
  
  // 预警状态
  alertLevel: text("alert_level").default("none"), // none, yellow, red
  alertReasons: text("alert_reasons"), // JSON: 预警原因列表
  
  // 趋势
  trend: text("trend"), // improving, stable, declining
  previousScore: integer("previous_score"),
  
  // 快照时间
  snapshotAt: integer("snapshot_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 自动改进任务表
 * 系统自动生成的课程改进建议
 */
export const autoImprovementTasks = sqliteTable("auto_improvement_tasks", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  
  // 任务类型
  taskType: text("task_type").notNull(), // add_content, adjust_difficulty, fix_exercise, add_faq
  
  // 触发原因
  triggerType: text("trigger_type").notNull(), // low_health, feedback, analytics, scheduled
  triggerDetails: text("trigger_details"), // JSON
  
  // 任务内容
  description: text("description").notNull(),
  targetLesson: integer("target_lesson"),
  suggestedContent: text("suggested_content"), // AI 生成的建议内容
  
  // 状态
  status: text("status").default("pending"), // pending, processing, completed, dismissed
  priority: integer("priority").default(5), // 1-10
  
  // 执行结果
  result: text("result"), // JSON: 执行结果
  completedAt: integer("completed_at", { mode: "timestamp" }),
  
  // 审核信息
  requiresReview: integer("requires_review", { mode: "boolean" }).default(true),
  reviewedBy: text("reviewed_by"),
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 课程淘汰记录表
 * 追踪低质量课程的淘汰流程
 */
export const courseSunsetRecords = sqliteTable("course_sunset_records", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  
  // 淘汰原因
  reason: text("reason").notNull(), // low_health, no_enrollment, author_inactive, deprecated
  details: text("details"), // JSON: 详细原因
  
  // 健康度历史
  finalHealthScore: integer("final_health_score"),
  healthHistory: text("health_history"), // JSON: 过去 N 天的健康度
  
  // 淘汰流程
  status: text("status").default("warning"), // warning, archived, removed
  warningSentAt: integer("warning_sent_at", { mode: "timestamp" }),
  archivedAt: integer("archived_at", { mode: "timestamp" }),
  removedAt: integer("removed_at", { mode: "timestamp" }),
  
  // 学员处理
  affectedStudents: integer("affected_students").default(0),
  alternativeCourses: text("alternative_courses"), // JSON: 推荐的替代课程
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 教师绩效评估表
 * 每月评估教师表现，决定晋级/降级
 */
export const teacherPerformanceReviews = sqliteTable("teacher_performance_reviews", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
  
  // 评估周期
  periodStart: integer("period_start", { mode: "timestamp" }).notNull(),
  periodEnd: integer("period_end", { mode: "timestamp" }).notNull(),
  
  // 评估维度得分
  avgCourseRating: real("avg_course_rating"),
  avgCompletionRate: real("avg_completion_rate"),
  studentGrowth: integer("student_growth"),
  avgResponseTime: integer("avg_response_time"), // 小时
  updateFrequency: integer("update_frequency"), // 次数
  
  // 综合得分
  overallScore: integer("overall_score"), // 0-100
  
  // 等级变化
  levelChange: text("level_change"), // promoted, demoted, none
  previousLevel: text("previous_level"),
  newLevel: text("new_level"),
  
  // 报告
  report: text("report"), // JSON: 详细评估报告
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// 第五阶段：飞轮系统配置
// ============================================

/**
 * 飞轮状态表
 * 存储飞轮系统的全局状态（单例）
 * 
 * 状态流转：
 * spinning_up → cruising → accelerating ↔ maintenance
 *                ↓              ↓
 *              paused         paused
 */
export const flywheelState = sqliteTable("flywheel_state", {
  id: text("id").primaryKey(),
  
  // 状态
  state: text("state").notNull().default("spinning_up"), // spinning_up, cruising, accelerating, maintenance, paused
  
  // 转速指标
  rpm: real("rpm").default(0), // 飞轮转速 (每周新增课程数)
  
  // 健康度
  systemHealth: integer("system_health").default(100), // 0-100
  
  // 统计
  totalCourses: integer("total_courses").default(0),
  totalTeachers: integer("total_teachers").default(0),
  totalStudents: integer("total_students").default(0),
  avgCourseRating: real("avg_course_rating").default(0),
  
  // 上次更新
  lastStateChange: integer("last_state_change", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * 系统报告表
 * 存储自动生成的日报、周报、月报
 */
export const systemReports = sqliteTable("system_reports", {
  id: text("id").primaryKey(),
  
  // 报告类型
  reportType: text("report_type").notNull(), // daily, weekly, monthly
  periodStart: integer("period_start", { mode: "timestamp" }).notNull(),
  periodEnd: integer("period_end", { mode: "timestamp" }).notNull(),
  
  // 报告内容
  summary: text("summary").notNull(), // JSON: 摘要数据
  details: text("details"), // JSON: 详细数据
  
  // 重点事项
  highlights: text("highlights"), // JSON: 重点事项列表
  warnings: text("warnings"), // JSON: 预警事项列表
  actionItems: text("action_items"), // JSON: 待办事项列表
  
  // 分发
  sentTo: text("sent_to"), // JSON: 接收者列表
  sentAt: integer("sent_at", { mode: "timestamp" }),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/**
 * Cron 任务日志表
 * 记录所有定时任务的执行情况
 */
export const cronJobLogs = sqliteTable("cron_job_logs", {
  id: text("id").primaryKey(),
  
  // 任务信息
  jobName: text("job_name").notNull(),
  jobType: text("job_type").notNull(), // scan, sync, analyze, report, cleanup
  
  // 执行状态
  status: text("status").notNull(), // running, success, failed, partial
  
  // 执行详情
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  duration: integer("duration"), // 毫秒
  
  // 结果
  result: text("result"), // JSON: 执行结果
  error: text("error"), // 错误信息
  
  // 统计
  itemsProcessed: integer("items_processed").default(0),
  itemsSucceeded: integer("items_succeeded").default(0),
  itemsFailed: integer("items_failed").default(0),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// 类型导出
// ============================================

export type ContentSource = typeof contentSources.$inferSelect;
export type RawContentSnapshot = typeof rawContentSnapshots.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type TeacherLevelHistory = typeof teacherLevelHistory.$inferSelect;
export type CourseProductionJob = typeof courseProductionJobs.$inferSelect;
export type CourseVersion = typeof courseVersions.$inferSelect;
export type LearningEvent = typeof learningEvents.$inferSelect;
export type DropoffPoint = typeof dropoffPoints.$inferSelect;
export type CourseFeedback = typeof courseFeedbacks.$inferSelect;
export type Experiment = typeof experiments.$inferSelect;
export type ExperimentAssignment = typeof experimentAssignments.$inferSelect;
export type ExperimentResult = typeof experimentResults.$inferSelect;
export type CourseHealthScore = typeof courseHealthScores.$inferSelect;
export type AutoImprovementTask = typeof autoImprovementTasks.$inferSelect;
export type CourseSunsetRecord = typeof courseSunsetRecords.$inferSelect;
export type TeacherPerformanceReview = typeof teacherPerformanceReviews.$inferSelect;
export type FlywheelState = typeof flywheelState.$inferSelect;
export type SystemReport = typeof systemReports.$inferSelect;
export type CronJobLog = typeof cronJobLogs.$inferSelect;

// ============================================
// 常量定义
// ============================================

/** 教师等级 */
export const TEACHER_LEVELS = {
  TA: "ta",
  LECTURER: "lecturer",
  ASSOCIATE: "associate",
  PROFESSOR: "professor",
} as const;

/** 教师等级分数范围 */
export const TEACHER_LEVEL_SCORES = {
  ta: { min: 0, max: 30 },
  lecturer: { min: 31, max: 50 },
  associate: { min: 51, max: 70 },
  professor: { min: 71, max: 100 },
} as const;

/** 飞轮状态 */
export const FLYWHEEL_STATES = {
  SPINNING_UP: "spinning_up",
  CRUISING: "cruising",
  ACCELERATING: "accelerating",
  MAINTENANCE: "maintenance",
  PAUSED: "paused",
} as const;

/** 课程生产任务状态 */
export const PRODUCTION_JOB_STATUS = {
  PENDING: "pending",
  PARSING: "parsing",
  ENHANCING: "enhancing",
  REVIEWING: "reviewing",
  PUBLISHED: "published",
  FAILED: "failed",
} as const;

/** 健康度预警级别 */
export const ALERT_LEVELS = {
  NONE: "none",
  YELLOW: "yellow",
  RED: "red",
} as const;

/** 健康度阈值 */
export const HEALTH_THRESHOLDS = {
  YELLOW: 50,
  RED: 30,
} as const;

/** 质量评分阈值 */
export const QUALITY_THRESHOLDS = {
  AUTO_PUBLISH: 85,
  NEEDS_REVIEW: 60,
} as const;
