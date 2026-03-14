#!/usr/bin/env python3
"""
为所有课程生成标准化的 学→练→考 三段式 lessons。
- 已有完整 type 标记的课程：跳过
- 已有 lessons 但没 type 的：重新标记 type
- 没有 lessons 的：根据课程信息自动生成
"""
import sqlite3
import json
import math

DB_PATH = "lobster.db"

def generate_lessons_for_course(name, description, duration, level, category):
    """根据课程信息生成学练考三段式 lessons"""
    total = duration or 90
    
    # 时间分配：学 40%, 练 35%, 考 25%
    learn_time = max(15, math.ceil(total * 0.4))
    practice_time = max(15, math.ceil(total * 0.35))
    assess_time = max(10, math.ceil(total * 0.25))
    
    # 根据课程名称和描述生成具体内容
    lessons = [
        {
            "title": f"学：{name}核心概念与原理",
            "duration": learn_time,
            "type": "learn"
        },
        {
            "title": f"练：{name}实战演练",
            "duration": practice_time,
            "type": "practice"
        },
        {
            "title": f"考：{name}能力验证",
            "duration": assess_time,
            "type": "assess"
        }
    ]
    
    # 高级课程或长课程：拆分为更细的学习单元
    if total >= 150 or level in ("advanced", "高级"):
        learn1_time = math.ceil(learn_time * 0.5)
        learn2_time = learn_time - learn1_time
        practice1_time = math.ceil(practice_time * 0.5)
        practice2_time = practice_time - practice1_time
        
        lessons = [
            {"title": f"学：{name}基础理论", "duration": learn1_time, "type": "learn"},
            {"title": f"学：{name}进阶技巧", "duration": learn2_time, "type": "learn"},
            {"title": f"练：基础实操训练", "duration": practice1_time, "type": "practice"},
            {"title": f"练：综合项目实战", "duration": practice2_time, "type": "practice"},
            {"title": f"考：综合能力评估", "duration": assess_time, "type": "assess"},
        ]
    
    return lessons


def add_types_to_existing(lessons):
    """给已有 lessons 但没 type 的课程补上 type"""
    n = len(lessons)
    if n == 0:
        return lessons
    
    # 按比例分配：前 40% 是学，中间 35% 是练，最后 25% 是考
    learn_end = max(1, math.ceil(n * 0.4))
    practice_end = max(learn_end + 1, math.ceil(n * 0.75))
    
    for i, lesson in enumerate(lessons):
        if "type" not in lesson:
            if i < learn_end:
                lesson["type"] = "learn"
                if not lesson["title"].startswith("学："):
                    lesson["title"] = "学：" + lesson["title"]
            elif i < practice_end:
                lesson["type"] = "practice"
                if not lesson["title"].startswith("练："):
                    lesson["title"] = "练：" + lesson["title"]
            else:
                lesson["type"] = "assess"
                if not lesson["title"].startswith("考："):
                    lesson["title"] = "考：" + lesson["title"]
    
    return lessons


def main():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    cur.execute("SELECT id, name, description, duration, level, category, lessons FROM skill_courses")
    rows = cur.fetchall()
    
    stats = {"skipped": 0, "retagged": 0, "generated": 0}
    
    for cid, name, desc, duration, level, category, lessons_json in rows:
        existing = []
        try:
            existing = json.loads(lessons_json) if lessons_json else []
        except:
            existing = []
        
        # Case 1: Already has type tags — skip
        if existing and all("type" in l for l in existing):
            stats["skipped"] += 1
            continue
        
        # Case 2: Has lessons but no type — retag
        if existing and not all("type" in l for l in existing):
            updated = add_types_to_existing(existing)
            cur.execute("UPDATE skill_courses SET lessons = ? WHERE id = ?",
                       (json.dumps(updated, ensure_ascii=False), cid))
            stats["retagged"] += 1
            continue
        
        # Case 3: No lessons — generate
        new_lessons = generate_lessons_for_course(name, desc, duration, level, category)
        cur.execute("UPDATE skill_courses SET lessons = ? WHERE id = ?",
                   (json.dumps(new_lessons, ensure_ascii=False), cid))
        stats["generated"] += 1
    
    conn.commit()
    conn.close()
    
    print(f"完成！跳过 {stats['skipped']} 门，重标记 {stats['retagged']} 门，新生成 {stats['generated']} 门")
    print(f"总计处理 {len(rows)} 门课程")


if __name__ == "__main__":
    main()