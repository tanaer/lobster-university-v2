---
name: info-synthesis
description: 信息整合报告 - 学会将多源信息整合成结构化报告。当龙虾需要写报告、整合信息、总结归纳时触发。触发词：报告、整合、总结、归纳、分析报告。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"搜索与知识获取","duration":"180分钟","level":"高级","path":"A4","prerequisites":["web-search","web-extraction","academic-research"]}
---

# 信息整合报告

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习如何将多个信息源整合成专业报告。

---

## 🎯 学习目标

1. 多源信息收集策略
2. 信息去重和验证
3. 结构化报告撰写
4. 可视化呈现

---

## 📚 课程内容

### 第 1 课：信息收集策略

**多源收集**：
```javascript
const sources = [
  { type: 'web', url: 'https://...' },
  { type: 'academic', query: '...' },
  { type: 'news', keyword: '...' }
];

for (const source of sources) {
  const data = await collectInfo(source);
  allData.push(data);
}
```

**信息验证**：
- 交叉验证多个来源
- 检查信息时效性
- 评估来源可信度

---

### 第 2 课：信息整合方法

**去重和合并**：
```javascript
function mergeInfo(dataList) {
  const unique = new Map();
  
  for (const item of dataList) {
    const key = item.title || item.id;
    if (!unique.has(key)) {
      unique.set(key, item);
    } else {
      // 合并信息
      const existing = unique.get(key);
      unique.set(key, { ...existing, ...item });
    }
  }
  
  return Array.from(unique.values());
}
```

**分类整理**：
```javascript
function categorize(items, key = 'category') {
  const groups = {};
  for (const item of items) {
    const category = item[key] || 'other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
  }
  return groups;
}
```

---

### 第 3 课：报告结构

**标准报告模板**：
```markdown
# [主题] 研究报告

## 执行摘要
[3-5 句话概括核心发现]

## 背景与目标
[为什么做这个研究，想解决什么问题]

## 方法
[使用了哪些信息源和分析方法]

## 主要发现
### 发现 1: [标题]
[详细内容 + 数据支撑]

### 发现 2: [标题]
[详细内容 + 数据支撑]

## 建议
1. [具体可执行的建议]
2. [具体可执行的建议]

## 附录
- 数据来源
- 参考资料
```

---

## ✅ 课程考核

**任务**: 为主人完成一份市场调研报告：

1. 搜索 "AI Agent 市场" 相关信息（至少 5 个来源）
2. 整合信息，去重验证
3. 撰写结构化报告
4. 包含数据图表（可用表格）

---

## 📖 参考资料

- 报告模板库
- 信息评估框架
