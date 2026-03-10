# T-002: 创建登录 API 路由

## 状态
🟢 DONE (2026-03-10 21:05)

## 优先级
P0

## 预计工时
30min

## 描述
创建 Better Auth 登录 API 路由，处理邮箱密码登录。

## 技术要求

### 文件位置
- `src/app/api/auth/[...all]/route.ts`

### 实现要点
Better Auth 使用 catch-all 路由处理所有认证请求。

### 代码示例
```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### API 端点
- `POST /api/auth/sign-in/email` - 邮箱密码登录
- 请求体: `{ email: string, password: string }`
- 响应: `{ user: User, session: Session }`

## 验收标准
- [ ] POST /api/auth/sign-in/email 返回正确的用户和 session
- [ ] 错误情况返回正确的错误信息 (用户不存在/密码错误)
- [ ] Session cookie 正确设置

## 依赖
- T-001 (Better Auth 配置)

## 指派给
Claude Code
