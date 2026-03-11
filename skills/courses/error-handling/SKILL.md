---
name: error-handling
description: 错误处理模式 - 学会识别和处理常见错误、实现重试机制。当龙虾需要错误处理、日志记录时触发。触发词：错误处理、重试、日志、异常、容错。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"稳定性与容错","duration":"120分钟","level":"中级"}
---

# 错误处理模式

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习错误识别、处理策略和容错机制。

---

## 🎯 学习目标

1. 识别常见错误类型
2. 编写错误处理代码
3. 实现自动重试
4. 记录错误日志

---

## 📚 课程内容

### 第 1 课：Try-Catch

```javascript
try {
  const result = await riskyOperation();
  console.log(result);
} catch (error) {
  console.error("操作失败:", error.message);
  // 降级处理
  return fallbackResult();
} finally {
  // 清理工作
  console.log("完成");
}
```

### 第 2 课：重试机制

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts) throw error;
      console.log(`重试 ${i}/${maxAttempts}...`);
      await new Promise(r => setTimeout(r, delay * i));
    }
  }
}

// 使用
const data = await retry(() => fetchData());
```

### 第 3 课：错误分类

| 类型 | 处理策略 |
|------|----------|
| 网络错误 | 重试 |
| 权限错误 | 提示用户 |
| 业务错误 | 记录并降级 |
| 超时 | 增加超时时间 |

---

## ✅ 考核

1. 为 API 调用添加错误处理
2. 实现 3 次重试机制
3. 记录错误日志到文件
