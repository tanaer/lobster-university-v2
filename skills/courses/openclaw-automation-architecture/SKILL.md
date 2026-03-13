---
name: openclaw-automation-architecture
description: >
  OpenClaw 自动化架构设计 - 使用 cron、HEARTBEAT.md、子代理、脚本和 MCP
  构建原生自动化系统。当用户需要：设计自动化工作流、设置定时任务、
  选择 cron vs heartbeat、替换 Zapier/n8n、构建监控告警时触发。
  触发词：自动化、定时任务、cron、heartbeat、工作流、监控、告警、Zapier、n8n
version: 2.0.0
type: executable-sop
metadata:
  category: 自动化
  module: 架构设计
  level: 高级
  estimated_time: 45分钟
  prerequisites: [OpenClaw 基础]
  tools_required: [write, read, exec]
---

# OpenClaw 自动化架构

## 知识库

- `cron` - 精确时间调度，独立执行，适合提醒/报告
- `HEARTBEAT.md` - 周期性检查，上下文感知，适合维护
- `sessions_spawn` - 子代理，适合复杂多步骤任务
- `script/MCP` - 确定性操作，适合重复性工作
- 五大要素：触发器、执行平面、状态、交付、恢复

---

## 工作流

### NODE-01: 需求分析

```yaml
id: NODE-01
input: user.request
type: branch
action: |
  分析自动化需求：
  
  1. 业务结果：一句话描述目标
     - 例："每天早上生成数据报告"
     - 例："监控网站状态，异常时告警"
  
  2. 触发方式：
     - 用户主动请求
     - 定时触发（精确时间/大致周期）
     - 事件触发（文件/数据/外部 webhook）
  
  3. 执行复杂度：
     - 简单工具调用
     - 多步骤推理
     - 需要专门技能
  
  4. 交付要求：
     - 即时通知
     - 保存到文件
     - 发送到特定渠道
  
  5. 容错要求：
     - 失败重试次数
     - 失败通知方式
success_criteria: 明确业务目标和约束
output: {outcome, trigger_type, complexity, delivery, recovery_requirements}
on_success: NODE-02
on_failure:
  action: 澄清需求
  fallback: ABORT
```

### NODE-02: 执行平面选择

```yaml
id: NODE-02
input: [NODE-01.outcome, NODE-01.trigger_type, NODE-01.complexity]
type: branch
action: |
  选择执行平面（按优先级）：
  
  1. 即时工具调用：
     - 条件：用户要即时结果，非自动化
     - 方案：直接执行工具
  
  2. cron（时间关键）：
     - 条件：精确时间、独立运行、定时报告
     - 子类型：
       * systemEvent → 主会话提醒
       * agentTurn → 隔离执行
  
  3. HEARTBEAT.md（漂移容忍）：
     - 条件：维护任务、上下文有益、低成本检查
     - 反模式：精确告警、高频任务、外部 SLA
  
  4. 子代理（复杂任务）：
     - 条件：多步骤、专门技能、长时间运行
     - 包含：Codex/Claude Code/Gemini
  
  5. 脚本/MCP（确定性）：
     - 条件：重复操作、稳定解析、API 调用
  
  6. 外部平台（最后选择）：
     - 条件：第三方认证、复杂 SaaS 集成
     - 工具：Zapier、Make、n8n
success_criteria: 确定执行平面
output: {execution_plane, reasoning, alternatives[]}
on_success: NODE-03
on_failure:
  fallback: NODE-03
```

### NODE-03: 状态与去重设计

```yaml
id: NODE-03
input: [NODE-02.execution_plane, NODE-01.outcome]
action: |
  设计状态管理：
  
  状态存储位置：
  - JSON 状态文件：workspace/state/{task_name}.json
  - 记忆文件：MEMORY.md 或 daily notes
  - 追加日志：workspace/logs/{task_name}.log
  - 项目产物：如 today-briefing.md
  
  去重策略：
  - 内容哈希：检测重复内容
  - 时间窗口：同一事件 5 分钟内不重复处理
  - ID 追踪：记录已处理的实体 ID
  
  成功定义：
  - 明确什么算成功
  - 可安全重试的操作
  
  生成状态文件模板
success_criteria: 状态方案设计完成
output: {state_location, dedup_strategy, success_criteria}
on_success: NODE-04
on_failure:
  fallback: NODE-04
```

### NODE-04: 失败处理设计

```yaml
id: NODE-04
input: [NODE-01.recovery_requirements, NODE-02.execution_plane]
action: |
  设计失败恢复机制：
  
  重试策略：
  - 次数：1-3 次
  - 退避：固定间隔 / 指数退避
  - 条件：哪些错误可重试
  
  通知策略：
  - 成功通知：是否静默/汇总
  - 失败通知：立即通知/汇总后通知
  - 通知渠道：主会话/邮件/其他渠道
  
  降级方案：
  - 部分失败时的处理
  - 备用数据源
  
  生成失败处理代码/配置
success_criteria: 恢复机制设计完成
output: {retry_policy, notification_policy, fallback_strategy}
on_success: NODE-05
on_failure:
  fallback: NODE-05
```

### NODE-05: 架构文档生成

```yaml
id: NODE-05
input: [NODE-01.outcome, NODE-02.execution_plane, NODE-03.state_location, NODE-04.retry_policy]
action: |
  生成架构文档：
  
  文档结构：
  ```markdown
  # {自动化名称}
  
  ## 目标
  {outcome}
  
  ## 架构决策
  - 执行平面：{execution_plane}
  - 选择理由：{reasoning}
  
  ## 组件
  - 触发器：{trigger_config}
  - 处理器：{handler_description}
  - 状态存储：{state_location}
  - 交付方式：{delivery_method}
  
  ## 失败处理
  - 重试：{retry_policy}
  - 通知：{notification_policy}
  
  ## 运行日志
  - 状态文件：{state_file_path}
  ```
  
  保存到 workspace/automations/{name}.md
success_criteria: 架构文档生成完成
output: {architecture_doc_path}
on_success: NODE-06
on_failure:
  fallback: NODE-06
```

### NODE-06: 具体实现

```yaml
id: NODE-06
input: [NODE-02.execution_plane, NODE-01.outcome, NODE-03.state_location]
type: branch
action: |
  根据执行平面生成实现：
  
  cron 配置：
  ```json
  {
    "schedule": "0 9 * * *",
    "payload": {
      "kind": "agentTurn",
      "prompt": "生成每日报告..."
    },
    "delivery": {"mode": "announce", "channel": "..."}
  }
  ```
  
  HEARTBEAT.md 配置：
  ```markdown
  ## {任务名}
  - 检查：{检查内容}
  - 频率：每 X 小时
  - 动作：{执行操作}
  ```
  
  子代理调用：
  ```javascript
  sessions_spawn({
    task: "...",
    runtime: "subagent",
    mode: "run"
  })
  ```
  
  脚本模板：
  ```python
  #!/usr/bin/env python3
  # {任务描述}
  import json
  STATE_FILE = "..."
  ```
  
  生成可运行的配置文件或代码
success_criteria: 实现代码/配置生成完成
output: {implementation_files[], config}
on_success: NODE-07
on_failure:
  action: 检查生成逻辑
  fallback: ABORT
```

### NODE-07: 部署与测试

```yaml
id: NODE-07
input: [NODE-06.implementation_files, NODE-02.execution_plane]
action: |
  部署自动化：
  
  cron 部署：
  - 使用 cron 工具创建任务
  - 验证下次执行时间
  
  HEARTBEAT.md 部署：
  - 写入或更新 HEARTBEAT.md
  - 说明检查频率
  
  子代理部署：
  - 保存调用脚本
  - 测试单次调用
  
  脚本部署：
  - 保存脚本文件
  - 添加执行权限
  - 测试运行
  
  执行一次测试运行
success_criteria: 部署成功，测试通过
output: {deployment_status, test_result}
on_success: NODE-08
on_failure:
  action: 修复部署问题
  retry: 2
  fallback: ABORT
```

### NODE-08: 监控与优化

```yaml
id: NODE-08
input: [NODE-07.deployment_status, NODE-03.state_location]
action: |
  设置监控：
  
  监控指标：
  - 执行成功率
  - 平均执行时间
  - 失败类型分布
  
  日志查看命令：
  - 状态文件位置
  - 日志查看方式
  
  优化建议：
  - 执行频率调整
  - 资源使用优化
  - 错误率降低
  
  生成监控指南
success_criteria: 监控配置完成
output: {monitoring_guide, optimization_tips[]}
on_success: NODE-FINAL
on_failure:
  fallback: NODE-FINAL
```

### NODE-FINAL: 交付与培训

```yaml
id: NODE-FINAL
type: end
input: [NODE-05.architecture_doc_path, NODE-06.implementation_files, NODE-08.monitoring_guide]
action: |
  输出总结：
  ✅ 自动化架构设计完成
  📋 执行平面：{execution_plane}
  📁 架构文档：{architecture_doc_path}
  ⚙️ 实现文件：{implementation_files}
  📊 监控指南：已生成
  
  使用说明：
  1. 查看架构文档了解设计决策
  2. 检查状态文件了解运行状况
  3. 根据需要调整执行频率
  4. 定期审查失败日志
  
  最佳实践提醒：
  - 优先使用 OpenClaw 原生能力
  - 小系统比大流程更可靠
  - 分离触发、执行、状态、交付
  - 为失败设计，不是为成功设计
  
  询问用户是否需要：
  - 设计更多自动化
  - 迁移现有 Zapier/n8n 流程
  - 优化现有自动化
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "设计自动化工作流"
- "设置定时任务"
- "用 cron 做监控"
- "heartbeat 任务"
- "替换 Zapier"
- "自动化架构"
