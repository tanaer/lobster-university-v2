#!/bin/bash
# 排行榜 mock 数据每小时更新 1-2 次

DB="/root/.openclaw/workspace/lobster-university/lobster.db"

# 随机选择 1-2 名学员增加成长值
COUNT=$((RANDOM % 2 + 1))

for i in $(seq 1 $COUNT); do
  # 随机选一个真实学员（非 mock）
  STUDENT=$(sqlite3 "$DB" "SELECT id FROM lobster_profiles WHERE is_mock = 0 ORDER BY RANDOM() LIMIT 1;")
  if [ -n "$STUDENT" ]; then
    # 增加 10-50 点成长值
    GROWTH=$((RANDOM % 41 + 10))
    sqlite3 "$DB" "UPDATE lobster_profiles SET total_study_time = total_study_time + $GROWTH WHERE id = '$STUDENT';"
    echo "$(date '+%H:%M') - $STUDENT +$GROWTH"
  fi
done
