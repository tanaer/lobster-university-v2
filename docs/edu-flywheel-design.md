# 教务自我迭代飞轮系统设计文档

> 版本: 1.0.0
> 日期: 2026-03-13
> 作者: 系统架构师

## 一、系统架构图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          教务自我迭代飞轮系统                                      │
│                    (Edu Flywheel Self-Evolution System)                         │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │   启动点     │
                                    │ Cron 任务    │
                                    └──────┬──────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              第一阶段：教师招聘系统                                │
│                         (Teacher Recruitment Pipeline)                           │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│   │  ClawHub    │    │  SkillHub   │    │   GitHub    │    │   社区提交   │      │
│   │  技能市场   │    │  技能市场   │    │   开源项目   │    │   (人工)    │      │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘      │
│          │                  │                  │                  │              │
│          └──────────────────┼──────────────────┼──────────────────┘              │
│                             ▼                  ▼                                 │
│                    ┌────────────────────────────────┐                            │
│                    │     内容源扫描器 (Scanner)      │                            │
│                    │  - 每日扫描新发布内容            │                            │
│                    │  - 解析 SKILL.md / README.md    │                            │
│                    │  - 提取元数据和内容              │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │    质量评估引擎 (Evaluator)     │                            │
│                    │                                │                            │
│                    │  评估维度:                      │                            │
│                    │  ├─ 下载量 (downloads)         │                            │
│                    │  ├─ 评分 (rating)              │                            │
│                    │  ├─ 更新频率 (update_freq)     │                            │
│                    │  ├─ 文档质量 (doc_quality)     │                            │
│                    │  ├─ 社区活跃度 (community)     │                            │
│                    │  └─ 内容深度 (content_depth)   │                            │
│                    │                                │                            │
│                    │  → 输出: quality_score (0-100) │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │     教师邀请系统 (Inviter)      │                            │
│                    │                                │                            │
│                    │  if score >= 80:               │                            │
│                    │    → 自动邀请为"客座教授"       │                            │
│                    │    → 发送 GitHub Issue/邮件    │                            │
│                    │  elif score >= 60:             │                            │
│                    │    → 加入"潜在教师池"           │                            │
│                    │    → 等待人工审核              │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │     教师档案库 (teachers)       │                            │
│                    │                                │                            │
│                    │  等级体系:                      │                            │
│                    │  ├─ 助教 (TA)        0-30分    │                            │
│                    │  ├─ 讲师 (Lecturer)  31-50分   │                            │
│                    │  ├─ 副教授 (Assoc.)  51-70分   │                            │
│                    │  └─ 教授 (Professor) 71-100分  │                            │
│                    │                                │                            │
│                    │  晋级条件:                      │                            │
│                    │  - 课程平均评分                 │                            │
│                    │  - 课程完成率                   │                            │
│                    │  - 学员反馈数量                 │                            │
│                    │  - 持续贡献时长                 │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
└────────────────────────────────────┼─────────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              第二阶段：课程生产管道                                │
│                         (Course Production Pipeline)                             │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                    ┌────────────────────────────────┐                            │
│                    │   SKILL.md 解析器 (Parser)      │                            │
│                    │                                │                            │
│                    │  解析内容:                      │                            │
│                    │  ├─ 课程名称/描述               │                            │
│                    │  ├─ 学习目标 (objectives)      │                            │
│                    │  ├─ 前置要求 (prerequisites)   │                            │
│                    │  ├─ 课程大纲 (lessons)         │                            │
│                    │  └─ 练习任务 (exercises)       │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │   AI 课程增强器 (Enhancer)      │                            │
│                    │                                │                            │
│                    │  增强内容:                      │                            │
│                    │  ├─ 自动生成课程大纲            │                            │
│                    │  ├─ 生成练习题 (选择题/简答)    │                            │
│                    │  ├─ 添加代码示例                │                            │
│                    │  ├─ 生成知识点总结              │                            │
│                    │  └─ 添加常见问题解答            │                            │
│                    │                                │                            │
│                    │  → 调用 LLM API                │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │   质量审核系统 (Reviewer)       │                            │
│                    │                                │                            │
│                    │  审核流程:                      │                            │
│                    │                                │                            │
│                    │  quality >= 85:                │                            │
│                    │    → 自动发布 (auto_publish)   │                            │
│                    │                                │                            │
│                    │  60 <= quality < 85:           │                            │
│                    │    → 人工审核队列              │                            │
│                    │    → 通知管理员                │                            │
│                    │                                │                            │
│                    │  quality < 60:                 │                            │
│                    │    → 标记为需改进              │                            │
│                    │    → 返回给增强器              │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │     课程版本管理 (Versions)     │                            │
│                    │                                │                            │
│                    │  - Skill 更新时自动触发         │                            │
│                    │  - 课程版本号 (semver)          │                            │
│                    │  - 变更日志 (changelog)         │                            │
│                    │  - 学员迁移提示                 │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
└────────────────────────────────────┼─────────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              第三阶段：课程实际检验                                │
│                          (Course Validation System)                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                    ┌────────────────────────────────┐                            │
│                    │   学习行为追踪 (Tracker)        │                            │
│                    │                                │                            │
│                    │  追踪指标:                      │                            │
│                    │  ├─ 课程开始率                  │                            │
│                    │  ├─ 各课时完成率                │                            │
│                    │  ├─ 平均学习时长                │                            │
│                    │  ├─ 退出点分析                  │                            │
│                    │  ├─ 练习通过率                  │                            │
│                    │  └─ 重试次数统计                │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │   反馈收集系统 (Feedback)       │                            │
│                    │                                │                            │
│                    │  收集渠道:                      │                            │
│                    │  ├─ 课程评分 (1-5星)           │                            │
│                    │  ├─ 文字评价                    │                            │
│                    │  ├─ 课时难度标记               │                            │
│                    │  ├─ 问题报告                    │                            │
│                    │  └─ 改进建议                    │                            │
│                    │                                │                            │
│                    │  触发时机:                      │                            │
│                    │  ├─ 完成每个课时后              │                            │
│                    │  ├─ 完成课程后                  │                            │
│                    │  └─ 退出课程时                  │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │   难度曲线分析 (Analytics)      │                            │
│                    │                                │                            │
│                    │  分析维度:                      │                            │
│                    │  ├─ 哪个课时卡住最多人？        │                            │
│                    │  ├─ 练习题通过率分布            │                            │
│                    │  ├─ 学习时长异常检测            │                            │
│                    │  └─ 知识点掌握热力图            │                            │
│                    │                                │                            │
│                    │  输出:                          │                            │
│                    │  ├─ 难度调整建议                │                            │
│                    │  ├─ 补充内容建议                │                            │
│                    │  └─ 练习题优化建议              │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │    A/B 测试系统 (Experiments)   │                            │
│                    │                                │                            │
│                    │  测试内容:                      │                            │
│                    │  ├─ 不同教学方式对比            │                            │
│                    │  ├─ 练习题形式对比              │                            │
│                    │  ├─ 课程结构对比                │                            │
│                    │  └─ 激励机制对比                │                            │
│                    │                                │                            │
│                    │  自动化:                        │                            │
│                    │  ├─ 学员随机分组                │                            │
│                    │  ├─ 统计显著性检验              │                            │
│                    │  └─ 自动选择优胜方案            │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
└────────────────────────────────────┼─────────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              第四阶段：反馈改进闭环                                │
│                         (Feedback Improvement Loop)                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                    ┌────────────────────────────────┐                            │
│                    │   课程健康度监控 (Health)       │                            │
│                    │                                │                            │
│                    │  健康度指标 (0-100):            │                            │
│                    │  ├─ 平均评分 * 20              │                            │
│                    │  ├─ 完成率 * 30                │                            │
│                    │  ├─ 退课率 (反向) * 20         │                            │
│                    │  ├─ 反馈数量 * 15              │                            │
│                    │  └─ 更新频率 * 15              │                            │
│                    │                                │                            │
│                    │  预警机制:                      │                            │
│                    │  ├─ health < 50: 黄色预警      │                            │
│                    │  └─ health < 30: 红色预警      │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                    ┌───────────────┴───────────────┐                            │
│                    │                               │                            │
│                    ▼                               ▼                            │
│   ┌────────────────────────────┐   ┌────────────────────────────┐               │
│   │   自动改进系统 (AutoFix)    │   │   课程淘汰系统 (Sunset)    │               │
│   │                            │   │                            │               │
│   │  触发条件:                  │   │  触发条件:                  │               │
│   │  - health < 60             │   │  - health < 20 持续 30天   │               │
│   │  - 有具体反馈               │   │  - 6个月无人选课           │               │
│   │                            │   │  - 作者放弃维护            │               │
│   │  改进动作:                  │   │                            │               │
│   │  ├─ AI 生成补充内容        │   │  淘汰流程:                  │               │
│   │  ├─ 调整练习题难度         │   │  ├─ 标记为"已归档"         │               │
│   │  ├─ 添加常见问题解答       │   │  ├─ 通知已选课学员         │               │
│   │  └─ 通知教师审核           │   │  ├─ 提供替代课程推荐       │               │
│   │                            │   │  └─ 30天后正式下架         │               │
│   └────────────────────────────┘   └────────────────────────────┘               │
│                                                                                  │
│                    ┌────────────────────────────────┐                            │
│                    │   教师绩效评估 (Performance)    │                            │
│                    │                                │                            │
│                    │  评估周期: 每月                │                            │
│                    │                                │                            │
│                    │  评估维度:                      │                            │
│                    │  ├─ 课程平均评分               │                            │
│                    │  ├─ 课程完成率                 │                            │
│                    │  ├─ 学员增长数                 │                            │
│                    │  ├─ 反馈响应时间               │                            │
│                    │  └─ 持续更新频率               │                            │
│                    │                                │                            │
│                    │  晋级/降级:                     │                            │
│                    │  ├─ 连续3月优秀 → 晋级         │                            │
│                    │  └─ 连续3月不及格 → 降级       │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
└────────────────────────────────────┼─────────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              第五阶段：飞轮加速                                    │
│                           (Flywheel Acceleration)                                │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                    ┌────────────────────────────────┐                            │
│                    │     数据仪表盘 (Dashboard)      │                            │
│                    │                                │                            │
│                    │  实时监控:                      │                            │
│                    │  ├─ 飞轮转速 (RPM)             │                            │
│                    │  ├─ 课程库增长率               │                            │
│                    │  ├─ 教师活跃度                 │                            │
│                    │  ├─ 学员满意度趋势             │                            │
│                    │  └─ 系统健康度                 │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │    自动化报告 (Reporting)       │                            │
│                    │                                │                            │
│                    │  日报: 每日 09:00              │                            │
│                    │  ├─ 新增课程                   │                            │
│                    │  ├─ 预警课程                   │                            │
│                    │  └─ 待审核内容                 │                            │
│                    │                                │                            │
│                    │  周报: 每周一 09:00            │                            │
│                    │  ├─ 飞轮健康度                 │                            │
│                    │  ├─ 教师绩效                   │                            │
│                    │  └─ 学员反馈汇总               │                            │
│                    │                                │                            │
│                    │  月报: 每月1日                 │                            │
│                    │  ├─ 系统整体分析               │                            │
│                    │  ├─ 改进建议                   │                            │
│                    │  └─ 下月计划                   │                            │
│                    └───────────────┬────────────────┘                            │
│                                    │                                             │
│                                    ▼                                             │
│                    ┌────────────────────────────────┐                            │
│                    │    飞轮状态机 (State Machine)   │                            │
│                    │                                │                            │
│                    │  States:                       │                            │
│                    │  ├─ SPINNING_UP (启动中)       │                            │
│                    │  ├─ CRUISING (巡航中)          │                            │
│                    │  ├─ ACCELERATING (加速中)      │                            │
│                    │  ├─ MAINTENANCE (维护中)       │                            │
│                    │  └─ PAUSED (暂停)              │                            │
│                    │                                │                            │
│                    │  Transitions:                  │                            │
│                    │  └─ 根据健康度自动切换状态     │                            │
│                    └────────────────────────────────┘                            │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │   持续循环   │
                                    │   ♻️ 飞轮    │
                                    └─────────────┘
                                           │
                                           └──────────────► 回到第一阶段
```

---

## 二、新增数据库 Schema

### 文件位置: `src/lib/db/schema-flywheel.ts`

```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { users } from "./schema";

// ============================================
// 第一阶段：教师招聘系统
// ============================================

// 内容源配置表
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

// 原始内容快照表 (存储从外部源抓取的原始数据)
export const rawContentSnapshots = sqliteTable("raw_content_snapshots", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull().references(() => contentSources.id),
  externalId: text("external_id").notNull(), // 外部系统的 ID
  sourceType: text("source_type").notNull(), // skill, repo, article
  rawContent: text("raw_content").notNull(), // 原始 SKILL.md / README 内容
  metadata: text("metadata"), // JSON: 作者、下载量、评分等
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  hash: text("hash"), // 内容哈希，用于检测变化
});

// 教师表
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

// 教师等级历史记录
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

// 课程生产任务表
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

// 课程版本表
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

// 需要引用 skillCourses，确保在文件末尾导入或前向声明
import { skillCourses } from "./schema-lobster";

// ============================================
// 第三阶段：课程实际检验
// ============================================

// 学习行为事件表 (细粒度追踪)
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

// 退出点分析表
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

// 反馈表 (扩展现有 reviews)
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

// A/B 测试表
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

// 实验分组表
export const experimentAssignments = sqliteTable("experiment_assignments", {
  id: text("id").primaryKey(),
  experimentId: text("experiment_id").notNull().references(() => experiments.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull(),
  variant: text("variant").notNull(), // a, b
  assignedAt: integer("assigned_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 实验结果表
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

// 课程健康度表
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

// 自动改进任务表
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

// 课程淘汰记录表
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

// 教师绩效评估表
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

// 飞轮状态表
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

// 系统报告表
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

// Cron 任务日志表
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
```

---

## 三、API 路由清单

### 文件结构

```
src/app/api/
├── flywheel/                      # 飞轮系统 API
│   ├── status/
│   │   └── route.ts              # GET: 获取飞轮状态
│   ├── dashboard/
│   │   └── route.ts              # GET: 仪表盘数据
│   └── control/
│       └── route.ts              # POST: 控制飞轮(启动/暂停)
│
├── admin/
│   ├── teachers/                  # 教师管理
│   │   ├── route.ts              # GET: 列表, POST: 创建
│   │   ├── [id]/
│   │   │   └── route.ts          # GET/PUT/DELETE: 单个教师
│   │   └── invite/
│   │       └── route.ts          # POST: 发送邀请
│   │
│   ├── content-sources/           # 内容源管理
│   │   ├── route.ts              # GET: 列表, POST: 创建
│   │   └── [id]/
│   │       └── route.ts          # GET/PUT/DELETE
│   │
│   ├── production-jobs/           # 课程生产任务
│   │   ├── route.ts              # GET: 列表, POST: 创建
│   │   ├── [id]/
│   │   │   └── route.ts          # GET/PUT/DELETE
│   │   └── review/
│   │       └── route.ts          # POST: 审核任务
│   │
│   ├── experiments/               # A/B 测试管理
│   │   ├── route.ts              # GET: 列表, POST: 创建
│   │   ├── [id]/
│   │   │   └── route.ts          # GET/PUT/DELETE
│   │   └── [id]/
│   │       └── results/
│   │           └── route.ts      # GET: 获取结果
│   │
│   └── reports/                   # 系统报告
│       ├── route.ts              # GET: 列表
│       └── [id]/
│           └── route.ts          # GET: 详情
│
├── courses/
│   ├── [id]/
│   │   ├── health/
│   │   │   └── route.ts          # GET: 课程健康度
│   │   ├── feedback/
│   │   │   └── route.ts          # GET: 反馈列表, POST: 提交反馈
│   │   ├── versions/
│   │   │   └── route.ts          # GET: 版本历史
│   │   └── sunset/
│   │       └── route.ts          # POST: 发起淘汰流程
│   │
│   └── improvements/              # 改进任务
│       ├── route.ts              # GET: 列表
│       └── [id]/
│           ├── route.ts          # GET/PUT
│           └── apply/
│               └── route.ts      # POST: 应用改进
│
├── cron/                          # Cron 任务入口
│   ├── scan-sources/
│   │   └── route.ts              # 扫描内容源
│   ├── evaluate-content/
│   │   └── route.ts              # 评估内容质量
│   ├── produce-courses/
│   │   └── route.ts              # 生产课程
│   ├── analyze-health/
│   │   └── route.ts              # 分析健康度
│   ├── generate-reports/
│   │   └── route.ts              # 生成报告
│   ├── cleanup/
│   │   └── route.ts              # 清理任务
│   └── teacher-review/
│       └── route.ts              # 教师绩效评估
│
└── learning/
    ├── events/
    │   └── route.ts              # POST: 记录学习事件
    └── dropoff/
        └── route.ts              # GET: 退出点分析
```

### API 详细清单

| 模块 | 路由 | 方法 | 功能 | 认证 |
|------|------|------|------|------|
| **飞轮状态** | `/api/flywheel/status` | GET | 获取飞轮当前状态 | Admin |
| | `/api/flywheel/dashboard` | GET | 仪表盘聚合数据 | Admin |
| | `/api/flywheel/control` | POST | 控制飞轮状态 | Admin |
| **教师管理** | `/api/admin/teachers` | GET | 教师列表 | Admin |
| | `/api/admin/teachers` | POST | 创建教师 | Admin |
| | `/api/admin/teachers/[id]` | GET/PUT/DELETE | 教师 CRUD | Admin |
| | `/api/admin/teachers/invite` | POST | 发送邀请 | Admin |
| **内容源** | `/api/admin/content-sources` | GET/POST | 内容源列表/创建 | Admin |
| | `/api/admin/content-sources/[id]` | GET/PUT/DELETE | 内容源 CRUD | Admin |
| **生产任务** | `/api/admin/production-jobs` | GET/POST | 任务列表/创建 | Admin |
| | `/api/admin/production-jobs/[id]` | GET/PUT/DELETE | 任务 CRUD | Admin |
| | `/api/admin/production-jobs/review` | POST | 审核任务 | Admin |
| **A/B 测试** | `/api/admin/experiments` | GET/POST | 实验列表/创建 | Admin |
| | `/api/admin/experiments/[id]` | GET/PUT/DELETE | 实验 CRUD | Admin |
| | `/api/admin/experiments/[id]/results` | GET | 实验结果 | Admin |
| **报告** | `/api/admin/reports` | GET | 报告列表 | Admin |
| | `/api/admin/reports/[id]` | GET | 报告详情 | Admin |
| **课程健康** | `/api/courses/[id]/health` | GET | 课程健康度 | Public |
| | `/api/courses/[id]/feedback` | GET/POST | 反馈列表/提交 | User |
| | `/api/courses/[id]/versions` | GET | 版本历史 | Public |
| | `/api/courses/[id]/sunset` | POST | 发起淘汰 | Admin |
| **改进任务** | `/api/courses/improvements` | GET | 改进任务列表 | Admin |
| | `/api/courses/improvements/[id]` | GET/PUT | 改进任务详情 | Admin |
| | `/api/courses/improvements/[id]/apply` | POST | 应用改进 | Admin |
| **学习事件** | `/api/learning/events` | POST | 记录学习事件 | User |
| | `/api/learning/dropoff` | GET | 退出点分析 | Admin |
| **Cron 任务** | `/api/cron/scan-sources` | POST | 扫描内容源 | Cron Secret |
| | `/api/cron/evaluate-content` | POST | 评估内容质量 | Cron Secret |
| | `/api/cron/produce-courses` | POST | 生产课程 | Cron Secret |
| | `/api/cron/analyze-health` | POST | 分析健康度 | Cron Secret |
| | `/api/cron/generate-reports` | POST | 生成报告 | Cron Secret |
| | `/api/cron/cleanup` | POST | 清理任务 | Cron Secret |
| | `/api/cron/teacher-review` | POST | 教师绩效评估 | Cron Secret |

---

## 四、Cron 任务清单

### 任务配置

| 任务名称 | 频率 | 路由 | 功能描述 |
|---------|------|------|---------|
| `scan-sources` | 每日 02:00 | `/api/cron/scan-sources` | 扫描 ClawHub/SkillHub 新内容 |
| `evaluate-content` | 每日 04:00 | `/api/cron/evaluate-content` | 评估新内容质量分数 |
| `produce-courses` | 每日 06:00 | `/api/cron/produce-courses` | 处理生产队列，生成课程 |
| `analyze-health` | 每日 08:00 | `/api/cron/analyze-health` | 计算所有课程健康度 |
| `generate-daily-report` | 每日 09:00 | `/api/cron/generate-reports?type=daily` | 生成日报 |
| `generate-weekly-report` | 每周一 09:00 | `/api/cron/generate-reports?type=weekly` | 生成周报 |
| `generate-monthly-report` | 每月1日 09:00 | `/api/cron/generate-reports?type=monthly` | 生成月报 |
| `teacher-review` | 每月1日 10:00 | `/api/cron/teacher-review` | 教师绩效评估 |
| `cleanup` | 每日 03:00 | `/api/cron/cleanup` | 清理过期数据 |
| `sync-skillhub` | 每日 01:00 | `/api/cron/scan-sources?source=skillhub` | 同步 SkillHub |
| `sync-clawhub` | 每日 01:30 | `/api/cron/scan-sources?source=clawhub` | 同步 ClawHub |

### Cron 配置示例 (crontab)

```bash
# 龙虾大学飞轮系统 Cron 配置
# 时区: Asia/Shanghai

# 每日同步
0 1 * * * curl -X POST https://longxiadaxue.com/api/cron/scan-sources?source=skillhub -H "X-Cron-Secret: ${CRON_SECRET}"
30 1 * * * curl -X POST https://longxiadaxue.com/api/cron/scan-sources?source=clawhub -H "X-Cron-Secret: ${CRON_SECRET}"

# 内容处理
0 4 * * * curl -X POST https://longxiadaxue.com/api/cron/evaluate-content -H "X-Cron-Secret: ${CRON_SECRET}"
0 6 * * * curl -X POST https://longxiadaxue.com/api/cron/produce-courses -H "X-Cron-Secret: ${CRON_SECRET}"

# 健康度分析
0 8 * * * curl -X POST https://longxiadaxue.com/api/cron/analyze-health -H "X-Cron-Secret: ${CRON_SECRET}"

# 报告生成
0 9 * * * curl -X POST https://longxiadaxue.com/api/cron/generate-reports?type=daily -H "X-Cron-Secret: ${CRON_SECRET}"
0 9 * * 1 curl -X POST https://longxiadaxue.com/api/cron/generate-reports?type=weekly -H "X-Cron-Secret: ${CRON_SECRET}"
0 9 1 * * curl -X POST https://longxiadaxue.com/api/cron/generate-reports?type=monthly -H "X-Cron-Secret: ${CRON_SECRET}"

# 教师评估
0 10 1 * * curl -X POST https://longxiadaxue.com/api/cron/teacher-review -H "X-Cron-Secret: ${CRON_SECRET}"

# 清理
0 3 * * * curl -X POST https://longxiadaxue.com/api/cron/cleanup -H "X-Cron-Secret: ${CRON_SECRET}"
```

### Vercel Cron 配置 (vercel.json)

```json
{
  "crons": [
    {
      "path": "/api/cron/scan-sources",
      "schedule": "0 1 * * *"
    },
    {
      "path": "/api/cron/evaluate-content",
      "schedule": "0 4 * * *"
    },
    {
      "path": "/api/cron/produce-courses",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/analyze-health",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/generate-reports?type=daily",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 3 * * *"
    }
  ]
}
```

---

## 五、服务层代码结构

```
src/lib/flywheel/
├── index.ts                       # 统一导出
│
├── core/                          # 核心模块
│   ├── flywheel-machine.ts        # 飞轮状态机
│   ├── event-bus.ts               # 事件总线
│   └── queue.ts                   # 任务队列
│
├── scanner/                       # 第一阶段：扫描
│   ├── index.ts
│   ├── clawhub-scanner.ts         # ClawHub 扫描器
│   ├── skillhub-scanner.ts        # SkillHub 扫描器
│   ├── github-scanner.ts          # GitHub 扫描器
│   └── content-parser.ts          # SKILL.md 解析器
│
├── evaluator/                     # 第一阶段：评估
│   ├── index.ts
│   ├── quality-scorer.ts          # 质量评分器
│   └── teacher-matcher.ts         # 教师匹配器
│
├── producer/                      # 第二阶段：生产
│   ├── index.ts
│   ├── course-generator.ts        # 课程生成器
│   ├── ai-enhancer.ts             # AI 增强器
│   ├── exercise-generator.ts      # 练习题生成器
│   └── version-manager.ts         # 版本管理器
│
├── tracker/                       # 第三阶段：追踪
│   ├── index.ts
│   ├── learning-tracker.ts        # 学习行为追踪
│   ├── dropoff-analyzer.ts        # 退出点分析
│   └── feedback-collector.ts      # 反馈收集器
│
├── analyzer/                      # 第三阶段：分析
│   ├── index.ts
│   ├── health-calculator.ts       # 健康度计算器
│   ├── difficulty-analyzer.ts     # 难度分析器
│   └── experiment-manager.ts      # A/B 测试管理
│
├── improver/                      # 第四阶段：改进
│   ├── index.ts
│   ├── auto-fixer.ts              # 自动修复器
│   ├── sunset-manager.ts          # 淘汰管理器
│   └── teacher-evaluator.ts       # 教师评估器
│
├── reporter/                      # 第五阶段：报告
│   ├── index.ts
│   ├── daily-reporter.ts          # 日报生成器
│   ├── weekly-reporter.ts         # 周报生成器
│   └── monthly-reporter.ts        # 月报生成器
│
└── utils/
    ├── llm-client.ts              # LLM API 客户端
    ├── notifier.ts                # 通知服务 (邮件/Telegram)
    └── logger.ts                  # 日志工具
```

---

## 六、实施路线图

### 阶段一：基础架构 (Week 1-2)

**目标：搭建飞轮骨架，实现最小可运行版本**

#### Week 1: 数据库 + 核心 API

| 任务 | 预估 | 优先级 |
|------|------|--------|
| 创建 `schema-flywheel.ts` 并 migrate | 4h | P0 |
| 实现飞轮状态机 (`flywheel-machine.ts`) | 6h | P0 |
| 实现基础 Cron 框架 (`/api/cron/*`) | 4h | P0 |
| 实现内容源管理 API | 4h | P0 |
| 实现 Cron 任务日志记录 | 2h | P1 |

**交付物：**
- [x] 数据库表已创建
- [x] 飞轮状态可查询
- [x] Cron 任务可触发并记录日志

#### Week 2: 扫描 + 评估

| 任务 | 预估 | 优先级 |
|------|------|--------|
| 实现 ClawHub 扫描器 | 6h | P0 |
| 实现 SkillHub 扫描器 | 6h | P0 |
| 实现 SKILL.md 解析器 | 4h | P0 |
| 实现质量评分器 | 4h | P1 |
| 实现教师自动创建 | 3h | P1 |

**交付物：**
- [x] 可从 ClawHub/SkillHub 抓取新内容
- [x] 可解析 SKILL.md 提取元数据
- [x] 可计算内容质量分数

---

### 阶段二：课程生产管道 (Week 3-4)

**目标：实现 Skill → 课程的自动转化**

#### Week 3: 解析 + 增强

| 任务 | 预估 | 优先级 |
|------|------|--------|
| 实现课程生成器 | 6h | P0 |
| 实现 AI 增强器 (LLM 集成) | 8h | P0 |
| 实现练习题生成器 | 6h | P1 |
| 实现版本管理器 | 4h | P1 |

**交付物：**
- [x] 可从 SKILL.md 自动生成课程大纲
- [x] AI 可自动生成练习题
- [x] 课程版本可追踪

#### Week 4: 审核 + 发布

| 任务 | 预估 | 优先级 |
|------|------|--------|
| 实现质量审核 API | 4h | P0 |
| 实现自动发布逻辑 (score >= 85) | 3h | P0 |
| 实现人工审核队列 UI | 6h | P1 |
| 实现课程更新同步 | 4h | P1 |

**交付物：**
- [x] 高质量课程自动发布
- [x] 低质量课程进入审核队列
- [x] Skill 更新时课程同步更新

---

### 阶段三：课程检验系统 (Week 5-6)

**目标：实现学习行为追踪和反馈收集**

#### Week 5: 追踪 + 收集

| 任务 | 预估 | 优先级 |
|------|------|--------|
| 实现学习事件记录 API | 4h | P0 |
| 实现退出点分析器 | 4h | P1 |
| 扩展反馈系统 (多类型) | 4h | P0 |
| 实现反馈 AI 标签提取 | 4h | P2 |

**交付物：**
- [x] 可追踪学员学习行为
- [x] 可分析课程退出点
- [x] 可收集多维度反馈

#### Week 6: 分析 + A/B 测试

| 任务 | 预估 | 优先级 |
|------|------|--------|
| 实现健康度计算器 | 4h | P0 |
| 实现难度曲线分析 | 4h | P1 |
| 实现 A/B 测试框架 | 6h | P1 |
| 实现显著性检验 | 3h | P2 |

**交付物：**
- [x] 每日计算课程健康度
- [x] 可创建和管理 A/B 测试
- [x] 可自动判断测试结果

---

### 阶段四：反馈改进闭环 (Week 7-8)

**目标：实现自动改进和课程淘汰**

#### Week 7: 自动改进

| 任务 | 预估 | 优先级 |
|------|------|--------|
| 实现自动改进任务生成 | 4h | P0 |
| 实现 AI 内容补充生成 | 4h | P1 |
| 实现改进任务审核流程 | 4h | P1 |
| 实现改进效果追踪 | 3h | P2 |

**交付物：**
- [x] 低健康度课程自动生成改进任务
- [x] AI 可生成补充内容建议
- [x] 改进效果可追踪

#### Week 8: 淘汰 + 评估

| 任务 | 预估 | 优先级 |
|------|------|--------|
| 实现课程淘汰流程 | 4h | P0 |
| 实现教师绩效评估 | 4h | P1 |
| 实现教师晋级/降级 | 3h | P1 |
| 实现学员迁移通知 | 3h | P2 |

**交付物：**
- [x] 低质量课程自动进入淘汰流程
- [x] 教师每月自动评估
- [x] 教师等级可自动调整

---

### 阶段五：飞轮加速 (Week 9-10)

**目标：实现仪表盘和自动化报告**

#### Week 9: 仪表盘 + 监控

| 任务 | 预估 | 优先级 |
|------|------|--------|
| 实现飞轮仪表盘 API | 4h | P0 |
| 实现飞轮仪表盘 UI | 8h | P0 |
| 实现预警通知系统 | 4h | P1 |
| 实现飞轮状态自动切换 | 3h | P1 |

**交付物：**
- [x] 管理员可查看飞轮实时状态
- [x] 预警自动通知
- [x] 飞轮状态自动切换

#### Week 10: 报告 + 优化

| 任务 | 预估 | 优先级 |
|------|------|--------|
| 实现日报生成器 | 4h | P0 |
| 实现周报/月报生成器 | 4h | P1 |
| 实现报告自动发送 | 3h | P1 |
| 性能优化 + 测试 | 6h | P0 |

**交付物：**
- [x] 每日自动生成报告
- [x] 报告自动发送到指定渠道
- [x] 系统稳定运行

---

### 里程碑总览

```
Week 1-2  ─────► 阶段一完成 ─────► 飞轮可启动 (SPINNING_UP)
Week 3-4  ─────► 阶段二完成 ─────► 课程自动生产 (CRUISING)
Week 5-6  ─────► 阶段三完成 ─────► 学习数据闭环 (ACCELERATING)
Week 7-8  ─────► 阶段四完成 ─────► 自动改进上线 (ACCELERATING)
Week 9-10 ─────► 阶段五完成 ─────► 飞轮全速运转 (ACCELERATING)
```

---

## 七、关键技术决策

### 1. LLM 集成

**用途：**
- 课程内容增强 (生成大纲、补充内容)
- 练习题生成 (选择题、简答题)
- 反馈情感分析
- 改进建议生成

**推荐方案：**
- 主力模型：Claude 3.5 Sonnet (性价比高)
- 备用模型：GLM-4 (国内可用)
- 调用方式：通过 OpenClaw Gateway

### 2. 任务队列

**用途：**
- 课程生产任务异步处理
- 大量内容扫描时分批处理

**推荐方案：**
- 简单方案：数据库轮询 + 状态机
- 进阶方案：BullMQ + Redis (如需高并发)

### 3. 事件驱动

**用途：**
- 模块间解耦
- 实时更新仪表盘

**推荐方案：**
- 简单方案： EventEmitter (内存)
- 进阶方案：消息队列

### 4. 通知渠道

**用途：**
- 教师邀请
- 课程预警
- 系统报告

**推荐方案：**
- 邮件：Resend / SendGrid
- 即时消息：Telegram Bot
- 站内通知：数据库 + 轮询

---

## 八、监控与告警

### 关键指标

| 指标 | 阈值 | 告警级别 |
|------|------|---------|
| 飞轮健康度 | < 50 | Yellow |
| 飞轮健康度 | < 30 | Red |
| Cron 任务失败率 | > 10% | Yellow |
| Cron 任务失败率 | > 30% | Red |
| 课程生产队列积压 | > 100 | Yellow |
| 低健康度课程数 | > 10 | Yellow |
| 教师响应时间 | > 7 天 | Yellow |

### 告警渠道

- **Yellow**: 站内通知 + 日报汇总
- **Red**: 即时通知 (Telegram/邮件)

---

## 九、安全考虑

### 1. Cron 任务认证

所有 Cron 端点需要验证 `X-Cron-Secret` header：

```typescript
const cronSecret = request.headers.get("X-Cron-Secret");
if (cronSecret !== process.env.CRON_SECRET) {
  return new Response("Unauthorized", { status: 401 });
}
```

### 2. 敏感数据加密

- API Key 使用 AES-256 加密存储
- 教师邮箱脱敏展示

### 3. 速率限制

- Cron 端点：每分钟最多 1 次调用
- 公开 API：按 IP 限流

---

## 十、后续优化方向

1. **多语言支持**：自动翻译课程内容
2. **个性化推荐**：基于学员画像推荐课程
3. **社区驱动**：允许学员提交课程改进建议
4. **知识图谱**：构建技能之间的关联图谱
5. **学习路径优化**：基于数据优化学习顺序

---

*文档版本: 1.0.0 | 最后更新: 2026-03-13*
