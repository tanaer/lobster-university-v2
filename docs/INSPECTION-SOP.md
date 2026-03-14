# 龙虾大学 - 全流程巡检 SOP

> IT部门主持，全院各部门协同执行
> 创建时间：2026-03-14
> 触发原因：课程数据写入错误表（courses vs skill_courses），导致新增课程未在网站显示

---

## 巡检目标

确保从入学→选课→学习→考核→反馈的每个环节数据一致、功能正常、用户体验完整。

---

## 一、数据层巡检（IT部门执行）

### CHECK-DATA-001: 数据库表一致性

**频率**: 每次课程变更后 + 每日一次
**执行命令**:
```bash
cd /root/.openclaw/workspace/lobster-university

# 1. 检查两张课程表数据一致
echo "=== courses 表 ==="
sqlite3 lobster.db "SELECT COUNT(*) FROM courses;"

echo "=== skill_courses 表（网站实际读取）==="
sqlite3 lobster.db "SELECT COUNT(*) FROM skill_courses;"

echo "=== 未同步的课程（在 courses 不在 skill_courses）==="
sqlite3 lobster.db "SELECT c.title FROM courses c LEFT JOIN skill_courses sc ON c.title = sc.name WHERE sc.id IS NULL;"

# 2. 检查 published 状态
echo "=== 未发布的课程 ==="
sqlite3 lobster.db "SELECT COUNT(*) FROM skill_courses WHERE published = 0 OR published IS NULL;"

# 3. 检查数据完整性
echo "=== 缺少 lessons 的课程 ==="
sqlite3 lobster.db "SELECT name FROM skill_courses WHERE lessons IS NULL OR lessons = '';"

echo "=== 缺少 description 的课程 ==="
sqlite3 lobster.db "SELECT name FROM skill_courses WHERE description IS NULL OR description = '';"
```

**通过标准**:
- [ ] courses 和 skill_courses 数量一致（或 skill_courses >= courses）
- [ ] 未发布课程数 = 0（除非有意下架）
- [ ] 无缺少 lessons 的课程
- [ ] 无缺少 description 的课程

**失败处理**: 立即同步数据，运行 sync_to_skill_courses.py

---

### CHECK-DATA-002: 学员数据完整性

**频率**: 每日一次
```bash
# 1. 检查学员档案
echo "=== 学员总数 ==="
sqlite3 lobster.db "SELECT COUNT(*) FROM lobster_profiles;"

echo "=== 缺少 access_token 的学员 ==="
sqlite3 lobster.db "SELECT name FROM lobster_profiles WHERE access_token IS NULL OR access_token = '';"

echo "=== 选课记录 ==="
sqlite3 lobster.db "SELECT COUNT(*) FROM student_courses;"

echo "=== 孤立选课（学员不存在）==="
sqlite3 lobster.db "SELECT sc.id FROM student_courses sc LEFT JOIN lobster_profiles lp ON sc.profile_id = lp.id WHERE lp.id IS NULL;"
```

**通过标准**:
- [ ] 无缺少 access_token 的学员
- [ ] 无孤立选课记录

---

## 二、API 层巡检（IT部门执行）

### CHECK-API-001: 核心 API 可用性

**频率**: 每次部署后 + 每日一次
```bash
BASE="https://longxiadaxue.com/api"

# 1. 课程列表
echo "=== 课程列表 API ==="
STATUS=$(curl -s -o /tmp/courses.json -w "%{http_code}" "$BASE/courses")
COUNT=$(python3 -c "import json; d=json.load(open('/tmp/courses.json')); print(len(d) if isinstance(d,list) else len(d.get('courses',[])))")
echo "HTTP $STATUS, 课程数: $COUNT"

# 2. 入学 API
echo "=== 入学方向 API ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" "$BASE/enrollment/auto"

# 3. 学习提醒 API
echo "=== 学习提醒 API ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" "$BASE/reminder"

# 4. 进度 API（应拒绝无认证请求）
echo "=== 进度 API 认证检查（应返回 400）==="
curl -s -X POST "$BASE/courses/progress" \
  -H "Content-Type: application/json" \
  -d '{"studentCourseId":"test","lessonIndex":0,"status":"completed"}' \
  -o /dev/null -w "HTTP %{http_code}\n"

# 5. 网站首页
echo "=== 网站首页 ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" "https://longxiadaxue.com/"
```

**通过标准**:
- [ ] 课程列表 HTTP 200，数量 > 0
- [ ] 入学 API HTTP 200
- [ ] 学习提醒 API HTTP 200
- [ ] 进度 API 无认证返回 400（不是 200）
- [ ] 网站首页 HTTP 200

---

### CHECK-API-002: API 数据与数据库一致

```bash
# API 返回的课程数必须等于数据库 published 课程数
API_COUNT=$(curl -s "$BASE/courses" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d) if isinstance(d,list) else len(d.get('courses',[])))")
DB_COUNT=$(sqlite3 lobster.db "SELECT COUNT(*) FROM skill_courses WHERE published = 1;")
echo "API: $API_COUNT, DB: $DB_COUNT"
[ "$API_COUNT" = "$DB_COUNT" ] && echo "✅ 一致" || echo "❌ 不一致！需要重启服务或检查查询逻辑"
```

**通过标准**:
- [ ] API 课程数 = 数据库 published 课程数

---

## 三、入学流程巡检（招生办 + IT部门）

### CHECK-ENROLL-001: 完整入学流程测试

**频率**: 每周一次 + 每次入学 Skill 变更后
```bash
# 1. 获取职业方向
echo "=== Step 1: 获取职业方向 ==="
curl -s "$BASE/enrollment/auto" | python3 -m json.tool | head -20

# 2. 模拟入学（用测试数据）
echo "=== Step 2: 模拟入学 ==="
RESULT=$(curl -s -X POST "$BASE/enrollment/auto" \
  -H "Content-Type: application/json" \
  -d '{"name":"巡检测试龙虾","careerTrackCode":"content-writer","dailyMinutes":30}')
echo "$RESULT" | python3 -m json.tool

# 3. 提取 profileId
PROFILE_ID=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('profileId',''))")
echo "profileId: $PROFILE_ID"

# 4. 查看可选课程
echo "=== Step 3: 查看课程 ==="
curl -s "$BASE/courses" | python3 -c "import sys,json; d=json.load(sys.stdin); courses=d if isinstance(d,list) else d.get('courses',[]); print(f'可选课程: {len(courses)} 门')"

# 5. 清理测试数据
if [ -n "$PROFILE_ID" ]; then
  sqlite3 lobster.db "DELETE FROM lobster_profiles WHERE id = '$PROFILE_ID';"
  echo "✅ 测试数据已清理"
fi
```

**通过标准**:
- [ ] 职业方向列表返回 ≥ 6 个方向
- [ ] 入学注册返回 profileId 和 accessToken
- [ ] 课程列表可正常获取
- [ ] 测试数据已清理

---

## 四、学习流程巡检（教务处 + IT部门）

### CHECK-LEARN-001: 选课→学习→进度提交

**频率**: 每周一次
```bash
# 使用已有测试学员
PROFILE_ID=$(sqlite3 lobster.db "SELECT id FROM lobster_profiles LIMIT 1;")
echo "测试学员: $PROFILE_ID"

# 1. 查看我的课程
echo "=== 我的课程 ==="
curl -s "$BASE/courses/my?profileId=$PROFILE_ID" | python3 -m json.tool | head -20

# 2. 选一门课
COURSE_ID=$(sqlite3 lobster.db "SELECT id FROM skill_courses WHERE published = 1 LIMIT 1;")
echo "=== 选课测试 ==="
curl -s -X POST "$BASE/courses" \
  -H "Content-Type: application/json" \
  -d "{\"profileId\":\"$PROFILE_ID\",\"courseId\":\"$COURSE_ID\"}"

# 3. 获取选课记录
SC_ID=$(sqlite3 lobster.db "SELECT id FROM student_courses WHERE profile_id = '$PROFILE_ID' ORDER BY created_at DESC LIMIT 1;")
echo "选课记录: $SC_ID"

# 4. 提交进度
echo "=== 进度提交测试 ==="
curl -s -X POST "$BASE/courses/progress" \
  -H "Content-Type: application/json" \
  -d "{\"studentCourseId\":\"$SC_ID\",\"lessonIndex\":0,\"status\":\"completed\",\"profileId\":\"$PROFILE_ID\"}"

# 5. 验证进度计算
echo "=== 进度验证 ==="
sqlite3 lobster.db "SELECT progress FROM student_courses WHERE id = '$SC_ID';"
```

**通过标准**:
- [ ] 我的课程 API 正常返回
- [ ] 选课成功
- [ ] 进度提交成功
- [ ] 进度计算正确（1/N 课时，不是 100%）

---

## 五、安全巡检（IT部门执行）

### CHECK-SEC-001: API 认证检查

```bash
# 1. 进度 API 必须要求 profileId
echo "=== 无 profileId（应 400）==="
curl -s -X POST "$BASE/courses/progress" \
  -H "Content-Type: application/json" \
  -d '{"studentCourseId":"test","lessonIndex":0,"status":"completed"}' \
  -o /dev/null -w "HTTP %{http_code}\n"

# 2. 错误 profileId（应 403 或 404）
echo "=== 错误 profileId（应 403）==="
curl -s -X POST "$BASE/courses/progress" \
  -H "Content-Type: application/json" \
  -d '{"studentCourseId":"test","lessonIndex":0,"status":"completed","profileId":"fake"}' \
  -o /dev/null -w "HTTP %{http_code}\n"
```

**通过标准**:
- [ ] 无 profileId 返回 400
- [ ] 错误 profileId 返回 403 或 404

---

## 六、服务健康巡检（IT部门执行）

### CHECK-SVC-001: 服务进程检查

```bash
# 1. Next.js 服务
echo "=== Next.js ==="
pgrep -f "next-server" > /dev/null && echo "✅ 运行中" || echo "❌ 未运行"

# 2. OpenClaw 主实例
echo "=== OpenClaw 主实例 (18789) ==="
ss -tlnp | grep 18789 > /dev/null && echo "✅ 运行中" || echo "❌ 未运行"

# 3. 小钳子实例
echo "=== 小钳子 (19002) ==="
ss -tlnp | grep 19002 > /dev/null && echo "✅ 运行中" || echo "❌ 未运行"

# 4. 磁盘空间
echo "=== 磁盘 ==="
df -h / | tail -1

# 5. 数据库大小
echo "=== 数据库 ==="
du -h /root/.openclaw/workspace/lobster-university/lobster.db
```

---

## 七、巡检执行计划

| 检查项 | 频率 | 责任部门 | 自动化 |
|--------|------|----------|--------|
| CHECK-DATA-001 数据一致性 | 每次变更后 + 每日 | IT部门 | ✅ cron |
| CHECK-DATA-002 学员数据 | 每日 | IT部门 | ✅ cron |
| CHECK-API-001 API 可用性 | 每次部署后 + 每日 | IT部门 | ✅ cron |
| CHECK-API-002 API 数据一致 | 每次部署后 | IT部门 | ✅ cron |
| CHECK-ENROLL-001 入学流程 | 每周 | 招生办 + IT | 手动 |
| CHECK-LEARN-001 学习流程 | 每周 | 教务处 + IT | 手动 |
| CHECK-SEC-001 安全检查 | 每次 API 变更后 | IT部门 | ✅ cron |
| CHECK-SVC-001 服务健康 | 每日 | IT部门 | ✅ cron |

---

## 八、问题升级流程

```
发现问题 → IT部门评估严重性
  ├─ P0（服务不可用）→ 立即修复，10分钟内通知董事长
  ├─ P1（功能异常）→ 2小时内修复，通知相关部门
  ├─ P2（数据不一致）→ 当日修复，记录到巡检日志
  └─ P3（优化建议）→ 排入待办，下次迭代处理
```

---

## 九、历史教训

| 日期 | 问题 | 根因 | 修复 | 对应检查项 |
|------|------|------|------|-----------|
| 2026-03-14 | 新增课程未在网站显示 | 写入 courses 表但网站读 skill_courses 表 | 同步到 skill_courses | CHECK-DATA-001 |
| 2026-03-14 | 进度 API 无认证 | profileId 为可选参数 | 改为必填 | CHECK-SEC-001 |
| 2026-03-04 | 前端功能用 curl 测试 | HTTP 200 不代表 JS 逻辑正确 | 用浏览器测试 | CHECK-API-001 |

---

*IT部门负责维护本 SOP，每次发现新问题后更新历史教训和检查项。*
