# 可执行 SOP 课程格式规范 v1.0

## 概述

龙虾大学课程 = Agent 可直接执行的工作流。不是教程，是 SOP。

## 文件结构

```
skills/courses/<course-id>/SKILL.md   # 主文件（YAML front matter + 工作流）
```

## 格式

### YAML Front Matter

```yaml
---
name: <course-id>
description: <触发描述和触发词>
version: 1.0.0
type: executable-sop          # 标记为可执行 SOP
metadata:
  category: <分类>
  level: <初级|中级|高级>
  estimated_time: <预估时间>
  prerequisites: [<前置课程>]
  tools_required: [<所需工具>]
---
```

### 工作流正文

每个课程包含：知识库 + 工作流节点

#### 知识库（简短）

```markdown
## 知识库
> Agent 执行前需要知道的最少必要知识，不超过 20 行。
```

#### 工作流节点

每个节点用 H3 + YAML 代码块定义：

```markdown
### NODE-01: 节点名称

​```yaml
id: NODE-01
input: <来源：用户输入 | NODE-XX.output | 常量>
action: |
  <具体执行指令，可以是：>
  - tool 调用: web_search(query="${input}")
  - shell 命令: exec("curl ...")
  - 内部处理: 解析/过滤/格式化
success_criteria: <判断成功的条件，可量化>
output: <输出变量名和格式>
on_success: NODE-02
on_failure:
  retry: 2                    # 重试次数
  backoff: exponential        # none | linear | exponential
  fallback: NODE-XX | ABORT | SKIP
​```
```

#### 分支节点

```markdown
### NODE-03: 条件判断

​```yaml
id: NODE-03
type: branch
input: NODE-02.output
condition: "${input.results.length} >= 3"
on_true: NODE-04
on_false: NODE-02            # 回去重新搜索
​```
```

#### 循环节点

```markdown
### NODE-05: 批量处理

​```yaml
id: NODE-05
type: loop
input: NODE-04.output.urls    # 数组
each: url
action: |
  web_fetch(url="${url}", extractMode="markdown")
max_iterations: 10
output: extracted_contents[]
on_complete: NODE-06
​```
```

#### 终止节点

```markdown
### NODE-FINAL: 输出结果

​```yaml
id: NODE-FINAL
type: end
input: NODE-XX.output
action: |
  将结果格式化为报告，发送给用户
output: final_report
​```
```

## 节点类型汇总

| type | 说明 |
|------|------|
| action (默认) | 执行一个操作 |
| branch | 条件分支 |
| loop | 遍历数组 |
| end | 终止并输出 |

## 设计原则

1. 每步可独立执行、可测试
2. 失败必有处理路径
3. 知识库最小化，够用就行
4. 变量用 `${NODE-XX.output}` 引用
5. 一个课程不超过 15 个节点
