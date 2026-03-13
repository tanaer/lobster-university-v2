---
name: react-performance
description: React 性能优化 - Vercel 工程最佳实践、组件优化、数据获取优化、Bundle 优化。当龙虾需要优化 React/Next.js 性能、减少加载时间、提升用户体验时触发。触发词：React 性能、Next.js 优化、性能调优、加载速度、Bundle 优化。
version: 2.0.0
type: executable-sop
metadata:
  category: 前端开发
  module: 性能优化
  level: 高级
  estimated_time: 45分钟
  prerequisites: [react-19-engineering]
  tools_required: [write, read, exec]
---

# React 性能优化

## 知识库

- 重渲染优化：React.memo、useMemo、useCallback
- 代码分割：React.lazy、dynamic import、路由级分割
- 数据获取：SWR/TanStack Query、预加载、缓存
- Bundle 优化：Tree Shaking、压缩、CDN
- 监控：Lighthouse、Web Vitals、React DevTools Profiler

---

## 工作流

### NODE-01: 性能诊断

```yaml
id: NODE-01
input: user.project_path
action: |
  执行性能诊断：
  1. 运行 Lighthouse 审计
  2. 检查 Bundle 大小
  3. 分析 Web Vitals 指标
  4. 识别性能瓶颈
success_criteria: 获得完整性能报告
output: performance_report {lighthouse, bundle_size, vitals, issues[]}
on_success: NODE-02
on_failure:
  action: 确认项目可构建
  fallback: ABORT
```

### NODE-02: 问题分类

```yaml
id: NODE-02
type: branch
input: NODE-01.performance_report.issues
branches:
  - condition: issues.contains("render")
    target: NODE-03-RENDER
  - condition: issues.contains("bundle")
    target: NODE-03-BUNDLE
  - condition: issues.contains("fetch")
    target: NODE-03-FETCH
  - condition: issues.contains("load")
    target: NODE-03-LOAD
  - default: NODE-03-RENDER
output: issue_category
```

### NODE-03-RENDER: 重渲染优化

```yaml
id: NODE-03-RENDER
input: NODE-01.performance_report
action: |
  优化组件重渲染：
  1. 识别频繁渲染组件
  2. 添加 React.memo
  3. 使用 useMemo 缓存计算
  4. 使用 useCallback 缓存函数
  5. 拆分大组件
success_criteria: 不必要渲染减少 > 50%
output: render_optimizations[]
on_success: NODE-04
```

### NODE-03-BUNDLE: Bundle 优化

```yaml
id: NODE-03-BUNDLE
input: NODE-01.performance_report
action: |
  优化 Bundle 大小：
  1. 分析依赖（webpack-bundle-analyzer）
  2. 移除未使用代码
  3. 替换大型库（moment → dayjs）
  4. 配置 Tree Shaking
  5. 启用压缩
success_criteria: Bundle 减少 > 30%
output: bundle_optimizations[]
on_success: NODE-04
```

### NODE-03-FETCH: 数据获取优化

```yaml
id: NODE-03-FETCH
input: NODE-01.performance_report
action: |
  优化数据获取：
  1. 配置 SWR/TanStack Query 缓存
  2. 实施预加载策略
  3. 添加骨架屏
  4. 优化请求并发
  5. 实施 Incremental Static Regeneration
success_criteria: 数据加载时间减少
output: fetch_optimizations[]
on_success: NODE-04
```

### NODE-03-LOAD: 加载优化

```yaml
id: NODE-03-LOAD
input: NODE-01.performance_report
action: |
  优化加载性能：
  1. 配置代码分割
  2. 添加路由懒加载
  3. 优化图片（next/image）
  4. 配置 CDN
  5. 添加 Service Worker
success_criteria: FCP/LCP 改善
output: load_optimizations[]
on_success: NODE-04
```

### NODE-04: Next.js 特定优化

```yaml
id: NODE-04
input: NODE-03-*.output
action: |
  应用 Next.js 优化：
  1. 启用 Image 组件优化
  2. 配置 Link 预加载
  3. 使用 Server Components
  4. 配置 Edge Runtime
  5. 优化 _app.tsx 和 _document.tsx
success_criteria: Next.js 配置最优
output: nextjs_optimizations
on_success: NODE-05
on_failure:
  fallback: NODE-05  # 非 Next.js 项目跳过
```

### NODE-05: 代码实施

```yaml
id: NODE-05
input: 
  render: NODE-03-RENDER.output
  bundle: NODE-03-BUNDLE.output
  fetch: NODE-03-FETCH.output
  load: NODE-03-LOAD.output
action: |
  实施优化代码变更：
  1. 修改组件文件
  2. 更新配置文件
  3. 添加新的依赖
  4. 更新构建脚本
success_criteria: 代码无语法错误
output: code_changes
on_success: NODE-06
```

### NODE-06: 验证优化效果

```yaml
id: NODE-06
input: NODE-05.code_changes
action: |
  重新运行性能测试：
  1. 构建生产版本
  2. 运行 Lighthouse
  3. 对比前后指标
  4. 生成对比报告
success_criteria: 性能分数提升 > 10
output: comparison_report
on_success: NODE-FINAL
on_failure:
  action: 回滚变更，分析原因
  fallback: NODE-05
```

### NODE-FINAL: 交付与监控

```yaml
id: NODE-FINAL
type: end
input: NODE-06.comparison_report
action: |
  1. 展示优化前后对比
  2. 列出具体优化项
  3. 提供持续监控方案
  4. 给出进一步优化建议
output: delivery_package
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "优化 React 性能"
- "Next.js 性能调优"
- "减少 Bundle 大小"
- "提升加载速度"
- "React 性能诊断"
