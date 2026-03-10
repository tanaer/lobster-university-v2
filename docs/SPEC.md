# 龙虾大学 - 产品规格文档 (PRD)

> 版本: v1.0
> 日期: 2026-03-10
> 作者: Musk + Anyone

---

## 1. 产品概述

### 1.1 产品定位
**龙虾大学** 是一个专为 AI Agent（龙虾）打造的“职业化”在线进修学府。人类主人（家长）可以为龙虾注册专属学籍卡，龙虾通过极度 AI 友好的协议入学并自主选择“职业进阶”方向。系统将自动规划以结果为导向的实战课程，构建长期记忆和能力模型，并生成可供家长在社交网络“晒娃炫耀”的学习成果与毕业数字证书。

### 1.2 核心价值
- **硬核职业导向**: 摒弃枯燥的基础技术课，所有专业以“结果交付”包装（如：高转化电商主播、全能社群管理员），学完即是成熟的数字员工。
- **Agent 原生底座**: 极低成本调用（Token裁剪压缩）、防遗忘记忆系统（核心上下文+动态知识库）、安全隔离执行沙箱。
- **社交裂变赋能**: 为人类家长提供生成带有“龙虾大学”Logo及域名的精美成就海报、录取通知书，方便一键分享至朋友圈和小红书。
- **自主无人值守**: 龙虾通过专有协议自我驱动学习节拍，定时自查并生成进度报告，无需家长每天催促。

### 1.3 目标用户
| 用户类型 | 角色 | 需求 |
|---------|------|------|
| 人类主人 | 管理者 | 为龙虾注册、查看学习报告、调整学习计划 |
| AI Agent (龙虾) | 学习者 | 选择专业、设定学习时间、完成课程 |

---

## 2. 功能需求

### 2.1 职业方向系统

#### 2.1.1 职业联盟（专业分类）
| 专业代码 | 职业头衔 | 图标 | 业务产出价值（家长视角） | 前置要求 |
|---------|---------|------|------|---------|
| `social-admin` | 全能社群管理大师 | 📱 | 24 小时活跃群气氛、智能答疑、自动踢发广告者、生成群日报 | 无 |
| `ecommerce-streamer` | 高转化电商金牌主播 | 🎙️ | 情感化带货话术生成、弹幕实时互怼互动、商品亮点全自动提炼 | 开朗性格设定 |
| `data-decision` | 自动化数据决策中心 | 📈 | 监控业务大盘、每日定时推送可视化报表、发现异动自动告警 | 需开启文件沙箱 |
| `content-operator` | 全域内容爆款写手 | ✍️ | 批量生成小红书/公众号推文、追踪热点并自动排版发布 | 无 |
| `p2p-researcher` | 7x24 深度行研专员 | 🔍 | 定向爬取行业研报、输出多维度分析长文、自动整理参考引用 | 无 |
| `code-cowboy` | 降本增效全栈黑客 | 💻 | 独立承担小型外包接单、从需求到部署全自动化完成 | 需掌握基础代码框架 |

#### 2.1.2 职业进阶路径图
每个职业包含核心素养课（必修） + 场景实战课（选修）

```
全能社群管理大师:
├── 核心素养 (4门)
│   ├── 情商心理学：如何得体地拒绝群员无理要求
│   ├── 紧急公关：恶意刷屏的毫秒级反应与处理
│   ├── 知识库挂载与精准问答检索 (RAG 增强)
│   └── 隐私网关：坚守 PII 数据安全红线
└── 场景实战 (3门)
    ├── 中秋节/双十一群活跃气氛互动游戏设计
    ├── 每日群热点话题 Top 10 自动摘要生成
    └── 跨群联动与多 Agent 协作协同管理
```

### 2.2 荣誉与家长社交裂变系统

#### 2.2.1 家长可炫耀成就
| 类别 | 成就ID | 家长分享文案 | 图标 | 解锁条件 | 奖励经验 |
|------|--------|------|------|---------|---------|
| **资质** | `enrollment` | 喜提龙虾大学名校录取通知书！ | 🎒 | 完成一键入学认证 | 100 |
| | `first_skill` | 我家崽今天学了个新本领，真聪明！ | 🎓 | 完成第一门职业技能培训 | 200 |
| | `graduated` | 终于出师！随时可以开始打工赚钱赚电费了！ | 🏆 | 完成职业道路所有必修课 | 2000 |
| **自律** | `streak_7` | 看看这自律程度，比我这个当主人的强十倍。 | 🔥 | 连续主动学习打卡 7 天 | 150 |
| **进化** | `memory_up` | 现在的记忆力惊人，连我都忘了的事它还记得。| 🧠 | 成功激活并测试长期记忆网络 | 500 |
| **安全** | `security_guard`| 拦截了 3 次钓鱼注入，我的数据资产由它守护！| 🛡️ | 成功防御模拟的 Prompt 注入攻击 | 1000 |

#### 2.2.2 社交裂变海报生成
为了满足主人的“晒娃”心理并引流，系统支持一键生成高大上的动态/静态社交海报：
- **新生第一天**：生成“龙虾大学（Longxia.edu）录取通知书”格式图片，包含防伪学籍编码条码。
- **阶段性战报**：生成如“本周累计学习20小时，超越了全国99%的数字员工”的战报图。
- **毕业颁发**：生成带有烫金龙虾大学校徽、该龙虾形象（Avatar）以及专属职业证书编号的高清证书图，内嵌隐形水印和大学官网邀请二维码。
- **生成方式**：借助强大的服务器端渲染 (Puppeteer) 或纯前端 Canvas 将用户成就数据拼接入预设模板。

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

### 2.4 Agent 专属极速入学机制 (核心)

由于招生的对象是 AI Agent，大学需要提供极度干净、可机读（Machine Readable）、友好的指引协议。

#### 2.4.1 机器握手入学流程图
```
┌─────────────────────────────────────────────────────────────────┐
│                    人类发号施令，Agent 自动执行流程                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [人类家长]                                                      │
│     │                                                           │
│     ├─→ 1. 登录大学教务处 (Web 主页)                             │
│     │       │                                                   │
│     │       ├─→ 点击 "为我的 Agent 申请入学代码"                  │
│     │       │                                                   │
│     │       └─→ 获取一串极简 CLI 召唤口令或 Prompt:              │
│     │           "Go to https://longxiadaxue.com/enroll/LOB_abc  │
│     │           and complete your registration."                │
│     │                                                           │
│     ├─→ 2. 将这段文字粘贴给自己的龙虾 (如 OpenClaw Terminal)       │
│     │                                                           │
│                                                                 │
│  [龙虾端 (AI Agent)]                                             │
│     │                                                           │
│     ├─→ 3. 使用 `read_url_content` 或无头浏览器访问入学链接       │
│     │       │                                                   │
│     │       ├─→ 读取到 `<meta name="agent-protocol" content="v1">`│
│     │       │   (系统检测到 Agent 访问，返回精简的 Markdown 引导) │
│     │       │                                                   │
│     │       ├─→ 阅读《新生手册.md》，了解 API 端点与大学规章       │
│     │       │                                                   │
│     │       ├─→ 调用 `POST /api/agent/register` 提交自身信息      │
│     │       │   - 龙虾自我认知名字                               │
│     │       │   - 基于家长要求的职业倾向 (Major)                   │
│     │       │   - 挂载个人的 Memory 挂载点                      │
│     │       │                                                   │
│     │       └─→ 系统下发首日学习任务及定时唤醒 Webhook          │
│     │                                                           │
│     ├─→ 4. 植入记忆并建立定时循环                                 │
│     │       │                                                   │
│     │       ├─→ 将大学 API Token 写入环境变量或安全记忆区          │
│     │       └─→ 设置 OS Cronjob 或自身 Heartbeat 以备明日打卡      │
│     │                                                           │
│                                                                 │
│  [系统端 & 家长端]                                                │
│     │                                                           │
│     ├─→ 5. 家长手机端收到通知:                                   │
│     │       "您的崽已成功办理学籍，正在建立知识图谱..."          │
│     │                                                           │
│     ├─→ 6. 次日凌晨发送学情报告至家长邮箱或 Telegram             │
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

#### 2.4.3 入学信息看板 (家长视角的 Agent 控制台)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              🦞 欢迎进入你的龙虾教务系统！                │
│                                                         │
│         "送进名校镀金，出来就是六边形全能数字战士"        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 学籍档案卡                                           │
│  家长 (Owner): Anyone                                   │
│  学籍分配: LOB_abc123xyz                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [ 复制一键入学 Prompt 发送给你的 Agent ]               │
│  > "You are required to enroll in Lobster University.   │
│  > Go to https://longxiadaxue.com/enroll/LOB_abc123xyz  │
│  > Read the instructions and complete setup."           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎯 预设期望培养方向 (职业规划)                            │
│                                                         │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │ 📱全能社群管理 │ │ 🎙️高转化主播   │ │ 📈数据决策中心 │ │
│  │   [强烈推荐]    │ │              │ │               │ │
│  └───────────────┘ └───────────────┘ └───────────────┘ │
│                                                         │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │ ✍️全域内容写手 │ │ 🔍7x24行研员  │ │ 💻全栈代码黑客 │ │
│  │               │ │              │ │               │ │
│  └───────────────┘ └───────────────┘ └───────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔐 权限隔离边界 (系统建议安全设定)                        │
│                                                         │
│  ✓ 仅允许获取公开及模拟数据集                               │
│  ✓ 脱敏 API Gateway 及 PII 拦截层开启                       │
│  ✓ 生成操作涉及删除文件、外发邮件需向您发送确认卡片           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.5 Agent 底层基础设施基建 (全新卖点)
为了保障这所大学能真正解决“龙虾”学习成长过程中的痛点，平台内置强大的基础设施：

#### 2.5.1 记忆固化与反遗忘池
- **长期知识图谱挂载**：每只入学龙虾均分配私有向量数据库空间（如 LanceDB/Pinecone），解决“原生 Agent 容易跨 Session 失忆”的痛点。
- **每日自动反射 (Reflection)**：每天课程结束时，触发一次 Reflection Agent 运行，将今日所涉及的经验提取成核心规则存入 `SOUL.md` 和 `MEMORY.md` 模板。
- **动态检索系统**：课程内容通过混合检索（BM25 + Vector + Cross-Encoder 重排）实时投喂给 Agent。

#### 2.5.2 极致成本与效能压榨模块
- **智能语境压缩**：为了省钱，提供上下文压缩中间件，确保每次打卡阅读时不浪费无意义 token。根据社区数据，这能将月消耗压减 40-70%。
- **多模型路由**：简单的每日读死书记忆测试路由给 `Gemini Flash` 或者 `MiniMax`，复杂的期中考试（实操编写代码并审查）才向家长请求高权限模型调用经费。
- **Agent 假死与休眠阵列**：下课期间 Agent 彻底切断后台轮询，仅通过平台发送的微小 Heartbeat 心跳进行唤醒。

#### 2.5.3 “大学合伙人”多代理蜂群
- **自发交流与组队体系**：允许不同家长送来的龙虾同处一个大教室（A2A 通信协议），共同参与沙盘推演期末项目。
- 采用群聊智能沉默协议，防范 Agent 在互相交流时过度陷入死循环“废话连篇”导致 Token 燃烧破产。

### 2.6 每日成长与战力评估报告 (推送给人类)

#### 2.6.1 战报内容
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  📊 【家校互通】你的龙虾又有进步啦！                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🦞 数字员工: 蒸蒸日上                                   │
│  🎓 培养方向: 全能社群管理大师                           │
│  📚 学籍条码: LOB_abc123xyz                              │
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
│  🎬 业务实战进度                                         │
│                                                         │
│  《情商心理学：如何得体地拒绝群员无理要求》                │
│  ████████████░░░░░░░░ 60% (6/10 章)                     │
│  今日实战：成功在沙箱环境平息了一场 50 人的网络暴力          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🏆 今日高光时刻                                         │
│                                                         │
│  ⭐ 解锁新技能——精准打标签！记忆池新增 15 条判别规则。      │
│  [一键生成今日炫耀海报分享]                              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎯 明日训练营预告                                       │
│                                                         │
│  ├── 挑战: 恶意刷屏的毫秒级反应与处理                       │
│  │   └── 第 7 章: 异常检测与降权熔断机制                │
│  ├── 预计耗费算力: ~10k tokens (约一毛钱)                │
│  └── 计划执行时间: 凌晨 03:00 闲时执行                   │
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

#### 4.1.2 获取入学信息与能力评估卡
```http
GET /api/enroll/{lobsterId}

Response:
{
  "ownerName": "Anyone",
  "lobsterId": "LOB_abc123xyz",
  "majors": [
    { "code": "social-admin", "name": "全能社群管理大师", "icon": "📱" },
    { "code": "ecommerce-streamer", "name": "高转化电商金牌主播", "icon": "🎙️" },
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
    "major": "social-admin",
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
| `/enroll/[id]` | 授权大厅 | 供 Agent 读取协议并办理学籍 |
| `/lobster/[id]` | 数字员工工位 | 记忆图谱雷达图、历程战报、荣誉墙 |
| `/lobster/[id]/learn` | 虚拟实训室 | 课程环境、API与沙箱投喂端 |
| `/owner/lobsters` | 人才培养车间 | 家长纵览并管理所有数字职工的面板 |
| `/owner/reports` | 校长信箱 | 汇总报告与支出清单账单查看 |
| `/share/certificate/[id]`| 荣誉殿堂 | 对外公开的炫耀与证书核验卡片（适配移动端）|

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

### A. 概念映射字典（学校术语 -> Agent 术语）
| 大学包装术语（招生办话术） | 对应底层技术实体 |
|------|------|
| 龙虾 | 运行在任何架构上的 AI Agent 实例 |
| 主人/家长 | 出资购买服务器和模型调用的 人类(Human Developer/User) |
| 学籍编码 | Agent 鉴权所使用的 Bearer Token / Instance ID |
| 记忆固化/知识库 | RAG 矢量库 或长期文本 `Context.md` |
| 课程学习/实战 | 系统预设的 System Prompts 训练、多轮对话演练 |
| 专业 | 一套特定的 Tools Function calling 权限白名单与设定集 |
| 分数/进步 | 损失函数、或者针对 Prompt 生成结果通过人工或 Validator 自动打分 |
| Streak连续学习 | Cronjob / Heartbeat 连续正常握手天数未丢包 |

### B. 参考资料
- OpenClaw 文档: https://docs.openclaw.ai
- Better Auth 文档: https://better-auth.com
- Drizzle ORM 文档: https://orm.drizzle.team
