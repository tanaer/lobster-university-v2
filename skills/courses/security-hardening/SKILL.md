---
name: security-hardening
description: 安全加固实践 - 凭证卫生管理、敏感信息扫描、提示注入防御、数据泄露防护。当龙虾需要审计代码安全、加固系统防护、检查敏感信息泄露时触发。触发词：安全审计、凭证管理、敏感信息、安全加固、API Key 扫描。
version: 2.0.0
type: executable-sop
metadata:
  category: 安全
  module: 安全加固
  level: 高级
  estimated_time: 45分钟
  prerequisites: [api-key-guardian]
  tools_required: [write, read, exec, web_search]
---

# 安全加固实践

## 知识库

- 凭证管理：环境变量、Secrets Manager、.gitignore
- 敏感扫描：git-secrets、truffleHog、gitleaks
- 提示注入：输入验证、输出过滤、权限隔离
- 数据防护：加密存储、传输加密、最小权限原则

---

## 工作流

### NODE-01: 安全需求分析

```yaml
id: NODE-01
input: user.request
action: |
  确定安全加固目标：
  - 凭证卫生检查
  - 敏感信息扫描
  - 提示注入防御
  - 全面安全审计
success_criteria: 目标明确
output: security_target
on_success: NODE-02
on_failure:
  action: 询问具体安全需求
  fallback: ABORT
```

### NODE-02: 路由分发

```yaml
id: NODE-02
type: branch
input: NODE-01.security_target
branches:
  - condition: target == "credentials"
    target: NODE-03-CREDS
  - condition: target == "sensitive_scan"
    target: NODE-03-SCAN
  - condition: target == "prompt_injection"
    target: NODE-03-PROMPT
  - condition: target == "full_audit"
    target: NODE-03-AUDIT
  - default: NODE-03-AUDIT
output: route_target
```

### NODE-03-CREDS: 凭证卫生检查

```yaml
id: NODE-03-CREDS
input: user.project_path
action: |
  检查凭证管理：
  1. 扫描硬编码密钥
  2. 检查 .env 文件
  3. 验证 .gitignore 配置
  4. 审计 git 历史中的敏感信息
success_criteria: 无明文凭证泄露
output: credential_report {issues[], recommendations[]}
on_success: NODE-04
```

### NODE-03-SCAN: 敏感信息扫描

```yaml
id: NODE-03-SCAN
input: user.project_path
action: |
  执行敏感信息扫描：
  1. 运行 gitleaks scan
  2. 检查 API Key 格式
  3. 识别数据库连接串
  4. 检测私钥文件
success_criteria: 扫描完成，问题列表生成
output: sensitive_findings[]
on_success: NODE-04
```

### NODE-03-PROMPT: 提示注入防御

```yaml
id: NODE-03-PROMPT
input: user.ai_system_config
action: |
  分析提示注入风险：
  1. 检查用户输入处理
  2. 审计系统提示词
  3. 验证输出过滤
  4. 评估权限边界
success_criteria: 风险点识别完成
output: injection_risks[]
on_success: NODE-04
```

### NODE-03-AUDIT: 全面安全审计

```yaml
id: NODE-03-AUDIT
input: user.project_path
action: |
  执行全面审计：
  1. 凭证卫生检查（NODE-03-CREDS）
  2. 敏感信息扫描（NODE-03-SCAN）
  3. 依赖漏洞检查（npm audit）
  4. 代码安全模式审查
success_criteria: 审计报告完整
output: full_audit_report
on_success: NODE-04
```

### NODE-04: 风险评估

```yaml
id: NODE-04
input: NODE-03-*.output
action: |
  评估安全风险等级：
  - 严重：凭证泄露、RCE 漏洞
  - 高危：敏感信息暴露
  - 中危：配置不当
  - 低危：最佳实践建议
success_criteria: 风险等级明确
output: risk_assessment {critical[], high[], medium[], low[]}
on_success: NODE-05
```

### NODE-05: 修复方案生成

```yaml
id: NODE-05
type: loop
input: NODE-04.risk_assessment
each: risk_item
action: |
  为每个风险生成修复方案：
  1. 描述问题影响
  2. 提供修复代码
  3. 说明验证方法
  4. 给出预防措施
max_iterations: 20
output: fixes[]
on_complete: NODE-06
```

### NODE-06: 修复实施

```yaml
id: NODE-06
input: NODE-05.fixes
action: |
  实施安全修复：
  1. 移除硬编码凭证
  2. 配置环境变量
  3. 更新 .gitignore
  4. 添加 pre-commit hooks
  5. 清理 git 历史（如需要）
success_criteria: 关键风险已修复
output: applied_fixes[]
on_success: NODE-07
on_failure:
  action: 记录无法自动修复的问题
  fallback: NODE-07
```

### NODE-07: 验证修复效果

```yaml
id: NODE-07
input: NODE-06.applied_fixes
action: |
  重新运行安全检查：
  1. 重新扫描敏感信息
  2. 验证凭证不再泄露
  3. 确认配置正确
success_criteria: 无严重和高危问题
output: verification_result
on_success: NODE-FINAL
on_failure:
  action: 返回残留问题
  fallback: NODE-05
```

### NODE-FINAL: 交付与持续监控

```yaml
id: NODE-FINAL
type: end
input: NODE-07.verification_result
action: |
  1. 输出安全审计报告
  2. 列出已修复问题
  3. 提供持续监控方案
  4. 推荐安全工具集成
output: security_delivery
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "安全审计"
- "检查 API Key 泄露"
- "扫描敏感信息"
- "加固系统安全"
- "凭证卫生检查"
