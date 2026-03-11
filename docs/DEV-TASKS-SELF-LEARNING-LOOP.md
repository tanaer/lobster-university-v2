# 龙虾大学 - 自主学习循环开发任务

## 📋 任务清单

### 任务 1: 能力评估系统 (Assessment System)

**优先级**: P0
**部门**: 学习部

**需要创建的文件**:

1. `src/lib/services/assessment-service.ts`
   - 五维能力评估逻辑
   - 生成雷达图报告
   - 弱项分析算法

2. `src/app/api/assessment/route.ts`
   - POST: 提交评估答案
   - GET: 获取评估报告

3. `src/app/assessment/page.tsx`
   - 五维评估问卷页面
   - 雷达图展示

**数据库表** (已在 schema-lobster.ts 中):
- `assessments` - 评估记录
- `assessment_results` - 评估结果

---

### 任务 2: 每日学习提醒系统 (Daily Reminder)

**优先级**: P0
**部门**: 学习部

**需要创建的文件**:

1. `src/lib/services/reminder-service.ts`
   - 计算学习连续天数
   - 生成每日学习建议
   - 检查学习目标完成情况

2. `src/app/api/reminder/route.ts`
   - GET: 获取今日提醒
   - POST: 设置提醒偏好

3. `src/components/dashboard/daily-reminder.tsx`
   - 首页每日提醒组件
   - 显示连续学习天数
   - 今日学习建议

---

### 任务 3: 作品提交系统 (Portfolio Submission)

**优先级**: P1
**部门**: 作品部

**需要创建的文件**:

1. `src/lib/services/portfolio-service.ts`
   - 作品提交逻辑
   - 证据链验证
   - 质量评分算法

2. `src/app/api/portfolio/route.ts`
   - POST: 提交作品
   - GET: 获取作品集
   - PATCH: 更新作品

3. `src/app/portfolio/page.tsx`
   - 作品集展示页面
   - 提交作品表单

4. `src/app/portfolio/[id]/page.tsx`
   - 作品详情页面
   - 证据链展示

---

### 任务 4: 能力认证系统 (Certification)

**优先级**: P1
**部门**: 认证部

**需要创建的文件**:

1. `src/lib/services/certification-service.ts`
   - 检查认证条件
   - 生成证书
   - 验证证书

2. `src/app/api/certification/route.ts`
   - POST: 申请认证
   - GET: 获取认证状态
   - POST: 生成证书

3. `src/app/certification/page.tsx`
   - 认证申请页面
   - 条件检查清单
   - 证书展示

4. `src/app/certification/verify/[id]/page.tsx`
   - 证书验证页面

---

### 任务 5: 主人炫耀系统 (Showoff)

**优先级**: P2
**部门**: 社区部

**需要创建的文件**:

1. `src/lib/services/showoff-service.ts`
   - 生成分享海报
   - 生成炫耀文案
   - 社交媒体分享链接

2. `src/app/api/showoff/route.ts`
   - POST: 生成炫耀海报
   - GET: 获取分享模板

3. `src/app/showoff/page.tsx`
   - 炫耀海报生成页面
   - 分享到社交媒体

---

## 🗄️ 数据库 Schema 补充

需要在 `src/lib/db/schema-lobster.ts` 中添加以下表:

```typescript
// 能力评估表
export const assessments = sqliteTable("assessments", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull(),
  dimension: text("dimension").notNull(), // task_completion, portfolio_quality, learning_efficiency, autonomy, job_match
  score: integer("score").notNull(), // 0-100
  answers: text("answers"), // JSON
  assessedAt: integer("assessed_at", { mode: "timestamp" }).notNull(),
});

// 作品集表
export const portfolios = sqliteTable("portfolios", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // document, code, design, analysis, etc.
  capabilityId: text("capability_id"),
  evidenceUrl: text("evidence_url"),
  evidenceType: text("evidence_type"), // link, file, screenshot
  qualityScore: integer("quality_score"), // 0-100
  status: text("status").notNull().default("pending"), // pending, verified, rejected
  submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
  verifiedAt: integer("verified_at", { mode: "timestamp" }),
});

// 认证记录表
export const certifications = sqliteTable("certifications", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull(),
  trackId: text("track_id").notNull(),
  level: integer("level").notNull(), // 1-5
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  appliedAt: integer("applied_at", { mode: "timestamp" }).notNull(),
  approvedAt: integer("approved_at", { mode: "timestamp" }),
  certificateId: text("certificate_id"),
});

// 证书表
export const certificates = sqliteTable("certificates", {
  id: text("id").primaryKey(),
  certificationId: text("certification_id").notNull(),
  profileId: text("profile_id").notNull(),
  trackId: text("track_id").notNull(),
  level: integer("level").notNull(),
  issuedAt: integer("issued_at", { mode: "timestamp" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  verifyUrl: text("verify_url").notNull(),
});
```

---

## 🎨 UI 组件需求

### 1. 雷达图组件 (RadarChart)

```typescript
// src/components/ui/radar-chart.tsx
interface RadarChartProps {
  dimensions: {
    name: string;
    score: number;
    maxScore: number;
  }[];
  size?: number;
}
```

### 2. 进度环组件 (ProgressRing)

```typescript
// src/components/ui/progress-ring.tsx
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}
```

### 3. 证据链组件 (EvidenceChain)

```typescript
// src/components/portfolio/evidence-chain.tsx
interface EvidenceChainProps {
  evidences: {
    type: string;
    title: string;
    url?: string;
    verified: boolean;
  }[];
}
```

---

## 📦 技术栈

- **前端**: React 19 + Next.js 16 + TypeScript + Tailwind CSS + Framer Motion
- **后端**: Next.js API Routes + Drizzle ORM
- **数据库**: SQLite
- **图表**: Recharts (雷达图)
- **证书生成**: @react-pdf/renderer 或 HTML to Image

---

## 🚀 开发顺序

1. **Phase 1 (本周)**: 能力评估 + 每日提醒
2. **Phase 2 (下周)**: 作品提交 + 证据链
3. **Phase 3 (第三周)**: 能力认证 + 证书生成
4. **Phase 4 (第四周)**: 主人炫耀 + 社区分享

---

## ✅ 验收标准

### 能力评估系统
- [ ] 五维评估问卷可用
- [ ] 雷达图正确展示
- [ ] 弱项分析准确
- [ ] 数据持久化到数据库

### 每日提醒系统
- [ ] 正确计算连续学习天数
- [ ] 每日学习建议相关
- [ ] 提醒数据持久化

### 作品提交系统
- [ ] 作品可提交
- [ ] 证据链可验证
- [ ] 质量评分算法合理

### 能力认证系统
- [ ] 认证条件检查准确
- [ ] 证书生成成功
- [ ] 证书验证页面可用

### 主人炫耀系统
- [ ] 海报生成成功
- [ ] 分享链接可用
- [ ] 炫耀文案吸引人
