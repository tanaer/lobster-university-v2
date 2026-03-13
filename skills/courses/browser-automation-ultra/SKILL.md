---
name: browser-automation-zero-token
description: 浏览器自动化高级 - 零 Token 消耗的浏览器自动化，通过 Playwright 脚本而非 AI 驱动，支持 CDP 锁管理、类人交互模拟、反检测。适合批量自动化、定期任务、成本敏感场景。触发词：浏览器自动化、Playwright、零Token、批量操作、自动化测试。
version: 2.0.0
type: executable-sop
metadata:
  category: 自动化
  module: 浏览器自动化
  level: 中级
  estimated_time: 90分钟
  prerequisites: [browser-automation]
  tools_required: [browser-automation-ultra, playwright]
---

# 浏览器自动化高级

## 知识库

- `browser-automation-ultra` skill 提供零 Token 消耗的浏览器自动化
- 核心原理：使用 Playwright 脚本而非 AI 实时驱动，大幅降低成本
- CDP (Chrome DevTools Protocol) 锁管理：避免多个实例冲突
- 类人交互：随机延迟、鼠标轨迹模拟、防检测
- 适用场景：批量操作、定期任务、表单填写、数据采集、自动化测试
- 一次编写脚本，可无限次复用

---

## 工作流

### NODE-01: 接收自动化需求

```yaml
id: NODE-01
input: user.automation_request
action: |
  解析自动化需求：
  - 目标网站/应用
  - 要执行的操作（导航、点击、输入、提取等）
  - 执行频率（一次性/定期）
  - 数据输入源
success_criteria: 明确自动化场景和操作步骤
output: target_site, operations[], frequency, input_data
on_success: NODE-02
on_failure:
  action: 询问用户具体要自动化什么
  fallback: ABORT
```

### NODE-02: 评估自动化方案

```yaml
id: NODE-02
input: NODE-01.operations
action: |
  评估最佳实现方案：
  - 简单操作 → 直接生成 Playwright 脚本
  - 复杂交互 → 分解为多个步骤
  - 需要登录 → 检查是否需要处理认证
  - 反爬风险 → 启用类人交互模式
success_criteria: 确定实现方案
output: implementation_plan {script_type, steps, anti_detection, auth_required}
on_success: NODE-03
on_failure:
  action: 告知用户当前需求过于复杂，建议简化
  fallback: ABORT
```

### NODE-03: 检查 CDP 端口可用性

```yaml
id: NODE-03
input: null
action: |
  检查 CDP 端口是否被占用：
  - 默认端口 9222
  - 如被占用，尝试其他端口或等待释放
success_criteria: CDP 端口可用
output: cdp_port
on_success: NODE-04
on_failure:
  action: 警告用户 CDP 端口被占用，提供解决方案
  fallback: NODE-ERROR
```

### NODE-04: 生成 Playwright 脚本

```yaml
id: NODE-04
input: NODE-01.operations + NODE-02.implementation_plan
action: |
  生成 Playwright 脚本：
  1. 导入必要模块
  2. 配置浏览器启动参数
  3. 实现每个操作步骤
  4. 添加类人交互延迟（如需要）
  5. 添加错误处理和重试
  6. 提取和保存结果
success_criteria: 脚本语法正确、逻辑完整
output: playwright_script {code, filename}
on_success: NODE-05
on_failure:
  retry: 1
  fallback: NODE-ERROR
```

### NODE-05: 脚本安全审查

```yaml
id: NODE-05
input: NODE-04.playwright_script
action: |
  审查脚本安全性：
  - 检查是否有危险操作（无限循环、暴力操作）
  - 确认没有硬编码敏感信息
  - 检查是否符合目标网站 ToS
success_criteria: 脚本安全合规
output: approved_script
on_success: NODE-06
on_failure:
  action: 指出安全问题并修改脚本
  fallback: NODE-04
```

### NODE-06: 执行自动化脚本

```yaml
id: NODE-06
input: NODE-05.approved_script + NODE-03.cdp_port
action: |
  执行 Playwright 脚本：
  1. 启动浏览器（无头/有头模式）
  2. 执行自动化操作
  3. 监控执行状态
  4. 捕获截图和日志
  5. 处理异常情况
success_criteria: 脚本执行完成
output: execution_result {status, screenshots[], logs, data_extracted}
on_success: NODE-07
on_failure:
  retry: 1
  backoff: 10s
  fallback: NODE-ERROR
```

### NODE-07: 验证执行结果

```yaml
id: NODE-07
input: NODE-06.execution_result
action: |
  验证执行结果：
  - 检查是否完成所有操作
  - 验证提取的数据完整性
  - 检查是否有错误日志
success_criteria: 结果符合预期
output: validated_result
on_success: NODE-08
on_failure:
  action: 分析失败原因，决定是否重试或调整脚本
  fallback: NODE-04
```

### NODE-08: 保存脚本和结果

```yaml
id: NODE-08
input: NODE-05.approved_script + NODE-07.validated_result
action: |
  保存可复用资产：
  - 保存 Playwright 脚本到指定目录
  - 保存执行日志
  - 保存提取的数据
  - 生成使用文档
success_criteria: 所有资产保存成功
output: saved_files {script_path, log_path, data_path, doc_path}
on_success: NODE-FINAL
on_failure:
  action: 警告保存失败，但继续返回结果
  fallback: NODE-FINAL
```

### NODE-ERROR: 错误处理

```yaml
id: NODE-ERROR
type: end
action: |
  向用户解释自动化失败原因
  提供调试建议：
  - 检查网络连接
  - 验证目标网站可访问
  - 检查脚本逻辑
  - 查看详细日志
output: error_message
```

### NODE-FINAL: 输出并询问后续

```yaml
id: NODE-FINAL
type: end
input: NODE-07.validated_result + NODE-08.saved_files
action: |
  1. 展示执行结果摘要
  2. 提供脚本文件路径（可复用）
  3. 询问是否需要：
     - 设置定期执行（cron）
     - 修改脚本增加功能
     - 批量处理更多数据
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "自动化这个网页操作"
- "写个 Playwright 脚本"
- "批量填写表单"
- "零 Token 浏览器自动化"
- "定期抓取网站数据"
