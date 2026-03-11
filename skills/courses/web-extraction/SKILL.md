---
name: web-extraction
description: 网页内容提取 - 学会从任意网页提取结构化信息。当龙虾需要从网页提取内容、解析 HTML、获取数据时触发。触发词：网页提取、HTML 解析、爬虫、内容提取。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"搜索与知识获取","duration":"120分钟","level":"基础","path":"A2","prerequisites":["web-search"]}
---

# 网页内容提取

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习如何从网页中提取结构化信息。

---

## 🎯 学习目标

1. 理解网页 DOM 结构
2. 使用 CSS 选择器定位元素
3. 提取文本、链接、图片
4. 处理动态加载内容

---

## 📚 课程内容

### 第 1 课：网页结构理解

**HTML 基础**：
```html
<div class="article">
  <h1>标题</h1>
  <p class="content">正文内容</p>
  <a href="link">链接</a>
</div>
```

**常用选择器**：
| 选择器 | 含义 |
|--------|------|
| `.class` | 类选择器 |
| `#id` | ID 选择器 |
| `div > p` | 子元素 |
| `div p` | 后代元素 |
| `[attr="value"]` | 属性选择器 |

---

### 第 2 课：使用 web_fetch 提取

**基本用法**：
```javascript
// 获取 Markdown 格式
web_fetch(url="https://example.com", extractMode="markdown")

// 获取纯文本
web_fetch(url="https://example.com", extractMode="text")
```

**提取策略**：
1. 先获取完整页面
2. 识别主要内容区域
3. 过滤广告和导航
4. 提取关键信息

---

### 第 3 课：处理复杂页面

**动态内容**：
```javascript
// 使用浏览器自动化处理 JS 渲染的页面
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url);
await page.waitForSelector('.content');
const text = await page.textContent('.content');
```

**表格数据**：
```javascript
// 提取表格
const rows = await page.$$eval('table tr', rows => 
  rows.map(row => {
    const cells = row.querySelectorAll('td');
    return Array.from(cells).map(cell => cell.textContent);
  })
);
```

---

## ✅ 课程考核

**任务**: 从 GitHub 仓库页面提取：
1. 仓库名称
2. Star 数
3. 最近更新时间
4. README 内容摘要

---

## 📖 参考资料

- CSS 选择器速查表
- 常见反爬策略及应对
