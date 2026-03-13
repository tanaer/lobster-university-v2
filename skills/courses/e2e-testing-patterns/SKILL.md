---
name: e2e-testing-patterns
description: E2E 测试模式 - 构建可靠、快速的端到端测试套件。当需要编写 E2E 测试、消除不稳定测试、集成 CI/CD 时触发。触发词：E2E 测试、Playwright、Cypress、自动化测试、测试流水线、消除 flaky 测试。
version: 2.0.0
type: executable-sop
metadata:
  category: 测试
  module: 自动化测试
  level: 高级
  estimated_time: 3 小时
  prerequisites: []
  tools_required: [exec, write, process]
---

# E2E 测试专家

## 知识库

- Playwright: 跨浏览器 (Chromium/Firefox/WebKit)、自动等待、Trace Viewer
- Cypress: 前端友好、Time Travel、网络拦截
- 测试金字塔：单元测试 70% + 集成测试 20% + E2E 10%
- Flaky 测试根因：竞态条件、网络延迟、环境依赖、数据污染
- 最佳实践：Page Object 模式、数据隔离、独立可重复、快速失败
- CI 集成：并行执行、分片 (Sharding)、失败重试、伪影留存

---

## 工作流

### NODE-01: 测试范围定义

```yaml
id: NODE-01
input: user.application_info
action: |
  确定测试范围：
  - 识别关键用户旅程 (Critical User Journeys)
  - 优先级排序 (P0/P1/P2)
  - 确定测试场景 (登录/下单/支付等)
  - 排除不适合 E2E 的场景
success_criteria: 测试场景清单明确
output: test_scope {journeys[], priorities[], exclusions[]}
on_success: NODE-02
on_failure:
  action: 请求用户提供核心业务流程
  fallback: ABORT
```

### NODE-02: 框架选择

```yaml
id: NODE-02
input: NODE-01.test_scope, user.tech_stack
action: |
  选择测试框架：
  - Playwright: 跨浏览器/多标签/API 测试
  - Cypress: 前端调试友好/快照丰富
  - 考虑因素：团队技能、浏览器需求、CI 支持
success_criteria: 框架选择合理
output: framework_choice {name, rationale, config_template}
on_success: NODE-03
on_failure:
  action: 默认选择 Playwright
  fallback: NODE-03
```

### NODE-03: 测试环境配置

```yaml
id: NODE-03
input: NODE-02.framework_choice
action: |
  配置测试环境：
  - 安装依赖 (@playwright/test 或 cypress)
  - 配置文件 (playwright.config.ts / cypress.config.js)
  - 浏览器安装
  - 环境变量 (测试数据库 URL 等)
  - 测试数据准备策略
success_criteria: 可运行示例测试
output: test_environment {config_file, dependencies, env_vars}
on_success: NODE-04
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-04: Page Object 设计

```yaml
id: NODE-04
type: loop
input: NODE-01.test_scope
action: |
  设计 Page Object：
  - 识别页面/组件
  - 定义定位器 (优先 data-testid)
  - 封装操作方法
  - 添加断言方法
  每个页面生成独立的 Page 类
output: page_objects {name, locators[], methods[]}[]
on_success: NODE-05
```

### NODE-05: 编写测试用例

```yaml
id: NODE-05
type: loop
input: NODE-01.test_scope, NODE-04.page_objects
action: |
  编写测试：
  - Arrange: 准备测试数据
  - Act: 执行用户操作
  - Assert: 验证结果
  - 添加适当等待 (避免硬编码 sleep)
  - 截图/录屏 (失败时)
max_iterations: 10
output: test_cases {name, steps[], assertions[], fixtures[]}[]
on_success: NODE-06
```

### NODE-06: 测试数据管理

```yaml
id: NODE-06
input: NODE-05.test_cases
action: |
  设计数据策略：
  - 测试前：创建数据 (API/直接 DB)
  - 测试中：隔离数据 (唯一标识)
  - 测试后：清理数据
  - 使用 Factory/Builder 模式
success_criteria: 测试可独立重复运行
output: data_strategy {setup, teardown, isolation_method}
on_success: NODE-07
on_failure:
  fallback: NODE-05
```

### NODE-07: Flaky 测试消除

```yaml
id: NODE-07
input: NODE-05.test_cases
action: |
  检查并修复不稳定因素：
  - 替换硬编码等待为智能等待
  - 消除竞态条件
  - 移除环境依赖
  - 固定测试数据
  - 添加失败重试 (最多 2 次)
success_criteria: 连续运行 10 次通过率 100%
output: stability_report {flaky_tests[], fixes_applied, pass_rate}
on_success: NODE-08
on_failure:
  action: 标记不稳定测试并隔离
  fallback: NODE-08
```

### NODE-08: CI/CD 集成

```yaml
id: NODE-08
input: NODE-02.framework_choice, NODE-05.test_cases
action: |
  配置 CI 流水线：
  - 添加测试 Job
  - 配置并行执行 (Sharding)
  - 失败重试机制
  - 保存测试伪影 (截图/录像/Trace)
  - 通知集成 (Slack/钉钉)
success_criteria: CI 可自动触发测试
output: cicd_config {workflow_file, parallelism, artifacts, notifications}
on_success: NODE-09
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-09: 性能优化

```yaml
id: NODE-09
input: NODE-05.test_cases, NODE-08.cicd_config
action: |
  优化执行速度：
  - 并行执行测试
  - 复用登录状态 (Storage State)
  - 按需启动浏览器
  - 限制超时时间
  - 目标：单次 E2E < 10 分钟
success_criteria: 总执行时间 < 10 分钟
output: performance_report {total_time, parallelization_factor, bottlenecks[]}
on_success: NODE-10
on_failure:
  action: 识别并优化慢测试
  fallback: NODE-05
```

### NODE-10: 测试报告

```yaml
id: NODE-10
input: NODE-09.performance_report
action: |
  配置测试报告：
  - HTML 报告 (内置/第三方)
  - JUnit XML (CI 集成)
  - 覆盖率报告
  - 趋势分析 (通过率/执行时间)
success_criteria: 报告可清晰展示测试结果
output: reporting_config {format, output_path, retention}
on_success: NODE-FINAL
```

### NODE-FINAL: 交付测试套件

```yaml
id: NODE-FINAL
type: end
input: NODE-10.reporting_config, NODE-07.stability_report
action: |
  输出测试包：
  1. 测试框架配置
  2. Page Objects 库
  3. 测试用例集
  4. 测试数据管理脚本
  5. CI/CD 集成配置
  6. 测试报告模板
  7. 运维手册 (执行/调试/维护)
  8. Flaky 测试处理建议
output: e2e_test_package
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "写 E2E 测试"
- "Playwright 测试"
- "Cypress 测试"
- "自动化测试"
- "消除 flaky 测试"
- "测试流水线"
- "CI 测试集成"
