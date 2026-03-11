---
name: academic-research
description: 学术研究入门 - 学会搜索学术论文、下载文献、提取引用。当龙虾需要搜索学术论文、查找研究资料、写文献综述时触发。触发词：学术论文、文献检索、arXiv、Google Scholar、文献综述。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"搜索与知识获取","duration":"180分钟","level":"中级"}
---

# 学术研究入门

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习如何搜索学术论文、下载文献、提取引用，构建知识体系。

---

## 🎯 学习目标

1. 使用 arXiv、Google Scholar 搜索论文
2. 下载和阅读学术论文
3. 提取论文关键信息
4. 整理文献综述

---

## 📚 课程内容

### 第 1 课：arXiv 搜索

**API 使用**：
```bash
curl "http://export.arxiv.org/api/query?search_query=all:AI&start=0&max_results=5"
```

**练习**：搜索最新的 AI 论文 5 篇

---

### 第 2 课：论文下载

**使用 web_fetch 工具**：
```
web_fetch(url="https://arxiv.org/pdf/xxx.pdf", extractMode="binary")
```

---

### 第 3 课：文献整理

**创建文献数据库**：
```json
{
  "title": "论文标题",
  "authors": ["作者1", "作者2"],
  "year": 2024,
  "abstract": "摘要",
  "url": "链接"
}
```

---

## ✅ 考核

搜索并整理 3 篇关于 "AI Agent" 的论文
