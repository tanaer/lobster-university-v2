---
name: infra-as-code
description: >
  基础设施即代码 - 使用 Terraform、CloudFormation、Pulumi 定义和管理云基础设施。
  当用户需要：编写 IaC 配置、管理 Terraform 状态、部署云资源、调试基础设施漂移、
  设置多环境部署、创建 VPC/EC2/S3/RDS/Lambda 时触发。
  触发词：terraform、cloudformation、pulumi、基础设施、IaC、部署、VPC、EC2、S3、RDS
version: 2.0.0
type: executable-sop
metadata:
  category: 云原生
  module: 基础设施管理
  level: 高级
  estimated_time: 60分钟
  prerequisites: [云账号(AWS/Azure/GCP), 基础命令行]
  tools_required: [exec, write, read]
---

# 基础设施即代码 (IaC)

## 知识库

- `terraform plan/apply/destroy` - 预览/应用/销毁资源
- `pulumi preview/up` - Pulumi 工作流
- `aws cloudformation` - CloudFormation CLI
- 状态管理：本地 → 远程 S3 + DynamoDB 锁定
- 多环境：workspaces + tfvars 文件

---

## 工作流

### NODE-01: 需求分析

```yaml
id: NODE-01
input: user.request
type: branch
action: |
  解析用户需求：
  1. 云平台：AWS / Azure / GCP / 其他
  2. 工具偏好：Terraform / CloudFormation / Pulumi
  3. 资源类型：VPC / 计算 / 存储 / 数据库 / 无服务器
  4. 环境需求：单环境 / 多环境(dev/staging/prod)
  5. 现有状态：全新项目 / 已有资源需导入
success_criteria: 明确工具和资源范围
output: {platform, tool, resources[], environments[], existing?}
on_success: NODE-02
on_failure:
  action: 询问缺失信息
  fallback: ABORT
```

### NODE-02: 项目结构初始化

```yaml
id: NODE-02
input: [NODE-01.tool, NODE-01.resources]
action: |
  根据工具创建项目结构：
  
  Terraform:
  ```
  infra/
    main.tf variables.tf outputs.tf providers.tf
    terraform.tfvars backend.tf
    modules/{vpc,compute,db}/
  ```
  
  Pulumi:
  ```
  infra/
    Pulumi.yaml Pulumi.{stack}.yaml
    index.ts (或 __main__.py)
  ```
  
  CloudFormation:
  ```
  infra/
    template.yaml parameters/
  ```
  
  创建目录和基础文件
success_criteria: 项目结构创建完成
output: project_path
on_success: NODE-03
on_failure:
  action: 检查目录权限
  fallback: ABORT
```

### NODE-03: 提供商配置

```yaml
id: NODE-03
input: [NODE-01.platform, NODE-02.project_path, NODE-01.tool]
action: |
  生成提供商配置：
  
  Terraform (providers.tf):
  ```hcl
  terraform {
    required_version = ">= 1.5"
    required_providers {
      aws = { source = "hashicorp/aws", version = "~> 5.0" }
    }
  }
  provider "aws" {
    region = var.aws_region
    default_tags { tags = { ManagedBy = "terraform" } }
  }
  ```
  
  执行 terraform init 或 pulumi stack init
success_criteria: 提供商配置完成，初始化成功
output: init_status
on_success: NODE-04
on_failure:
  action: 检查凭证配置 (AWS_ACCESS_KEY_ID, ~/.aws/credentials)
  fallback: ABORT
```

### NODE-04: 变量定义

```yaml
id: NODE-04
input: [NODE-01.resources, NODE-01.environments, NODE-02.project_path]
action: |
  创建变量文件：
  
  variables.tf:
  - aws_region (default: us-east-1)
  - environment (validation: dev/staging/prod)
  - instance_type (default: t3.micro)
  - db_password (sensitive: true)
  
  terraform.tfvars (示例值，不提交真实密码)
  env/dev.tfvars, env/prod.tfvars (多环境)
  
  outputs.tf 定义关键输出：vpc_id, endpoint, db_host
success_criteria: 变量定义完整
output: variables_file_path
on_success: NODE-05
on_failure:
  fallback: NODE-05
```

### NODE-05: 核心资源配置

```yaml
id: NODE-05
input: [NODE-01.resources, NODE-04.variables_file_path]
type: loop
action: |
  为每种资源类型生成配置：
  
  VPC/网络：
  - aws_vpc, aws_subnet(public/private), aws_internet_gateway
  - aws_route_table, aws_security_group
  
  计算：
  - aws_instance (EC2), aws_launch_template, aws_autoscaling_group
  - aws_lambda_function, aws_iam_role
  
  存储：
  - aws_s3_bucket, aws_s3_bucket_versioning
  
  数据库：
  - aws_db_instance (RDS), aws_db_subnet_group
  
  每个资源包含：标签、依赖关系、生命周期规则
max_iterations: 10
output: resource_configs[]
on_complete: NODE-06
```

### NODE-06: 状态管理配置

```yaml
id: NODE-06
input: [NODE-02.project_path, NODE-01.environments]
action: |
  配置远程状态 (backend.tf)：
  ```hcl
  terraform {
    backend "s3" {
      bucket         = "my-terraform-state"
      key            = "project/terraform.tfstate"
      region         = "us-east-1"
      dynamodb_table = "terraform-locks"
      encrypt        = true
    }
  }
  ```
  
  检查/创建：
  - S3 bucket 存在且启用版本控制
  - DynamoDB 表存在，主键 LockID
  
  执行：terraform init -reconfigure
success_criteria: 远程状态配置成功
output: backend_status
on_success: NODE-07
on_failure:
  action: 创建 S3 bucket 和 DynamoDB 表后重试
  fallback: NODE-07
```

### NODE-07: 计划与验证

```yaml
id: NODE-07
input: NODE-02.project_path
action: |
  执行验证流程：
  1. terraform fmt -recursive (格式化)
  2. terraform validate (语法检查)
  3. terraform plan -out=plan.tfplan (生成计划)
  
  分析 plan 输出：
  - 新增资源数
  - 修改资源数
  - 销毁资源数
  - 是否有意外变更
success_criteria: plan 成功，无意外销毁
output: plan_summary {add, change, destroy, plan_file}
on_success: NODE-08
on_failure:
  action: 修复语法错误或依赖问题
  fallback: NODE-05
```

### NODE-08: 用户确认

```yaml
id: NODE-08
input: NODE-07.plan_summary
type: branch
action: |
  向用户展示计划摘要：
  - 将创建 X 个资源
  - 将修改 Y 个资源
  - 将销毁 Z 个资源 (如果是 prod，警告)
  
  请求确认：
  - 确认执行 apply
  - 取消
  - 修改配置
success_criteria: 用户明确确认
output: user_confirmation
on_success: NODE-09
on_failure:
  action: 根据用户反馈修改
  fallback: NODE-05
```

### NODE-09: 应用配置

```yaml
id: NODE-09
input: [NODE-07.plan_file, NODE-02.project_path]
action: |
  执行：terraform apply plan.tfplan
  
  监控输出：
  - 资源创建进度
  - 错误信息
  - 输出值
  
  保存输出到 outputs.json
success_criteria: apply 成功，资源创建完成
output: apply_result {outputs, resources_created[]}
on_success: NODE-10
on_failure:
  action: |
    根据错误类型处理：
    - 权限错误 → 检查 IAM 策略
    - 配额限制 → 申请提升配额
    - 依赖错误 → 调整资源依赖
  retry: 2
  fallback: ABORT
```

### NODE-10: 输出与文档

```yaml
id: NODE-10
input: [NODE-09.apply_result, NODE-02.project_path]
action: |
  1. 收集所有输出值：vpc_id, endpoint, db_host 等
  2. 生成资源清单文档
  3. 创建 .gitignore (排除 .terraform/, *.tfstate, *.tfvars)
  4. 提交到版本控制 (可选)
  
  格式化输出：
  - 资源列表和访问方式
  - 重要输出值
  - 后续操作建议
success_criteria: 文档生成完成
output: documentation
on_success: NODE-FINAL
on_failure:
  fallback: NODE-FINAL
```

### NODE-FINAL: 完成与后续建议

```yaml
id: NODE-FINAL
type: end
input: [NODE-09.apply_result, NODE-10.documentation]
action: |
  输出总结：
  ✅ 基础设施部署完成
  📋 创建资源：{resources_count}
  🔗 重要端点：{endpoints}
  📁 项目位置：{project_path}
  
  后续操作建议：
  1. 设置定期 drift 检查：terraform plan -refresh-only
  2. 配置 CI/CD 自动部署
  3. 设置成本监控告警
  4. 定期备份状态文件
  
  询问用户是否需要其他环境的配置
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "用 Terraform 部署 AWS"
- "创建 CloudFormation 模板"
- "设置 Pulumi 项目"
- "搭建 VPC 和 EC2"
- "配置基础设施"
