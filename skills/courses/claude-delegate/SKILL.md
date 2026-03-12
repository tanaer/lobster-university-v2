# Claude Code 任务委托

> 学会使用 claude-delegate 技能，高效委托编程任务

## 课程信息

| 项目 | 内容 |
|------|------|
| 课程 ID | claude-delegate |
| 难度 | 中级 |
| 时长 | 2 小时 |
| 分类 | AI 开发工具 |
| 前置课程 | 无 |

---

## 第一章：课程概述

### 学习目标
- 理解 Claude Code 委托机制
- 掌握非交互式执行方法
- 学会常见任务委托模式

### 为什么学习这门课？
Claude Code 是强大的编程助手，但每次手动输入命令很繁琐。claude-delegate 技能封装了最佳实践，让你一句话就能委托任务。

---

## 第二章：核心概念

### 2.1 什么是任务委托？
任务委托是将编程工作交给 Claude Code 自动完成的过程。

### 2.2 非交互式执行
使用 `--print --permission-mode bypassPermissions` 参数，Claude Code 可以无需确认自动执行。

### 2.3 工作目录
所有任务在指定的工作目录中执行，确保操作安全。

---

## 第三章：基础用法

### 3.1 基本命令结构
```bash
bash workdir:/path/to/project command:"claude --permission-mode bypassPermissions --print 'your task'"
```

### 3.2 功能开发
```bash
bash workdir:~/my-app command:"claude --permission-mode bypassPermissions --print 'build user auth module'"
```

### 3.3 代码重构
```bash
bash workdir:~/my-lib command:"claude --permission-mode bypassPermissions --print 'refactor data processing for performance'"
```

---

## 第四章：进阶用法

### 4.1 PR 审查
```bash
bash workdir:/tmp/pr-review command:"claude --permission-mode bypassPermissions --print 'review PR #123'"
```

### 4.2 Bug 修复
```bash
bash workdir:~/buggy-app command:"claude --permission-mode bypassPermissions --print 'fix the null pointer bug in user service'"
```

### 4.3 代码探索
```bash
bash workdir:~/new-project command:"claude --permission-mode bypassPermissions --print 'explore the codebase structure'"
```

---

## 第五章：实践案例

### 案例 1：构建 REST API
委托 Claude Code 构建完整的 REST API 模块。

### 案例 2：添加测试覆盖
委托 Claude Code 为现有代码添加单元测试。

### 案例 3：性能优化
委托 Claude Code 优化慢查询代码。

---

## 第六章：最佳实践

### ✅ 推荐做法
- 明确描述任务目标
- 指定正确的工作目录
- 一次委托一个明确任务

### ❌ 避免做法
- 模糊的任务描述
- 在错误的目录执行
- 一次委托多个不相关任务

---

## 第七章：常见问题

### Q1: 权限被拒绝怎么办？
确保工作目录存在且有读写权限。

### Q2: 任务执行时间过长？
可以拆分为多个小任务分别委托。

### Q3: 如何查看执行结果？
Claude Code 会输出执行过程和结果。

---

## 第八章：进阶学习

### 推荐课程
- Claude Code 入门
- Claude Code 进阶
- 多 Agent 协作

### 实践项目
- 自动化 CI/CD 流程
- 代码质量门禁
- 自动化代码审查

---

## 完成标准

- [ ] 理解委托机制
- [ ] 成功委托 3 个不同类型任务
- [ ] 掌握最佳实践

---

*龙虾大学 · AI 开发工具课程*
