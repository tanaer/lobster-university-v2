---
name: debug-methodology
description: 调试方法论 - 系统化问题解决和调试流程。当遇到 Bug、性能问题、部署故障或需要定位根因时触发。触发词：调试、排查问题、Bug 修复、性能分析、日志分析、定位问题。
version: 2.0.0
type: executable-sop
metadata:
  category: 开发工具
  module: 问题排查
  level: 中级
  estimated_time: 2 小时
  prerequisites: []
  tools_required: [exec, read, process]
---

# 调试方法论专家

## 知识库

- 调试原则：先复现→再定位→后修复→验证回归
- 二分法：快速缩小问题范围 (时间/代码/环境)
- 日志级别：DEBUG < INFO < WARN < ERROR < FATAL
- 性能分析：CPU Profiling、Memory Profiling、Flame Graph
- 常见问题：空指针、竞态条件、资源泄漏、配置错误
- 工具链：debugger、strace、lsof、top、htop、Wireshark

---

## 工作流

### NODE-01: 问题描述收集

```yaml
id: NODE-01
input: user.problem_description
action: |
  收集信息 (5W1H)：
  - What: 现象是什么？错误信息？
  - When: 何时发生？频率？
  - Where: 哪个环境/服务/模块？
  - Who: 影响哪些用户？
  - How: 如何复现？步骤？
  - Change: 最近有什么变更？
success_criteria: 问题描述可复现或有日志
output: problem Brief {symptoms, error_message, environment, reproduction_steps}
on_success: NODE-02
on_failure:
  action: 引导用户补充关键信息
  fallback: ABORT
```

### NODE-02: 问题分类

```yaml
id: NODE-02
input: NODE-01.problem_brief
action: |
  分类问题类型：
  - 功能 Bug (逻辑错误/边界条件)
  - 性能问题 (慢/卡顿/超时)
  - 资源问题 (内存/CPU/磁盘)
  - 网络问题 (连接/DNS/防火墙)
  - 配置问题 (环境变量/权限)
  - 依赖问题 (版本不兼容)
success_criteria: 问题类型明确
output: problem_type
on_success: NODE-03
on_failure:
  action: 默认按功能 Bug 处理
  fallback: NODE-03
```

### NODE-03: 复现问题

```yaml
id: NODE-03
input: NODE-01.problem_brief
action: |
  尝试复现：
  - 执行复现步骤
  - 记录实际输出
  - 确认复现频率 (必现/偶现)
  - 最小化复现条件
success_criteria: 成功复现或确认偶现条件
output: reproduction_result {reproducible, frequency, minimal_conditions}
on_success: NODE-04
on_failure:
  action: 请求用户协助复现或提供日志
  fallback: NODE-08
```

### NODE-04: 日志分析

```yaml
id: NODE-04
input: NODE-03.reproduction_result, NODE-02.problem_type
action: |
  收集与分析日志：
  - 定位相关日志文件
  - 筛选 ERROR/WARN 级别
  - 关联时间戳与复现步骤
  - 提取异常堆栈/错误码
success_criteria: 找到可疑日志条目
output: log_evidence {error_entries[], stack_traces[], timestamps[]}
on_success: NODE-05
on_failure:
  action: 开启调试日志级别重新复现
  fallback: NODE-03
```

### NODE-05: 二分法定位

```yaml
id: NODE-05
type: loop
input: NODE-04.log_evidence
action: |
  二分法缩小范围：
  - 时间二分：注释代码/切换版本
  - 模块二分：隔离问题模块
  - 数据二分：简化输入数据
  - 环境二分：对比正常/异常环境
  每次迭代缩小 50% 范围
max_iterations: 5
output: suspicious_scope {module, function, line_range, confidence}
on_success: NODE-06
```

### NODE-06: 根因假设

```yaml
id: NODE-06
input: NODE-05.suspicious_scope
action: |
  提出根因假设：
  - 基于证据列出可能原因
  - 按可能性排序
  - 设计验证方法 (证伪测试)
success_criteria: 有可验证的假设
output: root_cause_hypothesis {hypotheses[], verification_plan}
on_success: NODE-07
on_failure:
  fallback: NODE-05
```

### NODE-07: 验证与修复

```yaml
id: NODE-07
input: NODE-06.root_cause_hypothesis
action: |
  验证并修复：
  - 执行验证测试
  - 确认根因
  - 制定修复方案
  - 实施修复
  - 验证修复效果
success_criteria: 问题不再复现
output: fix_result {root_cause, fix_applied, verification_passed}
on_success: NODE-09
on_failure:
  retry: 2
  fallback: NODE-06
```

### NODE-08: 深入分析 (疑难问题)

```yaml
id: NODE-08
input: NODE-04.log_evidence, NODE-02.problem_type
action: |
  高级分析手段：
  - 性能问题：Profiling + Flame Graph
  - 内存问题：Heap Dump 分析
  - 竞态条件：Thread Dump + 时序分析
  - 网络问题：tcpdump/Wireshark 抓包
  - 系统问题：strace/lsof 追踪
success_criteria: 获取深层证据
output: deep_analysis_report
on_success: NODE-06
on_failure:
  action: 建议用户寻求专家协助
  fallback: NODE-FINAL
```

### NODE-09: 回归测试

```yaml
id: NODE-09
input: NODE-07.fix_result
action: |
  防止回归：
  - 编写/更新测试用例
  - 覆盖本次 Bug 场景
  - 运行相关测试集
  - 确认无副作用
success_criteria: 测试通过
output: regression_test_result {test_cases[], passed, coverage}
on_success: NODE-10
on_failure:
  action: 重新评估修复方案
  fallback: NODE-07
```

### NODE-10: 文档化

```yaml
id: NODE-10
input: NODE-09.regression_test_result, NODE-07.fix_result
action: |
  记录知识：
  - 问题描述与根因
  - 修复方案
  - 经验教训
  - 更新排查手册
success_criteria: 文档完整可检索
output: knowledge_base_entry
on_success: NODE-FINAL
```

### NODE-FINAL: 输出报告

```yaml
id: NODE-FINAL
type: end
input: NODE-10.knowledge_base_entry, NODE-07.fix_result
action: |
  输出调试报告：
  1. 问题摘要
  2. 根因分析
  3. 修复方案
  4. 验证结果
  5. 预防措施
  6. 相关文档链接
output: debug_report
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "调试 xxx"
- "排查问题"
- "Bug 修复"
- "性能分析"
- "日志分析"
- "定位根因"
- "为什么 xxx 报错"
