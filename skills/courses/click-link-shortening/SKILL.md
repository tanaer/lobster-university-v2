---
name: click-link-optimizer
description: Click 链接优化 - 使用 Click API 缩短链接、生成品牌二维码、追踪点击数据、分析营销效果。适合营销活动、社交媒体、广告追踪场景。触发词：短链接、链接缩短、二维码、点击追踪、营销分析、Click。
version: 2.0.0
type: executable-sop
metadata:
  category: 营销工具
  module: 链接管理
  level: 中级
  estimated_time: 30分钟
  prerequisites: [similarweb-analytics]
  tools_required: [click-link-shortening]
---

# Click 链接优化

## 知识库

- `click-link-shortening` skill 提供链接缩短和追踪功能
- 核心功能：长链接缩短、自定义短链、二维码生成、点击追踪
- 支持品牌域名：使用自己的域名创建短链
- 追踪指标：点击量、地理位置、设备类型、来源渠道
- 二维码：支持自定义样式、Logo、颜色
- API 需要配置 Click API Key

---

## 工作流

### NODE-01: 接收链接优化需求

```yaml
id: NODE-01
input: user.request
action: |
  解析用户需求：
  - 缩短单个链接
  - 批量缩短链接
  - 生成二维码
  - 查看链接数据
  - 创建品牌短链
success_criteria: 明确操作类型和目标
output: operation_type, target_links[], options
on_success: NODE-02
on_failure:
  action: 询问用户具体需要什么操作
  fallback: ABORT
```

### NODE-02: 检查 Click API 配置

```yaml
id: NODE-02
input: null
action: |
  检查 Click API 是否配置：
  - API Key 是否存在
  - API 连接是否正常
  - 配额是否充足
success_criteria: API 配置正确且可用
output: api_status
on_success: NODE-03
on_failure:
  action: 指导用户配置 Click API Key
  fallback: ABORT
```

### NODE-03: 路由到对应操作

```yaml
id: NODE-03
type: branch
input: NODE-01.operation_type
branches:
  - condition: shorten_single
    target: NODE-04
  - condition: shorten_batch
    target: NODE-05
  - condition: generate_qrcode
    target: NODE-06
  - condition: view_analytics
    target: NODE-07
  - condition: create_branded
    target: NODE-08
default: NODE-04
```

### NODE-04: 缩短单个链接

```yaml
id: NODE-04
input: NODE-01.target_links[0] + NODE-01.options
action: |
  使用 Click API 缩短链接：
  1. 验证原始链接格式
  2. 调用短链接 API
  3. 可选：设置自定义后缀
  4. 可选：设置过期时间
success_criteria: 返回有效的短链接
output: short_link {original, short, custom_suffix, expires_at}
on_success: NODE-09
on_failure:
  retry: 2
  backoff: 3s
  fallback: NODE-ERROR
```

### NODE-05: 批量缩短链接

```yaml
id: NODE-05
type: loop
input: NODE-01.target_links
each: link
action: |
  批量处理链接：
  1. 验证每个链接格式
  2. 调用短链接 API
  3. 记录成功/失败
max_iterations: 50
output: batch_results[] {original, short, status}
on_complete: NODE-09
```

### NODE-06: 生成二维码

```yaml
id: NODE-06
input: NODE-01.target_links[0] + NODE-01.options
action: |
  生成带品牌二维码：
  1. 确定短链接（如未缩短则先缩短）
  2. 选择二维码样式
  3. 添加 Logo（可选）
  4. 设置颜色（可选）
  5. 生成二维码图片
success_criteria: 生成有效的二维码图片
output: qrcode {image_url, short_link, style, size}
on_success: NODE-09
on_failure:
  retry: 1
  fallback: NODE-ERROR
```

### NODE-07: 查看链接分析数据

```yaml
id: NODE-07
input: NODE-01.target_links[0]
action: |
  获取链接点击数据：
  1. 查询总点击量
  2. 按时间分组（日/周/月）
  3. 地理分布
  4. 设备类型分布
  5. 来源渠道分布
success_criteria: 返回完整分析数据
output: analytics {total_clicks, timeline, geo, devices, referrers}
on_success: NODE-09
on_failure:
  retry: 1
  fallback: NODE-ERROR
```

### NODE-08: 创建品牌短链

```yaml
id: NODE-08
input: NODE-01.target_links[0] + NODE-01.options
action: |
  创建品牌短链接：
  1. 验证品牌域名配置
  2. 设计自定义后缀
  3. 创建短链接
  4. 验证可访问性
success_criteria: 品牌短链创建成功
output: branded_link {domain, suffix, full_url, original}
on_success: NODE-09
on_failure:
  action: 指导用户配置品牌域名
  fallback: NODE-ERROR
```

### NODE-09: 格式化输出结果

```yaml
id: NODE-09
input: NODE-04 OR NODE-05 OR NODE-06 OR NODE-07 OR NODE-08
action: |
  根据操作类型格式化结果：
  - 缩短链接：展示原链和短链对比
  - 批量处理：表格展示所有结果
  - 二维码：展示图片和使用建议
  - 分析数据：图表和关键指标
  - 品牌短链：展示链接和分享建议
success_criteria: 结果清晰易读
output: formatted_result
on_success: NODE-FINAL
on_failure:
  fallback: NODE-ERROR
```

### NODE-ERROR: 错误处理

```yaml
id: NODE-ERROR
type: end
action: |
  向用户解释操作失败原因
  提供可能的解决方案：
  - 检查链接格式
  - 检查 API 配额
  - 验证品牌域名配置
output: error_message
```

### NODE-FINAL: 输出并询问后续

```yaml
id: NODE-FINAL
type: end
input: NODE-09.formatted_result
action: |
  1. 展示处理结果
  2. 提供使用建议：
     - 分享到社交媒体
     - 嵌入营销邮件
     - 添加到广告素材
  3. 询问是否需要：
     - 设置定期报告
     - 批量处理更多链接
     - 集成到其他工具
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "缩短这个链接"
- "生成二维码"
- "查看短链点击数据"
- "创建品牌短链"
- "批量缩短链接"
