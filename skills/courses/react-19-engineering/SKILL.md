---
name: react-19-engineering
description: React 19 工程化实践 - Server Components、Hooks 进阶、Zustand 状态管理、TanStack Query、生产部署。当龙虾需要搭建 React 19 项目、优化组件架构、配置状态管理时触发。触发词：React 19、Server Components、Zustand、TanStack Query、React 工程化。
version: 2.0.0
type: executable-sop
metadata:
  category: 前端开发
  module: React 进阶
  level: 高级
  estimated_time: 60分钟
  prerequisites: [react-19-depth]
  tools_required: [write, read, exec]
---

# React 19 工程化实践

## 知识库

- Server Components：服务端渲染、流式传输、Suspense
- Zustand：轻量状态管理、persist、devtools
- TanStack Query：数据获取、缓存、乐观更新
- Hooks 规范：依赖数组、自定义 Hook 拆分
- 目录结构：features/、components/、hooks/、lib/

---

## 工作流

### NODE-01: 项目类型判断

```yaml
id: NODE-01
input: user.request
action: |
  确定工程化需求类型：
  - 新项目初始化
  - 现有项目升级
  - 特定功能实现（状态管理/数据获取）
  - 性能优化
success_criteria: 需求类型明确
output: task_type
on_success: NODE-02
on_failure:
  action: 询问用户具体需求
  fallback: ABORT
```

### NODE-02: 路由分发

```yaml
id: NODE-02
type: branch
input: NODE-01.task_type
branches:
  - condition: type == "new_project"
    target: NODE-03-INIT
  - condition: type == "upgrade"
    target: NODE-03-UPGRADE
  - condition: type == "state_management"
    target: NODE-03-STATE
  - condition: type == "data_fetching"
    target: NODE-03-QUERY
  - condition: type == "optimization"
    target: NODE-03-OPT
  - default: NODE-03-INIT
output: route_target
```

### NODE-03-INIT: 项目初始化

```yaml
id: NODE-03-INIT
input: user.request
action: |
  创建 React 19 项目结构：
  1. 初始化命令（Next.js 或 Vite）
  2. 配置 TypeScript
  3. 设置目录结构
  4. 配置 ESLint + Prettier
  5. 安装核心依赖
success_criteria: 项目可启动
output: project_structure
on_success: NODE-04
```

### NODE-03-UPGRADE: 项目升级

```yaml
id: NODE-03-UPGRADE
input: user.project_path
action: |
  升级现有项目到 React 19：
  1. 检查当前 React 版本
  2. 更新 package.json 依赖
  3. 迁移废弃 API
  4. 添加 Server Components 支持
success_criteria: 升级后无破坏性变更
output: upgrade_report
on_success: NODE-04
```

### NODE-03-STATE: Zustand 状态管理

```yaml
id: NODE-03-STATE
input: user.state_requirements
action: |
  配置 Zustand 状态管理：
  1. 创建 store 文件
  2. 定义 state 类型
  3. 实现 actions
  4. 配置 persist（持久化）
  5. 添加 devtools
success_criteria: store 可用，类型完整
output: zustand_setup
on_success: NODE-04
```

### NODE-03-QUERY: TanStack Query 配置

```yaml
id: NODE-03-QUERY
input: user.data_requirements
action: |
  配置 TanStack Query：
  1. 创建 QueryClient
  2. 定义 query keys
  3. 实现 useQuery hooks
  4. 实现 useMutation hooks
  5. 配置缓存策略
success_criteria: 数据获取流程完整
output: query_setup
on_success: NODE-04
```

### NODE-03-OPT: 性能优化

```yaml
id: NODE-03-OPT
input: user.project_path
action: |
  执行性能优化：
  1. 分析 Bundle 大小
  2. 实施代码分割
  3. 优化重渲染（memo、useMemo）
  4. 配置懒加载
success_criteria: 性能指标提升
output: optimization_report
on_success: NODE-04
```

### NODE-04: Server Components 配置

```yaml
id: NODE-04
input: NODE-03-*.output
action: |
  配置 Server Components：
  1. 标记 'use server' 指令
  2. 创建 Server Actions
  3. 配置 Suspense 边界
  4. 设置流式传输
success_criteria: SSR/SSG 配置正确
output: server_components_config
on_success: NODE-05
on_failure:
  retry: 1
  action: 检查 Next.js 版本兼容性
```

### NODE-05: 代码质量检查

```yaml
id: NODE-05
input: project_files
action: |
  执行代码质量检查：
  1. TypeScript 类型检查
  2. ESLint 检查
  3. 构建测试
success_criteria: 无错误和警告
output: quality_report
on_success: NODE-FINAL
on_failure:
  action: 返回错误列表，请求修复
  fallback: NODE-04
```

### NODE-FINAL: 交付与文档

```yaml
id: NODE-FINAL
type: end
input: NODE-05.quality_report
action: |
  1. 总结工程化配置
  2. 提供启动命令
  3. 输出目录结构说明
  4. 给出后续优化建议
output: delivery_package
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "初始化 React 19 项目"
- "配置 Zustand 状态管理"
- "设置 TanStack Query"
- "升级到 React 19"
- "React 工程化配置"
