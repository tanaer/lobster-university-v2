---
name: knowledge-graph
description: 知识图谱构建 - 学会使用 Neo4j 构建关系网络、知识图谱。当龙虾需要构建知识图谱、分析关系网络、复杂决策时触发。触发词：知识图谱、Neo4j、关系网络、图数据库。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"数据库与长期记忆","duration":"180分钟","level":"高级","path":"C4","prerequisites":["sqlite-basics","data-cleaning","vector-db"]}
---

# 知识图谱构建

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习使用 Neo4j 构建知识图谱，实现复杂关系分析。

---

## 🎯 学习目标

1. 理解图数据库概念
2. 使用 Neo4j 存储节点和关系
3. 编写 Cypher 查询
4. 构建实际知识图谱

---

## 📚 课程内容

### 第 1 课：图数据库基础

**核心概念**：
```
节点 (Node)     - 实体，如"人物"、"公司"
关系 (Relation) - 实体间的连接
属性 (Property) - 节点/关系的信息
标签 (Label)    - 节点的分类
```

**图模型示例**：
```
(人物:张三)-[:工作于]->(公司:ABC)
(人物:张三)-[:认识]->(人物:李四)
(公司:ABC)-[:位于]->(城市:北京)
```

---

### 第 2 课：Neo4j 安装和使用

**Docker 启动**：
```bash
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest
```

**Node.js 连接**：
```javascript
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
);

const session = driver.session();
```

---

### 第 3 课：Cypher 查询语言

**创建节点**：
```cypher
CREATE (p:Person {name: '张三', age: 30})
CREATE (c:Company {name: 'ABC公司'})
```

**创建关系**：
```cypher
MATCH (p:Person {name: '张三'})
MATCH (c:Company {name: 'ABC公司'})
CREATE (p)-[:WORKS_AT {since: 2020}]->(c)
```

**查询**：
```cypher
// 查找张三的所有关系
MATCH (p:Person {name: '张三'})-[r]->(target)
RETURN p, r, target

// 查找所有同事
MATCH (p1:Person)-[:WORKS_AT]->(c:Company)<-[:WORKS_AT]-(p2:Person)
WHERE p1.name = '张三'
RETURN p2.name
```

---

### 第 4 课：构建知识图谱

**领域建模**：
```javascript
async function buildKnowledgeGraph(data) {
  const session = driver.session();
  
  // 创建实体节点
  for (const entity of data.entities) {
    await session.run(`
      MERGE (n:${entity.type} {id: $id})
      SET n += $properties
    `, { id: entity.id, properties: entity.properties });
  }
  
  // 创建关系
  for (const rel of data.relations) {
    await session.run(`
      MATCH (a {id: $from})
      MATCH (b {id: $to})
      MERGE (a)-[r:${rel.type}]->(b)
    `, { from: rel.from, to: rel.to });
  }
  
  await session.close();
}
```

**应用场景**：
- 供应链追踪
- 社交网络分析
- 知识推理
- 推荐系统

---

## ✅ 课程考核

**任务**: 构建一个公司知识图谱：

1. 创建节点：公司、人物、产品
2. 创建关系：工作于、生产、合作
3. 查询：找出某公司的所有员工
4. 查询：找出两个人之间的最短路径

---

## 📖 参考资料

- Cypher 语法手册
- 图算法介绍
