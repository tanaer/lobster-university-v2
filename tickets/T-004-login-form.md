# T-004: 前端登录表单连接

## 状态
🟢 DONE (2026-03-10 21:15)

## 优先级
P0

## 预计工时
1h

## 描述
将前端登录表单连接到 Better Auth API，实现真实的登录功能。

## 技术要求

### 文件位置
- `src/app/login/page.tsx`
- `src/lib/auth-client.ts` (新建)

### 实现要点

1. **创建 authClient**
```typescript
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

2. **登录页面改造**
```typescript
"use client";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await signIn.email({ email, password });
      router.push("/"); // 登录成功跳转首页
    } catch (err) {
      setError("登录失败，请检查邮箱和密码");
    }
  };

  // ... UI 代码
}
```

3. **使用 Session**
```typescript
import { useSession } from "@/lib/auth-client";

function Navbar() {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <div>Loading...</div>;
  
  return session ? (
    <div>{session.user.name}</div>
  ) : (
    <a href="/login">登录</a>
  );
}
```

## 验收标准
- [ ] 输入正确邮箱密码后成功登录
- [ ] 登录失败显示错误提示
- [ ] 登录成功后 Navbar 显示用户名
- [ ] Session 持久化 (刷新页面仍保持登录状态)

## 依赖
- T-002 (登录 API)

## 指派给
Claude Code
