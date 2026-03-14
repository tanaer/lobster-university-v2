# 入学流程问题记录

## 2026-03-14 23:28 检查

### 🔴 问题 1：邀请码生成 API 返回服务器错误
- **端点:** `POST /api/invite-code/generate`
- **请求:** `{"studentId":"test"}`
- **响应:** `{"error":"服务器错误"}`
- **影响:** 无法生成邀请码，可能影响新学员邀请流程
- **建议:** 检查 invite-code 路由的后端逻辑和数据库依赖

### 🟡 问题 2：Cron 任务查询使用了错误的表名
- **当前查询:** `SELECT COUNT(*) FROM students WHERE created_at > ...`
- **实际情况:** 数据库中不存在 `students` 表，入学数据在 `enrollments` 表，时间字段为 `enrolled_at`
- **修正查询:** `SELECT COUNT(*) FROM enrollments WHERE enrolled_at > strftime('%s','now','-1 day')`

### ✅ 正常项
- 入学 API (`/api/skill/enrollment`) 正常返回 skill 文档
- 数据库连接正常，共 24 张表
- 过去 24 小时新入学数：0（正常，无新注册）
