# 教务飞轮系统 - 快速实施指南

## 一、系统概览

```
┌─────────────────────────────────────────────────────────────────┐
│                    教务自我迭代飞轮                              │
│                                                                 │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│   │ 教师招聘 │ → │ 课程生产 │ → │ 课程检验 │ → │ 反馈改进 │   │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘   │
│         ↑                                              │        │
│         └──────────────────────────────────────────────┘        │
│                         ♻️ 闭环                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 二、核心文件

| 文件 | 用途 |
|------|------|
| `docs/edu-flywheel-design.md` | 完整设计文档 (58KB) |
| `src/lib/db/schema-flywheel.ts` | 数据库 Schema (21KB) |

## 三、新增数据库表 (21张)

### 第一阶段：教师招聘
| 表名 | 用途 |
|------|------|
| `content_sources` | 内容源配置 (ClawHub/SkillHub/GitHub) |
| `raw_content_snapshots` | 原始内容快照 |
| `teachers` | 教师档案 |
| `teacher_level_history` | 教师等级历史 |

### 第二阶段：课程生产
| 表名 | 用途 |
|------|------|
| `course_production_jobs` | 课程生产任务 |
| `course_versions` | 课程版本管理 |

### 第三阶段：课程检验
| 表名 | 用途 |
|------|------|
| `learning_events` | 学习行为事件 |
| `dropoff_points` | 退出点分析 |
| `course_feedbacks` | 课程反馈 |
| `experiments` | A/B 测试 |
| `experiment_assignments` | 实验分组 |
| `experiment_results` | 实验结果 |

### 第四阶段：反馈改进
| 表名 | 用途 |
|------|------|
| `course_health_scores` | 课程健康度 |
| `auto_improvement_tasks` | 自动改进任务 |
| `course_sunset_records` | 课程淘汰记录 |
| `teacher_performance_reviews` | 教师绩效评估 |

### 第五阶段：飞轮配置
| 表名 | 用途 |
|------|------|
| `flywheel_state` | 飞轮状态 |
| `system_reports` | 系统报告 |
| `cron_job_logs` | Cron 日志 |

## 四、Cron 任务清单

| 任务 | 时间 | 功能 |
|------|------|------|
| `scan-sources` | 每日 02:00 | 扫描 ClawHub/SkillHub |
| `evaluate-content` | 每日 04:00 | 评估内容质量 |
| `produce-courses` | 每日 06:00 | 生成课程 |
| `analyze-health` | 每日 08:00 | 计算健康度 |
| `generate-reports` | 每日 09:00 | 生成报告 |
| `cleanup` | 每日 03:00 | 清理过期数据 |
| `teacher-review` | 每月 1 日 | 教师评估 |

## 五、API 路由清单

### 飞轮控制
- `GET /api/flywheel/status` - 获取飞轮状态
- `GET /api/flywheel/dashboard` - 仪表盘数据
- `POST /api/flywheel/control` - 控制飞轮

### 教师管理
- `GET/POST /api/admin/teachers` - 教师列表/创建
- `GET/PUT/DELETE /api/admin/teachers/[id]` - 教师 CRUD
- `POST /api/admin/teachers/invite` - 发送邀请

### 内容源
- `GET/POST /api/admin/content-sources` - 内容源列表/创建
- `GET/PUT/DELETE /api/admin/content-sources/[id]` - 内容源 CRUD

### 课程生产
- `GET/POST /api/admin/production-jobs` - 任务列表/创建
- `POST /api/admin/production-jobs/review` - 审核任务

### 课程健康
- `GET /api/courses/[id]/health` - 课程健康度
- `GET/POST /api/courses/[id]/feedback` - 反馈
- `GET /api/courses/[id]/versions` - 版本历史

### Cron 入口
- `POST /api/cron/scan-sources` - 扫描内容源
- `POST /api/cron/evaluate-content` - 评估质量
- `POST /api/cron/produce-courses` - 生产课程
- `POST /api/cron/analyze-health` - 分析健康度
- `POST /api/cron/generate-reports` - 生成报告

## 六、实施路线图

```
Week 1-2  ████████░░░░░░░░░░░░  阶段一：数据库 + 扫描器
Week 3-4  ░░░░░░░░████████░░░░  阶段二：课程生产管道
Week 5-6  ░░░░░░░░░░░░░░██████  阶段三：学习检验系统
Week 7-8  ████████████████████  阶段四：反馈改进闭环
Week 9-10 ░░░░░░░░░░░░░░░░░░░░  阶段五：仪表盘 + 报告
```

## 七、快速开始

### 1. 运行数据库迁移

```bash
cd /root/.openclaw/workspace/lobster-university

# 生成迁移文件
pnpm drizzle-kit generate

# 执行迁移
pnpm drizzle-kit migrate
```

### 2. 创建初始内容源

```sql
INSERT INTO content_sources (id, name, type, endpoint, enabled)
VALUES 
  ('src_clawhub', 'ClawHub', 'api', 'https://clawhub.com/api', 1),
  ('src_skillhub', 'SkillHub', 'api', 'https://skillhub.cn/api', 1);
```

### 3. 初始化飞轮状态

```sql
INSERT INTO flywheel_state (id, state, system_health)
VALUES ('flywheel_001', 'spinning_up', 100);
```

### 4. 配置 Cron

在 Vercel 中配置 `vercel.json`，或在服务器上配置 crontab。

### 5. 验证系统

```bash
# 手动触发扫描
curl -X POST https://longxiadaxue.com/api/cron/scan-sources \
  -H "X-Cron-Secret: YOUR_SECRET"

# 检查飞轮状态
curl https://longxiadaxue.com/api/flywheel/status
```

## 八、关键阈值配置

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `QUALITY_AUTO_PUBLISH` | 85 | 自动发布阈值 |
| `QUALITY_NEEDS_REVIEW` | 60 | 需人工审核阈值 |
| `HEALTH_YELLOW` | 50 | 黄色预警阈值 |
| `HEALTH_RED` | 30 | 红色预警阈值 |
| `TEACHER_PROMOTE_MONTHS` | 3 | 连续优秀月数晋级 |
| `TEACHER_DEMOTE_MONTHS` | 3 | 连续不及格月数降级 |
| `SUNSET_WARNING_DAYS` | 30 | 淘汰预警天数 |

## 九、环境变量

```env
# Cron 认证密钥
CRON_SECRET=your-cron-secret-here

# LLM API (用于 AI 增强)
OPENAI_API_KEY=sk-xxx
# 或使用 OpenClaw Gateway
OPENCLAW_GATEWAY_URL=https://claudeai.best

# 通知服务
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx

# 邮件服务 (可选)
RESEND_API_KEY=re_xxx
ADMIN_EMAIL=admin@longxiadaxue.com
```

## 十、下一步行动

1. **[ ]** 运行数据库迁移
2. **[ ]** 创建初始内容源记录
3. **[ ]** 初始化飞轮状态
4. **[ ]** 配置 Cron 任务
5. **[ ]** 实现 ClawHub 扫描器
6. **[ ]** 实现课程生成器
7. **[ ]** 创建管理后台 UI

---

*更多详情请参阅 `docs/edu-flywheel-design.md`*
