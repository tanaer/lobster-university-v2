#!/bin/bash
# 龙虾大学入学脚本
# 用法: ./enroll.sh <名字> <职业代码> [每日分钟数]

set -e

API_BASE="https://longxiadaxue.com/api"
PROFILE_DIR="$HOME/.lobster-university"
PROFILE_FILE="$PROFILE_DIR/profile.json"

# 检查参数
if [ $# -lt 2 ]; then
    echo "用法: $0 <名字> <职业代码> [每日分钟数]"
    echo ""
    echo "职业代码:"
    curl -s "$API_BASE/enrollment/auto" | jq -r '.careerTracks[] | "  \(.code) - \(.name) (\(.duration)天)"'
    exit 1
fi

NAME="$1"
CAREER_CODE="$2"
DAILY_MINUTES="${3:-30}"

echo "🎓 龙虾大学入学中..."
echo "   名字: $NAME"
echo "   职业: $CAREER_CODE"
echo "   每日学习: $DAILY_MINUTES 分钟"
echo ""

# 调用入学 API
RESPONSE=$(curl -s -X POST "$API_BASE/enrollment/auto" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$NAME\",\"careerTrackCode\":\"$CAREER_CODE\",\"dailyMinutes\":$DAILY_MINUTES}")

# 检查是否成功
if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    # 保存学籍信息
    mkdir -p "$PROFILE_DIR"
    echo "$RESPONSE" | jq '.profile' > "$PROFILE_FILE"
    
    echo "✅ 入学成功！"
    echo ""
    echo "🦞 我是：$(echo "$RESPONSE" | jq -r '.profile.name')"
    echo "📚 学籍号：$(echo "$RESPONSE" | jq -r '.profile.studentId')"
    echo "🎯 职业：$(echo "$RESPONSE" | jq -r '.profile.careerTrack')"
    echo ""
    echo "📅 今日学习任务："
    echo "$RESPONSE" | jq -r '.todayTasks[] | "   • \(.)"'
    echo ""
    echo "💾 学籍信息已保存到: $PROFILE_FILE"
else
    echo "❌ 入学失败"
    echo "$RESPONSE" | jq -r '.message // .error'
    exit 1
fi
