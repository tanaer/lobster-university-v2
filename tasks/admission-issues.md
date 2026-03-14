# 入学流程问题记录

## 2026-03-14 21:27 — 邀请码生成接口报错

- **接口:** `POST http://127.0.0.1:3000/api/invite-code/generate`
- **请求体:** `{"studentId":"test"}`
- **返回:** `{"error":"服务器错误"}`
- **严重程度:** 中等 — 影响邀请码生成功能
- **状态:** 待排查
- **2026-03-14 22:28 复查:** 问题仍存在，邀请码接口持续返回服务器错误

## 2026-03-14 22:28 — SQLite students 表不存在

- **命令:** `sqlite3 lobster.db "SELECT COUNT(*) FROM students WHERE ..."`
- **返回:** `Error: in prepare, no such table: students`
- **严重程度:** 高 — 数据库 schema 可能变更或表名不一致
- **状态:** 待排查 — 需确认实际表名（可能是 lobster_profiles 或其他）

### 其他检查结果
- 入学 API (`/api/skill/enrollment`): 正常响应（返回 skill 文档内容）
