---
name: webhook-integration
description: Webhook 集成 - 学会接收和处理 Webhook、实现事件驱动。当龙虾需要接收外部通知、API 回调时触发。触发词：Webhook、回调、事件驱动、API。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"多通道与调度","duration":"120分钟","level":"中级"}
---

# Webhook 集成

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习 Webhook 原理、端点创建和事件处理。

---

## 🎯 学习目标

1. 理解 Webhook 原理
2. 创建 Webhook 端点
3. 验证和处理请求
4. 实现事件响应

---

## 📚 课程内容

### 第 1 课：Webhook 原理

**工作流程**：
```
外部服务 → HTTP POST → 你的服务器 → 处理 → 响应
```

**常见用途**：
- 支付回调
- GitHub Push 通知
- 表单提交
- 状态变更

### 第 2 课：创建端点

**Next.js API 路由**：
```typescript
// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证签名
    const signature = request.headers.get('x-signature');
    if (!verifySignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // 处理事件
    await handleEvent(body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook 处理失败:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### 第 3 课：事件处理

```javascript
async function handleEvent(event) {
  switch (event.type) {
    case 'payment.success':
      await handlePaymentSuccess(event.data);
      break;
    case 'payment.failed':
      await handlePaymentFailed(event.data);
      break;
    case 'user.created':
      await handleUserCreated(event.data);
      break;
    default:
      console.log('未知事件类型:', event.type);
  }
}
```

---

## ✅ 考核

1. 创建 Webhook 端点
2. 验证请求签名
3. 处理至少 2 种事件类型
