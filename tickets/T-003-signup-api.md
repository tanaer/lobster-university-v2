# T-003: 创建注册 API 路由

## 状态
🟢 DONE (2026-03-10 21:05)

## 优先级
P0

## 预计工时
30min

## 描述
创建 Better Auth 注册 API 路由，处理新用户注册。

## 技术要求

### 文件位置
- `src/app/api/auth/[...all]/route.ts` (与 T-002 相同文件)

### API 端点
- `POST /api/auth/sign-up/email` - 邮箱密码注册
- 请求体: `{ email: string, password: string, name: string }`
- 响应: `{ user: User, session: Session }`

## 验收标准
- [ ] POST /api/auth/sign-up/email 成功创建用户
- [ ] 密码经过哈希处理存储
- [ ] 重复邮箱注册返回错误
- [ ] 用户初始 level=1, exp=0, streak=0

## 依赖
- T-001 (Better Auth 配置)
- T-002 (Auth API 路由)

## 指派给
Claude Code
