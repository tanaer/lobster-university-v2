---
name: web-scraper-pro-zhuyu28
description: Web爬虫进阶 - 学会使用浏览器自动化技术进行动态页面抓取、反爬虫绕过、数据清洗和存储。当龙虾需要从复杂网站提取数据、处理JavaScript渲染内容或绕过反爬机制时触发。触发词：Web爬虫、数据采集、动态页面抓取、反爬虫、浏览器自动化、数据提取。
version: 2.0.0
type: executable-sop
metadata:
  category: 自动化
  module: 数据采集
  level: 中级
  estimated_time: 2小时
  prerequisites: [browser-automation-ultra]
  tools_required: [browser, camofox_create_tab, camofox_snapshot, camofox_click, camofox_type, write]
---

# Web 爬虫进阶

## 知识库

- 动态页面需要浏览器自动化工具（如Playwright、Puppeteer）来处理JavaScript渲染
- 常见反爬机制：IP限制、User-Agent检测、行为分析、验证码、请求频率限制
- 绕过策略：代理轮换、随机延迟、真实浏览器指纹、人类行为模拟
- 数据提取方法：CSS选择器、XPath、正则表达式、结构化解析
- 数据存储格式：JSON、CSV、数据库
- 道德和法律考虑：遵守robots.txt、合理请求频率、尊重版权

---

## 工作流

### NODE-01: 接收爬虫任务

```yaml
id: NODE-01
input: user.query, target_url, data_requirements
action: |
  解析用户需求，确定目标URL、所需数据字段和特殊要求
  验证URL有效性和数据需求明确性
success_criteria: URL有效且数据需求具体明确
output: target_url, required_fields, special_requirements
on_success: NODE-02
on_failure:
  action: 向用户请求澄清目标和数据需求
  fallback: ABORT
```

### NODE-02: 分析目标网站

```yaml
id: NODE-02
input: NODE-01.target_url
action: |
  使用Camofox创建新标签页
  导航到目标URL
  分析页面结构、加载机制和反爬特征
success_criteria: 完成网站特征分析，识别关键元素选择器
output: site_analysis {structure, anti_bot_features, selectors, pagination}
on_success: NODE-03
on_failure:
  retry: 2
  backoff: exponential
  fallback: ABORT
```

### NODE-03: 设计爬取策略

```yaml
id: NODE-03
input: NODE-02.site_analysis, NODE-01.special_requirements
action: |
  根据反爬特征设计绕过策略
  确定数据提取方法和选择器
  规划分页/滚动逻辑（如适用）
  设置合理的延迟和请求模式
success_criteria: 爬取策略完整且考虑了反爬措施
output: scraping_strategy {bypass_methods, selectors, pagination_logic, delays, error_handling}
on_success: NODE-04
on_failure:
  fallback: ABORT
```

### NODE-04: 实施爬虫脚本

```yaml
id: NODE-04
input: NODE-03.scraping_strategy, NODE-01.required_fields
action: |
  使用Camofox工具实现爬虫逻辑
  包含错误处理和重试机制
  实现数据提取和初步清洗
success_criteria: 脚本成功执行并提取到样本数据
output: scraped_data_sample, script_implementation
on_success: NODE-05
on_failure:
  retry: 2
  backoff: exponential
  fallback: NODE-06  # 尝试简化策略
```

### NODE-05: 验证数据质量

```yaml
id: NODE-05
input: NODE-04.scraped_data_sample, NODE-01.required_fields
action: |
  检查提取的数据是否完整、准确
  验证所有必需字段都已获取
  识别数据质量问题（缺失、格式错误等）
success_criteria: 数据质量满足要求，完整性>95%
output: data_quality_report, cleaned_data
on_success: NODE-07
on_failure:
  fallback: NODE-06  # 优化选择器和策略
```

### NODE-06: 优化爬取策略

```yaml
id: NODE-06
type: branch
input: NODE-04.script_implementation, NODE-05.data_quality_report
action: |
  调整选择器和提取逻辑
  增强反爬绕过措施
  优化错误处理和重试机制
success_criteria: 改进后的策略能成功提取数据
output: optimized_strategy
on_success: NODE-04  # 重新实施
on_failure:
  fallback: ABORT
```

### NODE-07: 执行完整爬取

```yaml
id: NODE-07
input: NODE-04.script_implementation, NODE-02.site_analysis.pagination
action: |
  执行完整的数据爬取流程
  处理所有页面/分页
  应用数据清洗规则
  监控执行状态和错误
success_criteria: 完成全部数据爬取，错误率<5%
output: complete_dataset, execution_log
on_success: NODE-08
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-08: 数据后处理

```yaml
id: NODE-08
input: NODE-07.complete_dataset, NODE-01.required_fields
action: |
  执行最终数据清洗和格式化
  去重、标准化、验证数据类型
  转换为指定输出格式（JSON/CSV）
success_criteria: 数据格式统一且符合要求
output: processed_dataset, output_format
on_success: NODE-09
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-09: 生成爬虫报告

```yaml
id: NODE-09
input: NODE-07.execution_log, NODE-08.processed_dataset, NODE-03.scraping_strategy
action: |
  创建爬虫执行报告：
  - 执行摘要（成功/失败统计）
  - 数据概览（记录数、字段完整性）
  - 技术细节（使用的策略、遇到的挑战）
  - 使用说明（如何重复执行）
success_criteria: 报告完整且包含所有关键信息
output: scraper_report
on_success: NODE-10
on_failure:
  fallback: NODE-10  # 继续但跳过报告
```

### NODE-10: 保存和交付

```yaml
id: NODE-10
input: NODE-08.processed_dataset, NODE-09.scraper_report, NODE-08.output_format
action: |
  将数据保存到文件
  保存爬虫脚本供将来使用
  准备交付包（数据+脚本+报告）
success_criteria: 所有文件成功保存
output: delivery_package {data_file, script_file, report_file}
on_success: NODE-FINAL
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-FINAL: 输出并汇报

```yaml
id: NODE-FINAL
type: end
input: NODE-10.delivery_package
action: |
  1. 提供数据文件和使用说明
  2. 分享爬虫脚本和报告
  3. 询问是否需要调整或扩展爬取范围
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "爬取这个网站的数据"
- "从网页提取信息"
- "动态页面数据采集"
- "绕过反爬虫"
- "大规模数据抓取"
- "浏览器自动化爬虫"