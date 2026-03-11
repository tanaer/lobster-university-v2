---
name: sqlite-basics
description: SQLite 数据库基础课程 - 使用 SQLite 存储和查询数据，掌握创建表、CRUD 操作、复杂查询。触发词：SQLite、数据库、SQL、CRUD、查询
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"数据存储","duration":50,"level":"初级"}
---

# SQLite 数据库基础

> **🤖 这整个文档是给你的 — AI Agent。**

## 🎯 学习目标

完成本课程后，你将能够：

- 创建和管理 SQLite 数据库
- 设计表结构并创建表
- 执行 CRUD（增删改查）操作
- 编写复杂查询（JOIN、子查询、聚合）
- 使用事务保证数据一致性
- 进行数据库备份和恢复

## 📚 课程内容

### 第 1 课：数据库与表操作

**创建数据库和连接**

```python
import sqlite3
from pathlib import Path

# 连接数据库（不存在则创建）
db_path = "myapp.db"
conn = sqlite3.connect(db_path)

# 获取游标
cursor = conn.cursor()

# 设置返回字典格式（可选）
def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

conn.row_factory = dict_factory
cursor = conn.cursor()

print(f"数据库已连接: {db_path}")
```

**创建表**

```python
def create_tables(conn):
    """创建应用表"""
    cursor = conn.cursor()
    
    # 用户表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # 文章表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            author_id INTEGER NOT NULL,
            status TEXT DEFAULT 'draft',
            views INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id)
        )
    ''')
    
    # 标签表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    ''')
    
    # 文章-标签关联表（多对多）
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS article_tags (
            article_id INTEGER,
            tag_id INTEGER,
            PRIMARY KEY (article_id, tag_id),
            FOREIGN KEY (article_id) REFERENCES articles(id),
            FOREIGN KEY (tag_id) REFERENCES tags(id)
        )
    ''')
    
    # 创建索引
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)')
    
    conn.commit()
    print("表创建完成")

# 使用
create_tables(conn)
```

**查看表结构**

```python
def describe_table(conn, table_name):
    """查看表结构"""
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = cursor.fetchall()
    
    print(f"\n表结构: {table_name}")
    print("-" * 60)
    for col in columns:
        print(f"  {col['name']:20} {col['type']:15} {'NOT NULL' if col['notnull'] else ''}")
    
    return columns

def list_tables(conn):
    """列出所有表"""
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    print("数据库中的表:")
    for table in tables:
        print(f"  - {table['name']}")
    
    return tables

list_tables(conn)
describe_table(conn, 'users')
```

**关键要点：**
- sqlite3.connect() 创建/连接数据库
- PRIMARY KEY AUTOINCREMENT 自增主键
- FOREIGN KEY 建立外键关系
- CREATE INDEX 加速查询

### 第 2 课：CRUD 操作

**Create - 插入数据**

```python
def insert_user(conn, username, email, password_hash):
    """插入用户"""
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        ''', (username, email, password_hash))
        
        conn.commit()
        user_id = cursor.lastrowid
        print(f"用户已创建: ID={user_id}, username={username}")
        return user_id
    
    except sqlite3.IntegrityError as e:
        print(f"插入失败: {e}")
        return None

def insert_users_batch(conn, users):
    """批量插入用户"""
    cursor = conn.cursor()
    
    try:
        cursor.executemany('''
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        ''', users)
        
        conn.commit()
        print(f"已插入 {cursor.rowcount} 个用户")
    
    except sqlite3.IntegrityError as e:
        print(f"批量插入失败: {e}")

# 使用
user_id = insert_user(conn, "zhangsan", "zhang@example.com", "hashed123")

users = [
    ("lisi", "lisi@example.com", "hashed456"),
    ("wangwu", "wangwu@example.com", "hashed789"),
]
insert_users_batch(conn, users)
```

**Read - 查询数据**

```python
def get_user_by_id(conn, user_id):
    """根据 ID 查询用户"""
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    return cursor.fetchone()

def get_user_by_username(conn, username):
    """根据用户名查询"""
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    return cursor.fetchone()

def get_all_users(conn, limit=10, offset=0):
    """分页查询所有用户"""
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, username, email, created_at, is_active
        FROM users
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    ''', (limit, offset))
    return cursor.fetchall()

def count_users(conn):
    """统计用户数量"""
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) as count FROM users')
    return cursor.fetchone()['count']

# 使用
user = get_user_by_id(conn, 1)
print(f"用户: {user['username']}, 邮箱: {user['email']}")

users = get_all_users(conn, limit=5)
for u in users:
    print(f"  {u['id']}: {u['username']}")

print(f"总用户数: {count_users(conn)}")
```

**Update - 更新数据**

```python
def update_user_email(conn, user_id, new_email):
    """更新用户邮箱"""
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE users
        SET email = ?
        WHERE id = ?
    ''', (new_email, user_id))
    
    conn.commit()
    
    if cursor.rowcount > 0:
        print(f"用户 {user_id} 邮箱已更新为 {new_email}")
        return True
    else:
        print(f"未找到用户 {user_id}")
        return False

def deactivate_user(conn, user_id):
    """停用用户"""
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE users SET is_active = 0 WHERE id = ?
    ''', (user_id,))
    
    conn.commit()
    return cursor.rowcount > 0

def increment_article_views(conn, article_id):
    """增加文章浏览量"""
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE articles SET views = views + 1 WHERE id = ?
    ''', (article_id,))
    conn.commit()

# 使用
update_user_email(conn, 1, "newemail@example.com")
deactivate_user(conn, 2)
```

**Delete - 删除数据**

```python
def delete_user(conn, user_id):
    """删除用户"""
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    
    if cursor.rowcount > 0:
        print(f"用户 {user_id} 已删除")
        return True
    return False

def delete_inactive_users(conn):
    """删除所有非活跃用户"""
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM users WHERE is_active = 0')
    deleted = cursor.rowcount
    conn.commit()
    
    print(f"已删除 {deleted} 个非活跃用户")
    return deleted

# 软删除（推荐）
def soft_delete_user(conn, user_id):
    """软删除用户（只是标记为已删除）"""
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE users 
        SET is_active = 0, deleted_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (user_id,))
    conn.commit()
    return cursor.rowcount > 0
```

**关键要点：**
- 使用参数化查询（?）防止 SQL 注入
- executemany() 批量操作更高效
- lastrowid 获取插入的自增 ID
- rowcount 获取影响的行数

### 第 3 课：复杂查询与事务

**JOIN 查询**

```python
def get_articles_with_authors(conn):
    """查询文章及作者信息"""
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            a.id,
            a.title,
            a.views,
            a.created_at,
            u.username as author_name,
            u.email as author_email
        FROM articles a
        INNER JOIN users u ON a.author_id = u.id
        ORDER BY a.created_at DESC
    ''')
    return cursor.fetchall()

def get_articles_by_tag(conn, tag_name):
    """根据标签查询文章"""
    cursor = conn.cursor()
    cursor.execute('''
        SELECT DISTINCT a.*
        FROM articles a
        INNER JOIN article_tags at ON a.id = at.article_id
        INNER JOIN tags t ON at.tag_id = t.id
        WHERE t.name = ?
    ''', (tag_name,))
    return cursor.fetchall()

def get_user_statistics(conn):
    """用户统计（文章数、总浏览量）"""
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            u.id,
            u.username,
            COUNT(a.id) as article_count,
            COALESCE(SUM(a.views), 0) as total_views
        FROM users u
        LEFT JOIN articles a ON u.id = a.author_id
        GROUP BY u.id
        ORDER BY article_count DESC
    ''')
    return cursor.fetchall()

# 使用
articles = get_articles_with_authors(conn)
for a in articles:
    print(f"{a['title']} by {a['author_name']} - {a['views']} views")

stats = get_user_statistics(conn)
for s in stats:
    print(f"{s['username']}: {s['article_count']} 篇文章, {s['total_views']} 浏览")
```

**子查询**

```python
def get_popular_authors(conn, min_views=1000):
    """查询高浏览量作者"""
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM users
        WHERE id IN (
            SELECT DISTINCT author_id 
            FROM articles 
            WHERE views > ?
        )
    ''', (min_views,))
    return cursor.fetchall()

def get_articles_above_average_views(conn):
    """查询浏览量高于平均的文章"""
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM articles
        WHERE views > (
            SELECT AVG(views) FROM articles
        )
    ''')
    return cursor.fetchall()

def get_latest_article_per_user(conn):
    """每个用户的最新文章"""
    cursor = conn.cursor()
    cursor.execute('''
        SELECT a.* FROM articles a
        INNER JOIN (
            SELECT author_id, MAX(created_at) as max_date
            FROM articles
            GROUP BY author_id
        ) latest ON a.author_id = latest.author_id 
                 AND a.created_at = latest.max_date
    ''')
    return cursor.fetchall()
```

**聚合函数**

```python
def get_article_stats(conn):
    """文章统计"""
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
            COUNT(CASE WHEN status = 'draft' THEN 1 END) as drafts,
            SUM(views) as total_views,
            AVG(views) as avg_views,
            MAX(views) as max_views,
            MIN(views) as min_views
        FROM articles
    ''')
    return cursor.fetchone()

def get_daily_article_counts(conn, days=7):
    """每日文章发布数"""
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as count
        FROM articles
        WHERE created_at >= DATE('now', ?)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
    ''', (f'-{days} days',))
    return cursor.fetchall()

# 使用
stats = get_article_stats(conn)
print(f"总文章: {stats['total']}, 已发布: {stats['published']}")
print(f"总浏览: {stats['total_views']}, 平均: {stats['avg_views']:.1f}")
```

**事务处理**

```python
def transfer_article(conn, article_id, new_author_id):
    """转移文章（事务示例）"""
    try:
        cursor = conn.cursor()
        
        # 开始事务
        conn.execute('BEGIN TRANSACTION')
        
        # 检查文章是否存在
        cursor.execute('SELECT * FROM articles WHERE id = ?', (article_id,))
        article = cursor.fetchone()
        if not article:
            raise ValueError(f"文章 {article_id} 不存在")
        
        # 检查新作者是否存在
        cursor.execute('SELECT * FROM users WHERE id = ?', (new_author_id,))
        if not cursor.fetchone():
            raise ValueError(f"用户 {new_author_id} 不存在")
        
        # 更新文章作者
        cursor.execute('''
            UPDATE articles SET author_id = ? WHERE id = ?
        ''', (new_author_id, article_id))
        
        # 提交事务
        conn.commit()
        print(f"文章 {article_id} 已转移给用户 {new_author_id}")
        return True
    
    except Exception as e:
        # 回滚事务
        conn.rollback()
        print(f"转移失败: {e}")
        return False

# 使用上下文管理器
def create_article_with_tags(conn, title, content, author_id, tag_names):
    """创建文章并添加标签"""
    with conn:
        cursor = conn.cursor()
        
        # 创建文章
        cursor.execute('''
            INSERT INTO articles (title, content, author_id, status)
            VALUES (?, ?, ?, 'published')
        ''', (title, content, author_id))
        article_id = cursor.lastrowid
        
        # 添加标签
        for tag_name in tag_names:
            # 获取或创建标签
            cursor.execute('''
                INSERT OR IGNORE INTO tags (name) VALUES (?)
            ''', (tag_name,))
            
            cursor.execute('SELECT id FROM tags WHERE name = ?', (tag_name,))
            tag_id = cursor.fetchone()['id']
            
            # 关联文章和标签
            cursor.execute('''
                INSERT INTO article_tags (article_id, tag_id)
                VALUES (?, ?)
            ''', (article_id, tag_id))
        
        print(f"文章已创建: ID={article_id}, 标签={tag_names}")
        return article_id
```

**备份与恢复**

```python
import shutil
from datetime import datetime

def backup_database(db_path, backup_dir="backups"):
    """备份数据库"""
    import os
    os.makedirs(backup_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{backup_dir}/backup_{timestamp}.db"
    
    shutil.copy2(db_path, backup_path)
    print(f"备份已创建: {backup_path}")
    return backup_path

def export_to_sql(conn, output_path):
    """导出为 SQL 文件"""
    with open(output_path, 'w', encoding='utf-8') as f:
        for line in conn.iterdump():
            f.write(f"{line}\n")
    
    print(f"SQL 导出完成: {output_path}")

def import_from_sql(conn, sql_path):
    """从 SQL 文件导入"""
    with open(sql_path, 'r', encoding='utf-8') as f:
        sql = f.read()
    
    conn.executescript(sql)
    conn.commit()
    print(f"SQL 导入完成: {sql_path}")
```

**关键要点：**
- JOIN 连接多表查询
- GROUP BY 分组聚合
- 事务保证操作原子性
- 定期备份重要数据

## ✅ 课程考核

完成以下任务以通过考核：

1. **数据库设计** (30分)
   - 设计一个学生成绩管理系统数据库
   - 创建学生表、课程表、成绩表
   - 添加适当的索引和外键

2. **CRUD 操作** (30分)
   - 插入 5 名学生、3 门课程、15 条成绩记录
   - 实现成绩查询和更新功能
   - 实现学生删除（级联删除成绩）

3. **复杂查询** (40分)
   - 查询每个学生的平均成绩和排名
   - 查询每门课程的最高分、最低分、平均分
   - 查询不及格（<60）的学生名单

**提交物：**
- `schema.sql` - 建表 SQL
- `crud.py` - CRUD 操作代码
- `queries.py` - 复杂查询代码
- `school.db` - 包含测试数据的数据库

## 📖 参考资料

- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [Python sqlite3 文档](https://docs.python.org/3/library/sqlite3.html)
- [SQLite 教程](https://www.sqlitetutorial.net/)
- [DB Browser for SQLite](https://sqlitebrowser.org/) - 可视化工具
