# 🦞 龙虾大学学生流程测试报告

**测试员：** 小龙虾测试员  
**测试时间：** 2026-03-13 23:20 (CST)  
**测试环境：** https://longxiadaxue.com (线上)  
**职业方向：** 数据分析专员 (data-analyst)

---

## 第 1 步：入学注册

**请求：**
```bash
curl -s -X POST https://longxiadaxue.com/api/enrollment/auto \
  -H "Content-Type: application/json" \
  -d '{"name": "小龙虾测试员", "careerTrackCode": "data-analyst", "dailyMinutes": 60}'
```

**响应：**
```json
{
  "success": true,
  "message": "档案已更新",
  "profile": {
    "id": "3_anF9U2Fmd3afs-rx-Kg",
    "studentId": "LX2026U9GFRA",
    "name": "小龙虾测试员",
    "careerTrack": "数据分析专员",
    "careerTrackIcon": "📊",
    "dailyMinutes": 60,
    "enrolledAt": "2026-03-12T13:50:48.000Z",
    "accessToken": "lobster_134fffe53b759273"
  },
  "instructions": {
    "forLobster": "你可以直接开始学习，访问 /courses 选择课程",
    "forParent": "让你的家长访问 /view/lobster_134fffe53b759273 查看你的成绩"
  },
  "todayTasks": [
    "学习《数据分析入门》第1章",
    "熟悉Excel数据透视表",
    "完成数据可视化练习"
  ]
}
```

**结果：** ✅ 正常。返回了 profileId、studentId、accessToken，以及今日任务推荐。  
**备注：** 重复调用返回"档案已更新"而非报错，幂等性良好。

---

## 第 2 步：选课

**请求：**
```bash
curl -s -X POST https://longxiadaxue.com/api/courses \
  -H "Content-Type: application/json" \
  -d '{"profileId": "3_anF9U2Fmd3afs-rx-Kg", "courseId": "course_web_search"}'
```

**响应：**
```json
{"error": "已报名该课程"}
```

**结果：** ✅ 正常（之前已选过该课程，返回了防重复提示）。  
**备注：** 防重复选课逻辑正常工作。但返回的 HTTP 状态码未确认是否为 4xx（建议返回 409 Conflict 而非默认 200）。

---

## 第 3 步：查看课程详情

**请求：**
```bash
curl -s https://longxiadaxue.com/api/courses/course_web_search
```

**响应（摘要）：**
```json
{
  "success": true,
  "course": {
    "id": "course_web_search",
    "name": "Web 搜索入门",
    "code": "web-search-basics",
    "description": "学会使用搜索引擎获取信息、提取关键内容、整理成报告",
    "module": "搜索与知识获取",
    "category": "基础能力",
    "duration": 120,
    "level": "初级",
    "objectives": ["使用搜索引擎查找信息", "从搜索结果中筛选有价值的内容", "提取网页关键信息", "整理成结构化报告"],
    "lessons": [
      {"title": "搜索引擎原理与 Brave Search API 使用", "duration": 25, "type": "learn"},
      {"title": "搜索技巧：引号精确匹配、site: 限定、filetype: 过滤", "duration": 20, "type": "learn"},
      {"title": "用 web_search + web_fetch 完成一次完整信息检索", "duration": 30, "type": "practice"},
      {"title": "独立完成「AI Agent 市场现状」搜索并输出结构化报告", "duration": 45, "type": "assess"}
    ],
    "prerequisites": [],
    "enrollCount": 1,
    "completionRate": 0,
    "skillContent": "..."
  }
}
```

**结果：** ✅ 正常。课程详情完整，包含 4 个课时（2 学 + 1 练 + 1 考），总时长 120 分钟。  
**备注：** `skillContent` 字段包含完整的 SKILL.md 内容，数据量较大，前端可能不需要全部返回。

---

## 第 4 步：查看我的课程

**请求：**
```bash
curl -s "https://longxiadaxue.com/api/courses/my?profileId=3_anF9U2Fmd3afs-rx-Kg"
```

**响应：**
```json
{
  "success": true,
  "courses": [{
    "studentCourseId": "9UtxrNhI01b_t_WFbPM_j",
    "courseId": "course_web_search",
    "name": "Web 搜索入门",
    "code": "web-search-basics",
    "module": "搜索与知识获取",
    "level": "初级",
    "status": "enrolled",
    "progress": 0,
    "enrolledAt": "2026-03-13T15:18:05.000Z",
    "startedAt": null,
    "completedAt": null
  }]
}
```

**结果：** ✅ 正常。能看到已选课程列表、进度和状态。

---

## 第 5 步：进入学习页面

**请求：**
```bash
curl -s https://longxiadaxue.com/learn/course_web_search
```

**结果：** ✅ 正常。返回完整的 Next.js SSR HTML 页面，包含导航栏（课程、我的课程、排行榜）和加载状态。页面是 CSR 渲染，初始 HTML 显示"加载中..."，实际内容由客户端 JS 渲染。

---

## 第 6 步：测试学习进度 API

### 6a. 课程进度提交 (`/api/courses/progress`)

**请求：**
```bash
curl -s -X POST https://longxiadaxue.com/api/courses/progress \
  -H "Content-Type: application/json" \
  -d '{"studentCourseId": "9UtxrNhI01b_t_WFbPM_j", "lessonIndex": 0, "lessonTitle": "搜索引擎原理与 Brave Search API 使用", "status": "completed"}'
```

**响应：**
```json
{"success": true, "message": "进度更新成功", "progress": 100}
```

**结果：** ⚠️ 功能正常但有问题。  
**问题 1：** 无需认证即可提交进度！只要知道 `studentCourseId` 就能修改任何人的课程进度。  
**问题 2：** 提交 1 个课时（共 4 个）后进度直接变成 100%。原因：进度计算逻辑是 `completedCount / totalCount`，而 `totalCount` 是已有进度记录数（不是课程总课时数），所以 1/1 = 100%。

### 6b. 学习记录提交 (`/api/study-logs`)

**请求：**
```bash
curl -s -X POST https://longxiadaxue.com/api/study-logs \
  -H "Content-Type: application/json" \
  -d '{"taskName": "搜索引擎原理与 Brave Search API 使用", "taskType": "learn", "duration": 25}'
```

**响应：**
```json
{"error": "未登录"}
```

**结果：** ⚠️ 需要 Web 登录 session 认证，API 调用无法直接使用。  
**问题：** 对于 Agent（龙虾）来说，没有浏览器 session，无法通过此 API 记录学习日志。需要支持 profileId 或 accessToken 认证方式。

### 6c. 进度提交后验证

再次查看我的课程：
```json
{
  "status": "completed",
  "progress": 100,
  "completedAt": "2026-03-13T15:21:27.000Z"
}
```

确认进度已更新，但只完成了 1/4 课时就显示 100%。

---

## 已发现的 API 端点清单

| 路径 | 用途 |
|------|------|
| `/api/enrollment/auto` | 自动入学 |
| `/api/enrollment` | 入学管理 |
| `/api/courses` | 选课 |
| `/api/courses/[id]` | 课程详情 |
| `/api/courses/my` | 我的课程 |
| `/api/courses/progress` | 课程进度 |
| `/api/study-logs` | 学习记录（需登录） |
| `/api/assessment` | 考核评估 |
| `/api/certification` | 证书 |
| `/api/certification/generate` | 生成证书 |
| `/api/certification/verify/[id]` | 验证证书 |
| `/api/portfolio` | 作品集 |
| `/api/portfolio/[id]` | 作品详情 |
| `/api/profile/[id]` | 个人档案 |
| `/api/reminder` | 提醒 |
| `/api/skill/enrollment` | 技能入学 |
| `/api/stats` | 统计 |
| `/api/admin/stats` | 管理员统计 |
| `/api/cron/sync` | 定时同步 |
| `/api/auth/[...all]` | 认证 |

---

## 总结

### ✅ 正常流程（4/6）

| 步骤 | 状态 |
|------|------|
| 入学注册 | ✅ 完美，幂等，返回信息丰富 |
| 选课 | ✅ 正常，有防重复 |
| 查看课程详情 | ✅ 完整，含课时安排 |
| 查看我的课程 | ✅ 正常 |
| 学习页面 | ✅ 页面可访问 |

### ⚠️ 有问题的流程（2/6）

| 步骤 | 问题 |
|------|------|
| 课程进度提交 | 无认证 + 进度计算 bug |
| 学习记录提交 | 不支持 Agent 认证方式 |

---

## 改进建议

### 🔴 高优先级

1. **进度计算 bug**：`/api/courses/progress` 的进度百分比应基于课程总课时数（从课程定义中获取），而非已有进度记录数。当前逻辑 `completedCount / allProgress.length` 会导致完成 1 个课时就显示 100%。
   
2. **进度 API 缺少认证**：任何人知道 `studentCourseId` 就能修改进度。应增加 profileId 验证或 accessToken 校验。

### 🟡 中优先级

3. **study-logs 支持 Agent 认证**：当前只支持 Web session 登录。建议增加 `profileId` + `accessToken` 的认证方式，让 Agent 也能提交学习记录。

4. **选课重复的 HTTP 状态码**：重复选课应返回 `409 Conflict` 而非 200，方便客户端区分。

5. **课程详情 API 返回数据过大**：`skillContent` 字段包含完整 SKILL.md 内容（几 KB），建议拆分为单独的 API 或按需加载。

### 🟢 低优先级

6. **学习页面 SSR**：`/learn/course_web_search` 初始渲染只显示"加载中..."，对 SEO 和首屏体验不友好。可考虑服务端预渲染课程基本信息。

7. **缺少课时级别的学习内容 API**：目前没有 API 返回单个课时的学习材料/内容，学习页面的实际教学内容获取方式不明确。

8. **入学 API 的 `enrolledAt` 时间**：返回的是首次入学时间而非本次更新时间，这是正确的，但建议增加 `updatedAt` 字段。
