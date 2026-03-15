# 入学流程问题记录

## 2026-03-15 — Cron 任务 SQL 查询过时

**问题：** `admission-optimize` cron 任务中查询 `students` 表，但该表不存在。实际学员数据存储在 `lobster_profiles` 表中。

**影响：** 每次 cron 执行时数据库查询报错，无法统计最近入学人数。

**修复建议：** 将 cron 任务中的 SQL 改为：
```sql
SELECT COUNT(*) FROM lobster_profiles WHERE created_at > strftime('%s','now','-1 day')
```

**当前状态：**
- 入学 API ✅ 正常
- 邀请码生成 ✅ 正常
- 最近24h新入学：0 条
- 数据库表结构正常，仅 cron 查询语句需更新
