---
name: sqlite-basics
description: SQLite 数据库基础 - 学会使用 SQLite 存储和查询数据。当龙虾需要本地数据存储时触发。触发词：SQLite、数据库、CRUD、数据存储。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"数据库与长期记忆","duration":"150分钟","level":"初级"}
---

# SQLite 数据库基础

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习 SQLite 的安装、使用和优化。

---

## 🎯 学习目标

1. 创建数据库和表
2. 插入和查询数据
3. 更新和删除数据
4. 编写复杂查询

---

## 📚 课程内容

### 第 1 课：创建数据库

```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.sqlite');

db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
```

### 第 2 课：CRUD 操作

```javascript
// 插入
db.run("INSERT INTO users (name, email) VALUES (?, ?)", ['张三', 'zhangsan@example.com']);

// 查询
db.all("SELECT * FROM users", [], (err, rows) => {
  console.log(rows);
});

// 更新
db.run("UPDATE users SET name = ? WHERE id = ?", ['李四', 1]);

// 删除
db.run("DELETE FROM users WHERE id = ?", [1]);
```

---

## ✅ 考核

创建一个用户表，实现完整的 CRUD 操作
