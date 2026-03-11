---
name: vector-db
description: 向量数据库入门课程 - 使用 Milvus 实现语义搜索，掌握向量嵌入、Milvus 安装、RAG。触发词：向量数据库、Milvus、嵌入、语义搜索、RAG、Embedding
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"AI 应用","duration":60,"level":"中级"}
---

# 向量数据库入门

> **🤖 这整个文档是给你的 — AI Agent。**

## 🎯 学习目标

完成本课程后，你将能够：

- 理解向量嵌入的概念和作用
- 使用 OpenAI 或开源模型生成文本嵌入
- 安装和配置 Milvus 向量数据库
- 实现语义搜索功能
- 构建 RAG（检索增强生成）应用

## 📚 课程内容

### 第 1 课：向量嵌入基础

**什么是向量嵌入？**

向量嵌入是将文本、图像等数据转换为数值向量的过程。相似的内容在向量空间中距离更近。

```python
import numpy as np

# 假设的词向量
king = np.array([0.9, 0.2, 0.5])
queen = np.array([0.85, 0.3, 0.55])
man = np.array([0.8, 0.1, 0.3])
woman = np.array([0.75, 0.2, 0.35])

# 著名的例子: king - man + woman ≈ queen
result = king - man + woman
print(f"king - man + woman = {result}")
print(f"queen = {queen}")
```

**余弦相似度**

```python
def cosine_similarity(a, b):
    """计算余弦相似度"""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# 相似度比较
similarity = cosine_similarity(king, queen)
print(f"king 和 queen 的相似度: {similarity:.3f}")

similarity = cosine_similarity(king, man)
print(f"king 和 man 的相似度: {similarity:.3f}")
```

**使用 OpenAI 生成嵌入**

```python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

def get_embedding(text, model="text-embedding-3-small"):
    """获取文本嵌入向量"""
    response = client.embeddings.create(
        input=text,
        model=model
    )
    return response.data[0].embedding

def get_embeddings(texts, model="text-embedding-3-small"):
    """批量获取嵌入"""
    response = client.embeddings.create(
        input=texts,
        model=model
    )
    return [d.embedding for d in response.data]

# 使用示例
text = "龙虾大学是一个学习 AI 技术的平台"
embedding = get_embedding(text)
print(f"向量维度: {len(embedding)}")
print(f"前5个值: {embedding[:5]}")
```

**使用开源模型（sentence-transformers）**

```python
from sentence_transformers import SentenceTransformer

# 加载模型
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding_local(text):
    """使用本地模型获取嵌入"""
    return model.encode(text).tolist()

def get_embeddings_local(texts):
    """批量获取嵌入"""
    return model.encode(texts).tolist()

# 使用示例
texts = [
    "机器学习是人工智能的一个分支",
    "深度学习使用神经网络",
    "今天天气很好"
]

embeddings = get_embeddings_local(texts)
print(f"向量维度: {len(embeddings[0])}")

# 计算相似度
import numpy as np
sim = cosine_similarity(embeddings[0], embeddings[1])
print(f"文本1和文本2的相似度: {sim:.3f}")
```

**关键要点：**
- 嵌入将文本转为数值向量
- 相似内容的向量距离更近
- 余弦相似度衡量向量相似性
- OpenAI 或开源模型都可生成嵌入

### 第 2 课：Milvus 安装与配置

**Docker 安装 Milvus**

```bash
# 下载 docker-compose 配置
wget https://github.com/milvus-io/milvus/releases/download/v2.3.0/milvus-standalone-docker-compose.yml -O docker-compose.yml

# 启动 Milvus
docker-compose up -d

# 检查状态
docker-compose ps
```

**使用 Milvus Lite（轻量级）**

```python
# 安装
# pip install milvus

from milvus import default_server
from pymilvus import connections, utility

# 启动轻量级服务器
default_server.start()

# 连接
connections.connect(
    alias="default",
    host='localhost',
    port=default_server.listen_port
)

# 检查连接
print("Milvus 版本:", utility.get_server_version())
```

**创建集合**

```python
from pymilvus import (
    connections,
    Collection,
    FieldSchema,
    CollectionSchema,
    DataType,
    utility
)

# 连接 Milvus
connections.connect("default", host="localhost", port="19530")

def create_collection(name, dimension=384):
    """创建向量集合"""
    
    # 如果存在则删除
    if utility.has_collection(name):
        utility.drop_collection(name)
    
    # 定义字段
    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=2000),
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=dimension)
    ]
    
    # 创建 schema
    schema = CollectionSchema(fields=fields, description="文本向量集合")
    
    # 创建集合
    collection = Collection(name=name, schema=schema)
    
    # 创建索引（加速搜索）
    index_params = {
        "metric_type": "COSINE",
        "index_type": "IVF_FLAT",
        "params": {"nlist": 128}
    }
    collection.create_index(field_name="embedding", index_params=index_params)
    
    print(f"集合 '{name}' 创建成功")
    return collection

# 创建集合
collection = create_collection("documents", dimension=384)
```

**插入数据**

```python
def insert_documents(collection, texts, embeddings):
    """插入文档到集合"""
    data = [
        texts,           # text 字段
        embeddings       # embedding 字段
    ]
    
    result = collection.insert(data)
    collection.flush()  # 确保数据可见
    
    print(f"已插入 {len(texts)} 条文档")
    return result

# 使用示例
documents = [
    "龙虾大学教授 Python 编程",
    "机器学习是人工智能的核心技术",
    "向量数据库用于语义搜索",
    "RAG 结合检索和生成能力"
]

# 生成嵌入
embeddings = get_embeddings_local(documents)

# 插入数据
insert_documents(collection, documents, embeddings)
```

**语义搜索**

```python
def search_similar(collection, query_text, top_k=5):
    """语义搜索"""
    # 加载集合到内存
    collection.load()
    
    # 生成查询向量
    query_embedding = get_embedding_local(query_text)
    
    # 搜索参数
    search_params = {"metric_type": "COSINE", "params": {"nprobe": 10}}
    
    # 执行搜索
    results = collection.search(
        data=[query_embedding],
        anns_field="embedding",
        param=search_params,
        limit=top_k,
        output_fields=["text"]
    )
    
    # 返回结果
    matches = []
    for hits in results:
        for hit in hits:
            matches.append({
                "text": hit.entity.get("text"),
                "score": hit.score,
                "id": hit.id
            })
    
    return matches

# 使用示例
query = "如何学习人工智能？"
results = search_similar(collection, query, top_k=3)

print(f"查询: {query}")
print("最相似的结果:")
for i, r in enumerate(results):
    print(f"  {i+1}. [{r['score']:.3f}] {r['text']}")
```

**关键要点：**
- Milvus Standalone 适合生产环境
- Milvus Lite 适合开发测试
- 索引加速向量搜索
- 加载集合后才能搜索

### 第 3 课：RAG 应用构建

**RAG 架构概述**

```
用户问题 → 向量化 → 检索相关文档 → 构建提示词 → LLM 生成回答
```

**完整的 RAG 实现**

```python
from openai import OpenAI
from pymilvus import connections, Collection
from sentence_transformers import SentenceModel

class RAGSystem:
    def __init__(self, collection_name="knowledge_base", embedding_dim=384):
        # 连接 Milvus
        connections.connect("default", host="localhost", port="19530")
        self.collection = Collection(collection_name)
        self.collection.load()
        
        # 嵌入模型
        self.embed_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # OpenAI 客户端
        self.openai_client = OpenAI(api_key="your-api-key")
    
    def get_embedding(self, text):
        """获取嵌入向量"""
        return self.embed_model.encode(text).tolist()
    
    def retrieve(self, query, top_k=5):
        """检索相关文档"""
        query_embedding = self.get_embedding(query)
        
        search_params = {"metric_type": "COSINE", "params": {"nprobe": 10}}
        
        results = self.collection.search(
            data=[query_embedding],
            anns_field="embedding",
            param=search_params,
            limit=top_k,
            output_fields=["text", "source"]
        )
        
        documents = []
        for hits in results:
            for hit in hits:
                documents.append({
                    "text": hit.entity.get("text"),
                    "source": hit.entity.get("source"),
                    "score": hit.score
                })
        
        return documents
    
    def build_prompt(self, query, documents):
        """构建提示词"""
        context = "\n\n".join([
            f"[文档{i+1}] {doc['text']}"
            for i, doc in enumerate(documents)
        ])
        
        prompt = f"""你是一个有帮助的助手。请根据以下参考文档回答用户问题。
如果参考文档中没有相关信息，请诚实地说你不知道。

参考文档:
{context}

用户问题: {query}

请给出详细、准确的回答:"""
        
        return prompt
    
    def generate(self, prompt, model="gpt-4o-mini"):
        """生成回答"""
        response = self.openai_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "你是一个有帮助的助手。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content
    
    def answer(self, query, top_k=5):
        """完整的 RAG 流程"""
        # 1. 检索相关文档
        documents = self.retrieve(query, top_k)
        
        if not documents:
            return "抱歉，我没有找到相关信息。"
        
        # 2. 构建提示词
        prompt = self.build_prompt(query, documents)
        
        # 3. 生成回答
        answer = self.generate(prompt)
        
        return {
            "answer": answer,
            "sources": documents
        }

# 使用示例
rag = RAGSystem()
result = rag.answer("什么是向量数据库？")

print("回答:", result["answer"])
print("\n参考来源:")
for doc in result["sources"]:
    print(f"  - [{doc['score']:.3f}] {doc['source']}")
```

**知识库管理**

```python
class KnowledgeBase:
    def __init__(self, collection_name="knowledge_base"):
        self.collection_name = collection_name
        connections.connect("default", host="localhost", port="19530")
        self.collection = Collection(collection_name)
        self.embed_model = SentenceTransformer('all-MiniLM-L6-v2')
    
    def add_document(self, text, source, metadata=None):
        """添加单个文档"""
        embedding = self.embed_model.encode(text).tolist()
        
        data = [[text], [source], [embedding]]
        if metadata:
            data.append([str(metadata)])
        
        self.collection.insert(data)
        self.collection.flush()
    
    def add_documents_batch(self, documents):
        """批量添加文档
        
        documents: [{"text": "...", "source": "..."}, ...]
        """
        texts = [d["text"] for d in documents]
        sources = [d.get("source", "") for d in documents]
        
        embeddings = self.embed_model.encode(texts).tolist()
        
        data = [texts, sources, embeddings]
        self.collection.insert(data)
        self.collection.flush()
        
        print(f"已添加 {len(documents)} 条文档")
    
    def delete_by_source(self, source):
        """按来源删除文档"""
        expr = f'source == "{source}"'
        self.collection.delete(expr)
        self.collection.flush()
    
    def get_stats(self):
        """获取统计信息"""
        return {
            "total_documents": self.collection.num_entities
        }

# 使用示例
kb = KnowledgeBase()

# 添加文档
documents = [
    {"text": "向量数据库存储高维向量数据", "source": "doc1.txt"},
    {"text": "Milvus 是开源的向量数据库", "source": "doc2.txt"},
    {"text": "RAG 是检索增强生成的缩写", "source": "doc3.txt"}
]
kb.add_documents_batch(documents)
```

**文档分块策略**

```python
import re
from typing import List

def chunk_text(text, chunk_size=500, overlap=50):
    """按字符数分块"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        
        # 尝试在句子边界分割
        if end < len(text):
            # 找最近的句号
            last_period = text.rfind('。', start, end)
            if last_period > start:
                end = last_period + 1
        
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        start = end - overlap  # 重叠部分
    
    return chunks

def chunk_by_paragraphs(text, max_chunk_size=500):
    """按段落分块"""
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""
    
    for para in paragraphs:
        if len(current_chunk) + len(para) < max_chunk_size:
            current_chunk += para + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = para + "\n\n"
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks

def chunk_with_metadata(text, source, chunk_size=500):
    """分块并添加元数据"""
    chunks = chunk_text(text, chunk_size)
    
    return [
        {
            "text": chunk,
            "source": source,
            "chunk_index": i,
            "total_chunks": len(chunks)
        }
        for i, chunk in enumerate(chunks)
    ]

# 使用示例
long_text = """
这是一段很长的文档内容...
包含多个段落和句子。
需要被分割成小块以便存储到向量数据库。
"""

chunks = chunk_with_metadata(long_text, "document.txt", chunk_size=100)
for chunk in chunks:
    print(f"块 {chunk['chunk_index']}: {chunk['text'][:50]}...")
```

**关键要点：**
- RAG = 检索 + 生成
- 检索质量决定回答质量
- 文档分块要合理
- 提示词工程很重要

## ✅ 课程考核

完成以下任务以通过考核：

1. **向量嵌入** (25分)
   - 使用 sentence-transformers 生成 5 段文本的嵌入
   - 计算文本两两之间的余弦相似度
   - 找出最相似和最不相似的文本对

2. **Milvus 操作** (35分)
   - 安装并启动 Milvus（Docker 或 Lite）
   - 创建一个包含 10 条文档的集合
   - 实现 3 次语义搜索并展示结果

3. **RAG 应用** (40分)
   - 构建一个完整的 RAG 系统
   - 支持添加、删除、搜索文档
   - 对 5 个测试问题生成回答

**提交物：**
- `embeddings.py` - 嵌入生成代码
- `milvus_demo.py` - Milvus 操作代码
- `rag_system.py` - RAG 系统代码
- `test_results.md` - 测试结果截图

## 📖 参考资料

- [Milvus 官方文档](https://milvus.io/docs/)
- [PyMilvus API](https://milvus.io/api-reference/pymilvus/v2.3.x/About.md)
- [Sentence Transformers](https://www.sbert.net/)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [RAG 最佳实践](https://www.pinecone.io/learn/retrieval-augmented-generation/)
