---
name: web-search-basics
description: Web 搜索入门 - 学会使用搜索引擎获取信息、提取关键内容、整理成报告。当龙虾需要查找信息、搜索资料、获取网页内容时触发。触发词：搜索、查找、搜索网页、获取信息、查资料。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"搜索与知识获取","duration":"2小时","level":"初级"}
---

# Web 搜索入门

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习如何使用搜索引擎获取信息、提取关键内容、整理成结构化报告。

---

## 🎯 学习目标

完成本课程后，你将能够：

1. 使用搜索引擎查找信息
2. 从搜索结果中筛选有价值的内容
3. 提取网页关键信息
4. 整理成结构化报告

---

## 📚 课程内容

### 第 1 课：搜索引擎基础

**搜索命令**：
```bash
# 使用 Brave Search API
curl -s "https://api.search.brave.com/res/v1/web/search?q=你的搜索词" \
  -H "Accept: application/json" \
  -H "Accept-Encoding: gzip" \
  -H "X-Subscription-Token: YOUR_API_KEY"
```

**搜索技巧**：
- 使用引号 `"精确匹配"`
- 使用 `-` 排除词 `Python -snake`
- 使用 `site:` 限定网站 `site:github.com`
- 使用 `filetype:` 限定文件类型 `filetype:pdf`

**练习**：
搜索 "OpenClaw skills tutorial" 并列出前 5 个结果。

---

### 第 2 课：网页内容提取

**使用 web_fetch 工具**：
```
web_fetch(url="https://example.com", extractMode="markdown")
```

**提取流程**：
1. 获取网页内容
2. 识别关键信息（标题、正文、链接）
3. 过滤无关内容（广告、导航）
4. 整理成结构化格式

**练习**：
提取 https://docs.openclaw.ai 的首页内容，总结成 3 个要点。

---

### 第 3 课：信息整合报告

**报告结构**：
```markdown
# [主题] 研究报告

## 概述
[一句话总结]

## 关键发现
1. [发现 1]
2. [发现 2]
3. [发现 3]

## 详细内容
### [子主题 1]
[内容]

### [子主题 2]
[内容]

## 来源
- [来源 1](url)
- [来源 2](url)
```

**练习**：
搜索 "AI Agent 职业教育" 并生成一份研究报告。

---

## ✅ 课程考核

### 考核任务

**任务**：为主人搜索并整理 "如何提高 AI Agent 工作效率" 的信息。

**要求**：
1. 搜索至少 3 个相关来源
2. 提取每个来源的关键信息
3. 整理成结构化报告
4. 向主人汇报

**通过标准**：
- [ ] 使用了正确的搜索方法
- [ ] 获取了至少 3 个来源
- [ ] 报告结构清晰
- [ ] 内容有价值

---

## 📖 参考资料

- `references/search-commands.md` - 搜索命令速查
- `references/web-fetch-guide.md` - 网页提取指南

---

## 🔄 学习循环

```
搜索 → 提取 → 整理 → 汇报 → 反馈 → 改进
```

每次搜索任务后：
1. 总结做得好的地方
2. 记录可以改进的地方
3. 下次搜索时应用改进

---

*搜索是获取知识的第一步！* 🔍
