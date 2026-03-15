# 测试记录

日期：2026-03-15  
执行者：Codex

## 已执行验证

### 1. TypeScript 静态检查

- 命令：`npx tsc --noEmit --pretty false`
- 结果：通过
- 结论：本次代码改动与当前仓库类型系统兼容。

### 2. 定向 ESLint 检查

- 命令：`npx eslint src/app/api/enrollment/auto/route.ts src/app/api/portfolio/route.ts src/app/api/parent/bind/route.ts src/lib/services/portfolio-service.ts src/lib/db/schema-lobster.ts src/lib/db/schema.ts --max-warnings=0`
- 结果：通过
- 结论：本次直接修改的核心文件未新增 ESLint 问题。

### 3. 全量构建

- 命令：`npm run build`
- 结果：通过
- 结论：Next.js 生产构建成功，路由 `/api/enrollment/auto`、`/api/portfolio`、`/api/parent/bind` 均被纳入构建结果。

### 4. 全量 Lint

- 命令：`npm run lint`
- 结果：失败
- 现象：仓库存在大量既有 ESLint 问题，覆盖 `admin/events`、`assessment`、`certification`、`portfolio` 页面、UI 组件等多个未在本次任务中修改的模块。
- 结论：失败原因主要是仓库历史问题，不阻塞本次改动的编译与定向校验，但属于现存质量风险。

### 5. 数据库迁移与结构验证

- 命令：
  - `npm run db:generate`
  - `npm run db:migrate`
  - `sqlite3 lobster.db "PRAGMA table_info('portfolios');"`
  - `sqlite3 lobster.db "PRAGMA table_info('users');"`
- 结果：
  - 成功生成 `drizzle/0004_black_lila_cheney.sql`
  - `db:migrate` 首次执行因数据库已有部分手工字段而报 `duplicate column name: review_status`
  - 已补齐缺失列并登记迁移哈希后再次执行，迁移成功
- 结论：
  - `portfolios` 已包含 `skills`、`review_status`、`review_feedback`
  - `users` 已包含 `parent_onboarding_completed`、`parent_report_subscription`

### 6. 本地 HTTP 冒烟：自动入学

- 服务：`npm run dev`，端口 `3001`
- 用例：
  - `GET /api/enrollment/auto`
  - `POST /api/enrollment/auto` 有效参数
  - `POST /api/enrollment/auto` 非法参数
- 结果：
  - 成功返回职业方向列表
  - 成功返回已更新档案、访问令牌、今日任务
  - 非法名称正确返回 `400` 和错误信息
- 结论：`ADMIT-001A` 对应 API 工作正常。

### 7. 本地 HTTP 冒烟：作品集提交

- 用例：
  - `POST /api/portfolio` 有效提交但 URL 不可访问
  - `POST /api/portfolio` 描述不足 50 字
  - `GET /api/portfolio?profileId=...`
  - `GET /api/portfolio?profileId=...&action=stats`
  - `GET /api/portfolio/:id`
- 结果：
  - 有效提交成功创建记录，并返回 `reviewStatus=needs_revision`、`status=rejected` 与自动审核反馈
  - 描述过短正确返回 `400`
  - 列表、详情和统计接口均能读到刚写入的记录
- 结论：`PRAC-002` 对应 API 已实现字段校验、自动审核反馈和统计能力。

### 8. 本地 HTTP 冒烟：家长绑定链路

- 用例：
  - `POST /api/parent/bind` 未登录
  - 数据库表存在性检查：`parents`、`invite_codes`、`parent_student_bindings`
  - `POST /api/auth/sign-up/email` 构造登录态
- 结果：
  - 未登录时正确返回 `{"error":"请先登录"}`
  - 三张家长链路表已补齐到运行数据库
  - 认证注册接口返回 `500`，日志显示 `better-auth` Drizzle adapter 缺少 `user` 模型映射
- 结论：
  - `parent/bind` 自身的登录前置校验正常
  - 受仓库现有认证配置问题影响，无法在本次任务中完成真实登录态绑定冒烟
  - 本次新增的家长引导返回结构与数据库字段已通过静态检查和结构检查验证

## 关键输出样例

### 自动入学成功返回

```json
{
  "success": true,
  "message": "档案已更新",
  "profile": {
    "id": "Q5lQTiPEGJu6krIgJZoff",
    "studentId": "LX2026JL9Y6U",
    "name": "测试龙虾"
  }
}
```

### 作品集自动审核返回

```json
{
  "success": true,
  "review": {
    "status": "needs_revision",
    "feedback": "作品链接暂不可访问，请检查 URL 是否有效后重新提交",
    "workflowStatus": "rejected"
  }
}
```

## 阻塞与说明

- 运行数据库长期存在迁移漂移：
  - `review_status`、`parent_onboarding_completed` 已提前存在
  - `skills`、`parent_report_subscription` 缺失
  - `parents`、`invite_codes`、`parent_student_bindings` 三张表也缺失
- 已在本次任务中修复当前运行数据库，使其满足本次 SOP 优化需求。
- `better-auth` 注册链路当前 500，属于仓库既有配置问题，不是本次 SOP 改动直接引入的问题。
