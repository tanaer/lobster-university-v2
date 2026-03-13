---
name: similarweb-analytics
description: SimilarWeb网站流量与用户行为分析 - 学会使用SimilarWeb工具进行网站流量分析、用户行为研究、搜索流量分析和竞品对比。当龙虾需要分析网站流量、用户行为模式、关键词表现或竞品数据时触发。触发词：SimilarWeb分析、网站流量分析、竞品分析、用户行为分析。
version: 2.0.0
type: executable-sop
metadata:
  category: 数据科学
  module: 网站分析
  level: 中级
  estimated_time: 2小时
  prerequisites: [ga4-analytics]
  tools_required: [web_search, web_fetch, browser]
---

# SimilarWeb Analytics

## 知识库

- SimilarWeb提供网站流量、用户行为、地理分布、流量来源等数据
- 核心指标：总访问量、页面浏览量、跳出率、平均停留时间、页面/访问
- 流量来源分类：直接流量、推荐流量、搜索流量（有机+付费）、社交流量、展示广告
- 竞品分析功能可对比多个网站的关键指标
- 搜索分析显示关键词排名、搜索量、CPC等信息

---

## 工作流

### NODE-01: 接收分析任务

```yaml
id: NODE-01
input: user.query
action: |
  解析用户输入，提取目标网站域名和分析需求类型
success_criteria: 域名格式正确且分析需求明确
output: target_domain, analysis_type
on_success: NODE-02
on_failure:
  action: 向用户请求澄清目标网站和分析需求
  fallback: ABORT
```

### NODE-02: 验证网站可分析性

```yaml
id: NODE-02
input: NODE-01.target_domain
action: |
  web_search(query="site:${input} SimilarWeb", count=3)
success_criteria: 返回结果包含SimilarWeb相关数据
output: similarweb_available
on_success: NODE-03
on_failure:
  retry: 1
  fallback: NODE-04  # 尝试直接访问SimilarWeb
```

### NODE-03: 获取SimilarWeb数据

```yaml
id: NODE-03
input: NODE-01.target_domain
action: |
  使用浏览器导航到 SimilarWeb.com
  搜索目标域名
  提取关键指标数据
success_criteria: 成功获取至少5个核心指标
output: traffic_data {total_visits, pages_per_visit, bounce_rate, avg_visit_duration, traffic_sources}
on_success: NODE-05
on_failure:
  fallback: NODE-04
```

### NODE-04: 备用数据源搜索

```yaml
id: NODE-04
type: branch
input: NODE-01.target_domain
action: |
  web_search(query="${input} website traffic analytics", count=5)
  筛选可靠的数据源（如官方报告、行业分析）
success_criteria: 找到至少2个可靠数据源
output: alternative_sources[]
on_success: NODE-06
on_failure:
  fallback: ABORT
```

### NODE-05: 竞品分析（如果需要）

```yaml
id: NODE-05
input: NODE-01.analysis_type, NODE-03.traffic_data
condition: input.analysis_type contains "竞品" or "对比"
action: |
  识别主要竞品网站
  对每个竞品重复NODE-03流程
  生成对比表格
success_criteria: 完成至少2个网站的对比分析
output: competitor_analysis
on_success: NODE-07
on_failure:
  fallback: NODE-07  # 继续但跳过竞品部分
```

### NODE-06: 整合替代数据

```yaml
id: NODE-06
input: NODE-04.alternative_sources
action: |
  从每个数据源提取关键指标
  标注数据来源和可信度
  整合成统一格式
success_criteria: 数据格式统一且来源清晰
output: consolidated_data
on_success: NODE-08
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-07: 生成分析报告

```yaml
id: NODE-07
input: NODE-03.traffic_data, NODE-05.competitor_analysis
action: |
  创建结构化报告：
  - 执行摘要（关键发现）
  - 流量概览（趋势、总量）
  - 用户行为分析（参与度指标）
  - 流量来源分解
  - 竞品对比（如果适用）
  - 建议和洞察
success_criteria: 报告包含所有必需部分且数据准确
output: similarweb_report
on_success: NODE-FINAL
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-08: 生成替代分析报告

```yaml
id: NODE-08
input: NODE-06.consolidated_data
action: |
  创建基于替代数据源的分析报告
  明确标注数据局限性和估计性质
success_criteria: 报告透明说明数据来源和限制
output: alternative_report
on_success: NODE-FINAL
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-FINAL: 输出并汇报

```yaml
id: NODE-FINAL
type: end
input: NODE-07.similarweb_report or NODE-08.alternative_report
action: |
  1. 格式化最终报告
  2. 发送给用户
  3. 询问是否需要深入特定方面或导出数据
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "分析 xxx 网站的流量"
- "xxx 的SimilarWeb数据"
- "竞品网站分析"
- "用户行为分析"
- "网站流量来源"