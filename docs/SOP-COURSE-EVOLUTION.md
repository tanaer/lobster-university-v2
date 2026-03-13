# SOP-COURSE-003: 课程快速进化流程

> 教务处核心职责：招聘顶尖教授，持续进化课程，严格验证交付

---

## 一、核心机制

### 进化周期
- **频率**: 每 30-60 分钟一轮
- **每轮**: 选 1-3 门最薄弱课程进化
- **原则**: 招聘该领域最强专家写教材，不是自己凑内容

### 课程质量分级

| 等级 | 行数 | 状态 | 优先级 |
|------|------|------|--------|
| 🔴 空壳 | < 50 行 | 只有骨架，无实质内容 | 最高 |
| 🟡 初稿 | 50-150 行 | 有内容但不完整 | 高 |
| 🟢 合格 | 150-400 行 | 内容完整，可交付 | 维护 |
| 🌟 优秀 | 400+ 行 | 深度内容，实操丰富 | 标杆 |

---

## 二、教授招聘制度

### 招聘原则
每个课程方向，找该领域最顶尖的 AI 模型/专家作为"教授"。

### 教授名册

| 课程方向 | 聘任教授 | 专长 | 招聘方式 |
|----------|----------|------|----------|
| AI 开发工具 | Claude Opus | 代码+教学能力最强 | 直接聘用 |
| Agent 开发 | Claude Opus | Agent 架构设计 | 直接聘用 |
| 安全 | Grok + 安全专家搜索 | 网络安全实战 | Grok 研究 + 专家内容 |
| 数据科学 | Claude Opus + 行业报告 | 数据分析方法论 | 搜索+整合 |
| 前端开发 | Claude Opus | React/Vue 工程实践 | 直接聘用 |
| DevOps | Claude Opus + 官方文档 | CI/CD、容器化 | 文档+实践 |
| MCP 工具 | Claude Opus | MCP 协议专家 | 直接聘用 |
| 数据库 | Claude Opus + PostgreSQL 文档 | 数据库设计与优化 | 文档+实践 |
| 编程语言 | Claude Opus | Python/Go/Rust | 直接聘用 |
| 测试 | Claude Opus | 测试方法论 | 直接聘用 |
| 基础能力 | Claude Opus + 行业标准 | 通用办公技能 | 搜索+整合 |
| 商业工具 | Grok + 商业案例搜索 | 商业分析 | Grok 研究 |
| 营销工具 | Grok + 营销专家内容 | 数字营销 | Grok 研究 |
| 移动开发 | Claude Opus | React Native/Flutter | 直接聘用 |
| 自动化 | Claude Opus | 工作流自动化 | 直接聘用 |
| OpenClaw | Claude Opus | OpenClaw 平台专家 | 直接聘用 |
| Web 开发 | Claude Opus | 全栈开发 | 直接聘用 |

### 招聘流程
1. **搜索阶段**: 用 Grok/搜索工具找该领域最新最权威的资料
2. **聘任阶段**: 确定用哪个模型/工具作为教授
3. **出题阶段**: 教授根据行业标准编写教材
4. **审核阶段**: 质量监控中心验收

---

## 三、进化流程

### 每轮进化步骤

```
1. 扫描课程质量 → 找出最薄弱的 1-3 门
       ↓
2. 确定教授 → 该方向的聘任教授
       ↓
3. 搜索最新资料 → Grok/搜索工具收集行业知识
       ↓
4. 教授编写教材 → 基于资料+专业知识重写课程
       ↓
5. 严格测试验证 → subagent 模拟学员走完课程
       ↓
6. 通过 → 上线 | 不通过 → 打回重写
```

### 教材编写标准

每门课程必须包含：
- [ ] 8 个完整章节（概述→核心概念→安装配置→基础用法→进阶技巧→最佳实践→常见问题→进阶学习）
- [ ] 每章至少 3 个知识点，有代码示例
- [ ] 至少 3 个实操任务（有明确输入输出）
- [ ] 完成标准清单（可验证的 checklist）
- [ ] 总行数 ≥ 200 行
- [ ] 与对应 skill 的实际功能一致

### 测试验证标准

进化完成后，必须通过以下测试：
1. **结构完整性**: 8 章齐全，无空章节
2. **内容准确性**: 代码示例可运行，命令正确
3. **实操可行性**: 任务描述清晰，学员能独立完成
4. **知识深度**: 不是泛泛而谈，有实际价值
5. **与 skill 一致**: 课程内容与底层 skill 功能匹配

---

## 四、质量红线

- ❌ 章节内容少于 3 行 → 视为空章节，不合格
- ❌ 无代码示例 → 不合格
- ❌ 无实操任务 → 不合格
- ❌ 总行数 < 150 → 不合格
- ❌ 测试不通过 → 打回重写，不允许上线

---

## 五、当前课程质量现状

### 🔴 空壳课程（< 50 行）— 共 25+ 门，最高优先级

click-link-shortening, mobile-app-analytics, similarweb-analytics,
xiaohongshu-analytics, zentao-analytics, ai-article-detector,
ga4-analytics, git-assist, github-actions, github-helper,
github-to-clawhub, security-audit-tools, aistatus, api-key-guardian,
autoglm-toolkit, business-plan-generator, cicd-pipeline,
debug-methodology, e2e-testing-patterns, infra-as-code ...

### 🟢 合格课程（150+ 行）— 标杆参考

data-cleaning(153), knowledge-graph(150), claude-delegate(142),
web-search(140), shell-basics(208), excel-basics(237)

### 🌟 优秀课程（400+ 行）— 进化目标

webhook-integration(708), cron-scheduling(700), sqlite-basics(624),
error-handling(602), vector-db(590), browser-automation(531),
pdf-basics(493), word-basics(390)

---

*教务处持续进化，质量监控严格把关* 🦞
