---
name: xiaohongshu-analytics
description: 小红书数据分析 - 学会采集小红书公开数据、分析笔记内容与互动、识别优质博主和追踪趋势。当龙虾需要分析小红书内容、博主表现或市场趋势时触发。触发词：小红书分析、笔记分析、博主数据、小红书趋势、社交媒体分析、小红书爬虫。
version: 2.0.0
type: executable-sop
metadata:
  category: 数据科学
  module: 社交媒体分析
  level: 中级
  estimated_time: 1.5小时
  prerequisites: [data-visualizer]
  tools_required: [browser, camofox_create_tab, camofox_snapshot, web_search, write]
---

# 小红书数据分析

## 知识库

- 小红书是中文生活方式分享平台，内容以图文和短视频为主
- 公开数据包括：笔记内容、点赞数、收藏数、评论数、发布时间、标签
- 博主数据包括：粉丝数、获赞数、笔记数、认证状态、领域标签
- 趋势分析指标：热门话题、增长最快的博主、高互动内容类型
- 数据采集注意事项：遵守平台规则、合理请求频率、仅采集公开数据
- 分析维度：内容质量、互动率、粉丝增长、话题热度、竞品对比

---

## 工作流

### NODE-01: 接收分析任务

```yaml
id: NODE-01
input: user.query, target_type, target_identifier
action: |
  解析用户需求，确定分析目标类型（笔记/博主/话题/竞品）
  提取目标标识符（URL、用户名、关键词等）
  验证目标有效性和可访问性
success_criteria: 目标类型明确且标识符有效
output: analysis_type, target_id, analysis_scope
on_success: NODE-02
on_failure:
  action: 向用户请求澄清分析目标和具体需求
  fallback: ABORT
```

### NODE-02: 初始化浏览器环境

```yaml
id: NODE-02
input: NODE-01.target_id
action: |
  使用Camofox创建新标签页
  导航到小红书网站
  处理可能的登录/验证页面
success_criteria: 成功加载小红书主页并准备好导航
output: browser_ready
on_success: NODE-03
on_failure:
  retry: 2
  backoff: exponential
  fallback: ABORT
```

### NODE-03: 导航到目标页面

```yaml
id: NODE-03
input: NODE-02.browser_ready, NODE-01.target_id, NODE-01.analysis_type
action: |
  根据目标类型构建URL并导航：
  - 笔记：直接访问笔记URL
  - 博主：访问博主主页
  - 话题：搜索相关关键词
  - 竞品：访问多个竞品主页
success_criteria: 成功加载目标页面
output: target_page_loaded
on_success: NODE-04
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-04: 采集基础数据

```yaml
id: NODE-04
input: NODE-03.target_page_loaded, NODE-01.analysis_type
action: |
  使用Camofox工具提取页面数据：
  - 笔记数据：标题、内容、图片、互动数、发布时间
  - 博主数据：用户名、粉丝数、获赞数、笔记数、认证信息
  - 话题数据：相关笔记列表、总互动量、热门内容
success_criteria: 成功提取至少80%的基础数据字段
output: raw_data {posts[], author_info, metrics, metadata}
on_success: NODE-05
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-05: 处理分页和滚动

```yaml
id: NODE-05
type: loop
input: NODE-04.raw_data, NODE-01.analysis_scope
action: |
  如果需要更多数据，执行滚动加载或分页导航
  继续采集额外数据直到满足scope要求
max_iterations: 10
success_criteria: 采集到足够数量的数据样本
output: complete_raw_data
on_complete: NODE-06
```

### NODE-06: 数据清洗和标准化

```yaml
id: NODE-06
input: NODE-05.complete_raw_data
action: |
  清洗数据：处理缺失值、标准化格式、转换数据类型
  计算衍生指标：互动率、平均互动、内容密度等
  去重和验证数据一致性
success_criteria: 数据清洗完成，关键指标计算准确
output: cleaned_data, derived_metrics
on_success: NODE-07
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-07: 执行分析计算

```yaml
id: NODE-07
input: NODE-06.cleaned_data, NODE-06.derived_metrics, NODE-01.analysis_type
action: |
  根据分析类型执行特定计算：
  - 笔记分析：内容质量评分、互动表现、最佳发布时间
  - 博主分析：影响力评分、内容一致性、粉丝质量
  - 话题分析：热度趋势、参与度、内容类型分布
  - 竞品分析：对比矩阵、优势劣势、机会威胁
success_criteria: 完成所有相关的分析计算
output: analysis_results {key_findings, scores, comparisons, trends}
on_success: NODE-08
on_failure:
  fallback: ABORT
```

### NODE-08: 生成可视化图表

```yaml
id: NODE-08
input: NODE-07.analysis_results, NODE-06.cleaned_data
action: |
  使用data-visualizer技能生成相关图表：
  - 互动趋势图
  - 内容类型分布饼图
  - 博主对比柱状图
  - 热度时间序列图
success_criteria: 生成至少3个相关的可视化图表
output: visualizations
on_success: NODE-09
on_failure:
  fallback: NODE-09  # 继续但跳过可视化
```

### NODE-09: 创建分析报告

```yaml
id: NODE-09
input: NODE-07.analysis_results, NODE-08.visualizations, NODE-01.analysis_scope
action: |
  整合分析结果和可视化，创建完整报告：
  - 执行摘要
  - 关键发现
  - 详细分析
  - 建议和洞察
  - 数据附录
success_criteria: 报告结构完整且包含所有关键信息
output: xiaohongshu_report
on_success: NODE-10
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-10: 保存原始数据

```yaml
id: NODE-10
input: NODE-06.cleaned_data, NODE-01.target_id
action: |
  将清洗后的原始数据保存为JSON文件
  包含元数据（采集时间、目标信息、字段说明）
success_criteria: 数据文件成功保存
output: data_file_path
on_success: NODE-FINAL
on_failure:
  fallback: NODE-FINAL  # 继续但不保存原始数据
```

### NODE-FINAL: 输出并汇报

```yaml
id: NODE-FINAL
type: end
input: NODE-09.xiaohongshu_report, NODE-10.data_file_path
action: |
  1. 提供完整的分析报告
  2. 分享可视化图表和原始数据文件
  3. 询问是否需要深入某个特定方面或扩展分析范围
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "分析这个小红书笔记"
- "小红书博主数据分析"
- "小红书热门话题"
- "竞品小红书表现"
- "小红书内容趋势"
- "小红书互动率分析"