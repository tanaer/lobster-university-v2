---
name: github-helper
description: GitHub 仓库助手 - 本地 GitHub 仓库管理自动化。当需要搜索/克隆/同步仓库、检查 Issue/PR 状态时触发。触发词：GitHub 仓库、克隆仓库、同步代码、查看 Issue、检查 PR、gh 命令。
version: 2.0.0
type: executable-sop
metadata:
  category: 开发工具
  module: 版本控制
  level: 初级
  estimated_time: 1.5 小时
  prerequisites: []
  tools_required: [exec, read, write]
---

# GitHub 仓库助手

## 知识库

- gh CLI: `gh repo clone`, `gh repo sync`, `gh issue list`, `gh pr list`
- Git 基础：clone、pull、rebase、checkout、branch
- 仓库结构：.git、main/master 分支、README、package.json
- Issue 状态：open、closed、locked；标签 (labels)、里程碑 (milestones)
- PR 状态：open、closed、merged、draft；CI 检查、审查意见
- 认证：gh auth login、Personal Access Token、SSH Key

---

## 工作流

### NODE-01: 需求解析

```yaml
id: NODE-01
input: user.request
action: |
  解析用户意图：
  - 操作类型：搜索/克隆/同步/查看 Issue/检查 PR
  - 目标仓库：owner/repo 或搜索关键词
  - 附加条件：label、milestone、状态过滤
success_criteria: 操作类型和目标明确
output: intent {operation, target_repo, filters{}}
on_success: NODE-02
on_failure:
  action: 请求用户澄清操作类型和仓库
  fallback: ABORT
```

### NODE-02: 认证检查

```yaml
id: NODE-02
input: NODE-01.intent
action: |
  检查 gh 认证状态：
  - 执行 gh auth status
  - 如未认证：引导 gh auth login
  - 确认有仓库访问权限
success_criteria: gh 已认证且可用
output: auth_status {authenticated, user, scopes[]}
on_success: NODE-03
on_failure:
  action: 执行 gh auth login 引导认证
  fallback: ABORT
```

### NODE-03: 分支 - 操作类型路由

```yaml
id: NODE-03
type: branch
input: NODE-01.intent
condition: NODE-01.intent.operation
if_equals:
  - value: search
    next: NODE-04-search
  - value: clone
    next: NODE-04-clone
  - value: sync
    next: NODE-04-sync
  - value: list-issues
    next: NODE-04-issues
  - value: list-prs
    next: NODE-04-prs
  - value: check-pr
    next: NODE-04-pr-detail
default:
  action: 告知用户不支持的操作
  fallback: NODE-FINAL
```

### NODE-04-search: 搜索仓库

```yaml
id: NODE-04-search
input: NODE-01.intent.target_repo
action: |
  执行搜索：
  - gh repo list ${user} --limit 100
  - 或 web 搜索：gh search repos ${query}
  - 过滤匹配结果
success_criteria: 返回非空结果列表
output: search_results {repos[{name, description, url, stars, updated_at}]}
on_success: NODE-05
on_failure:
  action: 建议用户提供更具体的关键词
  fallback: NODE-FINAL
```

### NODE-04-clone: 克隆仓库

```yaml
id: NODE-04-clone
input: NODE-01.intent.target_repo
action: |
  克隆仓库：
  - 检查本地是否已存在
  - gh repo clone ${owner}/${repo} ${dest_dir}
  - 确认克隆成功
success_criteria: 本地有.git 目录且可访问
output: clone_result {path, branch, last_commit}
on_success: NODE-05
on_failure:
  action: 检查权限和网络问题
  fallback: ABORT
```

### NODE-04-sync: 同步仓库

```yaml
id: NODE-04-sync
input: NODE-01.intent.target_repo
action: |
  同步仓库：
  - cd 到仓库目录
  - git checkout main (或指定分支)
  - gh repo sync ${owner}/${repo} --force
  - 或 git pull upstream main
success_criteria: 本地与 upstream 一致
output: sync_result {branch, commits_behind, commits_ahead, synced}
on_success: NODE-05
on_failure:
  action: 检查 upstream 配置和权限
  fallback: ABORT
```

### NODE-04-issues: 列出 Issue

```yaml
id: NODE-04-issues
input: NODE-01.intent.target_repo, NODE-01.intent.filters
action: |
  列出 Issue：
  - gh issue list --repo ${owner}/${repo}
  - 应用过滤：--label, --milestone, --state
  - 限制数量：--limit 20
success_criteria: 返回 Issue 列表
output: issues [{number, title, state, labels[], author, updated_at}]
on_success: NODE-05
on_failure:
  retry: 1
  fallback: NODE-FINAL
```

### NODE-04-prs: 列出 PR

```yaml
id: NODE-04-prs
input: NODE-01.intent.target_repo, NODE-01.intent.filters
action: |
  列出 PR：
  - gh pr list --repo ${owner}/${repo}
  - 应用过滤：--state, --author, --label
  - 包含 CI 状态：--json checkSuites
success_criteria: 返回 PR 列表
output: prs [{number, title, state, author, mergeable, ci_status, reviews}]
on_success: NODE-05
on_failure:
  retry: 1
  fallback: NODE-FINAL
```

### NODE-04-pr-detail: PR 详情检查

```yaml
id: NODE-04-pr-detail
input: NODE-01.intent.target_repo, NODE-01.intent.pr_number
action: |
  获取 PR 详情：
  - gh pr view ${pr_number} --repo ${owner}/${repo} --json files,commits,reviews,checkSuites
  - 分析变更文件
  - 检查 CI 结果
  - 查看审查意见
success_criteria: 获取完整 PR 信息
output: pr_detail {files[], commits[], reviews[], ci_status, mergeable}
on_success: NODE-05
on_failure:
  action: 检查 PR 号是否正确
  fallback: NODE-FINAL
```

### NODE-05: 结果格式化

```yaml
id: NODE-05
input: NODE-04-*.output
action: |
  格式化输出：
  - 表格形式 (如适用)
  - 关键信息高亮
  - 添加操作建议 (下一步)
success_criteria: 输出清晰易读
output: formatted_result
on_success: NODE-FINAL
```

### NODE-FINAL: 输出并建议

```yaml
id: NODE-FINAL
type: end
input: NODE-05.formatted_result
action: |
  输出结果：
  1. 展示查询/操作结果
  2. 提供后续操作建议
     - 克隆后：是否需要打开 IDE?
     - Issue 列表：是否需要查看某个 Issue 详情？
     - PR 列表：是否需要审查某个 PR?
  3. 记录操作历史 (可选)
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "克隆 xxx 仓库"
- "同步代码"
- "查看 Issue"
- "检查 PR"
- "列出 PR"
- "gh repo clone"
- "GitHub 仓库管理"
