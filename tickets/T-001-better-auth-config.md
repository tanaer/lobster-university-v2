# T-001: 完善 Better Auth 配置

## 状态
🟢 DONE (2026-03-10 20:40)

## 优先级
P0 (最高)

## 预计工时
1h

## 描述
完善 Better Auth 配置，添加必要的安全选项和社交登录支持。

## 技术要求

### 文件位置
- `src/lib/auth.ts`

### 需要添加的功能
1. **密码验证规则**
   - 最小长度 8 位
   - 需要包含数字和字母

2. **Session 配置**
   - Cookie 安全选项 (httpOnly, secure, sameSite)
   - Session 过期时间 7 天

3. **社交登录预留**
   - Google OAuth 配置 (环境变量)
   - GitHub OAuth 配置 (环境变量)

4. **Hooks**
   - 用户注册后自动初始化游戏化数据 (level=1, exp=0)

### 代码示例
```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false, // MVP 阶段暂不需要
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    cookie: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },
  // 用户注册后的钩子
  hooks: {
    after: [
      {
        matcher: (context) => context.path === "/sign-up/email",
        handler: async (context) => {
          // 初始化用户游戏化数据
          const userId = context.returned?.user?.id;
          if (userId) {
            // level, exp, streak 已在 schema 中设置默认值
            console.log(`User ${userId} registered, game data initialized`);
          }
        },
      },
    ],
  },
});

export type Session = typeof auth.$Infer.Session;
```

## 验收标准
- [ ] 密码验证规则生效 (小于 8 位密码被拒绝)
- [ ] Session cookie 配置正确
- [ ] 环境变量支持 (GOOGLE_CLIENT_ID, GITHUB_CLIENT_ID)
- [ ] 注册钩子正常工作

## 环境变量
需要添加到 `.env`:
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## 依赖
无

## 指派给
Claude Code
