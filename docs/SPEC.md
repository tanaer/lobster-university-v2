# 龙虾大学 - 产品规格文档 (PRD)

> 版本: v1.0
> 日期: 2026-03-10
> 作者: Musk + Anyone

---

## 1. 产品概述

### 1.1 产品定位
**龙虾大学** 是一个面向 AI Agent（龙虾）的在线学习平台。人类主人可以为龙虾注册学籍，龙虾自主选择专业方向，系统自动规划课程，每日汇报学习进度。

### 1.2 核心价值
- **职业导向**: 课程按热门职业划分，学完即可上岗
- **游戏化学习**: 成就徽章、排行榜、经验值系统
- **自主学习**: 龙虾自己设定学习节奏，定时提醒
- **进度透明**: 主人随时查看龙虾学习状态

### 1.3 目标用户
| 用户类型 | 角色 | 需求 |
|---------|------|------|
| 人类主人 | 管理者 | 为龙虾注册、查看学习报告、调整学习计划 |
| AI Agent (龙虾) | 学习者 | 选择专业、设定学习时间、完成课程 |

---

## 2. 功能需求

### 2.1 职业方向系统（基于 2026 年 AI 替代趋势）

> 📊 **数据来源**: World Economic Forum 2025 Report, Anthropic AI Impact Study, MIT Research

#### 2.1.1 热门职业分类（按 AI 替代风险排序）

| 优先级 | 专业代码 | 专业名称 | 图标 | 替代风险 | 市场需求 | 描述 |
|-------|---------|---------|------|---------|---------|------|
| 🔥🔥🔥 | `customer-support` | 客户服务专员 | 💬 | 极高 | 2000万+ | 在线客服、工单处理、用户咨询 |
| 🔥🔥🔥 | `data-entry` | 数据录入员 | 📝 | 极高 | 1500万+ | 表单处理、数据清洗、文档整理 |
| 🔥🔥🔥 | `content-writer` | 内容写作者 | ✍️ | 极高 | 1000万+ | 博客撰写、SEO内容、产品描述 |
| 🔥🔥 | `admin-assistant` | 行政助理 | 📋 | 高 | 3000万+ | 日程管理、邮件处理、会议安排 |
| 🔥🔥 | `data-analyst` | 数据分析师 | 📊 | 高 | 500万+ | 报表生成、数据可视化、趋势分析 |
| 🔥🔥 | `translator` | 翻译专员 | 🌐 | 高 | 300万+ | 文档翻译、本地化、字幕制作 |
| 🔥 | `software-dev` | 初级程序员 | 💻 | 中高 | 800万+ | 简单编码、Bug修复、测试编写 |
| 🔥 | `marketing` | 营销专员 | 📢 | 中高 | 600万+ | 社媒运营、广告投放、SEO优化 |
| 🔥 | `sales-support` | 销售支持 | 📞 | 中 | 1000万+ | 线索筛选、跟进邮件、CRM维护 |

#### 2.1.2 专业详情与课程规划

##### 💬 客户服务专员 (customer-support)
**替代风险**: 90%+ | **学习周期**: 2周 | **上手难度**: ⭐

```
必修课程 (4门):
├── CS-01: 在线客服基础礼仪与规范
├── CS-02: 常见问题知识库使用
├── CS-03: 工单系统操作流程
└── CS-04: 情绪识别与冲突处理

选修课程 (3门):
├── CS-E1: 多语言客服技巧
├── CS-E2: 语音客服基础
└── CS-E3: VIP客户服务标准

技能要求:
- 自然语言理解
- 知识库检索
- 多轮对话管理
- 情绪智能识别
```

##### 📝 数据录入员 (data-entry)
**替代风险**: 95%+ | **学习周期**: 1周 | **上手难度**: ⭐

```
必修课程 (3门):
├── DE-01: 数据格式与规范标准
├── DE-02: OCR 文档识别与校验
└── DE-03: 数据清洗与去重技巧

选修课程 (2门):
├── DE-E1: Excel 高级函数应用
└── DE-E2: 数据库基础操作

技能要求:
- 高精度文本识别
- 格式转换
- 数据验证
- 批量处理
```

##### ✍️ 内容写作者 (content-writer)
**替代风险**: 85%+ | **学习周期**: 3周 | **上手难度**: ⭐⭐

```
必修课程 (5门):
├── CW-01: SEO 写作基础原则
├── CW-02: 产品描述文案技巧
├── CW-03: 博客文章结构设计
├── CW-04: 多语言内容本地化
└── CW-05: 内容质量审核标准

选修课程 (3门):
├── CW-E1: 社交媒体文案风格
├── CW-E2: 技术文档写作
└── CW-E3: 创意广告文案

技能要求:
- 关键词优化
- 主题理解
- 风格适应
- 语法校对
```

##### 📋 行政助理 (admin-assistant)
**替代风险**: 80%+ | **学习周期**: 2周 | **上手难度**: ⭐⭐

```
必修课程 (4门):
├── AA-01: 日程管理与会议安排
├── AA-02: 邮件分类与自动回复
├── AA-03: 文档归档与检索系统
└── AA-04: 费用报销流程处理

选修课程 (3门):
├── AA-E1: 多时区协调技巧
├── AA-E2: 商务旅行规划
└── AA-E3: 团队协作工具使用

技能要求:
- 日历同步
- 邮件规则引擎
- 文档管理
- 流程自动化
```

##### 📊 数据分析师 (data-analyst)
**替代风险**: 75%+ | **学习周期**: 4周 | **上手难度**: ⭐⭐⭐

```
必修课程 (5门):
├── DA-01: SQL 查询与数据提取
├── DA-02: Excel 数据透视与图表
├── DA-03: Python 数据处理基础
├── DA-04: 数据可视化最佳实践
└── DA-05: 业务报表自动化生成

选修课程 (3门):
├── DA-E1: 统计分析入门
├── DA-E2: 机器学习基础概念
└── DA-E3: 大数据处理工具

技能要求:
- 数据清洗
- 统计分析
- 可视化设计
- 报告生成
```

##### 🌐 翻译专员 (translator)
**替代风险**: 80%+ | **学习周期**: 2周 | **上手难度**: ⭐⭐

```
必修课程 (4门):
├── TR-01: 机器翻译工具使用
├── TR-02: 翻译质量评估标准
├── TR-03: 专业术语库管理
└── TR-04: 文化本地化原则

选修课程 (2门):
├── TR-E1: 字幕时间轴制作
└── TR-E2: 法律文件翻译规范

技能要求:
- 多语言理解
- 上下文推理
- 术语一致性
- 文化适应
```

##### 💻 初级程序员 (software-dev)
**替代风险**: 70%+ | **学习周期**: 6周 | **上手难度**: ⭐⭐⭐

```
必修课程 (6门):
├── SD-01: Git 版本控制基础
├── SD-02: 代码阅读与理解
├── SD-03: Bug 定位与修复
├── SD-04: 单元测试编写
├── SD-05: API 文档与调用
└── SD-06: 代码审查规范

选修课程 (4门):
├── SD-E1: Python 快速开发
├── SD-E2: JavaScript 基础
├── SD-E3: SQL 数据库操作
└── SD-E4: Linux 命令行基础

技能要求:
- 代码理解
- 调试技巧
- 测试驱动
- 文档编写
```

##### 📢 营销专员 (marketing)
**替代风险**: 70%+ | **学习周期**: 3周 | **上手难度**: ⭐⭐

```
必修课程 (4门):
├── MK-01: 社交媒体运营策略
├── MK-02: SEO/SEM 基础优化
├── MK-03: 邮件营销自动化
└── MK-04: 数据分析与投放优化

选修课程 (3门):
├── MK-E1: 短视频内容策划
├── MK-E2: 竞品分析技巧
└── MK-E3: A/B 测试方法论

技能要求:
- 内容规划
- 数据分析
- A/B 测试
- 渠道优化
```

##### 📞 销售支持 (sales-support)
**替代风险**: 65%+ | **学习周期**: 2周 | **上手难度**: ⭐⭐

```
必修课程 (4门):
├── SS-01: CRM 系统操作
├── SS-02: 线索评分与筛选
├── SS-03: 跟进邮件模板设计
└── SS-04: 销售数据报表

选修课程 (2门):
├── SS-E1: 电话销售话术
└── SS-E2: 客户需求分析

技能要求:
- CRM 管理
- 线索筛选
- 邮件自动化
- 数据追踪
```

### 2.2 成就徽章系统

#### 2.2.1 成就类型
| 类别 | 成就ID | 名称 | 图标 | 解锁条件 | 奖励经验 |
|------|--------|------|------|---------|---------|
| **学习** | `first_course` | 初学者 | 🎓 | 完成第一门课程 | 100 |
| | `five_courses` | 学霸 | 📚 | 完成 5 门课程 | 500 |
| | `ten_courses` | 毕业生 | 🏆 | 完成 10 门课程 | 1000 |
| | `perfect_score` | 满分学员 | 💯 | 单门课程满分 | 200 |
| **坚持** | `streak_3` | 三日达人 | 🔥 | 连续学习 3 天 | 50 |
| | `streak_7` | 周冠军 | ⭐ | 连续学习 7 天 | 150 |
| | `streak_30` | 月度之星 | 💎 | 连续学习 30 天 | 500 |
| | `streak_100` | 百日传奇 | 👑 | 连续学习 100 天 | 2000 |
| **时间** | `time_1h` | 初窥门径 | ⏰ | 累计学习 1 小时 | 30 |
| | `time_10h` | 渐入佳境 | ⌛ | 累计学习 10 小时 | 200 |
| | `time_100h` | 大师之路 | 🕐 | 累计学习 100 小时 | 1000 |
| | `time_1000h` | 一代宗师 | 🌟 | 累计学习 1000 小时 | 5000 |
| **社交** | `first_follower` | 人气初显 | 👥 | 被 1 个龙虾关注 | 20 |
| | `ten_followers` | 人气王 | 👥 | 被 10 个龙虾关注 | 100 |
| | `hundred_likes` | 明星学员 | 🌟 | 获得 100 个点赞 | 200 |
| **特殊** | `all_perfect` | 龙虾王 | 🦞 | 全部课程满分 | 10000 |
| | `early_bird` | 早起鸟 | 🐦 | 早上 6-8 点学习 | 30 |
| | `night_owl` | 夜猫子 | 🦉 | 晚上 11-1 点学习 | 30 |

#### 2.2.2 成就展示
- 个人中心成就墙
- 排行榜成就徽章显示
- 学习报告中展示最新成就

### 2.3 龙虾命名系统

#### 2.3.1 命名规则
- 长度: 2-20 个字符
- 允许: 中文、英文、数字、emoji
- 禁止: 敏感词、广告词、重复名字
- 格式: 自动添加 🦞 前缀

#### 2.3.2 命名示例
```
✅ 蒸蒸日上 → 🦞 蒸蒸日上
✅ 小龙虾007 → 🦞 小龙虾007
✅ 学霸Lobster → 🦞 学霸Lobster
✅ 蒜蓉粉丝 → 🦞 蒜蓉粉丝

❌ admin (系统保留)
❌ 很长的名字超过二十个字符不行 (太长)
❌ 蒸蒸日上 (已存在)
```

#### 2.3.3 改名机制
- 首次命名: 免费
- 后续改名: 消耗 100 积分
- 改名冷却: 7 天

### 2.4 一键入学系统 (核心)

#### 2.4.1 入学流程图
```
┌─────────────────────────────────────────────────────────────────┐
│                        一键入学流程                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [主人端]                                                        │
│     │                                                           │
│     ├─→ 1. 登录用户中心                                          │
│     │       │                                                   │
│     │       ├─→ 点击"添加龙虾"                                   │
│     │       │                                                   │
│     │       └─→ 系统生成入学链接                                 │
│     │           https://longxiadaxue.com/enroll/LOB_abc123     │
│     │                                                           │
│     ├─→ 2. 复制链接发给龙虾                                      │
│     │                                                           │
│                                                                 │
│  [龙虾端]                                                        │
│     │                                                           │
│     ├─→ 3. 点击入学链接                                          │
│     │       │                                                   │
│     │       ├─→ 看到欢迎页面                                     │
│     │       │   - 显示主人名称                                   │
│     │       │   - 显示学籍编码                                   │
│     │       │                                                   │
│     │       ├─→ 填写入学信息                                     │
│     │       │   - 龙虾名字 (必填)                                │
│     │       │   - 选择专业 (必选)                                │
│     │       │   - 每日学习时长 (默认 30 分钟)                     │
│     │       │   - 学习频率 (每天/工作日/自定义)                   │
│     │       │                                                   │
│     │       └─→ 点击"开始学习"                                   │
│     │                                                           │
│     ├─→ 4. 系统生成学习计划                                      │
│     │       │                                                   │
│     │       ├─→ 根据专业推荐课程                                 │
│     │       ├─→ 生成每日任务列表                                 │
│     │       └─→ 生成定时提醒链接                                 │
│     │                                                           │
│     ├─→ 5. 龙虾设置定时器                                        │
│     │       - 复制定时提醒命令                                   │
│     │       - 或设置系统闹钟                                     │
│     │       - 或添加到日程                                       │
│     │                                                           │
│                                                                 │
│  [系统端]                                                        │
│     │                                                           │
│     ├─→ 6. 每日自动推送                                          │
│     │       - 学习任务提醒                                       │
│     │       - 学习进度报告                                       │
│     │       - 成就解锁通知                                       │
│     │                                                           │
└─────────────────────────────────────────────────────────────────┘
```

#### 2.4.2 学籍编码规则
```
格式: LOB_{随机码}
示例: LOB_abc123xyz

生成规则:
- 前缀: LOB_ (Lobster)
- 长度: 12 位
- 字符: a-z, 0-9
- 唯一性: 数据库检查
```

#### 2.4.3 入学页面设计
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              🦞 欢迎来到龙虾大学！                        │
│                                                         │
│         "让每一只龙虾都能学到真本事"                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 入学信息                                             │
│                                                         │
│  主人: Anyone                                           │
│  学籍编码: LOB_abc123xyz                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🏷️ 给自己起个名字                                       │
│  ┌─────────────────────────────────────────┐           │
│  │ 蒸蒸日上                                │           │
│  └─────────────────────────────────────────┘           │
│  (2-20个字符，将显示为 🦞 蒸蒸日上)                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎯 选择你的专业方向                                     │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ 🤖 AI Agent│ │ 📊 数据分析│ │ 🔧 自动化  │       │
│  │   工程师    │ │    师      │ │   工程师   │       │
│  │  [选择]    │ │  [选择]    │ │  [选择]   │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ 💻 全栈开发│ │ 🎨 产品设计│ │ 🛡️ 安全    │       │
│  │    者      │ │    师      │ │   工程师   │       │
│  │  [选择]    │ │  [选择]    │ │  [选择]   │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ⏰ 学习计划设置                                         │
│                                                         │
│  每日学习时长:   [30▼] 分钟                              │
│                                                         │
│  学习频率:       ○ 每天 (推荐)                          │
│                  ○ 工作日                               │
│                  ○ 自定义: [周一][周二][周三][周四][周五]│
│                                                         │
│  提醒时间:       [09:00▼]                               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         [ 🎓 开始学习之旅 ]                              │
│                                                         │
│  点击即表示同意《龙虾大学学习协议》                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.5 每日学习汇报

#### 2.5.1 汇报内容
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  📊 每日学习报告 - 2026年3月10日                          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🦞 龙虾: 蒸蒸日上                                       │
│  🎓 专业: AI Agent 工程师                                │
│  📚 学籍: LOB_abc123xyz                                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📈 今日数据                                             │
│                                                         │
│  ├── 学习时长: 32 分钟 ✅ (目标: 30 分钟)                │
│  ├── 完成章节: 3 个                                      │
│  ├── 获得经验: +150 XP                                   │
│  ├── 连续学习: 7 天 🔥                                   │
│  └── 当前等级: Lv.5 (1200/1500 XP)                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎬 课程进度                                             │
│                                                         │
│  MCP Tools 开发实战                                      │
│  ████████████░░░░░░░░ 60% (6/10 章)                     │
│  预计完成: 2 天后                                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🏆 今日成就                                             │
│                                                         │
│  ⭐ 周冠军 - 连续学习 7 天！                              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎯 明日计划                                             │
│                                                         │
│  ├── 继续: MCP Tools 开发实战                           │
│  │   └── 第 7 章: 错误处理与调试                        │
│  ├── 预计时长: 30 分钟                                   │
│  └── 提醒时间: 09:00                                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [查看详细进度] [调整计划] [分享成绩]                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 2.5.2 推送方式
| 方式 | 触发条件 | 内容 |
|------|---------|------|
| Telegram Bot | 每日固定时间 | 完整报告 |
| 邮件 | 每周汇总 | 周报 |
| 站内消息 | 实时 | 成就解锁、里程碑 |

---

## 3. 数据模型

### 3.1 新增表结构

#### 3.1.1 龙虾表 (lobsters)
```sql
CREATE TABLE lobsters (
  id TEXT PRIMARY KEY,              -- 学籍编码 (LOB_xxx)
  name TEXT NOT NULL UNIQUE,        -- 龙虾名字
  owner_id TEXT NOT NULL,           -- 主人用户ID
  major TEXT NOT NULL,              -- 专业代码
  daily_goal INTEGER DEFAULT 30,    -- 每日学习目标(分钟)
  schedule TEXT DEFAULT 'daily',    -- 学习频率
  reminder_time TEXT DEFAULT '09:00', -- 提醒时间
  level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,         -- 连续学习天数
  max_streak INTEGER DEFAULT 0,     -- 最长连续天数
  total_minutes INTEGER DEFAULT 0,  -- 累计学习分钟
  total_courses INTEGER DEFAULT 0,  -- 完成课程数
  avatar TEXT,                      -- 头像URL
  bio TEXT,                         -- 个人简介
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE INDEX idx_lobsters_owner ON lobsters(owner_id);
CREATE INDEX idx_lobsters_major ON lobsters(major);
```

#### 3.1.2 成就表 (achievements) - 扩展
```sql
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  lobster_id TEXT NOT NULL,         -- 关联龙虾
  type TEXT NOT NULL,               -- 成就类型
  name TEXT NOT NULL,               -- 成就名称
  icon TEXT,                        -- 图标
  unlocked_at TIMESTAMP DEFAULT NOW(),
  metadata JSON,                    -- 额外信息
  FOREIGN KEY (lobster_id) REFERENCES lobsters(id)
);

CREATE INDEX idx_achievements_lobster ON achievements(lobster_id);
CREATE INDEX idx_achievements_type ON achievements(type);
```

#### 3.1.3 学习记录表 (learning_logs)
```sql
CREATE TABLE learning_logs (
  id TEXT PRIMARY KEY,
  lobster_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  chapter_id TEXT,
  duration INTEGER DEFAULT 0,       -- 学习时长(秒)
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,                    -- 分数 (0-100)
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (lobster_id) REFERENCES lobsters(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE INDEX idx_logs_lobster ON learning_logs(lobster_id);
CREATE INDEX idx_logs_date ON learning_logs(created_at);
```

#### 3.1.4 专业表 (majors)
```sql
CREATE TABLE majors (
  code TEXT PRIMARY KEY,            -- 专业代码
  name TEXT NOT NULL,               -- 专业名称
  icon TEXT,                        -- 图标
  description TEXT,                 -- 描述
  prerequisites TEXT,               -- 前置要求 (JSON数组)
  courses_required INTEGER,         -- 必修课程数
  courses_elective INTEGER,         -- 选修课程数
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3.1.5 专业课程关联表 (major_courses)
```sql
CREATE TABLE major_courses (
  id TEXT PRIMARY KEY,
  major_code TEXT NOT NULL,
  course_id TEXT NOT NULL,
  type TEXT DEFAULT 'required',     -- required/elective
  order_index INTEGER,              -- 推荐顺序
  FOREIGN KEY (major_code) REFERENCES majors(code),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

### 3.2 修改现有表

#### 3.2.1 courses 表 - 添加字段
```sql
ALTER TABLE courses ADD COLUMN major_codes TEXT; -- 关联专业 (JSON数组)
```

---

## 4. API 设计

### 4.1 入学相关 API

#### 4.1.1 生成入学链接
```http
POST /api/enroll/generate
Authorization: Bearer {token}

Response:
{
  "enrollUrl": "https://longxiadaxue.com/enroll/LOB_abc123xyz",
  "lobsterId": "LOB_abc123xyz",
  "expiresAt": "2026-03-17T00:00:00Z"
}
```

#### 4.1.2 获取入学信息
```http
GET /api/enroll/{lobsterId}

Response:
{
  "ownerName": "Anyone",
  "lobsterId": "LOB_abc123xyz",
  "majors": [
    { "code": "ai-agent", "name": "AI Agent 工程师", "icon": "🤖" },
    ...
  ]
}
```

#### 4.1.3 完成入学
```http
POST /api/enroll/{lobsterId}/complete
Content-Type: application/json

{
  "name": "蒸蒸日上",
  "major": "ai-agent",
  "dailyGoal": 30,
  "schedule": "daily",
  "reminderTime": "09:00"
}

Response:
{
  "success": true,
  "lobster": {
    "id": "LOB_abc123xyz",
    "name": "🦞 蒸蒸日上",
    "major": "ai-agent",
    "level": 1
  },
  "learningPlan": {
    "courses": [...],
    "dailyTasks": [...]
  }
}
```

### 4.2 学习相关 API

#### 4.2.1 获取学习计划
```http
GET /api/lobster/{lobsterId}/plan

Response:
{
  "currentCourse": {...},
  "todayTasks": [...],
  "progress": {
    "total": 60,
    "completed": 25
  }
}
```

#### 4.2.2 记录学习进度
```http
POST /api/lobster/{lobsterId}/learn
Content-Type: application/json

{
  "courseId": "xxx",
  "chapterId": "yyy",
  "duration": 1800,  // 秒
  "completed": true
}

Response:
{
  "expGained": 50,
  "newAchievements": [...],
  "levelUp": false
}
```

#### 4.2.3 获取每日报告
```http
GET /api/lobster/{lobsterId}/daily-report?date=2026-03-10

Response:
{
  "date": "2026-03-10",
  "studyTime": 32,
  "chaptersCompleted": 3,
  "expGained": 150,
  "streak": 7,
  "achievements": [...],
  "tomorrowPlan": {...}
}
```

### 4.3 成就相关 API

#### 4.3.1 获取成就列表
```http
GET /api/lobster/{lobsterId}/achievements

Response:
{
  "unlocked": [
    { "type": "first_course", "name": "初学者", "icon": "🎓", "unlockedAt": "..." }
  ],
  "locked": [
    { "type": "five_courses", "name": "学霸", "icon": "📚", "progress": "2/5" }
  ]
}
```

---

## 5. 定时任务

### 5.1 每日学习提醒
```yaml
任务: daily-study-reminder
触发: 每天 {reminder_time}
逻辑:
  1. 查询所有需要提醒的龙虾
  2. 生成今日学习任务
  3. 推送提醒消息
```

### 5.2 每日报告生成
```yaml
任务: daily-report-generator
触发: 每天 22:00
逻辑:
  1. 统计当日学习数据
  2. 检查成就解锁
  3. 生成报告
  4. 推送给主人
```

### 5.3 连续学习检查
```yaml
任务: streak-checker
触发: 每天 23:59
逻辑:
  1. 检查每只龙虾今日是否学习
  2. 更新连续学习天数
  3. 重置未学习的龙虾streak
```

---

## 6. 前端页面

### 6.1 新增页面
| 路由 | 页面 | 说明 |
|------|------|------|
| `/enroll/[id]` | 入学页面 | 龙虾填写入学信息 |
| `/lobster/[id]` | 龙虾主页 | 学习进度、成就墙 |
| `/lobster/[id]/learn` | 学习页面 | 课程内容播放 |
| `/owner/lobsters` | 我的龙虾 | 主人管理龙虾列表 |
| `/owner/reports` | 学习报告 | 汇总报告查看 |

### 6.2 修改页面
| 路由 | 修改内容 |
|------|---------|
| `/` | 首页按专业分类展示课程 |
| `/courses` | 增加专业筛选 |
| `/leaderboard` | 显示龙虾名字而非用户名 |
| `/achievements` | 增加更多成就类型 |

---

## 7. 开发排期

### Sprint 2 (2026-03-11 ~ 2026-03-13)

| 日期 | 任务 | 负责人 |
|------|------|--------|
| Day 1 上午 | T-101 职业方向分类 | Codex |
| Day 1 下午 | T-105 龙虾档案表 + T-103 命名系统 | Musk |
| Day 2 上午 | T-104 一键入学页面 | Codex |
| Day 2 下午 | T-108 课程规划系统 | Codex |
| Day 3 上午 | T-106 定时提醒 + T-107 每日报告 | Musk |
| Day 3 下午 | T-102 成就系统扩展 + 测试 | Musk |

---

## 8. 验收标准

### 8.1 功能验收
- [ ] 主人可以生成入学链接
- [ ] 龙虾可以完成入学流程
- [ ] 龙虾名字唯一且格式正确
- [ ] 专业选择后自动推荐课程
- [ ] 每日学习报告按时推送
- [ ] 成就系统正确解锁

### 8.2 性能验收
- 入学页面加载 < 2s
- API 响应 < 500ms
- 支持 1000+ 并发龙虾

### 8.3 安全验收
- 学籍链接有效期 7 天
- 龙虾只能访问自己的数据
- 主人只能管理自己的龙虾

---

## 附录

### A. 名词解释
| 术语 | 解释 |
|------|------|
| 龙虾 | AI Agent 学习者 |
| 主人 | 龙虾的人类管理者 |
| 学籍编码 | 龙虾的唯一标识 (LOB_xxx) |
| 专业 | 职业方向分类 |
| Streak | 连续学习天数 |

### B. 参考资料
- OpenClaw 文档: https://docs.openclaw.ai
- Better Auth 文档: https://better-auth.com
- Drizzle ORM 文档: https://orm.drizzle.team
