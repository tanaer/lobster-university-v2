---
name: cicd-pipeline-builder
description: CI/CD 流水线构建器 - 创建、调试、管理 GitHub Actions 持续集成/部署流水线。支持自动化测试、自动化部署、Secrets 管理、缓存优化、矩阵构建。触发词：CI/CD、GitHub Actions、自动化测试、自动化部署、流水线、DevOps。
version: 2.0.0
type: executable-sop
metadata:
  category: DevOps
  module: 持续集成部署
  level: 中级
  estimated_time: 75分钟
  prerequisites: [github-actions]
  tools_required: [cicd-pipeline, github]
---

# CI/CD 流水线构建器

## 知识库

- `cicd-pipeline` skill 提供完整的 CI/CD 流水线构建能力
- GitHub Actions 核心概念：Workflow、Job、Step、Action、Runner
- 常用触发器：push、pull_request、schedule、workflow_dispatch
- Secrets 管理：加密存储敏感信息，不在日志中暴露
- 缓存优化：缓存依赖、artifact、workspace 持久化
- 矩阵构建：多版本、多平台并行测试

---

## 工作流

### NODE-01: 接收流水线需求

```yaml
id: NODE-01
input: user.pipeline_request
action: |
  解析流水线需求：
  - 项目类型（前端/后端/全栈/移动）
  - 主要功能（测试/构建/部署/通知）
  - 目标环境（开发/测试/生产）
  - 特殊需求（矩阵构建、缓存、密钥）
success_criteria: 明确流水线目标和范围
output: project_type, pipeline_goals[], environments[], special_requirements
on_success: NODE-02
on_failure:
  action: 询问用户具体需要什么类型的流水线
  fallback: ABORT
```

### NODE-02: 选择流水线模板

```yaml
id: NODE-02
type: branch
input: NODE-01.project_type + NODE-01.pipeline_goals
branches:
  - condition: 前端 + 测试部署
    target: NODE-03A
  - condition: 后端 + 测试部署
    target: NODE-03B
  - condition: 全栈 + 完整流程
    target: NODE-03C
  - condition: 自定义需求
    target: NODE-03D
default: NODE-03D
```

### NODE-03A: 生成前端流水线

```yaml
id: NODE-03A
input: NODE-01.output
action: |
  生成前端 CI/CD 配置：
  1. 安装依赖（npm/cnpm/yarn）
  2. 代码检查（ESLint/Prettier）
  3. 单元测试（Jest/Vitest）
  4. 构建（Webpack/Vite）
  5. 部署到静态托管
  6. 通知（可选）
success_criteria: 生成完整的 workflow YAML
output: workflow_yaml {content, filename}
on_success: NODE-04
on_failure:
  retry: 1
  fallback: NODE-ERROR
```

### NODE-03B: 生成后端流水线

```yaml
id: NODE-03B
input: NODE-01.output
action: |
  生成后端 CI/CD 配置：
  1. 安装依赖（pip/maven/gradle）
  2. 代码检查（pylint/checkstyle）
  3. 单元测试（pytest/junit）
  4. 构建（打包/Docker镜像）
  5. 部署到服务器/容器平台
  6. 健康检查
success_criteria: 生成完整的 workflow YAML
output: workflow_yaml {content, filename}
on_success: NODE-04
on_failure:
  retry: 1
  fallback: NODE-ERROR
```

### NODE-03C: 生成全栈流水线

```yaml
id: NODE-03C
input: NODE-01.output
action: |
  生成全栈 CI/CD 配置：
  1. 前端 job（测试 + 构建）
  2. 后端 job（测试 + 构建）
  3. 集成测试 job
  4. 部署 job（前后端协调）
  5. 端到端测试（可选）
success_criteria: 生成完整的 workflow YAML
output: workflow_yaml {content, filename}
on_success: NODE-04
on_failure:
  retry: 1
  fallback: NODE-ERROR
```

### NODE-03D: 生成自定义流水线

```yaml
id: NODE-03D
input: NODE-01.output
action: |
  根据用户需求自定义流水线：
  1. 分析每个需求点
  2. 选择对应的 Actions
  3. 组装 job 和 step
  4. 配置依赖关系
  5. 添加条件和环境变量
success_criteria: 生成符合需求的 workflow YAML
output: workflow_yaml {content, filename}
on_success: NODE-04
on_failure:
  action: 询问用户简化需求
  fallback: NODE-ERROR
```

### NODE-04: 配置 Secrets 和环境变量

```yaml
id: NODE-04
input: NODE-01.special_requirements
action: |
  识别并配置必要的 Secrets：
  - 部署密钥（SSH key、API token）
  - 云服务凭证（AWS、Azure、GCP）
  - 第三方服务（Docker Hub、NPM）
  - 通知 webhook（Slack、钉钉）
success_criteria: 列出所有需要的 Secrets 及配置方法
output: secrets_list[] {name, description, how_to_configure}
on_success: NODE-05
on_failure:
  fallback: NODE-05
```

### NODE-05: 添加性能优化

```yaml
id: NODE-05
input: NODE-03*.workflow_yaml + NODE-01.special_requirements
action: |
  优化流水线性能：
  - 添加依赖缓存（node_modules、pip、maven）
  - 配置 artifact 持久化
  - 优化触发条件（路径过滤）
  - 并行化独立 job
  - 配置超时和重试
success_criteria: 性能优化配置完成
output: optimized_workflow_yaml
on_success: NODE-06
on_failure:
  action: 警告优化失败，使用基础版本
  fallback: NODE-06
```

### NODE-06: 验证 YAML 语法

```yaml
id: NODE-06
input: NODE-05.optimized_workflow_yaml
action: |
  验证 workflow YAML：
  - YAML 语法检查
  - GitHub Actions 语法验证
  - 检查必需字段
  - 检查 actions 版本
success_criteria: YAML 语法正确
output: validated_yaml
on_success: NODE-07
on_failure:
  action: 指出语法错误并修复
  fallback: NODE-03D
```

### NODE-07: 生成配置文档

```yaml
id: NODE-07
input: NODE-06.validated_yaml + NODE-04.secrets_list
action: |
  生成完整配置文档：
  - 流水线说明
  - Secrets 配置指南
  - 触发条件说明
  - 自定义修改指南
  - 故障排查建议
success_criteria: 文档清晰完整
output: documentation
on_success: NODE-FINAL
on_failure:
  fallback: NODE-FINAL
```

### NODE-ERROR: 错误处理

```yaml
id: NODE-ERROR
type: end
action: |
  向用户解释流水线生成失败原因
  提供手动配置建议
  询问是否需要简化需求
output: error_message
```

### NODE-FINAL: 输出并询问后续

```yaml
id: NODE-FINAL
type: end
input: NODE-06.validated_yaml + NODE-07.documentation
action: |
  1. 展示 workflow YAML 内容
  2. 提供 Secrets 配置清单
  3. 提供完整配置文档
  4. 询问是否需要：
     - 直接提交到仓库
     - 添加更多功能
     - 配置分支保护规则
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "创建 CI/CD 流水线"
- "设置 GitHub Actions"
- "自动化测试和部署"
- "配置持续集成"
- "帮我写个 workflow 文件"
