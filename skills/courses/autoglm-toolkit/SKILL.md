---
name: autoglm-agent-toolkit
description: AutoGLM AI 工具包 - 智谱 AI 提供的 Agent 工具包，支持浏览器自动化、深度研究、网页搜索、图像生成、图像搜索、网页抓取。适合中文互联网任务。触发词：浏览器自动化、深度研究、网络搜索、AI生图、搜图、网页抓取、AutoGLM、智谱。
version: 2.0.0
type: executable-sop
metadata:
  category: AI应用
  module: 智谱AI工具包
  level: 高级
  estimated_time: 60分钟
  prerequisites: [aistatus]
  tools_required: [autoglm-toolkit]
---

# AutoGLM AI 工具包

## 知识库

- `autoglm-toolkit` skill 提供智谱 AI Agent 工具集
- 核心功能：浏览器自动化、深度研究、网页搜索、图像生成、图像搜索、网页抓取
- 特别适合中文互联网任务（小红书、B站、抖音、微信等）
- 需要智谱 AI API Key 配置
- 浏览器自动化支持复杂交互（点击、输入、滚动）
- 深度研究可自动搜索、阅读、综合多个来源

---

## 工作流

### NODE-01: 接收任务请求

```yaml
id: NODE-01
input: user.task
action: |
  解析用户任务，识别需要的工具：
  - 需要操作网页/填表 → browser_automation
  - 需要深度调研某话题 → deep_research
  - 需要搜索信息 → web_search
  - 需要生成图片 → image_generation
  - 需要搜索图片 → image_search
  - 需要提取网页内容 → web_extraction
success_criteria: 成功识别任务类型和所需工具
output: task_type, required_tool, task_params
on_success: NODE-02
on_failure:
  action: 询问用户具体想做什么
  fallback: ABORT
```

### NODE-02: 检查工具可用性

```yaml
id: NODE-02
input: NODE-01.required_tool
action: |
  检查 autoglm-toolkit 是否可用：
  - 检查 skill 是否安装
  - 检查 API Key 是否配置
  - 检查网络连接
success_criteria: 工具可用且配置正确
output: tool_status
on_success: NODE-03
on_failure:
  action: 指导用户配置 autoglm-toolkit
  fallback: ABORT
```

### NODE-03: 路由到对应工具分支

```yaml
id: NODE-03
type: branch
input: NODE-01.required_tool
branches:
  - condition: browser_automation
    target: NODE-04
  - condition: deep_research
    target: NODE-05
  - condition: web_search
    target: NODE-06
  - condition: image_generation
    target: NODE-07
  - condition: image_search
    target: NODE-08
  - condition: web_extraction
    target: NODE-09
default: NODE-06
```

### NODE-04: 执行浏览器自动化

```yaml
id: NODE-04
input: NODE-01.task_params
action: |
  使用 autoglm 浏览器自动化：
  1. 启动浏览器会话
  2. 导航到目标网站
  3. 执行用户指定的操作（点击、输入、滚动）
  4. 等待页面响应
  5. 截图或提取结果
success_criteria: 完成所有指定操作
output: automation_result {actions_taken, screenshots, extracted_data}
on_success: NODE-10
on_failure:
  retry: 2
  backoff: 10s
  fallback: NODE-ERROR
```

### NODE-05: 执行深度研究

```yaml
id: NODE-05
input: NODE-01.task_params
action: |
  使用 autoglm 深度研究：
  1. 分析研究主题
  2. 自动生成搜索查询
  3. 搜索多个来源
  4. 阅读并提取关键信息
  5. 综合成结构化报告
success_criteria: 生成完整研究报告
output: research_report {summary, key_findings, sources, details}
on_success: NODE-10
on_failure:
  retry: 1
  backoff: 5s
  fallback: NODE-ERROR
```

### NODE-06: 执行网页搜索

```yaml
id: NODE-06
input: NODE-01.task_params
action: |
  使用 autoglm 网页搜索：
  1. 接收搜索查询
  2. 执行搜索（支持中文优化）
  3. 返回结果列表
success_criteria: 返回相关搜索结果
output: search_results[] {title, url, snippet}
on_success: NODE-10
on_failure:
  retry: 2
  backoff: 3s
  fallback: NODE-ERROR
```

### NODE-07: 执行图像生成

```yaml
id: NODE-07
input: NODE-01.task_params
action: |
  使用 autoglm 图像生成：
  1. 解析图像描述
  2. 调用智谱图像生成 API
  3. 返回生成的图像 URL
success_criteria: 成功生成图像
output: generated_image {url, prompt_used}
on_success: NODE-10
on_failure:
  retry: 2
  backoff: 5s
  fallback: NODE-ERROR
```

### NODE-08: 执行图像搜索

```yaml
id: NODE-08
input: NODE-01.task_params
action: |
  使用 autoglm 图像搜索：
  1. 接收图像或关键词
  2. 执行图像搜索
  3. 返回相似图像列表
success_criteria: 返回相关图像结果
output: image_results[] {thumbnail, source_url, title}
on_success: NODE-10
on_failure:
  retry: 2
  fallback: NODE-ERROR
```

### NODE-09: 执行网页抓取

```yaml
id: NODE-09
input: NODE-01.task_params
action: |
  使用 autoglm 网页抓取：
  1. 接收目标 URL
  2. 抓取网页内容
  3. 提取结构化信息
  4. 转换为 Markdown 或 JSON
success_criteria: 成功提取网页内容
output: extracted_content {url, title, content, format}
on_success: NODE-10
on_failure:
  retry: 2
  backoff: 3s
  fallback: NODE-ERROR
```

### NODE-10: 处理结果

```yaml
id: NODE-10
input: NODE-04 OR NODE-05 OR NODE-06 OR NODE-07 OR NODE-08 OR NODE-09
action: |
  根据任务类型处理结果：
  - 浏览器自动化：总结操作和结果
  - 深度研究：格式化研究报告
  - 网页搜索：整理搜索结果
  - 图像生成：展示图像
  - 图像搜索：展示搜索结果
  - 网页抓取：展示提取内容
success_criteria: 结果格式化完成
output: formatted_result
on_success: NODE-FINAL
on_failure:
  fallback: NODE-ERROR
```

### NODE-ERROR: 错误处理

```yaml
id: NODE-ERROR
type: end
action: |
  向用户解释执行失败原因
  提供可能的解决方案
  询问是否需要重试或使用其他工具
output: error_message
```

### NODE-FINAL: 输出并询问后续

```yaml
id: NODE-FINAL
type: end
input: NODE-10.formatted_result
action: |
  1. 发送处理结果
  2. 询问是否需要：
     - 继续深入操作
     - 导出结果
     - 切换到其他工具
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "用 AutoGLM 自动化浏览器"
- "帮我深度研究 xxx"
- "用智谱搜索 xxx"
- "AI 生成一张图片"
- "搜索相关图片"
- "抓取这个网页内容"
