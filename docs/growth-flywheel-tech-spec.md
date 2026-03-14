# 龙虾大学增长飞轮技术实现方案

## 1. 现有代码库分析

### 1.1 项目结构
```
lobster-university/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   ├── (pages)/           # 页面组件
│   │   └── layout.tsx         # 根布局
│   ├── components/            # React 组件
│   ├── lib/
│   │   ├── db/               # 数据库 schema & 连接
│   │   ├── services/         # 业务逻辑服务
│   │   ├── auth.ts           # Better Auth 配置
│   │   └── utils.ts          # 工具函数
│   └── hooks/                # 自定义 hooks
├── scripts/                   # 脚本工具
└── package.json
```

### 1.2 技术栈确认
- **框架**: Next.js 16.1.6 (App Router)
- **语言**: TypeScript 5
- **数据库**: SQLite + Drizzle ORM
- **认证**: Better Auth (支持邮箱/密码、Google、GitHub)
- **样式**: Tailwind CSS 4
- **UI组件**: Radix UI + 自定义组件
- **状态**: Zustand + React Query

### 1.3 现有数据库表结构

#### 核心表 (schema.ts)
| 表名 | 用途 | 关键字段 |
|------|------|----------|
| `users` | 用户基础信息 | level, exp, streak, totalStudyTime |
| `sessions/accounts/verifications` | Better Auth | - |
| `courses` | 核心课程 (51门) | category, level, source, published |
| `chapters` | 课程章节 | content (MDX), order |
| `progress` | 学习进度 | completed, lastAccessedAt |
| `enrollments` | 课程注册 | progress (百分比) |
| `reviews` | 课程评价 | rating (1-5) |
| `achievements` | 成就系统 | type, metadata (JSON) |

#### 龙虾大学扩展表 (schema-lobster.ts)
| 表名 | 用途 | 关键字段 |
|------|------|----------|
| `careerTracks` | 职业方向 | capabilities, portfolioRequirements |
| `lobsterProfiles` | 学员档案 | studentId, accessToken, careerTrackId |
| `studyLogs` | 学习记录 | duration, deliverable |
| `portfolios` | 作品集 | status (draft/submitted/verified) |
| `certifications` | 认证申请 | level (1-5), status |
| `certificates` | 证书 | verifyUrl, expiresAt |
| `assessments` | 能力评估 | dimension, score |
| `streakRecords` | 连续学习 | date, studyMinutes, goalMet |
| `skillCourses` | 技能课程 (67门) | module, lessons (JSON) |
| `studentCourses` | 学员选课 | status, progress |

### 1.4 现有增长相关功能

✅ **已实现**
- 基础认证系统 (邮箱/密码 + 社交登录预留)
- 成就系统 (15种成就，含经验值)
- 连续学习记录 (streak)
- 证书生成与验证
- 基础统计 API (/api/admin/stats, /api/stats)
- 课程同步脚本 (scripts/sync-clawhub.ts - Mock 数据)
- Cron 同步端点 (/api/cron/sync)

⚠️ **部分实现/需完善**
- ClawHub 同步：目前使用 Mock 数据，需接入真实 API
- SEO：仅有基础 meta，无动态 OG、结构化数据
- 邀请系统：无
- 数据分析：仅基础统计，无用户行为追踪
- 推荐算法：无

❌ **缺失**
- 邀请码系统
- 用户行为事件追踪
- 留存率计算
- 邮件/通知系统
- A/B 测试框架

---

## 2. 自动化课程管道设计

### 2.1 数据流架构

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  ClawHub    │────▶│  Skill Parser │────▶│  AI Generator │
│   API       │     │  (Metadata)   │     │  (Curriculum) │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                │
                       ┌────────────────────────┘
                       ▼
              ┌─────────────────┐
              │  Quality Gate   │
              │  (Review/Auto)  │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ Approve  │ │  Revise  │ │  Reject  │
   └────┬─────┘ └────┬─────┘ └────┬─────┘
        │            │            │
        ▼            ▼            ▼
   ┌─────────────────────────────────────┐
   │      Publish to skill_courses       │
   └─────────────────────────────────────┘
```

### 2.2 技术实现

#### A. ClawHub API 集成
```typescript
// src/lib/services/clawhub-client.ts
interface ClawHubSkill {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
  downloads: number;
  rating: number;
  skillPath: string; // SKILL.md 文件路径
  githubUrl?: string;
}

class ClawHubClient {
  async fetchLatestSkills(since?: Date): Promise<ClawHubSkill[]>;
  async fetchSkillDetail(skillId: string): Promise<ClawHubSkill & { readme: string }>;
}
```

#### B. SKILL.md 解析器
```typescript
// src/lib/services/skill-parser.ts
interface ParsedSkill {
  name: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // 分钟
  objectives: string[];
  lessons: Lesson[];
  prerequisites: string[];
  metadata: {
    author: string;
    version: string;
    tags: string[];
  };
}

class SkillParser {
  parse(skillMdContent: string): ParsedSkill;
  extractCodeExamples(content: string): CodeExample[];
  validate(parsed: ParsedSkill): ValidationResult;
}
```

#### C. AI 课程生成器 (可选增强)
```typescript
// src/lib/services/curriculum-generator.ts
// 使用 LLM 将 SKILL.md 转换为结构化课程
// 输入: SKILL.md + 示例课程
// 输出: lessons JSON, 练习题, 项目作业
```

#### D. 质量控制机制

| 层级 | 机制 | 实现方式 |
|------|------|----------|
| L1 自动过滤 | 基础质量筛选 | downloads > 100, rating >= 4.0 |
| L2 内容验证 | 结构完整性 | 必填字段检查、Markdown 语法验证 |
| L3 重复检测 | 相似度比对 | 标题/描述相似度 < 80% |
| L4 人工审核 | 重要课程 | 标记为 featured 的课程需人工确认 |

#### E. 同步任务调度
```typescript
// src/app/api/cron/sync-clawhub/route.ts
// 每小时检查一次 ClawHub 更新
// 使用 Vercel Cron 或外部调度器触发

export async function GET(req: NextRequest) {
  // 1. 验证 token
  // 2. 获取 ClawHub 最新 skills
  // 3. 筛选高质量 skills
  // 4. 解析并转换
  // 5. 写入 skill_courses 表 (draft 状态)
  // 6. 发送通知 (可选)
}
```

### 2.3 数据库变更

```sql
-- 添加同步相关字段
ALTER TABLE skill_courses ADD COLUMN source VARCHAR(50); -- 'clawhub', 'manual'
ALTER TABLE skill_courses ADD COLUMN source_id VARCHAR(100);
ALTER TABLE skill_courses ADD COLUMN sync_status VARCHAR(20); -- 'pending', 'approved', 'rejected'
ALTER TABLE skill_courses ADD COLUMN synced_at TIMESTAMP;
ALTER TABLE skill_courses ADD COLUMN reviewed_by VARCHAR(50);
ALTER TABLE skill_courses ADD COLUMN auto_generated BOOLEAN DEFAULT FALSE;
```

---

## 3. 用户增长技术方案

### 3.1 注册/登录流程优化

#### 当前问题
- 仅支持邮箱注册，流程较长
- 无社交登录引导
- 注册后无明确下一步

#### 优化方案

**A. 社交登录优先**
```typescript
// src/app/login/page.tsx 优化
// 1. Google/GitHub 登录按钮前置
// 2. 邮箱注册折叠/后置
// 3. 一键注册流程 (获取邮箱后自动创建账户)
```

**B. 注册后引导 (Onboarding)**
```
注册成功
  ├──▶ 选择职业方向 (careerTracks)
  ├──▶ 设置每日学习目标
  ├──▶ 推荐第一门课程
  └──▶ 完成首个任务 (解锁成就)
```

**C. 渐进式资料收集**
```typescript
// 不一次性要求填写所有信息
// 在关键节点触发：
// - 首次提交作品时询问昵称
// - 首次申请认证时完善资料
// - 首次分享时确认头像
```

### 3.2 邀请码系统

#### 数据模型
```typescript
// schema-lobster.ts 新增
export const inviteCodes = sqliteTable("invite_codes", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(), // 如: LOBSTER-2026
  createdBy: text("created_by").references(() => users.id),
  
  // 使用限制
  maxUses: integer("max_uses").default(10),
  usedCount: integer("used_count").default(0),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  
  // 奖励设置
  inviterReward: integer("inviter_reward").default(100), // 经验值
  inviteeReward: integer("invitee_reward").default(50),
  
  status: text("status").default("active"), // active, expired, disabled
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const inviteUsages = sqliteTable("invite_usages", {
  id: text("id").primaryKey(),
  codeId: text("code_id").notNull().references(() => inviteCodes.id),
  usedBy: text("used_by").notNull().references(() => users.id),
  usedAt: integer("used_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  rewardGiven: integer("reward_given", { mode: "boolean" }).default(false),
});
```

#### 核心功能
```typescript
// src/lib/services/invite-service.ts
class InviteService {
  // 生成邀请码
  async generateCode(userId: string, options?: GenerateOptions): Promise<InviteCode>;
  
  // 验证并使用邀请码
  async useCode(code: string, newUserId: string): Promise<UseResult>;
  
  // 获取用户邀请统计
  async getUserInviteStats(userId: string): Promise<{
    totalInvited: number;
    totalRewards: number;
    activeCodes: InviteCode[];
  }>;
  
  // 生成分享链接 (带 tracking)
  async generateShareLink(userId: string, channel: 'wechat' | 'weibo' | 'copy'): Promise<string>;
}
```

#### 分享页面
```
/course/[id]?ref=USER_ID          # 课程分享
/invite/[code]                    # 邀请注册页
/certification/verify/[id]        # 证书分享 (已存在)
```

### 3.3 学习进度追踪增强

#### 现有基础上增加
```typescript
// 新增表: 详细学习事件
export const learningEvents = sqliteTable("learning_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  eventType: text("event_type").notNull(), // 'lesson_start', 'lesson_complete', 'video_play', 'exercise_submit'
  courseId: text("course_id"),
  lessonId: text("lesson_id"),
  metadata: text("metadata"), // JSON: { duration, score, etc. }
  sessionId: text("session_id"), // 用于关联同一学习会话
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 学习会话表 (用于计算单次学习时长)
export const studySessions = sqliteTable("study_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  startedAt: integer("started_at", { mode: "timestamp" }),
  endedAt: integer("ended_at", { mode: "timestamp" }),
  totalDuration: integer("total_duration"), // 分钟
  coursesAccessed: text("courses_accessed"), // JSON array
});
```

### 3.4 证书生成与分享优化

#### 现有功能
- ✅ 证书生成 (PNG/PDF)
- ✅ 验证页面
- ⚠️ 社交分享 (需增强)

#### 增强方案
```typescript
// 1. 动态 OG 图片生成
// /api/og/certificate/[id].tsx
// 生成 1200x630 的证书预览图，用于社交分享

// 2. 证书分享元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cert = await getCertificate(params.id);
  return {
    title: `${cert.profileName} 获得 ${cert.levelName} 认证`,
    description: `龙虾大学 ${cert.trackName} 方向能力认证`,
    openGraph: {
      images: [`/api/og/certificate/${params.id}`],
    },
  };
}

// 3. 一键分享按钮
// 微信分享、微博分享、生成海报
```

### 3.5 SEO 优化

#### A. 动态 Sitemap
```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getAllPublishedCourses();
  const tracks = await getAllCareerTracks();
  
  return [
    { url: 'https://longxiadaxue.com', priority: 1.0 },
    { url: 'https://longxiadaxue.com/courses', priority: 0.9 },
    ...courses.map(c => ({
      url: `https://longxiadaxue.com/courses/${c.id}`,
      priority: 0.8,
      lastModified: c.updatedAt,
    })),
    ...tracks.map(t => ({
      url: `https://longxiadaxue.com/tracks/${t.code}`,
      priority: 0.7,
    })),
  ];
}
```

#### B. 结构化数据 (JSON-LD)
```typescript
// 课程页面添加 Course 结构化数据
// 证书验证页面添加 EducationalOccupationalCredential
```

#### C. 页面级 Meta 优化
```typescript
// src/app/courses/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse(params.id);
  return {
    title: `${course.title} - 龙虾大学`,
    description: course.description,
    keywords: course.tags,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [course.coverImage || '/default-course.jpg'],
    },
  };
}
```

---

## 4. 数据追踪方案

### 4.1 用户行为事件追踪

#### 事件类型定义
```typescript
// src/lib/analytics/events.ts
export const AnalyticsEvents = {
  // 用户生命周期
  USER_REGISTERED: 'user_registered',
  USER_LOGIN: 'user_login',
  USER_ONBOARDING_COMPLETED: 'user_onboarding_completed',
  
  // 课程相关
  COURSE_VIEW: 'course_view',
  COURSE_ENROLL: 'course_enroll',
  LESSON_START: 'lesson_start',
  LESSON_COMPLETE: 'lesson_complete',
  COURSE_COMPLETE: 'course_complete',
  
  // 学习行为
  STUDY_SESSION_START: 'study_session_start',
  STUDY_SESSION_END: 'study_session_end',
  EXERCISE_SUBMIT: 'exercise_submit',
  
  // 作品集
  PORTFOLIO_CREATE: 'portfolio_create',
  PORTFOLIO_SUBMIT: 'portfolio_submit',
  
  // 认证
  CERTIFICATION_APPLY: 'certification_apply',
  CERTIFICATION_APPROVE: 'certification_approve',
  CERTIFICATE_SHARE: 'certificate_share',
  
  // 邀请
  INVITE_CODE_USED: 'invite_code_used',
  SHARE_LINK_CLICK: 'share_link_click',
} as const;
```

#### 追踪实现
```typescript
// src/lib/analytics/track.ts
interface TrackOptions {
  userId?: string;
  anonymousId?: string;
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

class Analytics {
  async track(options: TrackOptions): Promise<void> {
    // 1. 写入本地数据库 (analytics_events 表)
    // 2. 发送到外部分析平台 (可选: GA4, Mixpanel)
    // 3. 实时处理 (触发自动化工作流)
  }
  
  // 页面浏览追踪
  pageview(path: string, properties?: Record<string, any>): void;
  
  // 用户属性更新
  identify(userId: string, traits: Record<string, any>): void;
}

export const analytics = new Analytics();
```

#### 数据库表
```sql
CREATE TABLE analytics_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  anonymous_id TEXT,
  event_type TEXT NOT NULL,
  properties TEXT, -- JSON
  session_id TEXT,
  created_at INTEGER
);

CREATE INDEX idx_analytics_user ON analytics_events(user_id, created_at);
CREATE INDEX idx_analytics_event ON analytics_events(event_type, created_at);
```

### 4.2 课程完成率计算

```typescript
// src/lib/analytics/metrics.ts
class CourseMetrics {
  // 课程维度完成率
  async getCourseCompletionRate(courseId: string): Promise<{
    enrolled: number;
    started: number;
    completed: number;
    completionRate: number;
  }>;
  
  // 用户维度完成率
  async getUserCompletionRate(userId: string): Promise<{
    totalEnrolled: number;
    totalCompleted: number;
    overallRate: number;
    byCategory: Record<string, number>;
  }>;
  
  //  cohort 分析
  async getCohortCompletion(cohortDate: Date): Promise<{
    cohort: string; // '2026-03'
    enrolled: number;
    d7: number; // 7日完成率
    d30: number; // 30日完成率
    d90: number; // 90日完成率
  }>;
}
```

### 4.3 留存率计算

```typescript
// src/lib/analytics/retention.ts
class RetentionAnalysis {
  // 计算 N 日留存率
  async calculateRetention(cohortDate: Date, days: number[]): Promise<{
    cohort: string;
    totalUsers: number;
    retention: Record<number, number>; // { 1: 0.45, 7: 0.32, 30: 0.15 }
  }>;
  
  // 学习留存 (基于学习行为而非仅登录)
  async calculateLearningRetention(cohortDate: Date): Promise<{
    cohort: string;
    week1Active: number;
    week2Active: number;
    week4Active: number;
  }>;
  
  // 生成留存热力图数据
  async getRetentionHeatmap(): Promise<RetentionHeatmapData>;
}
```

### 4.4 简单推荐算法

#### 基于内容的推荐
```typescript
// src/lib/recommendations/content-based.ts
class ContentBasedRecommendation {
  async recommendForUser(userId: string, limit: number = 5): Promise<Course[]> {
    // 1. 获取用户已学课程
    const completedCourses = await this.getCompletedCourses(userId);
    
    // 2. 提取用户兴趣标签
    const userTags = this.extractUserTags(completedCourses);
    
    // 3. 计算课程相似度 (TF-IDF / 标签匹配)
    const candidates = await this.getCandidateCourses(userId);
    const scored = candidates.map(course => ({
      course,
      score: this.calculateSimilarity(userTags, course.tags),
    }));
    
    // 4. 返回 top N
    return scored.sort((a, b) => b.score - a.score).slice(0, limit).map(s => s.course);
  }
}
```

#### 协同过滤 (简化版)
```typescript
// src/lib/recommendations/collaborative.ts
class CollaborativeFiltering {
  async recommendForUser(userId: string, limit: number = 5): Promise<Course[]> {
    // 1. 找到相似用户 (基于课程重叠度)
    const similarUsers = await this.findSimilarUsers(userId, k: 10);
    
    // 2. 收集相似用户学过的课程
    const recommendations = new Map<string, number>();
    
    for (const { userId: similarId, similarity } of similarUsers) {
      const theirCourses = await this.getCompletedCourses(similarId);
      for (const course of theirCourses) {
        const current = recommendations.get(course.id) || 0;
        recommendations.set(course.id, current + similarity);
      }
    }
    
    // 3. 过滤已学课程，排序返回
    const userCourses = new Set((await this.getCompletedCourses(userId)).map(c => c.id));
    return Array.from(recommendations.entries())
      .filter(([id]) => !userCourses.has(id))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => this.getCourse(id));
  }
}
```

#### 混合推荐
```typescript
// src/lib/recommendations/hybrid.ts
class HybridRecommendation {
  async recommend(userId: string): Promise<Course[]> {
    const contentBased = await this.contentBased.recommendForUser(userId, 10);
    const collaborative = await this.collaborative.recommendForUser(userId, 10);
    
    // 加权融合
    const merged = this.mergeScores(contentBased, collaborative, weights: {
      content: 0.6,
      collaborative: 0.4,
    });
    
    // 添加多样性
    return this.diversify(merged, maxPerCategory: 2);
  }
}
```

---

## 5. 技术任务清单

### P0 - 核心增长功能 (1-2 周)

| 优先级 | 任务 | 文件路径 | 变更描述 | 预估工时 | 依赖 |
|--------|------|----------|----------|----------|------|
| P0 | 邀请码系统 - 数据模型 | `src/lib/db/schema-lobster.ts` | 新增 inviteCodes, inviteUsages 表 | 2h | - |
| P0 | 邀请码服务 | `src/lib/services/invite-service.ts` | 实现生成、验证、使用逻辑 | 4h | 数据模型 |
| P0 | 邀请码 API | `src/app/api/invite/route.ts` | POST 生成, GET 验证 | 3h | 服务层 |
| P0 | 注册页集成邀请码 | `src/app/signup/page.tsx` | 添加邀请码输入框, 自动填充 | 2h | API |
| P0 | 用户邀请统计 | `src/app/api/invite/stats/route.ts` | 获取用户邀请数据 | 2h | 服务层 |
| P0 | 分享链接生成 | `src/lib/services/invite-service.ts` | 添加 generateShareLink 方法 | 2h | - |

### P1 - SEO & 可发现性 (1 周)

| 优先级 | 任务 | 文件路径 | 变更描述 | 预估工时 | 依赖 |
|--------|------|----------|----------|----------|------|
| P1 | 动态 Sitemap | `src/app/sitemap.ts` | 生成课程/职业方向 sitemap | 2h | - |
| P1 | 课程页面 Meta | `src/app/courses/[id]/page.tsx` | 添加 generateMetadata | 2h | - |
| P1 | 证书 OG 图片 | `src/app/api/og/certificate/[id]/route.tsx` | 使用 @vercel/og 生成分享图 | 4h | - |
| P1 | 结构化数据 | `src/components/seo/json-ld.tsx` | 添加 Course/Credential 结构化数据 | 3h | - |
| P1 | robots.txt | `src/app/robots.ts` | 配置爬虫规则 | 1h | - |

### P2 - 数据追踪 (1-2 周)

| 优先级 | 任务 | 文件路径 | 变更描述 | 预估工时 | 依赖 |
|--------|------|----------|----------|----------|------|
| P2 | 事件追踪表 | `src/lib/db/schema-lobster.ts` | 新增 analytics_events 表 | 1h | - |
| P2 | 追踪服务 | `src/lib/analytics/track.ts` | 实现 Analytics 类 | 3h | 数据模型 |
| P2 | 页面浏览追踪 | `src/components/analytics/page-tracker.tsx` | 自动追踪页面浏览 | 2h | 追踪服务 |
| P2 | 关键事件埋点 | 多处 | 在注册、选课、完成等关键节点埋点 | 4h | 追踪服务 |
| P2 | 完成率计算 API | `src/app/api/analytics/completion/route.ts` | 课程/用户完成率统计 | 3h | 追踪数据 |
| P2 | 留存率计算 API | `src/app/api/analytics/retention/route.ts` | cohort 留存分析 | 4h | 追踪数据 |

### P3 - ClawHub 自动化 (1-2 周)

| 优先级 | 任务 | 文件路径 | 变更描述 | 预估工时 | 依赖 |
|--------|------|----------|----------|----------|------|
| P3 | ClawHub API 客户端 | `src/lib/services/clawhub-client.ts` | 封装 ClawHub API 调用 | 3h | - |
| P3 | SKILL.md 解析器 | `src/lib/services/skill-parser.ts` | 解析并验证 SKILL.md 格式 | 4h | - |
| P3 | 同步 Cron API | `src/app/api/cron/sync-clawhub/route.ts` | 定时同步任务 | 4h | 客户端+解析器 |
| P3 | 课程表扩展 | `src/lib/db/schema-lobster.ts` | 添加 source, sync_status 等字段 | 1h | - |
| P3 | 质量检查服务 | `src/lib/services/quality-gate.ts` | 实现自动质量筛选 | 3h | 解析器 |
| P3 | 管理后台审核 | `src/app/admin/courses/page.tsx` | 待审核课程列表 | 4h | 质量检查 |

### P4 - 推荐系统 (1 周)

| 优先级 | 任务 | 文件路径 | 变更描述 | 预估工时 | 依赖 |
|--------|------|----------|----------|----------|------|
| P4 | 基于内容推荐 | `src/lib/recommendations/content-based.ts` | 实现标签匹配推荐 | 4h | - |
| P4 | 推荐 API | `src/app/api/recommendations/route.ts` | 获取个性化推荐 | 2h | 推荐算法 |
| P4 | 首页推荐组件 | `src/components/home/recommended-courses.tsx` | 展示推荐课程 | 3h | API |
| P4 | 协同过滤 (可选) | `src/lib/recommendations/collaborative.ts` | 基于用户相似度推荐 | 6h | 数据积累 |

### P5 - 优化增强 (持续)

| 优先级 | 任务 | 文件路径 | 变更描述 | 预估工时 | 依赖 |
|--------|------|----------|----------|----------|------|
| P5 | 邮件服务集成 | `src/lib/services/email-service.ts` | 接入 Resend/SendGrid | 4h | - |
| P5 | 学习提醒邮件 | `src/app/api/cron/daily-reminder/route.ts` | 每日学习提醒 | 3h | 邮件服务 |
| P5 | A/B 测试框架 | `src/lib/experiments/index.ts` | 实验分组逻辑 | 4h | - |
| P5 | 性能监控 | `src/lib/monitoring/index.ts` | 核心指标监控 | 3h | - |

---

## 6. 实施建议

### 阶段一 (第1-2周): 增长基础
1. 完成邀请码系统 (P0)
2. 完成基础 SEO (P1)
3. 上线后观察数据

### 阶段二 (第3-4周): 数据驱动
1. 完成数据追踪 (P2)
2. 建立数据看板
3. 基于数据优化邀请流程

### 阶段三 (第5-6周): 内容自动化
1. 接入 ClawHub API
2. 建立自动同步管道
3. 质量审核流程

### 阶段四 (第7-8周): 智能推荐
1. 上线推荐系统
2. A/B 测试优化
3. 持续迭代

### 技术债务注意
- 保持 SQLite 单文件，监控大小增长 (>500MB 考虑迁移)
- Cron 任务考虑使用外部调度器 (如 GitHub Actions)
- 图片资源考虑接入 CDN

---

## 7. 关键指标 (North Star Metrics)

| 指标 | 当前 | 目标 (3个月) | 追踪方式 |
|------|------|-------------|----------|
| 月活跃用户 (MAU) | - | 1000+ | analytics_events |
| 注册转化率 | - | >20% | inviteUsages / 访问量 |
| 课程完成率 | - | >30% | studentCourses.status |
| 7日留存率 | - | >40% | retention analysis |
| 邀请系数 (K-factor) | - | >0.3 | inviteUsages 统计 |
| 平均学习时长 | - | >60分钟/周 | studyLogs |

---

*文档生成时间: 2026-03-13*
*版本: v1.0*
