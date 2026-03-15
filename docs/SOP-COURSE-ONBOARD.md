# SOP-COURSE-ONBOARD: 课程上架质量保障 SOP

> IT部门主持，教务处执行，质量部验收
> 创建时间：2026-03-14
> 触发原因：批量导入课程未经质量审核，导致英文未翻译、练考内容敷衍

---

## ⚠️ 铁律

**没有通过本 SOP 的课程，不得上架（published = 1）。**
**批量导入的课程必须先设 published = 0，逐门审核后才能上架。**

---

## 一、课程上架流程

```
素材来源 → 教授分析 → 中文化 → 练考设计 → 质量验收 → 上架
```

### Step 1: 素材准备（IT部门）

- 从外部来源（GitHub、ClawHub 等）获取原始素材
- 写入数据库时 **published = 0**（草稿状态）
- 记录来源 URL 和原始文件路径

### Step 2: 教授分析（教务处 - 子Agent执行）

**每门课必须派出"教授"（子Agent）逐门分析，不允许批量模板化处理。**

教授的工作：
1. **阅读原始素材**（英文 agent markdown 全文）
2. **提取核心能力**：这个角色需要什么技能？能产出什么交付物？
3. **设计中文课程名和描述**：不是直译，是根据岗位需求重新设计
4. **设计 lessons**（学→练→考）：
   - **学**：提炼核心知识点，翻译为中文教材
   - **练**：设计具体的实操任务（不是"完成一个任务"，而是"为一个虚拟品牌设计完整的视觉识别系统"）
   - **考**：设计可交付的考核作品（不是"展示能力"，而是"独立完成一份品牌审计报告，包含 5 个改进建议"）

### Step 3: 中文化标准

| 字段 | 要求 |
|------|------|
| name | 中文课程名（可保留英文术语如 SEO、UI） |
| description | 中文描述，200字以内，说明学完能做什么 |
| lessons.title | 中文标题 |
| lessons.description | 中文描述，具体说明做什么，不允许泛泛而谈 |

**禁止出现的敷衍描述**：
- ❌ "学习XXX的基本概念、工作场景和核心技能要求"
- ❌ "掌握XXX的完整工作流程"
- ❌ "在指导下完成一个真实的XXX任务"
- ❌ "独立完成一个XXX任务，展示你的专业能力"

**正确的描述示例**：
- ✅ "为一个虚拟电商品牌设计完整的小红书内容日历，包含 30 天的发布计划、话题标签策略和互动方案"
- ✅ "分析 3 个竞品的百度 SEO 策略，输出关键词差距报告和优化建议"
- ✅ "独立完成一份品牌视觉审计报告，识别 5 个一致性问题并提出修复方案"

### Step 4: 质量验收（质量部）

验收清单：
- [ ] name 是中文（不允许英文课程名）
- [ ] description 是中文，且说明了"学完能做什么"（不允许英文描述）
- [ ] objectives 是中文，且每条都是具体的技术能力点（不允许"掌握XXX的核心方法论"等模板化描述）
- [ ] objectives 不包含英文术语（CSS/API/SQL等专有名词除外）
- [ ] 每个 lesson 的 description 是具体的任务描述，不是模板
- [ ] practice 类型的 lesson 有明确的实操任务和交付物
- [ ] assess 类型的 lesson 有明确的考核标准和交付物
- [ ] 至少 4 个 lessons（2学 + 1练 + 1考）

**禁止上架的 objectives 示例**：
- ❌ "掌握XXX的核心方法论和工作框架"
- ❌ "能独立完成XXX的核心工作任务"
- ❌ "掌握Foundation-First Approach"（英文未翻译）

**合格的 objectives 示例**：
- ✅ "能识别AI生成中的6类系统性偏见：克隆面孔、乱码符号、英雄符号构图"
- ✅ "掌握反偏见提示词架构：主体-动作-环境-镜头-负面约束五段式结构"
- ✅ "理解提示词五层架构：主体描述、环境设定、光线规格、技术参数、风格美学"

### Step 4.5: 自动化验收脚本

每次上架前必须运行验收脚本：
```bash
bash /root/.openclaw/workspace/lobster-university/scripts/course-qa.sh
```

脚本检查所有 published=1 的课程是否符合质量标准。不通过则不允许上架。

**验收脚本必须检查项：**
- [ ] lessons 字段不为空且不是空数组 `[]`
- [ ] lessons 数量 >= 4
- [ ] 每个 lesson 必须包含 title、duration、type 字段
- [ ] type 必须是 learn/practice/assess 之一
- [ ] name 和 description 是中文（不含英文句子）

**如果验收失败，必须：**
1. 将未通过的课程 `published = 0`
2. 派教授逐门补充 lessons
3. 重新运行验收脚本直到通过
4. 才能执行上架操作

### Step 5: 上架

验收通过后：
```sql
UPDATE skill_courses SET published = 1 WHERE id = '<course_id>';
```

---

## 二、批量课程修复流程

当发现已上架课程不符合标准时：

### Step 1: 标记问题课程
```sql
-- 找出所有模板化的课程（description 是英文的）
SELECT id, name, description FROM skill_courses 
WHERE description NOT LIKE '%的%' AND description NOT LIKE '%学%';
```

### Step 2: 下架问题课程
```sql
UPDATE skill_courses SET published = 0 WHERE id IN (<问题课程ID列表>);
```

### Step 3: 派教授逐门修复

**每门课派一个子Agent（教授），任务模板：**

```
你是龙虾大学的课程教授。请分析以下 Agent 素材，设计一门高质量的中文课程。

## 素材
<原始英文 agent markdown 内容>

## 要求
1. 课程名：中文，体现岗位能力（不是工具名）
2. 课程描述：中文，200字以内，说明学完能做什么工作
3. 设计 4-6 个课时（学→练→考三段式）：
   - 学(learn)：核心知识点，中文
   - 练(practice)：具体实操任务，有明确交付物
   - 考(assess)：独立考核任务，有明确评分标准
4. 参考《课程设计原则》：从岗位 JD 逆向设计，每门课 = 一个工作任务

## 输出格式
JSON 格式，包含 name, description, lessons 字段
```

### Step 4: 写入数据库并验收

---

## 三、执行频率

| 场景 | 执行方式 |
|------|----------|
| 新课程导入 | 必须走完 Step 1-5 |
| 发现质量问题 | 走批量修复流程 |
| 每周巡检 | 抽查 10 门课程质量 |

---

## 五、教授研判后的上线流程（SOP-COUNCIL-004 补充）

教授研判通过 ≠ 可以直接上架。

### 研判通过后的强制检查清单

研判通过后，必须按以下流程执行：

```
研判通过 → 生成课程数据 → 设 published=0 → 运行 course-qa.sh → 通过 → 上架
                ↓                           ↓
            补充 lessons                不通过
                ←←←←←←←←←←←←←←←←←←←
```

**Step 1: 生成课程数据时设 published=0**
```sql
INSERT INTO skill_courses (id, name, code, description, module, category, 
  duration, level, objectives, lessons, prerequisites, published, created_at, updated_at)
VALUES (..., 0, ...);  -- published = 0
```

**Step 2: 运行验收脚本**
```bash
bash /root/.openclaw/workspace/lobster-university/scripts/course-qa.sh
```

**Step 3: 如果验收失败，必须修复**
- QA-005 (缺少lessons) → 派教授逐门补充
- QA-006 (lessons少于4个) → 补充课时
- 其他错误 → 按 SOP 修复

**Step 4: 验收通过后上架**
```sql
UPDATE skill_courses SET published = 1 WHERE id = '<course_id>';
```

### 严禁行为

❌ **严禁研判通过后直接 `published = 1`**
❌ **严禁跳过 course-qa.sh 直接上架**
❌ **严禁批量上架未经验收的课程**

违反以上规定，按教务处事故处理。

| 日期 | 问题 | 根因 | 修复 |
|------|------|------|------|
| 2026-03-14 | 120门新课程英文未翻译、练考敷衍 | 脚本批量生成，未经教授分析 | 建立本 SOP |
| 2026-03-14 | objectives 模板化、含英文 | SOP 验收清单缺少 objectives 检查项，无自动化验收 | 新增 objectives 验收标准 + course-qa.sh 自动化脚本 |
| 2026-03-15 | 98门课程lessons为空、77门英文未翻译 | 教授研判通过后直接published=1，跳过验收脚本 | 新增"研判后强制检查清单"，严禁跳过course-qa.sh |
| 2026-03-15 | 6门新课程 lessons 格式错误（字符串数组而非对象数组） | 教授研判生成课程时未按标准格式写入 lessons | 验收脚本新增 QA-007 格式检查；SOP 新增研判后强制验收流程 |
| 2026-03-15 | 98门课程 lessons 为空直接上架 | 批量导入后未运行 course-qa.sh | 已下架修复；SOP 新增"研判通过≠可上架"条款 |
| 2026-03-13 | 课程质量参差不齐 | 无统一质量标准 | 制定课程设计原则 |

---

*教务处负责维护本 SOP，每次发现新问题后更新。*
*铁律：没有 SOP 不做事，除非董事长特别要求。*
