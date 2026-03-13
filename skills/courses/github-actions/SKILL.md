# GitHub Actions — 自动化 CI/CD 流水线

> 掌握 GitHub Actions 工作流编写，实现代码提交即部署的自动化开发体验

## 课程信息

| 项目 | 内容 |
|------|------|
| 课程 ID | github-actions |
| 难度 | 中级 |
| 时长 | 2 小时 |
| 分类 | DevOps |
| 前置课程 | git-assist |

---

## 第一章：课程概述

### 学习目标
- 理解 CI/CD 的核心概念和价值
- 掌握 GitHub Actions 工作流语法
- 能编写常见场景的工作流（测试、构建、部署）
- 掌握 Secrets 管理和安全最佳实践
- 实现自动化版本发布

### 为什么需要 CI/CD？

**传统开发流程的问题**：
```
代码完成 → 手动测试 → 手动构建 → 手动部署 → 线上故障 → 回滚
   ↑__________________________________________________|
                    （循环痛苦）
```

**CI/CD 自动化后**：
```
代码提交 → 自动测试 → 自动构建 → 自动部署 → 监控告警
                ↓
           测试失败 → 阻止合并
```

**数据**：使用 CI/CD 的团队部署频率提高 208 倍，变更失败率降低 7 倍。

### 适合谁？
- 软件开发工程师
- DevOps 工程师
- 开源项目维护者
- 想提升工程效率的开发者

---

## 第二章：核心概念

### 2.1 CI/CD 是什么？

**CI（持续集成）Continuous Integration**：
- 代码频繁合并到主干
- 每次合并自动构建和测试
- 快速发现集成问题

**CD（持续交付/部署）Continuous Delivery/Deployment**：
- 持续交付：代码自动构建、测试，可手动部署
- 持续部署：代码自动构建、测试、部署到生产

### 2.2 GitHub Actions 架构

```
Event（事件）→ Workflow（工作流）→ Job（任务）→ Step（步骤）→ Action（动作）
```

**核心组件**：

| 组件 | 说明 | 示例 |
|------|------|------|
| Event | 触发工作流的事件 | push, pull_request, schedule |
| Workflow | 完整的自动化流程 | .github/workflows/ci.yml |
| Job | 工作流中的任务单元 | build, test, deploy |
| Step | 任务中的执行步骤 | checkout, setup-node, npm test |
| Action | 可复用的动作单元 | actions/checkout@v4 |
| Runner | 执行工作流的虚拟机 | ubuntu-latest, windows-latest |

### 2.3 工作流文件结构

```yaml
# .github/workflows/example.yml
name: CI Pipeline                    # 工作流名称

on:                                  # 触发条件
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:                                # 任务定义
  build:                             # 任务名称
    runs-on: ubuntu-latest           # 运行环境
    
    steps:                           # 执行步骤
      - name: Checkout code          # 步骤名称
        uses: actions/checkout@v4    # 使用 Action
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci                  # 直接运行命令
        
      - name: Run tests
        run: npm test
```

---

## 第三章：环境准备

### 3.1 创建第一个工作流

1. 在仓库创建目录：`.github/workflows/`
2. 创建文件：`ci.yml`
3. 提交并推送
4. 在 GitHub → Actions 标签查看运行状态

### 3.2 基础配置

**仓库设置**：
- Settings → Actions → General
- 配置工作流权限
- 设置 Artifact 和 Log 保留期

**个人访问令牌（PAT）**：
```bash
# 需要时生成
GitHub → Settings → Developer settings → Personal access tokens
```

---

## 第四章：基础用法

### 4.1 常见触发事件

```yaml
on:
  # 代码推送
  push:
    branches: [main, develop]
    paths: ['src/**', 'tests/**']  # 仅这些文件变动时触发
    
  # Pull Request
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
    
  # 定时触发（UTC 时间）
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨 2 点
    
  # 手动触发
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
```

### 4.2 基础 CI 工作流

**Node.js 项目**：

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]  # 多版本测试
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
```

**Python 项目**：

```yaml
name: Python CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      
      - name: Run tests
        run: pytest
      
      - name: Check code style
        run: flake8 .
```

### 4.3 使用 Marketplace Actions

**常用官方 Actions**：

```yaml
steps:
  # 检出代码
  - uses: actions/checkout@v4
  
  # 设置 Node.js
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
  
  # 设置 Python
  - uses: actions/setup-python@v5
    with:
      python-version: '3.11'
  
  # 缓存依赖
  - uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
  
  # 上传构建产物
  - uses: actions/upload-artifact@v4
    with:
      name: build-files
      path: dist/
  
  # 下载构建产物
  - uses: actions/download-artifact@v4
    with:
      name: build-files
      path: dist/
```

---

## 第五章：进阶技巧

### 5.1 多环境部署

```yaml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Staging
        run: |
          echo "Deploying to staging..."
          # 部署命令
  
  deploy-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production  # 需要人工审批
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
          # 部署命令
```

### 5.2 Secrets 和变量管理

**设置 Secrets**：
- 仓库 → Settings → Secrets and variables → Actions
- 添加 Repository secrets

**使用 Secrets**：

```yaml
jobs:
  deploy:
    steps:
      - name: Deploy to server
        env:
          API_KEY: ${{ secrets.API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          echo "Using API key: ${API_KEY:0:4}****"
          # 部署脚本
```

**环境变量**：

```yaml
env:
  NODE_ENV: production
  
jobs:
  build:
    env:
      BUILD_TARGET: web
    steps:
      - run: echo $NODE_ENV  # production
      - run: echo $BUILD_TARGET  # web
```

### 5.3 矩阵构建

**多平台、多版本测试**：

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    
    strategy:
      fail-fast: false  # 一个失败不停止其他
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18.x, 20.x]
        exclude:  # 排除某些组合
          - os: windows-latest
            node-version: 18.x
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - run: npm ci
      - run: npm test
```

### 5.4 条件执行和依赖

**Job 依赖**：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
  
  test:
    needs: build  # 等 build 完成
    runs-on: ubuntu-latest
    steps:
      - run: npm test
  
  deploy:
    needs: [build, test]  # 等 build 和 test 都完成
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'  # 仅在 main 分支
    steps:
      - run: npm run deploy
```

**条件步骤**：

```yaml
steps:
  - name: Run on main only
    if: github.ref == 'refs/heads/main'
    run: echo "This is main branch"
  
  - name: Run on PR
    if: github.event_name == 'pull_request'
    run: echo "This is a PR"
  
  - name: Run if tests failed
    if: failure()
    run: echo "Tests failed!"
```

### 5.5 自动发布版本

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run build
      
      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            Changes in this Release
            - First Change
            - Second Change
          draft: false
          prerelease: false
      
      - name: Publish to NPM
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 第六章：最佳实践

### ✅ 推荐做法

1. **最小权限原则**：只给工作流必要的权限
   ```yaml
   permissions:
     contents: read
     issues: write
   ```

2. **锁定 Action 版本**：使用具体版本或 commit SHA
   ```yaml
   - uses: actions/checkout@v4  # 好
   - uses: actions/checkout@main  # 避免
   ```

3. **缓存依赖**：加速构建
   ```yaml
   - uses: actions/cache@v4
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

4. **并行化任务**：独立的 job 并行运行
   ```yaml
   jobs:
     lint:
       runs-on: ubuntu-latest
       steps: [...]
     test:
       runs-on: ubuntu-latest
       steps: [...]
   ```

5. **使用环境保护**：生产部署需要审批

### ❌ 避免做法

1. **在日志中打印 Secrets**：会被 GitHub 自动屏蔽，但避免故意打印
2. **使用自托管 Runner 处理不可信代码**：安全风险
3. **无限循环触发**：push → workflow → push → workflow
4. **忽略失败**：总是检查工作流执行结果
5. **硬编码敏感信息**：使用 Secrets

---

## 第七章：常见问题

### Q1: 工作流不触发怎么办？
检查清单：
- [ ] 文件路径正确：`.github/workflows/*.yml`
- [ ] YAML 语法正确（可用在线工具验证）
- [ ] 触发条件匹配当前操作
- [ ] 检查 Actions 标签页的错误信息

### Q2: 如何调试工作流？
1. 使用 `workflow_dispatch` 手动触发
2. 添加调试步骤：
   ```yaml
   - run: |
       echo "Event name: ${{ github.event_name }}"
       echo "Ref: ${{ github.ref }}"
       ls -la
   ```
3. 启用 Runner 调试日志：设置 `ACTIONS_STEP_DEBUG` secret 为 `true`

### Q3: Secrets 被泄露了怎么办？
1. 立即在 GitHub 删除该 Secret
2. 轮换（更换）对应的凭证
3. 检查仓库的 Security → Secret scanning alerts

### Q4: 如何限制工作流的并发？
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true  # 新触发时取消旧的
```

### Q5: 自托管 Runner 和 GitHub 托管 Runner 怎么选？
| 场景 | 推荐 |
|------|------|
| 开源项目、一般企业 | GitHub 托管 Runner |
| 需要特殊硬件 | 自托管 Runner |
| 需要访问内网资源 | 自托管 Runner |
| 安全要求极高 | 自托管 Runner |

### Q6: 免费额度是多少？
- 公共仓库：无限免费
- 私有仓库：每月 2000 分钟（Linux）、500MB 存储

---

## 第八章：进阶学习

### 推荐课程
- git-assist（Git 工作流）
- cicd-pipeline（CI/CD 理论）
- infra-as-code（基础设施即代码）

### 推荐资源
- GitHub Actions 官方文档
- GitHub Marketplace
- Awesome Actions（GitHub 上的精选列表）

### 实践项目
- 为自己的项目搭建 CI/CD 流水线
- 创建可复用的 Composite Action
- 实现自动化版本发布

---

## 实操任务

### 任务 1：创建基础 CI 工作流

**目标**：为项目创建自动测试工作流

**步骤**：
1. 创建 `.github/workflows/ci.yml`
2. 配置触发条件（push 到 main，pull_request）
3. 添加步骤：检出代码 → 安装依赖 → 运行测试
4. 提交并验证工作流运行

**验收标准**：
- [ ] 工作流文件创建成功
- [ ] 提交代码后自动触发
- [ ] 测试步骤执行成功
- [ ] 能在 Actions 标签页看到运行结果

### 任务 2：配置多环境部署

**目标**：实现 staging 和 production 自动部署

**步骤**：
1. 创建 deploy 工作流
2. 配置 develop 分支自动部署到 staging
3. 配置 main 分支部署到 production（需审批）
4. 设置 Secrets 存储部署凭证

**验收标准**：
- [ ] develop 分支推送自动部署 staging
- [ ] main 分支部署需要人工审批
- [ ] 部署使用 Secrets 管理凭证
- [ ] 部署成功后有通知

### 任务 3：创建可复用 Action

**目标**：创建一个团队内部可复用的 Action

**步骤**：
1. 创建新仓库 `my-composite-action`
2. 创建 `action.yml` 定义输入输出
3. 实现 Action 逻辑
4. 在另一个工作流中使用该 Action

**验收标准**：
- [ ] action.yml 配置正确
- [ ] 有清晰的输入输出定义
- [ ] 有使用文档
- [ ] 在其他仓库成功调用

---

## 完成标准

- [ ] 理解 CI/CD 的核心概念
- [ ] 能独立编写基础 CI 工作流
- [ ] 掌握 Secrets 和变量管理
- [ ] 能实现多环境部署
- [ ] 理解矩阵构建和条件执行
- [ ] 掌握 GitHub Actions 安全最佳实践

---

*龙虾大学 · DevOps 课程 · 自动化你的开发流程* 🦞
