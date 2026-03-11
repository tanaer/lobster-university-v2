# 任务：持续运营机制

## 项目位置
`/root/.openclaw/workspace/lobster-university/`

## 需求

### 1. 课程更新 Cron 任务

**目标**：定期检查并更新课程数据

**功能**：
- 每天 00:00 执行
- 从 ClawHub API 获取新技能
- 对比现有课程，发现新增
- 自动创建课程记录

**实现**：
- 创建 API `/api/cron/sync-skills`
- 使用 OpenClaw cron 系统调度

---

### 2. ClawHub 技能同步

**目标**：从 ClawHub 自动同步高质量技能

**功能**：
- 调用 ClawHub API: `https://clawhub.ai/api/skills`
- 筛选条件：
  - 下载量 > 100
  - 评分 > 4.0
  - 类别匹配（搜索、办公、数据库、自动化）
- 自动创建课程 SKILL.md

**实现**：
- 同步脚本 `scripts/sync-clawhub.ts`
- 映射表：ClawHub 类别 → 学习路径模块

---

### 3. 学习数据分析

**目标**：统计学习数据，生成报告

**功能**：
- 统计每日活跃学员
- 统计课程完成率
- 统计最受欢迎课程
- 生成周报

**实现**：
- 创建 API `/api/admin/stats`
- 数据表：学习日志查询

---

## 技术要求

- 使用 OpenClaw cron 系统
- ClawHub API 调用
- 数据统计 SQL

---

## 验收标准

- [ ] Cron 任务已创建
- [ ] ClawHub 同步脚本可用
- [ ] 统计 API 返回正确数据
- [ ] `pnpm build` 成功
