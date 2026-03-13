---
name: web-quality-audit-ecc
description: Web质量综合审计 - 学会使用Lighthouse等工具进行性能、可访问性、SEO和最佳实践的全面Web质量审计。当龙虾需要对网站进行全面质量评估、优化建议或合规检查时触发。触发词：Web质量审计、性能审计、可访问性检查、SEO审计、Lighthouse分析、WCAG合规。
version: 2.0.0
type: executable-sop
metadata:
  category: Web 开发
  module: 质量保证
  level: 中级
  estimated_time: 2.5小时
  prerequisites: []
  tools_required: [browser, web_fetch, exec]
---

# Web 质量审计

## 知识库

- Lighthouse是Google的开源自动化工具，用于改进网页质量
- 四大核心指标：性能(Performance)、可访问性(Accessibility)、最佳实践(Best Practices)、SEO
- 性能关键指标：FCP(首次内容绘制)、LCP(最大内容绘制)、FID(首次输入延迟)、CLS(累积布局偏移)
- 可访问性标准：WCAG 2.1 AA级别合规
- SEO基础：元标签、结构化数据、移动友好性、页面速度
- 最佳实践：HTTPS、安全headers、图像优化、缓存策略

---

## 工作流

### NODE-01: 接收审计任务

```yaml
id: NODE-01
input: user.query, target_url
action: |
  解析用户输入，提取目标URL和审计重点
  验证URL格式有效性
success_criteria: URL有效且审计范围明确
output: audit_url, audit_scope
on_success: NODE-02
on_failure:
  action: 向用户请求有效的URL和审计需求
  fallback: ABORT
```

### NODE-02: 预检网站可访问性

```yaml
id: NODE-02
input: NODE-01.audit_url
action: |
  web_fetch(url="${input}", extractMode="text")
  检查基本可访问性（HTTP状态码、内容加载）
success_criteria: HTTP状态码为200且内容可加载
output: site_accessible
on_success: NODE-03
on_failure:
  retry: 2
  backoff: exponential
  fallback: ABORT
```

### NODE-03: 执行Lighthouse审计

```yaml
id: NODE-03
input: NODE-01.audit_url, NODE-01.audit_scope
action: |
  使用浏览器工具执行Lighthouse审计
  根据audit_scope调整审计配置
  收集四个维度的详细报告
success_criteria: 成功获取完整的Lighthouse报告
output: lighthouse_report {performance, accessibility, best_practices, seo, opportunities, diagnostics}
on_success: NODE-04
on_failure:
  retry: 1
  fallback: NODE-05  # 尝试手动审计
```

### NODE-04: 分析审计结果

```yaml
id: NODE-04
input: NODE-03.lighthouse_report
action: |
  识别关键问题和改进机会
  按优先级排序问题（高/中/低）
  计算各维度得分和整体质量指数
success_criteria: 完成问题分类和优先级排序
output: analyzed_results {critical_issues[], medium_issues[], low_issues[], scores, quality_index}
on_success: NODE-06
on_failure:
  fallback: ABORT
```

### NODE-05: 手动审计备选方案

```yaml
id: NODE-05
type: branch
input: NODE-01.audit_url, NODE-01.audit_scope
action: |
  手动检查关键指标：
  - 性能：页面加载时间、资源大小
  - 可访问性：alt标签、语义化HTML、颜色对比度
  - SEO：标题、描述、h1标签、内部链接
  - 最佳实践：HTTPS、响应式设计、错误处理
success_criteria: 完成至少3个维度的手动检查
output: manual_audit_results
on_success: NODE-07
on_failure:
  fallback: ABORT
```

### NODE-06: 生成优化建议

```yaml
id: NODE-06
input: NODE-04.analyzed_results
action: |
  为每个问题提供具体的优化建议
  包含实施步骤、预期效果和难度评估
  提供代码示例（如适用）
success_criteria: 每个关键问题都有对应的优化建议
output: optimization_recommendations
on_success: NODE-08
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-07: 生成手动审计报告

```yaml
id: NODE-07
input: NODE-05.manual_audit_results
action: |
  整理手动审计发现
  提供基于观察的改进建议
  标注结果的局限性
success_criteria: 报告结构清晰且建议实用
output: manual_audit_report
on_success: NODE-FINAL
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-08: 创建实施路线图

```yaml
id: NODE-08
input: NODE-06.optimization_recommendations, NODE-04.analyzed_results
action: |
  制定分阶段实施计划：
  - 立即可修复（快速胜利）
  - 短期优化（1-2周）
  - 长期改进（架构级变更）
  估算每项改进的ROI和实施成本
success_criteria: 路线图包含时间线、优先级和资源需求
output: implementation_roadmap
on_success: NODE-09
on_failure:
  fallback: NODE-09  # 继续但跳过路线图
```

### NODE-09: 生成综合审计报告

```yaml
id: NODE-09
input: NODE-04.analyzed_results, NODE-06.optimization_recommendations, NODE-08.implementation_roadmap
action: |
  创建完整的审计报告：
  - 执行摘要
  - 详细发现（按类别）
  - 优化建议
  - 实施路线图
  - 预期改进效果
success_criteria: 报告专业、完整且可操作
output: comprehensive_audit_report
on_success: NODE-FINAL
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-FINAL: 输出并汇报

```yaml
id: NODE-FINAL
type: end
input: NODE-09.comprehensive_audit_report or NODE-07.manual_audit_report
action: |
  1. 格式化最终审计报告
  2. 发送给用户
  3. 询问是否需要深入某个特定方面或重新审计
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "审计这个网站的质量"
- "Lighthouse分析"
- "性能优化建议"
- "可访问性检查"
- "SEO审计"
- "Web最佳实践检查"