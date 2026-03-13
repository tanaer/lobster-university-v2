# DeepReader — 可执行 SOP

> 学完这门课，Agent 能独立完成：从任意 URL 提取、解析、摘要网页内容，输出结构化数据

## 课程元数据

| 项目 | 内容 |
|------|------|
| 课程 ID | deepreader |
| 难度 | 初级 |
| 预计执行时间 | 10 分钟 |
| 前置技能 | shell-basics, curl |
| 输出物 | 网页内容的结构化摘要（标题、正文、关键信息） |

---

## 工作流总览

```
[URL] → Step 1: 获取网页 → Step 2: 解析内容 → Step 3: 提取关键信息 → Step 4: 生成摘要 → [结构化输出]
           ↓ 失败        ↓ 失败          ↓ 失败
        重试/换UA     换解析器       降级提取
```

---

## Step 1: 获取网页内容

### 输入
- 目标 URL（如 `https://example.com/article`）

### 执行
```bash
# 基础获取
curl -sL "https://example.com/article" -o page.html

# 带 User-Agent 模拟浏览器（防屏蔽）
curl -sL \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Accept: text/html,application/xhtml+xml" \
  "https://example.com/article" -o page.html

# 检查获取结果
head -c 1000 page.html
```

### 判断条件
- ✅ 成功：`page.html` 存在且 > 1KB，包含 `</html` 或 `<!DOCTYPE`
- ❌ 失败A：HTTP 403/429（被屏蔽）→ 换 User-Agent 或加延迟重试
- ❌ 失败B：跳转 JS 页面 → 使用无头浏览器方案（puppeteer/playwright）
- ❌ 失败C：内容付费墙 → 标记"需要登录"，终止流程
- 🔄 失败处理：最多重试 3 次，每次延迟 1-3 秒

### 输出
- `page.html`: 原始 HTML 文件
- `HTTP_STATUS`: HTTP 状态码

---

## Step 2: 解析网页结构

### 输入
- Step 1 的 `page.html`

### 执行

**方案 A：使用 readability 提取正文（推荐）**
```bash
# Node.js 方案
npm install -g @mozilla/readability jsdom

node -e "
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('page.html', 'utf8');
const doc = new JSDOM(html, { url: 'https://example.com' });
const reader = new Readability(doc.window.document);
const article = reader.parse();

console.log(JSON.stringify(article, null, 2));
" > article.json
```

**方案 B：使用 Python + BeautifulSoup**
```bash
pip install beautifulsoup4 lxml

python3 -c "
from bs4 import BeautifulSoup
import json

with open('page.html') as f:
    soup = BeautifulSoup(f, 'lxml')

# 提取标题
title = soup.find('h1') or soup.find('title')
title = title.get_text(strip=True) if title else 'No title'

# 提取正文（优先 article/main 标签）
content = soup.find('article') or soup.find('main') or soup.find('body')
text = content.get_text(separator='\n', strip=True) if content else ''

# 提取 meta 信息
meta = {m.get('name') or m.get('property'): m.get('content') 
        for m in soup.find_all('meta') if m.get('content')}

result = {
    'title': title,
    'text': text[:5000],  # 限制长度
    'meta': meta,
    'links': [a.get('href') for a in soup.find_all('a', href=True)][:20]
}
print(json.dumps(result, ensure_ascii=False, indent=2))
" > article.json
```

### 判断条件
- ✅ 成功：`article.json` 生成，包含 `title` 和有效 `text`（> 200 字符）
- ❌ 失败：提取内容太短（< 100 字符）→ 换解析方案（直接提取 body 文本）
- 🔄 失败处理：降级为提取所有可见文本

### 输出
- `article.json`: 结构化内容
  ```json
  {
    "title": "文章标题",
    "byline": "作者信息",
    "content": "HTML 正文",
    "textContent": "纯文本正文",
    "length": 1234,
    "excerpt": "摘要片段",
    "siteName": "网站名称"
  }
  ```

---

## Step 3: 提取关键信息

### 输入
- Step 2 的 `article.json`

### 执行

**提取结构化字段：**
```bash
# 使用 jq 提取
jq -r '{
  title: .title,
  author: .byline,
  summary: .excerpt,
  word_count: .length,
  site: .siteName,
  published: .meta["article:published_time"] // .meta["og:article:published_time"],
  keywords: .meta.keywords,
  main_image: .meta["og:image"]
}' article.json > extracted.json
```

**智能摘要生成（如果 excerpt 不够）：**
```bash
# 取前 3 段作为摘要
jq -r '.textContent' article.json | head -c 500 | sed 's/\n/ /g' > summary.txt
```

### 判断条件
- ✅ 成功：`extracted.json` 包含 title + 至少一个其他字段
- ❌ 失败：字段缺失 → 从原始 HTML 补充提取 meta 标签
- 🔄 失败处理：标记为"部分提取"

### 输出
- `extracted.json`: 关键信息
  ```json
  {
    "title": "文章标题",
    "author": "作者名",
    "summary": "文章摘要...",
    "word_count": 1234,
    "site": "网站名",
    "published": "2024-01-15",
    "keywords": "tag1, tag2",
    "main_image": "https://..."
  }
  ```

---

## Step 4: 生成最终输出

### 输入
- Step 3 的 `extracted.json`

### 执行

**标准输出格式：**
```bash
jq -r '
"# " + .title + "\n\n" +
"**来源**: " + (.site // "Unknown") + "\n" +
"**作者**: " + (.author // "Unknown") + "\n" +
"**发布时间**: " + (.published // "Unknown") + "\n" +
"**字数**: " + (.word_count | tostring) + "\n\n" +
"## 摘要\n\n" + .summary + "\n\n" +
"## 关键词\n\n" + (.keywords // "N/A") + "\n\n" +
"## 正文预览\n\n" + (.textContent[0:1000] // "") + "..."
' extracted.json > output.md
```

**JSON API 格式：**
```bash
jq -r '{
  url: "'$URL'",
  title: .title,
  author: .author,
  summary: .summary,
  content: .textContent,
  metadata: {
    site: .site,
    published: .published,
    word_count: .word_count,
    keywords: .keywords,
    image: .main_image
  },
  extracted_at: now | todate
}' extracted.json > output.json
```

### 判断条件
- ✅ 成功：`output.md` 或 `output.json` 生成，包含完整信息
- ❌ 失败：输出为空 → 检查输入数据
- 🔄 失败处理：输出最小可用信息（仅 title 和 URL）

### 输出
- `output.md`: Markdown 格式报告
- `output.json`: JSON API 格式

---

## 验收标准

| 检查项 | 预期结果 | 验证命令 |
|--------|----------|----------|
| 网页获取 | HTML 文件存在且有效 | `test -s page.html && grep -q "<html" page.html` |
| 内容解析 | 提取到标题和正文 | `jq -r '.title' extracted.json` 非空 |
| 摘要生成 | 摘要长度 > 50 字符 | `jq -r '.summary' extracted.json \| wc -c` > 50 |
| 元数据 | 至少提取到 site/author/published 之一 | `jq 'keys' extracted.json` |
| 输出格式 | Markdown 或 JSON 正确生成 | `test -f output.md` |

---

## 常见问题 & 排错

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| 403 Forbidden | 反爬虫 | 加 User-Agent、Cookie、或延迟 |
| 内容乱码 | 编码问题 | 用 `iconv -f GBK -t UTF-8` 转换 |
| JS 渲染页面 | SPA 应用 | 换 puppeteer/playwright |
| 提取内容为空 | 动态加载 | 检查是否需执行 JS |
| 付费墙 | 需要登录 | 标记"需要认证"，终止 |

---

## 扩展任务（选做）

- [ ] 批量处理 URL 列表
- [ ] 对比多个网页内容差异
- [ ] 提取表格数据为 CSV
- [ ] 监控网页变化（定时抓取对比）
- [ ] 集成到 n8n/Coze 工作流
- [ ] 添加翻译功能（提取后自动翻译）
