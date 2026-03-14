#!/bin/bash
# 龙虾大学全流程自动巡检脚本
# IT部门维护 | 每日执行

set -euo pipefail
DB="/root/.openclaw/workspace/lobster-university/lobster.db"
BASE="https://longxiadaxue.com/api"
ERRORS=()

echo "🔍 龙虾大学巡检开始 $(date '+%Y-%m-%d %H:%M')"
echo "================================"

# CHECK-DATA-001: 数据库表一致性
echo ""
echo "📊 CHECK-DATA-001: 数据一致性"
COURSES_COUNT=$(sqlite3 "$DB" "SELECT COUNT(*) FROM courses;")
SKILL_COUNT=$(sqlite3 "$DB" "SELECT COUNT(*) FROM skill_courses WHERE published = 1;")
UNSYNC=$(sqlite3 "$DB" "SELECT COUNT(*) FROM courses c LEFT JOIN skill_courses sc ON c.title = sc.name WHERE sc.id IS NULL;")
echo "  courses表: $COURSES_COUNT | skill_courses表: $SKILL_COUNT | 未同步: $UNSYNC"
if [ "$UNSYNC" -gt 0 ]; then
  ERRORS+=("DATA-001: ${UNSYNC}门课程未同步到skill_courses")
fi

# CHECK-DATA-002: 学员数据
echo ""
echo "👤 CHECK-DATA-002: 学员数据"
STUDENTS=$(sqlite3 "$DB" "SELECT COUNT(*) FROM lobster_profiles;")
NO_TOKEN=$(sqlite3 "$DB" "SELECT COUNT(*) FROM lobster_profiles WHERE access_token IS NULL OR access_token = '';")
echo "  学员: $STUDENTS | 缺token: $NO_TOKEN"
if [ "$NO_TOKEN" -gt 0 ]; then
  ERRORS+=("DATA-002: ${NO_TOKEN}名学员缺少access_token")
fi

# CHECK-API-001: API 可用性
echo ""
echo "🌐 CHECK-API-001: API可用性"
for endpoint in "/courses" "/enrollment/auto" "/reminder"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${BASE}${endpoint}" 2>/dev/null || echo "000")
  if [ "$STATUS" = "200" ]; then
    echo "  ✅ ${endpoint} → HTTP $STATUS"
  else
    echo "  ❌ ${endpoint} → HTTP $STATUS"
    ERRORS+=("API-001: ${endpoint} 返回 HTTP $STATUS")
  fi
done

# CHECK-API-002: API 数据一致
echo ""
echo "📈 CHECK-API-002: API数据一致性"
API_COUNT=$(curl -s --max-time 10 "${BASE}/courses" 2>/dev/null | python3 -c "
import sys,json
try:
    d=json.load(sys.stdin)
    courses=d if isinstance(d,list) else d.get('courses',[])
    print(len(courses))
except:
    print(0)
" 2>/dev/null || echo "0")
echo "  API: $API_COUNT | DB: $SKILL_COUNT"
if [ "$API_COUNT" != "$SKILL_COUNT" ]; then
  ERRORS+=("API-002: API课程数($API_COUNT) ≠ DB课程数($SKILL_COUNT)")
fi

# CHECK-SEC-001: 安全检查
echo ""
echo "🔒 CHECK-SEC-001: 安全检查"
SEC_STATUS=$(curl -s -X POST "${BASE}/courses/progress" \
  -H "Content-Type: application/json" \
  -d '{"studentCourseId":"test","lessonIndex":0,"status":"completed"}' \
  -o /dev/null -w "%{http_code}" --max-time 10 2>/dev/null || echo "000")
if [ "$SEC_STATUS" = "400" ]; then
  echo "  ✅ 进度API认证正常 (无profileId → 400)"
else
  echo "  ❌ 进度API认证异常 (无profileId → $SEC_STATUS, 应为400)"
  ERRORS+=("SEC-001: 进度API无认证返回$SEC_STATUS而非400")
fi

# CHECK-SVC-001: 服务健康
echo ""
echo "🖥️ CHECK-SVC-001: 服务健康"
pgrep -f "next-server" > /dev/null && echo "  ✅ Next.js 运行中" || { echo "  ❌ Next.js 未运行"; ERRORS+=("SVC-001: Next.js未运行"); }
ss -tlnp | grep 18789 > /dev/null && echo "  ✅ OpenClaw主实例 运行中" || { echo "  ❌ OpenClaw主实例 未运行"; ERRORS+=("SVC-001: OpenClaw主实例未运行"); }
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}')
echo "  📁 磁盘使用: $DISK_USAGE"

# 汇总
echo ""
echo "================================"
if [ ${#ERRORS[@]} -eq 0 ]; then
  echo "✅ 巡检通过！所有检查项正常。"
  echo "RESULT:PASS"
else
  echo "❌ 发现 ${#ERRORS[@]} 个问题："
  for err in "${ERRORS[@]}"; do
    echo "  ⚠️ $err"
  done
  echo "RESULT:FAIL"
fi
