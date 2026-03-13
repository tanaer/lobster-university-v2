---
name: devops-automation-pack
description: DevOps 自动化 - Docker、K8s、CI/CD 一站式部署自动化。当需要容器化应用、编排部署、搭建流水线或监控告警时触发。触发词：Docker 部署、Kubernetes、CI/CD 流水线、容器编排、监控告警、自动化发布。
version: 2.0.0
type: executable-sop
metadata:
  category: DevOps
  module: 自动化部署
  level: 高级
  estimated_time: 4 小时
  prerequisites: []
  tools_required: [exec, write, process]
---

# DevOps 自动化专家

## 知识库

- Docker: Dockerfile 最佳实践、多阶段构建、镜像优化
- Kubernetes: Deployment/Service/Ingress/ConfigMap/Secret
- CI/CD: GitHub Actions、GitLab CI、Jenkins Pipeline
- 监控：Prometheus + Grafana、告警规则 Alertmanager
- 日志：ELK Stack (Elasticsearch/Logstash/Kibana)、Loki
- 备份：Velero (K8s)、数据库备份策略
- 安全：镜像扫描、网络策略、RBAC 权限

---

## 工作流

### NODE-01: 应用分析

```yaml
id: NODE-01
input: user.application_info
action: |
  收集应用信息：
  - 技术栈 (语言/框架/版本)
  - 依赖服务 (数据库/缓存/消息队列)
  - 资源需求 (CPU/内存/存储)
  - 部署环境 (开发/测试/生产)
  - 扩展要求 (副本数/自动扩缩容)
success_criteria: 应用画像完整
output: app_profile {stack, dependencies, resources, environments, scaling}
on_success: NODE-02
on_failure:
  action: 请求用户提供应用详情
  fallback: ABORT
```

### NODE-02: Docker 化

```yaml
id: NODE-02
input: NODE-01.app_profile
action: |
  编写 Dockerfile：
  - 选择基础镜像 (Alpine/Debian)
  - 多阶段构建 (减小镜像)
  - 配置环境变量
  - 暴露端口
  - 健康检查 (HEALTHCHECK)
  - 非 root 用户运行
success_criteria: Dockerfile 可构建且镜像<500MB
output: dockerfile_content
on_success: NODE-03
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-03: Docker Compose (开发环境)

```yaml
id: NODE-03
input: NODE-01.app_profile, NODE-02.dockerfile_content
action: |
  编写 docker-compose.yml：
  - 定义应用服务
  - 配置依赖服务 (DB/Redis/MQ)
  - 挂载数据卷
  - 设置网络隔离
  - 配置环境变量
success_criteria: compose up 可启动完整栈
output: compose_file
on_success: NODE-04
on_failure:
  fallback: NODE-02
```

### NODE-04: Kubernetes 配置

```yaml
id: NODE-04
input: NODE-01.app_profile, NODE-02.dockerfile_content
action: |
  生成 K8s 资源清单：
  - Deployment (副本数/资源限制/健康检查)
  - Service (ClusterIP/NodePort/LoadBalancer)
  - Ingress (域名/HTTPS/路径路由)
  - ConfigMap (配置文件)
  - Secret (敏感信息)
  - HPA (自动扩缩容)
success_criteria: kubectl apply 可部署
output: k8s_manifests {deployment, service, ingress, configmap, secret, hpa}
on_success: NODE-05
on_failure:
  retry: 1
  fallback: NODE-02
```

### NODE-05: CI/CD 流水线

```yaml
id: NODE-05
input: NODE-02.dockerfile_content, NODE-04.k8s_manifests
action: |
  选择平台并生成配置：
  - GitHub Actions: .github/workflows/deploy.yml
  - GitLab CI: .gitlab-ci.yml
  流程：代码提交→构建→测试→镜像推送→部署
success_criteria: 流水线可触发并执行
output: cicd_config
on_success: NODE-06
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-06: 监控配置

```yaml
id: NODE-06
input: NODE-01.app_profile
action: |
  配置监控告警：
  - Prometheus metrics 暴露
  - Grafana 仪表盘模板
  - 告警规则 (CPU/内存/错误率/延迟)
  - Alertmanager 通知渠道
success_criteria: 可采集指标并触发告警
output: monitoring_config {prometheus_rules, grafana_dashboard, alertmanager_config}
on_success: NODE-07
on_failure:
  fallback: NODE-07
```

### NODE-07: 日志系统

```yaml
id: NODE-07
input: NODE-01.app_profile
action: |
  配置日志收集：
  - 应用日志输出规范 (JSON 格式)
  - Log collector (Fluentd/Filebeat)
  - 日志存储 (Elasticsearch/Loki)
  - 日志查询仪表盘 (Kibana/Grafana)
success_criteria: 日志可集中查询
output: logging_config {log_format, collector_config, storage_config}
on_success: NODE-08
on_failure:
  fallback: NODE-08
```

### NODE-08: 备份策略

```yaml
id: NODE-08
input: NODE-01.app_profile
action: |
  设计备份方案：
  - 数据库备份 (定时 + 增量)
  - K8s 资源备份 (Velero)
  - 备份保留策略
  - 恢复演练计划
success_criteria: 有可执行的备份恢复流程
output: backup_plan {schedule, retention, recovery_procedure}
on_success: NODE-09
on_failure:
  fallback: NODE-09
```

### NODE-09: 安全加固

```yaml
id: NODE-09
input: NODE-02.dockerfile_content, NODE-04.k8s_manifests
action: |
  安全配置检查：
  - 镜像漏洞扫描 (Trivy/Clair)
  - K8s NetworkPolicy
  - RBAC 最小权限
  - Secret 加密存储
  - 容器安全上下文
success_criteria: 通过安全检查清单
output: security_report {vulnerabilities[], hardening_applied}
on_success: NODE-10
on_failure:
  action: 修复高危漏洞
  fallback: NODE-02
```

### NODE-10: 部署验证

```yaml
id: NODE-10
type: loop
input: NODE-04.k8s_manifests, NODE-05.cicd_config
action: |
  部署验证清单：
  - 应用健康检查通过
  - 服务可访问 (端口/域名)
  - 监控数据上报
  - 日志正常输出
  - 回滚测试
success_criteria: 所有验证项通过
output: deployment_checklist {items[], passed}
on_success: NODE-FINAL
on_failure:
  action: 排查失败项
  fallback: NODE-04
```

### NODE-FINAL: 交付运维手册

```yaml
id: NODE-FINAL
type: end
input: NODE-10.deployment_checklist
action: |
  输出运维包：
  1. Dockerfile + docker-compose.yml
  2. K8s 资源清单
  3. CI/CD 流水线配置
  4. 监控告警配置
  5. 日志收集配置
  6. 备份恢复流程
  7. 安全加固报告
  8. 运维手册 (发布/回滚/排查)
output: devops_package
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "Docker 部署"
- "Kubernetes 配置"
- "CI/CD 流水线"
- "容器化应用"
- "监控告警配置"
- "自动化发布"
- "DevOps 搭建"
