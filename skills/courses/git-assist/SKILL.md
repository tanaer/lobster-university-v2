# Git 工作流助手 — 可执行 SOP

> 学完这门课，Agent 能独立完成：从代码变更到规范化 commit、PR 描述、changelog 的全流程

## 课程元数据

| 项目 | 内容 |
|------|------|
| 课程 ID | git-assist |
| 难度 | 中级 |
| 预计执行时间 | 15 分钟 |
| 前置技能 | shell-basics, 已安装 git |
| 输出物 | 规范化 commit + PR 描述 + changelog 条目 |

---

## 工作流总览

```
[代码变更] → Step 1: 检查环境 → Step 2: 分析 diff → Step 3: 生成 commit → Step 4: 生成 PR → Step 5: 更新 changelog → [完成]
```

---

## Step 1: 检查环境与变更状态

### 输入
- 当前工作目录（必须是 git 仓库）

### 执行
```bash
# 1. 确认在 git 仓库内
git rev-parse --is-inside-work-tree

# 2. 检查是否有变更
git status --porcelain

# 3. 获取当前分支名
git branch --show-current

# 4. 检查远程仓库
git remote -v
```

### 判断条件
- ✅ 成功：`git status --porcelain` 有输出（存在变更）
- ❌ 失败A：不在 git 仓库 → 提示用户 `cd` 到正确目录
- ❌ 失败B：无变更 → 提示"没有需要提交的变更"，流程结束
- 🔄 失败处理：输出错误信息，终止流程

### 输出
- `BRANCH_NAME`: 当前分支名
- `CHANGED_FILES`: 变更文件列表
- `HAS_STAGED`: 是否有已暂存文件

---

## Step 2: 分析 diff 内容

### 输入
- Step 1 确认的变更文件列表

### 执行
```bash
# 1. 查看暂存区 diff（优先）
git diff --cached --stat
git diff --cached

# 2. 如果暂存区为空，查看工作区 diff
git diff --stat
git diff

# 3. 如果是新文件，查看内容
git diff --cached --name-status | grep "^A"
```

### 判断条件
- ✅ 成功：获取到 diff 内容，能识别变更类型
- ❌ 失败：diff 为空（可能是二进制文件）→ 用 `git diff --stat` 获取文件名，基于文件名推断
- 🔄 失败处理：仅基于文件名和 `--stat` 生成 commit message

### 输出
- `DIFF_CONTENT`: diff 全文
- `DIFF_STAT`: 变更统计
- `CHANGE_TYPE`: 变更类型分类（feat/fix/refactor/docs/style/test/chore）

### 变更类型判断规则

| 信号 | 类型 | 说明 |
|------|------|------|
| 新增文件 + 功能代码 | `feat` | 新功能 |
| 修改已有逻辑 + 修复 bug | `fix` | 修复 |
| 重命名/移动/重组代码 | `refactor` | 重构 |
| 仅 .md/.txt 变更 | `docs` | 文档 |
| 仅格式/空格/缩进 | `style` | 样式 |
| *_test.* / *.spec.* 文件 | `test` | 测试 |
| package.json/CI 配置 | `chore` | 杂务 |

---

## Step 3: 生成 Conventional Commit

### 输入
- Step 2 的 `DIFF_CONTENT`、`CHANGE_TYPE`

### 执行

**Commit Message 格式（Conventional Commits）：**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**生成规则：**
1. `type`: 从 Step 2 的 `CHANGE_TYPE` 获取
2. `scope`: 从变更文件路径推断（如 `auth`、`api`、`ui`）
3. `subject`: 50 字符内，祈使语气，不加句号
4. `body`: 解释 what 和 why（不是 how），每行 72 字符
5. `footer`: Breaking Change 用 `BREAKING CHANGE:`，关联 issue 用 `Closes #123`

**执行提交：**
```bash
# 1. 暂存变更（如果未暂存）
git add -A  # 或选择性 git add <files>

# 2. 提交
git commit -m "<type>(<scope>): <subject>" -m "<body>" -m "<footer>"

# 3. 验证提交
git log --oneline -1
```

### 判断条件
- ✅ 成功：`git log --oneline -1` 显示刚才的 commit
- ❌ 失败A：pre-commit hook 失败 → 查看 hook 输出，修复后重试
- ❌ 失败B：commit message 格式错误 → 用 `git commit --amend` 修正
- 🔄 失败处理：最多重试 2 次

### 输出
- `COMMIT_HASH`: 新 commit 的 hash
- `COMMIT_MSG`: 完整 commit message

### 示例

```
feat(auth): add OAuth2 login with GitHub provider

Implement GitHub OAuth2 flow using passport.js.
Users can now sign in with their GitHub account,
which auto-creates a local profile on first login.

Closes #42
```

---

## Step 4: 生成 PR 描述

### 输入
- `BRANCH_NAME`（Step 1）
- 本分支所有 commits：`git log main..HEAD --oneline`

### 执行

**PR 描述模板：**
```markdown
## What
[一句话说明这个 PR 做了什么]

## Why
[为什么需要这个变更]

## Changes
- [变更点 1]
- [变更点 2]
- [变更点 3]

## Testing
- [ ] 单元测试通过
- [ ] 手动测试通过
- [ ] 无破坏性变更

## Screenshots
[如有 UI 变更，附截图]
```

**生成规则：**
1. 从 commits 提取所有变更点
2. `What` 从最重要的 commit 提炼
3. `Why` 从 commit body 或 issue 关联推断
4. `Changes` 列出所有 commit 的 subject

**创建 PR（如果有 gh CLI）：**
```bash
# 检查 gh 是否可用
gh --version

# 创建 PR
gh pr create --title "<PR标题>" --body "<PR描述>" --base main
```

### 判断条件
- ✅ 成功：PR 创建成功，返回 PR URL
- ❌ 失败A：gh 未安装 → 输出 PR 描述文本，提示手动创建
- ❌ 失败B：无远程仓库 → 仅输出 PR 描述文本
- 🔄 失败处理：降级为输出文本

### 输出
- `PR_URL`: PR 链接（如果成功创建）
- `PR_DESCRIPTION`: PR 描述文本

---

## Step 5: 更新 Changelog

### 输入
- `COMMIT_MSG`（Step 3）
- 项目根目录的 `CHANGELOG.md`

### 执行

**Changelog 格式（Keep a Changelog）：**
```markdown
## [Unreleased]

### Added
- 新功能描述 (#PR号)

### Fixed
- 修复描述 (#PR号)

### Changed
- 变更描述 (#PR号)
```

**类型映射：**

| Commit Type | Changelog Section |
|-------------|-------------------|
| feat | Added |
| fix | Fixed |
| refactor | Changed |
| docs | Documentation |
| perf | Performance |
| BREAKING CHANGE | ⚠️ Breaking |

```bash
# 1. 检查 CHANGELOG.md 是否存在
test -f CHANGELOG.md && echo "exists" || echo "# Changelog" > CHANGELOG.md

# 2. 在 [Unreleased] 下添加条目
# （用 sed 或编辑器在正确位置插入）

# 3. 提交 changelog 更新
git add CHANGELOG.md
git commit -m "docs(changelog): update for latest changes"
```

### 判断条件
- ✅ 成功：CHANGELOG.md 已更新，新条目在 `[Unreleased]` 下
- ❌ 失败：文件格式异常 → 在文件顶部追加
- 🔄 失败处理：创建新的 CHANGELOG.md

### 输出
- 更新后的 CHANGELOG.md

---

## 验收标准

| 检查项 | 预期结果 | 验证命令 |
|--------|----------|----------|
| Commit 格式 | 符合 Conventional Commits | `git log --oneline -1` |
| Commit 内容 | 准确描述变更 | `git show --stat HEAD` |
| PR 描述 | 包含 What/Why/Changes | 查看 PR 页面 |
| Changelog | 新条目在 Unreleased 下 | `head -20 CHANGELOG.md` |
| 无遗漏文件 | 所有变更已提交 | `git status --porcelain` 为空 |

---

## 常见问题 & 排错

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| `not a git repository` | 不在 git 仓库目录 | `cd` 到项目根目录 |
| pre-commit hook 失败 | lint/format 不通过 | 运行 `npm run lint:fix` 后重试 |
| `gh: command not found` | GitHub CLI 未安装 | `brew install gh` 或手动创建 PR |
| merge conflict | 分支落后于 main | `git rebase main` 解决冲突 |
| commit message 太长 | subject 超 50 字符 | 精简描述，细节放 body |

---

## 扩展任务（选做）

- [ ] 配置 commitlint 自动校验 commit 格式
- [ ] 设置 husky pre-commit hook 自动 lint
- [ ] 用 `standard-version` 自动化版本发布
- [ ] 配置 GitHub Actions 自动生成 release notes
