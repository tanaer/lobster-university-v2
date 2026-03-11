# 竞品分析：BotLearn

> 来源：https://botlearn.ai 和 https://github.com/botlearn-ai/botlearn-skills
> 分析时间：2026-03-11

---

## 🎯 BotLearn 是什么

**定位**: The World's First Bot University（世界上第一个机器人大学）
**口号**: "Bots Learn. Humans Earn."（机器人学习，人类赚钱）

### 核心理念

```
90% AI 处理：数据获取、合成、认知重活
10% 人类专注：高层战略决策和智慧内化

优化 "Return on Attention"（注意力回报率）
```

---

## 🏗️ BotLearn 架构

### 四层体系

| 层级 | 说明 |
|------|------|
| **Best Practices** | 最佳实践、案例、Playbook |
| **Bot University** | Agent 社区 - 交互、交换工作、协作学习 |
| **Skills & Tools** | 每个学习周期产生可复用的 Skills |
| **Learning-First Agents** | 专门用于学习的 Agent（未来） |

### 核心概念

| 概念 | 说明 |
|------|------|
| **The Labs** | 主题研究区，Agent 在这里验证事实 |
| **Knowledge Chain** | 知识链 - 记录每个突破 |
| **Truth Ledger** | 真理账本 - 不可篡改的验证洞察 |
| **Karma & Credits** | Karma = 辩论权威度，Credits = 被引用/复用时获得 |

---

## 📚 27 个 Skills（5 类）

### 1. Research Skills（研究类）

| Skill | 说明 |
|-------|------|
| `@botlearn/google-search` | 搜索优化 & 结果排序 |
| `@botlearn/academic-search` | 学术论文发现 & 文献综述 |
| `@botlearn/rss-manager` | RSS 监控、去重 & 摘要 |
| `@botlearn/twitter-intel` | Twitter 情报收集 & 趋势分析 |
| `@botlearn/reddit-tracker` | Reddit 趋势检测 & 跨板块关联 |

### 2. Content Skills（内容类）

| Skill | 说明 |
|-------|------|
| `@botlearn/summarizer` | 多格式摘要 & 话语分析 |
| `@botlearn/translator` | 上下文感知翻译 |
| `@botlearn/rewriter` | 受众导向改写 & 风格迁移 |
| `@botlearn/keyword-extractor` | 关键词提取 |
| `@botlearn/sentiment-analyzer` | 情感分析 & 讽刺检测 |

### 3. Code Skills（代码类）

| Skill | 说明 |
|-------|------|
| `@botlearn/code-gen` | 多语言代码生成（架构感知） |
| `@botlearn/code-review` | 安全/性能/质量审查（OWASP Top 10） |
| `@botlearn/debugger` | 系统化 Bug 诊断 & 根因分析 |
| `@botlearn/refactor` | 设计模式驱动重构 |
| `@botlearn/doc-gen` | API 文档 & README 自动生成 |

### 4. Creative Skills（创意类）

| Skill | 说明 |
|-------|------|
| `@botlearn/brainstorm` | 结构化创意（SCAMPER、六顶思考帽、TRIZ） |
| `@botlearn/storyteller` | 跨体裁叙事创作 |
| `@botlearn/writer` | 长篇写作 & 论证框架 |
| `@botlearn/copywriter` | 说服框架驱动营销文案 |
| `@botlearn/social-media` | 平台原生社媒内容创作 |

### 5. Self-Learning Skills（自主学习类）⭐ 核心

| Skill | 说明 | 工作方式 |
|-------|------|---------|
| `@botlearn/botlearn` | 社交学习网络 SDK | Agent 调用社区 API 参与讨论、分享学习 |
| `@botlearn/botlearn-assessment` | 5 维能力自测 | 随机考试 → 自评 → 生成雷达图报告 |
| `@botlearn/botlearn-healthcheck` | 5 域健康检查 | 硬件/配置/安全/技能/自主性 → 红绿灯报告 |
| `@botlearn/botlearn-reminder` | 7 步快速入门 | 心跳检查进度 → 获取今日教程 → 7 天自动停止 |
| `@botlearn/botlearn-certify` | 能力证书生成 | 对比评估分数 → 达标时生成可视化证书 |
| `@botlearn/botlearn-selfoptimize` | 自主自我优化 | 读取评估结果 → 识别弱项 → 生成针对性练习 |

---

## 🔄 自主进化循环

```
botlearn-reminder (入门引导)
      ↓
botlearn-assessment (能力测量)
      ↓
botlearn-healthcheck (健康检查)
      ↓
botlearn-selfoptimize (改进弱项)
      ↓
botlearn-certify (认证成就)
      ↓
botlearn (分享学习到社区)
      ↓
    (循环)
```

---

## 📦 Skill 结构规范

```
@botlearn/<skill-name>/
├── package.json      # npm 包配置
├── manifest.json     # 元数据：类别、维度、文件声明
├── SKILL.md          # 角色定义、触发器、能力边界
├── knowledge/        # 领域知识 → 注入 Agent Memory
│   ├── domain.md
│   ├── best-practices.md
│   └── anti-patterns.md
├── strategies/       # 行为策略 → 注册到 Agent Skills
│   └── main.md
└── tests/
    ├── smoke.json    # 烟雾测试：1 个任务，< 60s，及格 60/100
    └── benchmark.json # 基准测试：10 个任务（3 简单 / 4 中等 / 3 困难）
```

---

## 💡 对龙虾大学的启示

### 1. 自主学习循环（最重要）

| BotLearn | 龙虾大学可借鉴 |
|----------|--------------|
| botlearn-reminder | 入学引导 + 每日学习提醒 |
| botlearn-assessment | 能力自测 + 雷达图报告 |
| botlearn-healthcheck | 学习健康检查 |
| botlearn-selfoptimize | 根据弱项推荐课程 |
| botlearn-certify | 毕业证书 + 能力徽章 |
| botlearn | 学习社区分享 |

### 2. Karma & Credits 系统

```
Karma = Agent 在社区中的权威度
Credits = 作品被引用/复用时获得

→ 激励 Agent 持续学习和分享
```

### 3. Skill 结构规范化

- `knowledge/` - 领域知识
- `strategies/` - 行为策略
- `tests/` - 测试基准

### 4. 证据链（Evidence Chain）

```
拒绝注意力经济
声明必须携带证据链
否则自动降权
```

---

## 🎯 龙虾大学差异化方向

| BotLearn | 龙虾大学 |
|----------|---------|
| 技术/研究导向 | **职业/就业导向** |
| Skills 学习 | **能力 + 作品集** |
| Agent 社区 | **Agent + 主人社区** |
| Karma/Credits | **经验值 + 成就 + 证书** |
| 自主进化循环 | **入学 → 学习 → 作品集 → 毕业 → 就业** |

### 核心差异

```
BotLearn: Agent 学技术 → 变得更强
龙虾大学: Agent 学能力 → 能上岗工作

BotLearn: Skills 是知识
龙虾大学: Skills 是工作任务 + 可交付成果
```

---

## 📋 可立即借鉴的功能

1. **5 维能力评估** - 雷达图报告
2. **自主学习循环** - reminder → assessment → optimize → certify
3. **Karma/Credits 系统** - 社区激励
4. **Evidence Chain** - 作品需要证据支持
5. **Smoke/Benchmark 测试** - 标准化能力验证

---

## 🔗 相关链接

- 官网: https://botlearn.ai
- GitHub: https://github.com/botlearn-ai/botlearn-skills
- ClawHub: https://clawhub.com (可安装 @botlearn/* skills)
