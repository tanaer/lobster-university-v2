---
name: api-key-security-scanner
description: API 密钥守护者 - 扫描代码库中的敏感信息泄露，支持 Git 历史扫描，提供 AI 驱动的风险分析和修复建议。当代码提交前、定期安全审计、怀疑密钥泄露时触发。触发词：密钥扫描、安全检查、泄露检测、API key、敏感信息。
version: 2.0.0
type: executable-sop
metadata:
  category: 安全
  module: 代码安全
  level: 中级
  estimated_time: 45分钟
  prerequisites: []
  tools_required: [api-key-guardian]
---

# API 密钥守护者

## 知识库

- `api-key-guardian` skill 提供密钥检测和扫描功能
- 检测类型：API Key、密码、Token、私钥、证书等
- 扫描范围：当前文件、整个目录、Git 历史
- 风险等级：Critical（高危）、High（高）、Medium（中）、Low（低）
- Git 历史扫描可发现已删除但仍在历史中的密钥
- AI 风险分析提供智能修复建议

---

## 工作流

### NODE-01: 接收扫描请求

```yaml
id: NODE-01
input: user.request
action: |
  解析扫描参数：
  - 扫描目标（文件/目录/仓库）
  - 是否扫描 Git 历史
  - 风险等级阈值
success_criteria: 明确扫描目标和范围
output: scan_target, scan_git_history, risk_threshold
on_success: NODE-02
on_failure:
  action: 询问用户要扫描什么
  fallback: ABORT
```

### NODE-02: 验证目标存在性

```yaml
id: NODE-02
input: NODE-01.scan_target
action: |
  检查扫描目标是否存在：
  - 文件：检查文件路径
  - 目录：检查目录路径
  - 仓库：检查 .git 目录
success_criteria: 目标存在且可访问
output: validated_target
on_success: NODE-03
on_failure:
  action: 告知用户目标不存在
  fallback: ABORT
```

### NODE-03: 执行文件系统扫描

```yaml
id: NODE-03
input: NODE-02.validated_target
action: |
  使用 api-key-guardian 扫描当前文件系统：
  - 扫描所有文本文件
  - 检测各类密钥模式
  - 记录发现的位置和类型
success_criteria: 扫描完成（即使未发现问题）
output: file_findings[] {file, line, type, snippet, risk}
on_success: NODE-04
on_failure:
  retry: 1
  fallback: NODE-ERROR
```

### NODE-04: Git 历史扫描（条件执行）

```yaml
id: NODE-04
type: branch
input: NODE-01.scan_git_history
branches:
  - condition: true
    target: NODE-05
  - condition: false
    target: NODE-06
```

### NODE-05: 执行 Git 历史扫描

```yaml
id: NODE-05
input: NODE-02.validated_target
action: |
  使用 api-key-guardian 扫描 Git 历史：
  - 扫描所有提交记录
  - 检测已删除的密钥
  - 记录泄露的提交 hash
success_criteria: 历史扫描完成
output: git_findings[] {commit, file, type, snippet, risk}
on_success: NODE-06
on_failure:
  action: 警告用户 Git 历史扫描失败，继续处理文件系统结果
  output: []
  fallback: NODE-06
```

### NODE-06: AI 风险分析

```yaml
id: NODE-06
input: NODE-03.file_findings + NODE-05.git_findings
action: |
  使用 AI 分析每个发现的风险：
  - 评估密钥类型和敏感度
  - 判断是否为真实密钥还是误报
  - 评估潜在影响范围
success_criteria: 完成风险评估
output: analyzed_findings[] {finding, risk_level, is_false_positive, impact}
on_success: NODE-07
on_failure:
  retry: 1
  fallback: NODE-08
```

### NODE-07: 生成修复建议

```yaml
id: NODE-07
input: NODE-06.analyzed_findings
action: |
  为每个真实发现生成修复建议：
  - 立即撤销泄露的密钥
  - 使用环境变量替代硬编码
  - 添加到 .gitignore
  - 清理 Git 历史（如需要）
success_criteria: 为所有高危发现提供建议
output: remediation_steps[] {finding, steps, priority}
on_success: NODE-08
on_failure:
  fallback: NODE-08
```

### NODE-08: 生成安全报告

```yaml
id: NODE-08
input: NODE-06.analyzed_findings + NODE-07.remediation_steps
action: |
  整合成完整安全报告：
  - 执行摘要（发现数量、风险分布）
  - 详细发现列表
  - 修复建议（按优先级排序）
  - Git 历史发现（如有）
success_criteria: 报告结构完整
output: security_report
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
  向用户解释扫描失败原因
  提供手动检查建议
output: error_message
```

### NODE-FINAL: 输出报告并询问后续

```yaml
id: NODE-FINAL
type: end
input: NODE-08.security_report
action: |
  1. 发送安全报告
  2. 如有高危发现，强烈建议立即处理
  3. 询问是否需要：
     - 自动应用修复建议
     - 导出报告
     - 设置定期扫描
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "扫描代码中的密钥"
- "检查有没有 API key 泄露"
- "安全扫描这个项目"
- "检查 Git 历史中的敏感信息"
- "提交前安全检查"
