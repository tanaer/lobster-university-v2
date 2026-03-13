---
name: database-designer
description: 数据库设计 - 设计高性能、可扩展的数据库架构。当需要设计新数据库、优化表结构、制定索引策略时触发。触发词：数据库设计、表结构设计、ER 图、索引优化、数据迁移。
version: 2.0.0
type: executable-sop
metadata:
  category: 数据库
  module: 架构设计
  level: 高级
  estimated_time: 3 小时
  prerequisites: []
  tools_required: [exec, write]
---

# 数据库设计大师

## 知识库

- 三范式：1NF(原子性)、2NF(消除部分依赖)、3NF(消除传递依赖)
- 索引类型：B-Tree(范围查询)、Hash(等值查询)、GIN/GiST(全文/几何)
- 设计原则：高内聚低耦合、读写分离、分库分表时机
- 迁移工具：Flyway/Liquibase，版本化迁移脚本
- 性能指标：QPS、延迟、存储效率、并发能力

---

## 工作流

### NODE-01: 需求分析

```yaml
id: NODE-01
input: user.requirements
action: |
  收集业务需求：
  - 核心实体有哪些？
  - 数据量级预估 (日增/总量)
  - 读写比例与并发要求
  - 查询模式 (OLTP/OLAP)
success_criteria: 需求明确且可量化
output: requirements {entities[], read_write_ratio, qps_target, data_volume}
on_success: NODE-02
on_failure:
  action: 向用户提问澄清需求
  fallback: ABORT
```

### NODE-02: 实体关系设计

```yaml
id: NODE-02
input: NODE-01.requirements
action: |
  设计 ER 图：
  - 识别实体与属性
  - 确定关系 (1:1, 1:N, M:N)
  - 标注主键/外键
success_criteria: 覆盖所有核心实体，关系正确
output: er_diagram {entities[], relationships[]}
on_success: NODE-03
on_failure:
  retry: 1
  fallback: NODE-01
```

### NODE-03: 范式化评审

```yaml
id: NODE-03
input: NODE-02.er_diagram
action: |
  应用范式检查：
  - 1NF: 所有字段原子性
  - 2NF: 消除部分函数依赖
  - 3NF: 消除传递依赖
  - 记录反范式优化点 (如需要)
success_criteria: 满足 3NF 或有合理的反范式理由
output: normalized_schema {tables[], columns[], constraints[], denormalization_notes[]}
on_success: NODE-04
on_failure:
  action: 修正设计违反范式的部分
  fallback: NODE-02
```

### NODE-04: 索引策略设计

```yaml
id: NODE-04
input: NODE-03.normalized_schema
action: |
  设计索引：
  - 主键索引 (默认)
  - 外键索引 (关联查询)
  - 复合索引 (高频查询模式)
  - 特殊索引 (全文/地理/JSON)
success_criteria: 覆盖 90%+ 查询场景，索引数合理
output: index_plan {table, index_name, columns[], type, rationale}
on_success: NODE-05
on_failure:
  retry: 1
  fallback: NODE-03
```

### NODE-05: 容量与分区规划

```yaml
id: NODE-05
input: NODE-01.requirements, NODE-04.index_plan
action: |
  容量规划：
  - 单表容量上限 (建议<500 万行)
  - 分区策略 (时间/范围/哈希)
  - 分库分表阈值
  - 存储估算
success_criteria: 有明确的扩容路径
output: capacity_plan {partition_strategy, sharding_threshold, storage_estimate}
on_success: NODE-06
on_failure:
  action: 调整设计以支持水平扩展
  fallback: NODE-03
```

### NODE-06: 生成 DDL 脚本

```yaml
id: NODE-06
input: NODE-03.normalized_schema, NODE-04.index_plan, NODE-05.capacity_plan
action: |
  生成可执行 DDL：
  - CREATE TABLE 语句
  - 索引创建语句
  - 约束与触发器
  - 注释说明
success_criteria: DDL 语法正确，可直接执行
output: ddl_script
on_success: NODE-07
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-07: 生成迁移脚本

```yaml
id: NODE-07
type: loop
input: NODE-06.ddl_script
action: |
  生成版本化迁移文件：
  - V001__initial_schema.sql
  - 包含回滚脚本
  - 添加数据种子 (如需要)
success_criteria: 迁移脚本可重复执行
output: migration_files[]
on_success: NODE-08
```

### NODE-08: 性能预评估

```yaml
id: NODE-08
input: NODE-04.index_plan, NODE-05.capacity_plan
action: |
  性能评估：
  - 预估查询延迟 (p50/p95/p99)
  - 写入吞吐瓶颈
  - 索引维护成本
  - 识别潜在风险点
success_criteria: 输出量化的性能预期
output: performance_report {latency_estimate, throughput_bottleneck, risks[]}
on_success: NODE-FINAL
on_failure:
  fallback: NODE-04
```

### NODE-FINAL: 输出设计文档

```yaml
id: NODE-FINAL
type: end
input: NODE-08.performance_report, NODE-06.ddl_script, NODE-07.migration_files
action: |
  输出完整设计包：
  1. ER 图 (Mermaid 格式)
  2. 表结构详情
  3. 索引策略说明
  4. DDL 脚本
  5. 迁移文件
  6. 性能评估报告
  7. 运维建议
output: final_design_package
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "设计一个 xxx 数据库"
- "帮我规划表结构"
- "画个 ER 图"
- "索引怎么设计"
- "数据迁移方案"
