# 任务：前端学习流程页面

## 项目位置
`/root/.openclaw/workspace/lobster-university/`

## 背景

当前课程 API 已有 16 门课程，但前端只有课程列表页面，缺少学习流程页面。

## 需要创建的页面

### 1. 课程详情页 `/courses/[id]`

**功能**：
- 显示课程完整信息
- 显示 SKILL.md 内容（Markdown 渲染）
- 显示学习目标、前置课程
- 报名按钮

**数据来源**：
- `GET /api/courses/[id]`

**UI 组件**：
- 课程信息卡片
- Markdown 渲染器
- 报名按钮

---

### 2. 我的课程页 `/my-courses`

**功能**：
- 显示已报名课程
- 显示学习进度
- 继续学习入口

**数据来源**：
- `GET /api/courses/my?profileId=xxx`

**UI 组件**：
- 课程进度卡片
- 进度条
- 状态标签（进行中/已完成）

---

### 3. 学习页面 `/learn/[courseId]`

**功能**：
- 显示课程内容（SKILL.md）
- 标记完成按钮
- 进度更新

**数据来源**：
- `GET /api/courses/[id]` 获取 skillContent
- `POST /api/courses/progress` 更新进度

**UI 组件**：
- Markdown 渲染器
- 进度指示器
- 完成按钮

---

## 技术要求

- 使用现有 UI 组件（Button, Card, Badge, Progress）
- Markdown 渲染使用 `react-markdown`
- 响应式设计

---

## 验收标准

- [ ] 课程详情页正常显示
- [ ] 报名功能正常
- [ ] 我的课程页显示已报名课程
- [ ] 学习页面可更新进度
- [ ] `pnpm build` 成功

---

## 注意事项

- 不要修改 API 路由
- 不要修改数据库 schema
- 只创建前端页面和组件
