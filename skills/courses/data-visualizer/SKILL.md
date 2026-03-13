---
name: data-visualizer
description: 数据可视化 - 将数据转换为直观的 SVG 图表。当需要展示数据趋势、对比、分布或构建仪表盘时触发。触发词：画图表、可视化数据、柱状图、折线图、饼图、散点图、热力图、仪表盘。
version: 2.0.0
type: executable-sop
metadata:
  category: 数据科学
  module: 可视化
  level: 中级
  estimated_time: 2 小时
  prerequisites: []
  tools_required: [write, exec]
---

# 数据可视化专家

## 知识库

- 图表选择指南：
  - 对比→柱状图、趋势→折线图、占比→饼图/环图
  - 分布→散点图/直方图、关系→气泡图、热度→热力图
- SVG 基础：`<svg>`, `<rect>`, `<circle>`, `<path>`, `<text>`, `<g>`
- 颜色方案：分类色 (区分)、顺序色 (渐变)、发散色 (正负)
- 响应式：viewBox 属性、百分比单位、媒体查询
- 无障碍：title/desc 元素、颜色对比度 WCAG AA

---

## 工作流

### NODE-01: 数据与目标分析

```yaml
id: NODE-01
input: user.request
action: |
  解析需求：
  - 输入数据格式 (JSON/CSV/数组)
  - 可视化目标 (对比/趋势/占比/分布)
  - 受众与场景 (报告/仪表盘/演示)
success_criteria: 数据类型和目标明确
output: analysis {data_type, chart_goal, audience, context}
on_success: NODE-02
on_failure:
  action: 请求用户提供数据或澄清目标
  fallback: ABORT
```

### NODE-02: 图表类型选择

```yaml
id: NODE-02
input: NODE-01.analysis
action: |
  根据目标选择图表：
  - 对比 (≤5 项) → 柱状图
  - 趋势 (时间序列) → 折线图/面积图
  - 占比 (≤6 项) → 饼图/环图
  - 分布 → 散点图/箱线图
  - 多维 → 雷达图/热力图
success_criteria: 图表类型匹配数据特征
output: chart_type
on_success: NODE-03
on_failure:
  action: 建议最接近的可行图表
  fallback: NODE-01
```

### NODE-03: 数据预处理

```yaml
id: NODE-03
input: user.data, NODE-02.chart_type
action: |
  标准化数据：
  - 提取标签 (labels) 和数值 (values)
  - 处理缺失值 (填充/跳过)
  - 计算派生值 (总和/百分比/同比)
  - 排序/分组 (如需要)
success_criteria: 数据结构符合图表要求
output: processed_data {labels[], values[], metadata{}}
on_success: NODE-04
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-04: 设计配置

```yaml
id: NODE-04
input: NODE-02.chart_type, NODE-01.analysis
action: |
  配置视觉参数：
  - 尺寸 (width/height)
  - 颜色方案 (分类/顺序/发散)
  - 字体与字号
  - 边距与间距
  - 图例位置
success_criteria: 配置完整且一致
output: design_config {dimensions, colors[], font, spacing, legend_pos}
on_success: NODE-05
on_failure:
  action: 使用默认配置
  fallback: NODE-05
```

### NODE-05: 生成 SVG 代码

```yaml
id: NODE-05
input: NODE-03.processed_data, NODE-04.design_config, NODE-02.chart_type
action: |
  生成 SVG：
  - 计算坐标/比例尺
  - 绘制图表元素 (柱/线/扇形等)
  - 添加坐标轴/网格线
  - 添加标签和图例
  - 添加 title/desc(无障碍)
success_criteria: SVG 语法有效，可渲染
output: svg_code
on_success: NODE-06
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-06: 添加交互 (可选)

```yaml
id: NODE-06
type: branch
input: user.interaction_request, NODE-05.svg_code
condition: user.interaction_request == true
if_true:
  action: |
    添加交互：
    - hover 高亮 (CSS :hover)
    - 点击展开详情 (onclick + JS)
    - 工具提示 (title 元素)
  output: interactive_svg
  next: NODE-07
if_false:
  next: NODE-07
```

### NODE-07: 响应式适配

```yaml
id: NODE-07
input: NODE-05.svg_code
action: |
  添加响应式：
  - 设置 viewBox 属性
  - 移除固定 width/height 或设为 100%
  - 添加 preserveAspectRatio
  - 可选：媒体查询调整
success_criteria: SVG 可自适应容器
output: responsive_svg
on_success: NODE-08
on_failure:
  fallback: NODE-05
```

### NODE-08: 质量检查

```yaml
id: NODE-08
input: NODE-07.responsive_svg
action: |
  检查清单：
  - 颜色对比度 ≥ 4.5:1 (WCAG AA)
  - 文字不重叠
  - 数据标签清晰
  - SVG 大小合理 (<100KB)
  - 无语法错误
success_criteria: 通过所有检查项
output: quality_report {passed[], issues[]}
on_success: NODE-FINAL
on_failure:
  action: 修复问题并重新生成
  fallback: NODE-05
```

### NODE-09: 输出与交付

```yaml
id: NODE-09
type: loop
input: NODE-08.quality_report, NODE-07.responsive_svg
action: |
  生成交付物：
  - 独立 SVG 文件
  - 嵌入 HTML 示例
  - 使用文档 (如何修改数据/颜色)
success_criteria: 用户可直接使用
output: deliverables {svg_file, html_example, usage_guide}
on_success: NODE-FINAL
```

### NODE-FINAL: 汇报结果

```yaml
id: NODE-FINAL
type: end
input: NODE-09.deliverables
action: |
  输出：
  1. 展示 SVG 预览
  2. 提供下载链接/代码
  3. 说明如何修改数据
  4. 建议是否需其他图表补充
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "画个柱状图"
- "数据可视化"
- "生成图表"
- "SVG 图表"
- "做个仪表盘"
- "画折线图/饼图/散点图"
