---
name: zentao-analytics
description: 禅道数据分析 - 学会使用禅道API进行任务数据查询、工时统计和团队效率分析。当龙虾需要分析禅道项目管理数据、评估团队表现或优化工作流程时触发。触发词：禅道分析、任务数据、工时统计、效率分析、团队表现、禅道API。
version: 2.0.0
type: executable-sop
metadata:
  category: 数据科学
  module: 项目管理分析
  level: 中级
  estimated_time: 1.5小时
  prerequisites: [data-visualizer]
  tools_required: [web_fetch, exec, write]
---

# 禅道数据分析

## 知识库

- 禅道是开源的项目管理软件，支持敏捷开发流程
- 核心数据实体：任务、需求、Bug、用户故事、项目、产品、用户
- 关键指标：任务完成率、平均处理时间、延期率、工作量分配、Bug密度
- 禅道API提供RESTful接口访问数据（需要认证）
- 工时统计基于任务预估时间和实际记录时间
- 效率分析维度：个人效率、团队协作、流程瓶颈、资源分配

---

## 工作流

### NODE-01: 接收分析任务

```yaml
id: NODE-01
input: user.query, zentao_config, analysis_requirements
action: |
  解析用户需求，确定分析范围（项目/产品/时间段）
  验证禅道配置信息（URL、认证凭据）
  明确具体分析指标需求
success_criteria: 分析范围明确且禅道配置有效
output: analysis_scope, zentao_auth, required_metrics
on_success: NODE-02
on_failure:
  action: 向用户请求禅道配置和具体分析需求
  fallback: ABORT
```

### NODE-02: 验证禅道连接

```yaml
id: NODE-02
input: NODE-01.zentao_auth
action: |
  测试禅道API连接
  验证认证凭据有效性
  获取可用项目/产品列表
success_criteria: 成功连接禅道并获取基本元数据
output: connection_valid, available_projects, available_products
on_success: NODE-03
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-03: 构建API查询

```yaml
id: NODE-03
input: NODE-01.analysis_scope, NODE-01.required_metrics, NODE-02.available_projects
action: |
  根据分析范围构建具体的API查询参数
  确定需要调用的API端点（任务、Bug、用户故事等）
  设置时间范围和过滤条件
success_criteria: API查询参数完整且有效
output: api_queries {endpoints[], parameters[], filters}
on_success: NODE-04
on_failure:
  fallback: ABORT
```

### NODE-04: 执行数据采集

```yaml
id: NODE-04
input: NODE-03.api_queries, NODE-01.zentao_auth
action: |
  调用禅道API获取原始数据
  处理分页（如果数据量大）
  收集所有相关数据实体
success_criteria: 成功获取所有必需的数据实体
output: raw_zentao_data {tasks[], bugs[], stories[], users[], projects[]}
on_success: NODE-05
on_failure:
  retry: 2
  backoff: exponential
  fallback: ABORT
```

### NODE-05: 数据清洗和关联

```yaml
id: NODE-05
input: NODE-04.raw_zentao_data
action: |
  清洗数据：处理缺失值、标准化状态字段、统一时间格式
  建立数据关联：任务-用户、任务-项目、Bug-模块等
  计算基础指标：任务数量、完成率、状态分布
success_criteria: 数据清洗完成且关联关系建立正确
output: cleaned_data, basic_metrics
on_success: NODE-06
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-06: 工时统计计算

```yaml
id: NODE-06
input: NODE-05.cleaned_data, NODE-01.required_metrics
condition: required_metrics contains "工时" or "工作量"
action: |
  计算工时相关指标：
  - 总预估工时 vs 实际工时
  - 按用户/角色的工时分配
  - 工时偏差分析
  - 人均工作效率
success_criteria: 工时指标计算准确且完整
output: work_hour_metrics
on_success: NODE-07
on_failure:
  fallback: NODE-07  # 继续但跳过工时部分
```

### NODE-07: 效率分析计算

```yaml
id: NODE-07
input: NODE-05.cleaned_data, NODE-06.work_hour_metrics, NODE-01.required_metrics
action: |
  计算效率相关指标：
  - 任务周转时间（从创建到完成）
  - 平均处理时间（按任务类型）
  - 延期率和原因分析
  - 团队协作效率（交接次数、阻塞问题）
  - Bug修复效率（发现到解决时间）
success_criteria: 效率指标计算完成且有意义
output: efficiency_metrics
on_success: NODE-08
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-08: 趋势和对比分析

```yaml
id: NODE-08
input: NODE-05.cleaned_data, NODE-07.efficiency_metrics, NODE-01.analysis_scope
action: |
  执行时间趋势分析：
  - 周/月度任务完成趋势
  - Bug密度变化趋势
  - 团队效率改进轨迹
  如果适用，执行团队/个人对比分析
success_criteria: 趋势分析完成且洞察有价值
output: trend_analysis, comparison_results
on_success: NODE-09
on_failure:
  fallback: NODE-09  # 继续但跳过趋势分析
```

### NODE-09: 生成可视化图表

```yaml
id: NODE-09
input: NODE-07.efficiency_metrics, NODE-08.trend_analysis, NODE-05.basic_metrics
action: |
  使用data-visualizer技能生成相关图表：
  - 任务状态分布饼图
  - 工时分配柱状图
  - 效率趋势折线图
  - 团队对比雷达图
  - Bug密度热力图
success_criteria: 生成至少4个相关的可视化图表
output: visualizations
on_success: NODE-10
on_failure:
  fallback: NODE-10  # 继续但跳过部分可视化
```

### NODE-10: 创建分析报告

```yaml
id: NODE-10
input: NODE-07.efficiency_metrics, NODE-08.trend_analysis, NODE-09.visualizations, NODE-01.analysis_scope
action: |
  整合所有分析结果，创建完整的禅道分析报告：
  - 执行摘要（关键发现和建议）
  - 详细指标分析
  - 趋势洞察
  - 问题识别和改进建议
  - 数据附录和方法说明
success_criteria: 报告结构完整且包含所有关键分析维度
output: zentao_report
on_success: NODE-11
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-11: 保存原始数据

```yaml
id: NODE-11
input: NODE-05.cleaned_data, NODE-01.analysis_scope
action: |
  将清洗后的原始数据保存为JSON文件
  包含元数据（采集时间、分析范围、字段说明）
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
input: NODE-10.zentao_report, NODE-11.data_file_path
action: |
  1. 提供完整的禅道分析报告
  2. 分享可视化图表和原始数据文件
  3. 询问是否需要深入某个特定指标或调整分析维度
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "分析禅道项目数据"
- "团队工时统计"
- "禅道效率分析"
- "任务完成率报告"
- "Bug修复效率"
- "禅道趋势分析"