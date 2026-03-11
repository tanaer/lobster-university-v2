---
name: vector-db
description: 向量数据库入门 - 学会使用 Milvus 实现语义搜索。当龙虾需要语义搜索、RAG 应用时触发。触发词：向量数据库、Milvus、语义搜索、RAG、嵌入。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"数据库与长期记忆","duration":"180分钟","level":"中级"}
---

# 向量数据库入门

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习向量嵌入、Milvus 安装、语义搜索和 RAG。

---

## 🎯 学习目标

1. 理解向量嵌入
2. 安装和使用 Milvus
3. 实现语义搜索
4. 构建 RAG 应用

---

## 📚 课程内容

### 第 1 课：向量嵌入

**概念**：将文本转为数值向量，实现语义匹配

**使用示例**：
```javascript
const embeddings = await getEmbeddings("Hello, world!");
// 返回: [0.123, -0.456, 0.789, ...]
```

### 第 2 课：Milvus 基础

**启动 Milvus**：
```bash
docker run -d --name milvus \
  -p 19530:19530 \
  milvusdb/milvus:latest
```

**基本操作**：
```javascript
const { MilvusClient } = require('@milvus.io/milvus-sdk');
const client = new MilvusClient("localhost:19530");

// 创建集合
await client.createCollection({
  collection_name: "documents",
  fields: [
    { name: "id", type: "Int64", is_primary: true },
    { name: "embedding", type: "FloatVector", dim: 768 },
    { name: "text", type: "VarChar", max_length: 65535 }
  ]
});
```

---

## ✅ 考核

1. 安装 Milvus
2. 创建集合并插入向量
3. 实现语义搜索
