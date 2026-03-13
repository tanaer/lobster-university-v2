---
name: testing-patterns
description: 软件测试模式最佳实践 - 学会应用单元测试、集成测试、E2E测试的最佳实践，选择合适的测试框架，提高测试覆盖率和质量。当龙虾需要设计测试策略、编写测试用例、选择测试框架或提高测试覆盖率时触发。触发词：测试模式、单元测试、集成测试、E2E测试、测试框架、测试覆盖率。
version: 2.0.0
type: executable-sop
metadata:
  category: 测试
  module: 软件测试
  level: 中级
  estimated_time: 3小时
  prerequisites: []
  tools_required: [read, exec, web_search]
---

# 软件测试模式

## 知识库

- 单元测试：测试单个函数/模块，使用mock隔离依赖
- 集成测试：测试多个模块间的协作和接口
- E2E测试：模拟真实用户场景，测试完整业务流程
- 测试金字塔：大量单元测试 + 适量集成测试 + 少量E2E测试
- 常用测试框架：Jest/Vitest（JavaScript）、Pytest（Python）、JUnit（Java）
- 测试覆盖率工具：Istanbul、Coverage.py、JaCoCo
- AAA模式：Arrange-Act-Assert（准备-执行-断言）

---

## 工作流

### NODE-01: 接收测试任务

```yaml
id: NODE-01
input: user.query, user.code_context
action: |
  解析用户需求，确定测试类型（单元/集成/E2E）
  识别目标代码/项目技术栈
success_criteria: 明确测试类型和技术栈
output: test_type, tech_stack, target_code
on_success: NODE-02
on_failure:
  action: 向用户请求澄清测试需求和代码上下文
  fallback: ABORT
```

### NODE-02: 分析代码结构

```yaml
id: NODE-02
input: NODE-01.target_code, NODE-01.tech_stack
action: |
  读取相关代码文件
  识别关键函数、类、模块和依赖关系
  确定测试边界和复杂度
success_criteria: 完成代码结构分析，识别出可测试单元
output: code_analysis {functions[], classes[], dependencies[], complexity}
on_success: NODE-03
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-03: 选择测试框架

```yaml
id: NODE-03
input: NODE-02.tech_stack, NODE-01.test_type
action: |
  根据技术栈和测试类型推荐最佳测试框架
  检查项目中是否已存在测试配置
success_criteria: 确定具体的测试框架和版本
output: test_framework, config_exists
on_success: NODE-04
on_failure:
  fallback: ABORT
```

### NODE-04: 设计测试策略

```yaml
id: NODE-04
input: NODE-02.code_analysis, NODE-03.test_framework, NODE-01.test_type
action: |
  根据测试类型设计具体策略：
  - 单元测试：确定mock策略，边界条件
  - 集成测试：确定集成点，数据准备
  - E2E测试：确定用户场景，测试路径
success_criteria: 测试策略覆盖所有关键场景
output: test_strategy {test_cases[], mock_strategy, data_setup, assertions}
on_success: NODE-05
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-05: 生成测试代码

```yaml
id: NODE-05
input: NODE-04.test_strategy, NODE-03.test_framework, NODE-02.code_analysis
action: |
  生成符合框架规范的测试代码
  包含必要的import/require语句
  使用适当的断言和mock
success_criteria: 生成的测试代码语法正确且可执行
output: test_code
on_success: NODE-06
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-06: 验证测试配置

```yaml
id: NODE-06
input: NODE-03.config_exists, NODE-03.test_framework
action: |
  如果配置不存在，生成测试配置文件
  如果配置存在，验证其与推荐设置的一致性
success_criteria: 测试配置正确且完整
output: test_config
on_success: NODE-07
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-07: 计算预期覆盖率

```yaml
id: NODE-07
input: NODE-02.code_analysis, NODE-04.test_strategy
action: |
  基于测试策略估算预期覆盖率
  识别难以覆盖的代码路径
  提出改进建议
success_criteria: 覆盖率估算合理且有改进方案
output: coverage_estimate {expected_percentage, gaps, recommendations}
on_success: NODE-08
on_failure:
  fallback: NODE-08  # 继续但跳过覆盖率部分
```

### NODE-08: 生成测试文档

```yaml
id: NODE-08
input: NODE-05.test_code, NODE-06.test_config, NODE-07.coverage_estimate
action: |
  创建测试实施指南：
  - 如何运行测试
  - 配置说明
  - 预期结果
  - 覆盖率目标
  - 维护建议
success_criteria: 文档完整且实用
output: test_documentation
on_success: NODE-FINAL
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-FINAL: 输出并汇报

```yaml
id: NODE-FINAL
type: end
input: NODE-05.test_code, NODE-06.test_config, NODE-08.test_documentation
action: |
  1. 格式化测试代码和配置
  2. 提供完整的实施包
  3. 询问是否需要运行测试或调整策略
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "为这段代码写单元测试"
- "如何测试这个功能"
- "推荐测试框架"
- "提高测试覆盖率"
- "集成测试策略"
- "E2E测试用例"