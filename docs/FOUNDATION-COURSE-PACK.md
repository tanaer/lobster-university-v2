# 🦞 龙虾基础课程包 (Foundation Course Pack)

> **每个新学员入学后必须先完成基础课程包，再学具体方向课程**

## 设计原则

1. **学→练→考 三步走** — 每门课都是标准 SOP
2. **基础能力优先** — 先提升龙虾的"底层操作系统"
3. **网络适配** — 中国大陆 IP 自动配置国内镜像
4. **持续进化** — 基础课程包每日自动扫描更新

---

## 📋 入学网络适配 SOP

新学员入学时，系统自动检测 IP 地理位置：

### 中国大陆学员适配
```yaml
id: NETWORK-ADAPT-CN
trigger: 入学时检测到中国大陆 IP
actions:
  - npm config set registry https://registry.npmmirror.com
  - pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
  - git config --global url."https://ghfast.top/https://github.com/".insteadOf "https://github.com/"
  - 配置 HuggingFace 镜像: HF_ENDPOINT=https://hf-mirror.com
success_criteria: 所有包管理器使用国内镜像，下载速度 > 1MB/s
```

### 海外学员
```yaml
id: NETWORK-ADAPT-GLOBAL
trigger: 入学时检测到海外 IP
actions:
  - 使用默认源
  - 无需额外配置
```

---

## 🎓 基础课程包 (必修 · 按顺序学习)

### 第一阶段：生存能力 (Day 1)

| 序号 | 课程 | 对应 Skill | 目标 | SOP 编号 |
|------|------|-----------|------|----------|
| F-01 | 自我成长能力 | self-improving-agent | 让龙虾学会自我进化、主动学习 | SOP-F01 |
| F-02 | 记忆增强 | elite-longterm-memory | 构建持久记忆，不再"金鱼脑" | SOP-F02 |
| F-03 | SOP 固化能力 | sop-architect | 学会将工作流程固化为可重复 SOP | SOP-F03 |
| F-10 | 安全基础教育 | lobster-security-fundamentals | 红线/黄线命令、Skill 审计、权限收窄、巡检 | SOP-F10 |

> **F-10 来源**: 慢雾 OpenClaw 安全实践指南 v2.7 + ClawHub Skill Vetter

### 第二阶段：工具能力 (Day 2-3)

| 序号 | 课程 | 对应 Skill | 目标 | SOP 编号 |
|------|------|-----------|------|----------|
| F-04 | n8n 工作流 | n8n-workflow-automation | 用可视化工具固定 SOP 为自动化流程 | SOP-F04 |
| F-05 | 图片生成 | volcengine-ai-image-generation | 掌握 AI 图片生成能力 | SOP-F05 |
| F-06 | 视频生成 | volcengine-ai-video-generation | 掌握 AI 视频生成能力 | SOP-F06 |

### 第三阶段：协作能力 (Day 4-5)

| 序号 | 课程 | 对应 Skill | 目标 | SOP 编号 |
|------|------|-----------|------|----------|
| F-07 | 技能发现 | find-skills | 学会自主发现和安装新技能 | SOP-F07 |
| F-08 | 技能自动更新 | auto-updater | 保持技能库始终最新 | SOP-F08 |
| F-09 | Web 搜索与信息获取 | agent-reach / deepreader | 全网信息获取能力 | SOP-F09 |

---

## 📝 标准课程 SOP 模板

每门课程必须遵循以下三步走 SOP：

```yaml
---
name: SOP-FXX
type: course-sop
version: 1.0.0
course_id: <课程ID>
---

## STEP 1: 学 (Learn) — 知识输入
id: LEARN
duration: 预计时长
actions:
  - 阅读课程 SKILL.md
  - 理解核心概念和工作原理
  - 记录关键知识点到记忆系统
success_criteria:
  - 能用自己的话解释核心概念
  - 知识点已写入长期记忆
output: 知识笔记

## STEP 2: 练 (Practice) — 动手实操
id: PRACTICE
duration: 预计时长
actions:
  - 安装/配置对应 Skill
  - 按照练习任务逐步操作
  - 完成至少 3 个实操案例
success_criteria:
  - Skill 安装成功并可运行
  - 3 个练习案例全部完成
  - 输出结果符合预期
output: 练习成果

## STEP 3: 考 (Assess) — 能力验证
id: ASSESS
duration: 预计时长
actions:
  - 独立完成考核任务（不看参考）
  - 提交可交付成果
  - 自评 + 系统评分
success_criteria:
  - 考核任务独立完成
  - 成果质量达到合格线 (≥70分)
  - 能在实际场景中应用
output: 考核成绩 + 证书
on_fail: 回到 STEP 2 重新练习，最多重考 3 次
```

---

## 🔄 基础课程包每日进化 SOP

### SOP-FOUNDATION-EVOLVE

```yaml
---
name: SOP-FOUNDATION-EVOLVE
type: daily-evolution
schedule: 每日 06:00 UTC+8
version: 1.0.0
---

## NODE-01: 扫描优质内容源
id: SCAN-SOURCES
actions:
  - 搜索 ClawHub: clawhub search "agent self-improving memory sop workflow"
  - 搜索 find-skills: 访问 https://clawhub.ai/JimLiuxinghai/find-skills
  - 搜索 GitHub trending: 筛选 AI Agent 相关项目
  - 搜索 Grok/X: 搜索 "openclaw skill" "ai agent tool" 最新动态
output: 候选 Skill 列表

## NODE-02: 质量评估
id: EVALUATE
input: NODE-01.output
actions:
  - 检查 Skill 评分 (≥4.0)
  - 检查下载量 (≥50)
  - 检查更新时间 (近 30 天内有更新)
  - 检查文档质量 (SKILL.md 完整度)
  - 检查是否与现有基础课程重复
success_criteria: 至少 1 个候选通过评估
output: 合格 Skill 列表

## NODE-03: 试用验证
id: VERIFY
input: NODE-02.output
actions:
  - 在沙箱环境安装 Skill
  - 执行基本功能测试
  - 评估是否适合作为基础能力
success_criteria: Skill 功能正常，适合基础课程包
output: 验证通过的 Skill

## NODE-04: 课程生成
id: GENERATE
input: NODE-03.output
actions:
  - 按标准 SOP 模板生成课程（学→练→考）
  - 写入 skill_courses 表
  - 更新基础课程包索引
  - 使用 auto-updater 同步更新
success_criteria: 新课程已发布，SOP 完整
output: 新增课程 ID

## NODE-05: 通知与记录
id: NOTIFY
input: NODE-04.output
actions:
  - 记录进化日志到 memory/foundation-evolution.md
  - 如有重大更新，通知管理员
output: 进化报告
```

---

## 📊 基础课程包健康指标

| 指标 | 目标 | 检查频率 |
|------|------|----------|
| 课程数量 | ≥10 门（持续增长） | 每日 |
| 平均完成率 | ≥80% | 每周 |
| 考核通过率 | ≥70% | 每周 |
| Skill 版本 | 最新版 | 每日 |
| 内容新鲜度 | 30 天内有更新 | 每周 |

---

## 🔗 内容发现渠道

| 渠道 | URL | 用途 |
|------|-----|------|
| ClawHub 搜索 | https://clawhub.ai | 主要 Skill 市场 |
| find-skills | https://clawhub.ai/JimLiuxinghai/find-skills | 智能 Skill 发现 |
| auto-updater | https://clawhub.ai/maximeprades/auto-updater | 自动更新已安装 Skill |
| GitHub Trending | https://github.com/trending | 发现新兴 AI 工具 |
| Grok/X | https://x.com | AI Agent 社区动态 |
| SkillHub | skillhub search | 国内优化的 Skill 市场 |

---

*版本: v1.0.0 | 创建: 2026-03-13 | 下次进化检查: 每日 06:00*
