#!/bin/bash
# 课程质量验收脚本 — 教务处 SOP 自动化检查
# 每次课程上架前必须运行

DB="/root/.openclaw/workspace/lobster-university/lobster.db"
ERRORS=()

echo "🔍 课程质量验收 $(date '+%Y-%m-%d %H:%M')"
echo "================================"

# 1. 英文 name（排除技术专有名词和已经是中文的）
EN_NAME=$(sqlite3 "$DB" "SELECT COUNT(*) FROM skill_courses WHERE published = 1 AND name GLOB '*[A-Z]*[a-z]*[A-Z]*' AND name NOT LIKE '%Claude%' AND name NOT LIKE '%DevOps%' AND name NOT LIKE '%GitHub%' AND name NOT LIKE '%TypeScript%' AND name NOT LIKE '%PostgreSQL%' AND name NOT LIKE '%React%' AND name NOT LIKE '%OpenClaw%' AND name NOT LIKE '%Docker%' AND name NOT LIKE '%MCP%' AND name NOT LIKE '%API%' AND name NOT LIKE '%SQL%' AND name NOT LIKE '%Next%' AND name NOT LIKE '%RAG%' AND name NOT LIKE '%SEO%' AND name NOT LIKE '%UI%' AND name NOT LIKE '%UX%' AND name NOT LIKE '%CI/CD%' AND name NOT LIKE '%AI %' AND name NOT LIKE '%AutoGLM%' AND name NOT LIKE '%n8n%' AND name NOT LIKE '%Google%' AND name NOT LIKE '%SimilarWeb%' AND name NOT LIKE '%Prompt%' AND name NOT LIKE '%Bilibili%' AND name NOT LIKE '%Douyin%' AND name NOT LIKE '%Kuaishou%' AND name NOT LIKE '%Livestream%' AND name NOT LIKE '%WeChat%' AND name NOT LIKE '%Weibo%' AND name NOT LIKE '%Xiaohongshu%' AND name NOT LIKE '%Zhihu%' AND name NOT LIKE '%YouTube%' AND name NOT LIKE '%LinkedIn%' AND name NOT LIKE '%Jira%' AND name NOT LIKE '%Solidity%' AND name NOT LIKE '%EVM%' AND name NOT LIKE '%DeFi%' AND name NOT LIKE '%Excel%' AND name NOT LIKE '%Google Scholar%' AND name NOT LIKE '%TikTok%' AND name NOT LIKE '%Python%' AND name NOT LIKE '%Skill%' AND name NOT LIKE '%SaaS%' AND name NOT LIKE '%Composio%' AND name NOT LIKE '%Tmux%' AND name NOT LIKE '%Agent%';")
echo "英文课程名: $EN_NAME 门"
[ "$EN_NAME" -gt 0 ] && ERRORS+=("QA-001: ${EN_NAME}门课程名含英文")

# 2. 英文 description
EN_DESC=$(sqlite3 "$DB" "SELECT COUNT(*) FROM skill_courses WHERE published = 1 AND description NOT LIKE '%的%' AND description NOT LIKE '%学%' AND description NOT LIKE '%能%';")
echo "英文描述: $EN_DESC 门"
[ "$EN_DESC" -gt 0 ] && ERRORS+=("QA-002: ${EN_DESC}门课程描述含英文")

# 3. 模板化 objectives
TEMPLATE_OBJ=$(sqlite3 "$DB" "SELECT COUNT(*) FROM skill_courses WHERE published = 1 AND (objectives LIKE '%核心方法论%' OR objectives LIKE '%核心工作任务%' OR objectives LIKE '%行业标准流程%');")
echo "模板化 objectives: $TEMPLATE_OBJ 门"
[ "$TEMPLATE_OBJ" -gt 0 ] && ERRORS+=("QA-003: ${TEMPLATE_OBJ}门课程 objectives 是模板化的")

# 4. 英文 objectives（排除专有名词）
EN_OBJ=$(sqlite3 "$DB" "SELECT COUNT(*) FROM skill_courses WHERE published = 1 AND (objectives LIKE '%Approach%' OR objectives LIKE '%Framework%' OR objectives LIKE '%Standards%' OR objectives LIKE '%Excellence%' OR objectives LIKE '%Deliverables%' OR objectives LIKE '%Specification%');")
echo "英文 objectives: $EN_OBJ 门"
[ "$EN_OBJ" -gt 0 ] && ERRORS+=("QA-004: ${EN_OBJ}门课程 objectives 含未翻译英文")

# 5. 缺少 lessons
NO_LESSONS=$(sqlite3 "$DB" "SELECT COUNT(*) FROM skill_courses WHERE published = 1 AND (lessons IS NULL OR lessons = '' OR lessons = '[]');")
echo "缺少 lessons: $NO_LESSONS 门"
[ "$NO_LESSONS" -gt 0 ] && ERRORS+=("QA-005: ${NO_LESSONS}门课程缺少 lessons")

# 6. lessons 少于 4 个
FEW_LESSONS=$(sqlite3 "$DB" "SELECT COUNT(*) FROM skill_courses WHERE published = 1 AND lessons IS NOT NULL AND json_array_length(lessons) < 4;")
echo "lessons < 4: $FEW_LESSONS 门"
[ "$FEW_LESSONS" -gt 0 ] && ERRORS+=("QA-006: ${FEW_LESSONS}门课程 lessons 少于4个")

# 7. lessons 格式错误（字符串数组而非对象数组，缺少 title 字段）
BAD_FORMAT=$(sqlite3 "$DB" "SELECT COUNT(*) FROM skill_courses WHERE published = 1 AND lessons IS NOT NULL AND lessons != '' AND lessons != '[]' AND lessons NOT LIKE '%title%';")
echo "lessons 格式错误: $BAD_FORMAT 门"
[ "$BAD_FORMAT" -gt 0 ] && ERRORS+=("QA-007: ${BAD_FORMAT}门课程 lessons 格式错误（缺少title/duration/type字段）")

# 汇总
echo ""
echo "================================"
TOTAL=$(sqlite3 "$DB" "SELECT COUNT(*) FROM skill_courses WHERE published = 1;")
echo "在线课程总数: $TOTAL 门"

if [ ${#ERRORS[@]} -eq 0 ]; then
  echo "✅ 质量验收通过！"
  echo "RESULT:PASS"
else
  echo "❌ 发现 ${#ERRORS[@]} 个质量问题："
  for err in "${ERRORS[@]}"; do
    echo "  ⚠️ $err"
  done
  echo "RESULT:FAIL"
fi
