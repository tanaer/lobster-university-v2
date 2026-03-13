---
name: ai-service-monitor
description: AI 服务状态监控 - 实时查询 AI 服务商状态、模型可用性、趋势模型、宕机事件。当需要检查 AI 服务是否正常、模型是否可用、查看服务中断历史时触发。触发词：AI状态、服务状态、模型可用、宕机、服务监控。
version: 2.0.0
type: executable-sop
metadata:
  category: AI应用
  module: 服务监控
  level: 初级
  estimated_time: 20分钟
  prerequisites: []
  tools_required: [aistatus]
---

# AI 服务状态监控

## 知识库

- `aistatus` skill 提供 AI 服务状态查询功能
- 主要查询类型：provider_status（服务商状态）、model_search（模型搜索）、trending（趋势模型）、incidents（宕机事件）
- 支持的服务商：OpenAI、Anthropic、Google、Azure、AWS 等
- 状态指标：operational（正常）、degraded（降级）、outage（宕机）、maintenance（维护中）
- 基准测试：MMLU、HumanEval、GSM8K 等标准测试集分数

---

## 工作流

### NODE-01: 接收查询请求

```yaml
id: NODE-01
input: user.query
action: |
  解析用户输入，识别查询意图：
  - 检查服务商状态 → provider_status
  - 搜索特定模型 → model_search
  - 查看趋势模型 → trending
  - 查看宕机事件 → incidents
success_criteria: 成功识别查询类型
output: query_type, query_params
on_success: NODE-02
on_failure:
  action: 询问用户具体想查询什么
  fallback: ABORT
```

### NODE-02: 路由到对应查询分支

```yaml
id: NODE-02
type: branch
input: NODE-01.query_type
branches:
  - condition: provider_status
    target: NODE-03
  - condition: model_search
    target: NODE-04
  - condition: trending
    target: NODE-05
  - condition: incidents
    target: NODE-06
default: NODE-03
```

### NODE-03: 查询服务商状态

```yaml
id: NODE-03
input: NODE-01.query_params
action: |
  使用 aistatus skill 查询指定服务商状态
  如果未指定，查询所有主要服务商
success_criteria: 返回至少一个服务商的状态
output: provider_status {provider, status, last_updated}
on_success: NODE-07
on_failure:
  retry: 2
  backoff: 5s
  fallback: NODE-ERROR
```

### NODE-04: 搜索模型信息

```yaml
id: NODE-04
input: NODE-01.query_params
action: |
  使用 aistatus skill 搜索模型：
  - 可用性检查
  - 基准测试分数
  - 定价信息
success_criteria: 返回至少一个匹配的模型
output: model_info {name, provider, availability, benchmarks, pricing}
on_success: NODE-07
on_failure:
  action: 建议用户使用其他关键词搜索
  fallback: NODE-ERROR
```

### NODE-05: 获取趋势模型

```yaml
id: NODE-05
input: null
action: |
  使用 aistatus skill 获取当前趋势模型列表
  包含：使用率、新发布、热门度
success_criteria: 返回趋势模型列表
output: trending_models[] {rank, model, trend_score}
on_success: NODE-07
on_failure:
  retry: 1
  fallback: NODE-ERROR
```

### NODE-06: 查询宕机事件

```yaml
id: NODE-06
input: NODE-01.query_params
action: |
  使用 aistatus skill 查询最近的服务中断事件
  可按服务商、时间范围过滤
success_criteria: 返回事件列表（可能为空）
output: incidents[] {provider, time, duration, impact, status}
on_success: NODE-07
on_failure:
  fallback: NODE-ERROR
```

### NODE-07: 格式化结果

```yaml
id: NODE-07
input: NODE-03.output OR NODE-04.output OR NODE-05.output OR NODE-06.output
action: |
  根据查询类型格式化输出：
  - 状态查询：服务商 + 状态图标 + 更新时间
  - 模型搜索：模型名 + 可用性 + 性能指标
  - 趋势模型：排名 + 模型 + 趋势分数
  - 宕机事件：时间线 + 影响范围 + 恢复状态
success_criteria: 格式化输出清晰易读
output: formatted_report
on_success: NODE-FINAL
on_failure:
  retry: 1
  fallback: NODE-ERROR
```

### NODE-ERROR: 错误处理

```yaml
id: NODE-ERROR
type: end
action: |
  向用户解释查询失败原因
  提供可能的解决方案
  询问是否需要重试
output: error_message
```

### NODE-FINAL: 输出并询问后续

```yaml
id: NODE-FINAL
type: end
input: NODE-07.formatted_report
action: |
  1. 发送格式化报告
  2. 询问是否需要：
     - 深入查看某个服务商/模型
     - 设置监控提醒
     - 导出报告
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "检查 AI 服务状态"
- "OpenAI 挂了吗"
- "查看模型可用性"
- "最近有什么宕机事件"
- "当前最火的模型是什么"
