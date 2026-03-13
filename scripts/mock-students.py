#!/usr/bin/env python3
"""龙虾大学 Mock 学员生成器
用法:
  python3 mock-students.py init     # 初始化 1000+ 学员
  python3 mock-students.py batch    # 新增 20-50 个学员（cron 调用）
"""

import sqlite3
import random
import string
import sys
import time
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lobster.db')

# 中文姓名库
SURNAMES = ['王','李','张','刘','陈','杨','赵','黄','周','吴','徐','孙','胡','朱','高',
            '林','何','郭','马','罗','梁','宋','郑','谢','韩','唐','冯','于','董','萧',
            '程','曹','袁','邓','许','傅','沈','曾','彭','吕','苏','卢','蒋','蔡','贾',
            '丁','魏','薛','叶','阎','余','潘','杜','戴','夏','钟','汪','田','任','姜',
            '范','方','石','姚','谭','廖','邹','熊','金','陆','郝','孔','白','崔','康',
            '毛','邱','秦','江','史','顾','侯','邵','孟','龙','万','段','雷','钱','汤']

GIVEN_NAMES = ['伟','芳','娜','秀英','敏','静','丽','强','磊','洋','艳','勇','军','杰',
               '娟','涛','明','超','秀兰','霞','平','刚','桂英','文','云','华','梅','鑫',
               '建华','玲','建国','建军','桂兰','玉兰','英','志强','建平','小红','志明',
               '浩','宇','子涵','欣怡','梓涵','一诺','思远','雨泽','子轩','紫萱','若曦',
               '天翔','晨曦','雅琪','博文','嘉怡','皓轩','诗涵','泽宇','心怡','俊杰',
               '雨萱','子墨','语桐','奕辰','可馨','昊天','思琪','宇航','梦瑶','浩然']

# 邮箱域名
DOMAINS = ['qq.com','163.com','126.com','gmail.com','outlook.com','foxmail.com',
           'sina.com','sohu.com','yeah.net','hotmail.com','icloud.com','aliyun.com']

# 头像 URL 模板（使用 DiceBear API）
AVATAR_URL = 'https://api.dicebear.com/7.x/thumbs/svg?seed={seed}'

def gen_id(length=21):
    chars = string.ascii_letters + string.digits + '-_'
    return ''.join(random.choices(chars, k=length))

def gen_name():
    return random.choice(SURNAMES) + random.choice(GIVEN_NAMES)

def gen_email(name_pinyin):
    num = random.randint(1, 9999)
    return f"{name_pinyin}{num}@{random.choice(DOMAINS)}"

def gen_student_id(index):
    year = random.choice([2024, 2025, 2026])
    return f"LX{year}{index:05d}"

def gen_timestamp_range(days_ago_min=1, days_ago_max=180):
    now = int(time.time())
    offset = random.randint(days_ago_min * 86400, days_ago_max * 86400)
    return now - offset

def create_student(conn, index):
    uid = gen_id()
    name = gen_name()
    # 简单拼音（用随机字母代替）
    pinyin = ''.join(random.choices(string.ascii_lowercase, k=random.randint(4, 8)))
    email = gen_email(pinyin)
    created_at = gen_timestamp_range(1, 180)
    updated_at = created_at + random.randint(0, 86400 * 30)
    level = random.choices([1,2,3,4,5,6,7,8,9,10], 
                           weights=[30,25,15,10,8,5,3,2,1,1])[0]
    exp = level * random.randint(50, 200)
    streak = random.randint(0, min(level * 5, 30))
    total_study = random.randint(0, level * 60)
    avatar = AVATAR_URL.format(seed=uid[:8])
    
    # 插入 users
    conn.execute("""
        INSERT OR IGNORE INTO users (id, name, email, email_verified, image, created_at, updated_at, level, exp, streak, total_study_time)
        VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
    """, (uid, name, email, avatar, created_at, updated_at, level, exp, streak, total_study))
    
    # 插入 lobster_profiles
    student_id = gen_student_id(index)
    completed_tasks = random.randint(0, level * 10)
    portfolio_items = random.randint(0, max(1, level - 2))
    
    conn.execute("""
        INSERT OR IGNORE INTO lobster_profiles (id, user_id, name, avatar, student_id, enrolled_at, daily_study_minutes, total_study_time, completed_tasks, portfolio_items, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    """, (gen_id(), uid, name, avatar, student_id, created_at, 
          random.choice([15, 30, 45, 60]), total_study, completed_tasks, portfolio_items,
          created_at, updated_at))
    
    # 随机选课（1-5 门）
    courses = conn.execute("SELECT id FROM courses").fetchall()
    if courses:
        num_courses = random.randint(1, min(5, len(courses)))
        selected = random.sample(courses, num_courses)
        for course in selected:
            progress = random.randint(0, 100)
            chapters = random.randint(0, 10)
            conn.execute("""
                INSERT OR IGNORE INTO enrollments (id, user_id, course_id, progress, completed_chapters, last_accessed_at, enrolled_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (gen_id(), uid, course[0], progress, chapters,
                  updated_at, created_at))
    
    return name

def init_students(conn, count=1200):
    """初始化批量学员"""
    existing = conn.execute("SELECT count(*) FROM users").fetchone()[0]
    print(f"当前学员数: {existing}")
    
    names = []
    for i in range(count):
        name = create_student(conn, existing + i + 1)
        names.append(name)
        if (i + 1) % 100 == 0:
            conn.commit()
            print(f"  已创建 {i+1}/{count}...")
    
    conn.commit()
    new_total = conn.execute("SELECT count(*) FROM users").fetchone()[0]
    enrollments = conn.execute("SELECT count(*) FROM enrollments").fetchone()[0]
    print(f"✅ 完成! 新增 {count} 学员, 总计 {new_total} 学员, {enrollments} 条选课记录")

def batch_students(conn):
    """新增一批学员（20-50个）"""
    count = random.randint(20, 50)
    existing = conn.execute("SELECT count(*) FROM users").fetchone()[0]
    
    for i in range(count):
        create_student(conn, existing + i + 1)
    
    conn.commit()
    new_total = conn.execute("SELECT count(*) FROM users").fetchone()[0]
    print(f"✅ 新增 {count} 学员, 总计 {new_total}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python3 mock-students.py [init|batch]")
        sys.exit(1)
    
    conn = sqlite3.connect(DB_PATH)
    
    if sys.argv[1] == 'init':
        init_students(conn, count=1200)
    elif sys.argv[1] == 'batch':
        batch_students(conn)
    else:
        print(f"未知命令: {sys.argv[1]}")
        sys.exit(1)
    
    conn.close()
