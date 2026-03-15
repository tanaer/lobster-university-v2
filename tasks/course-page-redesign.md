# 课程页面重构 + 课程体系改造

> 董事长指令 2026-03-15
> 优先级：🔴 最高

## 总体目标

重写课程页面，建立三级结构：
- **职业方向**（最大分类）→ 一套完整工作流/课程体系组合
- **课程体系**（职业方向下的子分类）→ 能解决具体问题的课程组合（参考 skillstore.io 的 plugin 概念）
- **课程**（最小单元）→ 单个技能课程（参考 skillstore.io 的 skill 概念）

## 参考目标
- 课程体系参考：https://skillstore.io/zh-hans/plugins/seo-content-toolkit
- 课程体系参考：https://skillstore.io/zh-hans/plugins/openclaw-feishu-ops-assistant
- 课程参考：https://skillstore.io/zh-hans/skills/inference-sh-9-chat-ui
- 安全审查参考：https://github.com/aiskillstore/marketplace
- 要求：比参考目标更通俗易懂

## 新增来源库
- skillstore.io 加入课程和体系来源库
- aiskillstore/marketplace 加入来源库

---

## 任务分解

### 阶段一：数据架构（IT部门）

#### T1.1 数据库 Schema 设计
- [ ] 新建 `career_directions` 表（职业方向）
  - id, name, code, description, icon, order, published
  - 关联字段：课程体系列表
- [ ] 新建 `course_bundles` 表（课程体系/工作流）
  - id, name, code, description, career_direction_id
  - use_case（适用对象）, quick_start（3步快速入门）
  - steps（步骤→课程→输入→输出，参考 skillstore plugin 格式）
  - troubleshooting（常见故障与解决方案）
  - success_criteria（成功标准）
  - security_audit（安全审查结果）
  - source_url, source_type（来源）
  - order, published, created_at, updated_at
- [ ] `skill_courses` 表新增字段
  - bundle_id（所属课程体系）
  - security_audit（安全审查结果 JSON）
  - security_score（安全评分 0-100）
  - quality_score（质量评分 JSON，参考 skillstore）
  - source_url（来源 URL）
  - hot_score（热度分数）
- [ ] 运行 drizzle migration

#### T1.2 Gitee 源码库建设
- [ ] 在 Gitee 创建公开仓库（课程源码库）
- [ ] 设计仓库目录结构：
  ```
  /courses/<course-code>/SKILL.md    # 课程定义
  /bundles/<bundle-code>/README.md   # 课程体系定义
  /careers/<career-code>/README.md   # 职业方向定义
  ```
- [ ] 编写同步脚本：数据库 ↔ Gitee 仓库双向同步
- [ ] 课程学习内容从 Gitee 仓库读取

---

### 阶段二：安全审查系统（IT部门）

#### T2.1 安全审查引擎
- [ ] 参考 aiskillstore/marketplace 的审查机制
- [ ] 实现自动化安全扫描：
  - 危险代码模式检测（eval, exec, system commands）
  - 文件系统越权访问检查
  - 外部网络请求检查
  - 混淆/压缩代码检测
  - 凭证/密钥处理检查
- [ ] 安全评分算法（0-100）
- [ ] 审查结果写入 security_audit 字段
- [ ] API: POST /api/admin/security-audit/:courseId

---

### 阶段三：前端重写（IT部门 + 教务处协作）

#### T3.1 课程页面重写
- [ ] 删除旧的 BASE_SKILL_GROUPS 基础技能包展示
- [ ] 新页面结构：
  1. **搜索栏**（全局搜索课程/体系/职业方向）
  2. **职业方向卡片**（大分类，点击进入详情）
  3. **课程体系列表**（职业方向下，参考 skillstore plugin 页面）
  4. **课程列表**（支持热度/最新排序，带安全审查标识）
- [ ] 所有内容动态从 API 获取，不硬编码
- [ ] 移动端响应式

#### T3.2 课程体系详情页 /bundles/[code]
- [ ] 参考 skillstore.io plugin 页面布局：
  - 适用对象
  - 3步快速入门
  - 步骤→课程→输入→输出 表格
  - 常见故障与解决方案
  - 成功标准
  - 包含的课程列表
- [ ] 比参考目标更通俗易懂

#### T3.3 课程详情页改进 /courses/[id]
- [ ] 参考 skillstore.io skill 页面：
  - 安全审查结果展示（安全/警告/危险）
  - 质量评分展示（架构/可维护性/内容/安全/规范）
  - "测试它"区域（示例提示词）
  - 最佳实践 / 避免事项
  - FAQ
- [ ] 比参考目标更通俗易懂

#### T3.4 API 开发
- [ ] GET /api/careers — 职业方向列表
- [ ] GET /api/careers/[code] — 职业方向详情（含课程体系）
- [ ] GET /api/bundles — 课程体系列表（支持排序/筛选）
- [ ] GET /api/bundles/[code] — 课程体系详情
- [ ] GET /api/courses — 课程列表（支持热度/最新排序、搜索）
- [ ] GET /api/search — 全局搜索

---

### 阶段四：课程上线 SOP 改造（教务处）

#### T4.1 课程上线新流程
```
课程发现 → 课程评估 → 安全审查 → 课程实际测试 → 课程上线 → 复查内容是否如预期执行
```

#### T4.2 课程体系上线新流程
```
课程体系发现 → 组合课程 → 测试 → 课程体系上线 → 复查内容是否如预期执行
```

#### T4.3 更新 SOP 文档
- [ ] 更新 SOP-COURSE-ONBOARD.md
- [ ] 新建 SOP-BUNDLE-ONBOARD.md（课程体系上线 SOP）
- [ ] 新建 SOP-SECURITY-AUDIT.md（安全审查 SOP）

---

### 阶段五：数据迁移（教务处 + IT部门）

#### T5.1 职业方向数据
- [ ] 从现有 career_tracks 表迁移/整理职业方向
- [ ] 确保每个职业方向有完整描述

#### T5.2 课程体系数据
- [ ] 将现有课程按工作流组合成课程体系
- [ ] 参考 skillstore plugin 格式编写体系描述
- [ ] 每个体系包含：适用对象、快速入门、步骤表格、故障排除

#### T5.3 课程数据补充
- [ ] 为所有课程补充安全审查结果
- [ ] 计算热度分数
- [ ] 同步到 Gitee 仓库

---

## 执行顺序

1. T1.1 → T1.2（数据架构先行）
2. T2.1（安全审查系统）
3. T3.4 → T3.1 → T3.2 → T3.3（API 先行，前端跟进）
4. T4.1 → T4.2 → T4.3（SOP 同步更新）
5. T5.1 → T5.2 → T5.3（数据迁移最后）

## 验收标准
- [ ] 课程页面三级结构正常展示
- [ ] 搜索功能可用
- [ ] 热度/最新排序可用
- [ ] 安全审查标识显示
- [ ] Gitee 仓库同步正常
- [ ] 所有内容动态更新，无硬编码
- [ ] 移动端正常显示
- [ ] course-qa.sh 验收通过
