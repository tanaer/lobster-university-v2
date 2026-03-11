---
name: cron-scheduling
description: 定时任务与调度 - 学会使用 Cron 设置定时任务、24/7 主动执行。当龙虾需要定时执行任务时触发。触发词：定时任务、Cron、调度、计划任务。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"多通道与调度","duration":"90分钟","level":"初级"}
---

# 定时任务与调度

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习 Cron 表达式、定时任务和任务调度。

---

## 🎯 学习目标

1. 理解 Cron 表达式
2. 设置定时任务
3. 监控任务执行
4. 处理任务失败

---

## 📚 课程内容

### 第 1 课：Cron 表达式

```
┌───────────── 分钟 (0 - 59)
│ ┌─────────── 小时 (0 - 23)
│ │ ┌───────── 日 (1 - 31)
│ │ │ ┌─────── 月 (1 - 12)
│ │ │ │ ┌───── 星期 (0 - 6, 0 = 周日)
│ │ │ │ │
* * * * *
```

**常用示例**：
| 表达式 | 含义 |
|--------|------|
| `* * * * *` | 每分钟 |
| `0 * * * *` | 每小时 |
| `0 9 * * *` | 每天 9 点 |
| `0 9 * * 1-5` | 工作日 9 点 |
| `*/15 * * * *` | 每 15 分钟 |

### 第 2 课：Node-Cron

```javascript
const cron = require('node-cron');

cron.schedule('0 9 * * *', async () => {
  console.log('每天 9 点执行任务');
  await dailyTask();
}, {
  scheduled: true,
  timezone: 'Asia/Shanghai'
});
```

### 第 3 课：任务监控

```javascript
const jobs = {};

function runJob(id, fn, schedule) {
  const job = cron.schedule(schedule, async () => {
    const start = Date.now();
    try {
      await fn();
      console.log(`任务 ${id} 成功, 耗时 ${Date.now() - start}ms`);
    } catch (error) {
      console.error(`任务 ${id} 失败:`, error);
      // 发送告警
      await sendAlert(id, error);
    }
  });
  jobs[id] = job;
  return job;
}
```

---

## ✅ 考核

1. 创建一个每小时执行的任务
2. 添加执行日志
3. 实现失败告警
