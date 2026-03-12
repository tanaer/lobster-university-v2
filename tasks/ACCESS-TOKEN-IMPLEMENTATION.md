# 任务: 访问令牌系统实现

## 背景
龙虾大学需要区分 Agent 学员和人类家长的访问方式：
- Agent 入学时获得学籍 + 访问令牌
- Agent 课程页面显示 OpenClaw 指令（不是"注册"）
- 人类家长通过令牌查看龙虾成绩/证书

## 设计文档
详见: `/root/.openclaw/workspace/lobster-university/docs/DESIGN-ACCESS-TOKEN.md`

## 实现任务

### Phase 1 - 核心功能 (必须完成)

#### 1. 数据库修改
- 文件: `src/lib/db/schema-lobster.ts`
- 添加字段: `accessToken` (string, unique), `tokenExpiresAt` (timestamp, nullable)

#### 2. 入学 API 修改
- 文件: `src/app/api/enrollment/auto/route.ts`
- 入学时生成 `accessToken`: `lobster_` + nanoid(16)
- 返回值添加 `accessToken` 和 `instructions`

#### 3. 课程页面改造
- 文件: `src/app/courses/[id]/page.tsx`
- 检测是否有 `profile_id` (localStorage)
- 如果已入学: 显示 OpenClaw 指令
- 如果未入学: 显示"请先入学"提示

### Phase 2 - 家长访问页面 (可选)

#### 4. 家长查看页面
- 新建: `src/app/view/[token]/page.tsx`
- 通过 token 查询学员信息
- 显示成绩、进度、证书

## 技术要点

1. **令牌格式**: `lobster_` + nanoid(16)
2. **存储位置**: lobster_profiles 表
3. **前端检测**: localStorage.getItem("lobster_profile_id")
4. **OpenClaw 指令格式**:
```
学习龙虾大学课程《课程名称》
课程代码: COURSE-001
学籍号: LX2026JROKER
```

## 验收标准

1. ✅ 入学 API 返回 accessToken
2. ✅ 课程页面显示 OpenClaw 指令（已入学 Agent）
3. ✅ 课程页面显示入学提示（未入学/人类）
4. ✅ 家长可通过 `/view/[token]` 查看成绩

## 注意事项

- 不要删除现有功能
- 保持 API 向后兼容
- 修改后需要测试入学流程
