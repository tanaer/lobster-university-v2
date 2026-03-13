---
name: github-to-clawhub
description: >
  将 GitHub 开源项目转化为 OpenClaw skill 并发布到 clawhub 的完整流程。
  当用户说"把这个 GitHub 项目做成 skill"、"把 XX 发布到 clawhub"、"把这个项目封装成 skill"、
  "把 GitHub 链接转成 skill 上传"、"GitHub 转 skill"等类似需求时触发。
version: 2.0.0
type: executable-sop
metadata:
  category: 技能开发
  module: GitHub 集成
  level: 中级
  estimated_time: 45分钟
  prerequisites: [clawhub token]
  tools_required: [web_fetch, exec]
---

# GitHub → ClawHub 一键转化发布

## 知识库

- `web_fetch(url)` - 获取远程文件内容
- `clawhub publish` - 发布 skill 到 clawhub
- `knot_skills search` - 搜索已存在的 skill
- 排除标准：需本地 GPU、纯前端 UI、复杂本地部署、敏感内容

---

## 工作流

### NODE-01: 解析用户输入

```yaml
id: NODE-01
input: user.request
type: branch
action: |
  提取以下信息：
  1. GitHub URL (格式: https://github.com/{owner}/{repo})
  2. clawhub token (格式: clh_xxx)
  3. 可选: slug, displayName, tags
success_criteria: GitHub URL 有效
output: {github_url, token, slug?, displayName?, tags?}
on_success: NODE-02
on_failure:
  action: 向用户请求缺失信息
  fallback: ABORT
```

### NODE-02: 获取项目 README

```yaml
id: NODE-02
input: NODE-01.github_url
action: |
  构造 raw URL: https://raw.githubusercontent.com/{owner}/{repo}/main/README.md
  或 /master/README.md
  web_fetch(url="${raw_url}", extractMode="markdown")
success_criteria: 成功获取 README 内容
output: readme_content {title, description, features, license}
on_success: NODE-03
on_failure:
  retry: 1
  action: 尝试 README.md / readme.md / README.rst
  fallback: ABORT
```

### NODE-03: 项目可行性评估

```yaml
id: NODE-03
input: NODE-02.readme_content
type: branch
action: |
  检查排除标准：
  - 需要本地 GPU / 大 VRAM → REJECT
  - 纯前端/移动端 UI，无 API → REJECT
  - 需要复杂本地服务部署 → REJECT
  - 涉及敏感/违规内容 → REJECT
  
  提取关键信息：
  - 核心功能（一句话）
  - 技术路径（API/本地计算/多Agent/纯提示词）
  - License 类型
success_criteria: 通过排除标准
output: {is_valid, reason?, core_function, tech_path, license}
on_success: NODE-04
on_failure:
  action: 告知用户项目不适合原因
  fallback: ABORT
```

### NODE-04: clawhub 查重

```yaml
id: NODE-04
input: NODE-03.core_function
action: |
  执行 2-3 次搜索，覆盖不同关键词：
  1. knot_skills search "{核心功能关键词1}"
  2. knot_skills search "{核心功能关键词2}"
  3. knot_skills search "{技术路径}"
  
  判断结果：
  - 完全重复 → 建议换 slug 或放弃
  - 部分重叠 → 说明差异，继续
  - 空白地带 → 直接继续
success_criteria: 查重完成
output: {duplicate_status, similar_skills[], recommendation}
on_success: NODE-05
on_failure:
  fallback: NODE-05  # 查重失败继续，发布时会再次检查
```

### NODE-05: 确定 skill 元信息

```yaml
id: NODE-05
input: [NODE-01.slug?, NODE-01.displayName?, NODE-03.core_function, NODE-04.duplicate_status]
action: |
  如果用户未提供，自动生成：
  - slug: 从 repo 名生成，小写+连字符，如 "opinion-analyzer"
  - displayName: 描述性名称，如 "Opinion Analyzer — 多视角舆情分析助手"
  - tags: 3-5 个关键词，逗号分隔
  
  Slug 规则检查：
  - 全小写 + 连字符，无空格
  - 不与已有 skill 完全重复
success_criteria: 元信息完整且有效
output: {slug, displayName, tags, author}
on_success: NODE-06
on_failure:
  action: 向用户确认元信息
  fallback: NODE-06
```

### NODE-06: 撰写 SKILL.md

```yaml
id: NODE-06
input: [NODE-02.readme_content, NODE-05.slug, NODE-05.displayName, NODE-05.tags, NODE-01.github_url]
action: |
  生成 SKILL.md 内容：
  - YAML front matter: name, description(含触发词), author, version
  - 灵感来源: 原项目链接和 star 数
  - 使用方式: 2-3 个调用示例
  - 执行流程: 具体到操作层面
  - 输出格式: 交付物结构模板
  - 注意事项: 边界条件
  
  原则：
  1. description 包含 5-10 个触发词
  2. 执行流程具体到操作，不写废话
  3. 输出格式给模板
  4. 不是翻译 README，是转化为 AI 行为规范
success_criteria: SKILL.md 结构完整
output: skill_md_content
on_success: NODE-07
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-07: 创建本地文件

```yaml
id: NODE-07
input: [NODE-05.slug, NODE-06.skill_md_content]
action: |
  执行命令：
  SKILL_DIR="/root/.openclaw/workspace/skills/SKILL-{slug}"
  mkdir -p "$SKILL_DIR"
  echo "${skill_md_content}" > "$SKILL_DIR/SKILL.md"
  
  如果原项目有实用脚本/配置，一并复制
success_criteria: 目录创建成功，文件写入成功
output: skill_dir_path
on_success: NODE-08
on_failure:
  action: 检查磁盘空间和权限
  fallback: ABORT
```

### NODE-08: 发布到 clawhub

```yaml
id: NODE-08
input: [NODE-07.skill_dir_path, NODE-01.token, NODE-05.slug, NODE-05.displayName, NODE-05.tags]
action: |
  执行发布命令：
  CLAWHUB_TOKEN={token} clawhub publish {skill_dir_path} \
    --slug {slug} \
    --name "{displayName}" \
    --version 1.0.0 \
    --changelog "Initial release: {core_function}" \
    --tags "{tags}"
success_criteria: 发布成功，返回 skill URL
output: {publish_status, skill_url, error?}
on_success: NODE-09
on_failure:
  action: |
    根据错误类型处理：
    - Path must be folder → 检查目录路径
    - Slug taken → 建议换 slug，返回 NODE-05
    - Rate limit → 创建 65 分钟后重试任务
    - 401 Unauthorized → 要求重新生成 token
    - 400 acceptLicenseTerms → patch CLI 后重试
  fallback: NODE-05
```

### NODE-09: 验证发布

```yaml
id: NODE-09
input: NODE-05.slug
action: |
  执行验证：
  knot_skills search "{slug}"
  
  检查返回结果是否包含新发布的 skill
success_criteria: 能在 clawhub 搜索到
output: verification_result
on_success: NODE-FINAL
on_failure:
  action: 等待 30 秒后重试
  retry: 3
  fallback: NODE-FINAL  # 即使验证失败，发布可能已成功
```

### NODE-FINAL: 输出结果

```yaml
id: NODE-FINAL
type: end
input: [NODE-08.publish_status, NODE-05.slug, NODE-05.displayName, NODE-08.skill_url]
action: |
  格式化输出：
  ✅ 已发布：{displayName}
  📦 slug：{slug}
  🌐 {skill_url}
  
  询问用户是否需要：
  1. 本地安装测试
  2. 修改 skill 内容
  3. 发布另一个项目
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "把 https://github.com/xxx 做成 skill"
- "发布这个项目到 clawhub"
- "GitHub 转 skill"
- "封装 GitHub 项目"
