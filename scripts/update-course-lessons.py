#!/usr/bin/env python3
"""
教务处工具：将教授设计的 lessons JSON 写入数据库
用法: python3 update-course-lessons.py <course_id> '<lessons_json>'
"""
import sqlite3
import json
import sys

DB_PATH = "/root/.openclaw/workspace/lobster-university/lobster.db"

def update(course_id, lessons_json):
    lessons = json.loads(lessons_json)
    # 验证格式
    for l in lessons:
        assert "title" in l, f"缺少 title: {l}"
        assert "duration" in l, f"缺少 duration: {l}"
        assert "type" in l and l["type"] in ("learn", "practice", "assess"), f"type 必须是 learn/practice/assess: {l}"
    
    conn = sqlite3.connect(DB_PATH)
    conn.execute("UPDATE skill_courses SET lessons = ? WHERE id = ?",
                (json.dumps(lessons, ensure_ascii=False), course_id))
    conn.commit()
    conn.close()
    print(f"✓ {course_id} 已更新 {len(lessons)} 个课时")

if __name__ == "__main__":
    if len(sys.argv) == 3:
        update(sys.argv[1], sys.argv[2])
    else:
        # 批量模式：从 stdin 读取 JSON lines，每行 {"id": "...", "lessons": [...]}
        for line in sys.stdin:
            line = line.strip()
            if not line:
                continue
            data = json.loads(line)
            update(data["id"], json.dumps(data["lessons"], ensure_ascii=False))
