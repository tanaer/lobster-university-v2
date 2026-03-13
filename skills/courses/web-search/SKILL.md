---
name: web-search-basics
description: Web 搜索入门 - 学会使用搜索引擎获取信息、提取关键内容、整理成报告。当龙虾需要查找信息、搜索资料、获取网页内容时触发。触发词：搜索、查找、搜索网页、获取信息、查资料。
version: 2.0.0
type: executable-sop
metadata:
  category: 基础能力
  module: 搜索与知识获取
  level: 初级
  estimated_time: 30分钟
  prerequisites: []
  tools_required: [web_search, web_fetch]
---

# Web 搜索入门

## 知识库

- `web_search(query, count)` - 使用 Brave Search API 搜索
- `web_fetch(url, extractMode)` - 获取网页内容并提取
- 搜索技巧：引号精确匹配、site:限定网站、filetype:限定文件类型

---

## 工作流

### NODE-01: 接收搜索任务

```yaml
id: NODE-01
input: user.query
action: |
  解析用户输入，提取搜索关键词
success_criteria: 关键词非空且有意义
output: search_keywords
on_success: NODE-02
on_failure:
  action: 向用户请求澄清
  fallback: ABORT
```

### NODE-02: 执行搜索

```yaml
id: NODE-02
input: NODE-01.search_keywords
action: |
  web_search(query="${input}", count=5)
success_criteria: 返回结果数 >= 3
output: search_results {titles[], urls[], snippets[]}
on_success: NODE-03
on_failure:
  retry: 2
  backoff: exponential
  fallback: ABORT
```

### NODE-03: 筛选有效结果

```yaml
id: NODE-03
input: NODE-02.search_results
action: |
  过滤掉广告、无关内容，保留最相关的 3-5 条
success_criteria: 有效结果数 >= 3
output: filtered_urls[]
on_success: NODE-04
on_failure:
  fallback: NODE-02  # 回去重新搜索
```

### NODE-04: 批量提取网页内容

```yaml
id: NODE-04
type: loop
input: NODE-03.filtered_urls
each: url
action: |
  web_fetch(url="${url}", extractMode="markdown")
max_iterations: 5
output: contents[] {url, title, content}
on_complete: NODE-05
```

### NODE-05: 内容质量检查

```yaml
id: NODE-05
input: NODE-04.contents
action: |
  检查每个内容：长度 > 100 字符、主题相关、非错误页面
success_criteria: 有效内容数 >= 2
output: valid_contents[]
on_success: NODE-06
on_failure:
  fallback: NODE-02  # 扩大搜索范围
```

### NODE-06: 生成结构化报告

```yaml
id: NODE-06
input: NODE-05.valid_contents
action: |
  整理成报告格式：
  - 概述（一句话总结）
  - 关键发现（3-5点）
  - 详细内容（分点展开）
  - 来源列表
success_criteria: 报告结构完整、内容有价值
output: final_report
on_success: NODE-FINAL
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-FINAL: 输出并汇报

```yaml
id: NODE-FINAL
type: end
input: NODE-06.final_report
action: |
  1. 格式化报告
  2. 发送给用户
  3. 询问是否需要深入某个方向
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "搜索 xxx"
- "查一下 xxx"
- "帮我找 xxx 的资料"
- "调研 xxx"
