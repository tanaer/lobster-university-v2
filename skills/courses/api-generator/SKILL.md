# API 代码生成器 — 可执行 SOP

> 学完这门课，Agent 能独立完成：从需求描述到生成完整 RESTful API（路由 + 控制器 + 模型 + 文档 + 测试）

## 课程元数据

| 项目 | 内容 |
|------|------|
| 课程 ID | api-generator |
| 难度 | 中级 |
| 预计执行时间 | 20 分钟 |
| 前置技能 | shell-basics, Node.js 或 Python 基础 |
| 输出物 | 可运行的 RESTful API 项目 + OpenAPI 文档 |

---

## 工作流总览

```
[需求描述] → Step 1: 解析需求 → Step 2: 生成数据模型 → Step 3: 生成 CRUD 路由 → Step 4: 生成 OpenAPI 文档 → Step 5: 生成测试 → Step 6: 验证运行 → [完整 API 项目]
```

---

## Step 1: 解析需求，确定资源和字段

### 输入
- 用户的需求描述（如"做一个博客系统 API"）

### 执行

**从需求中提取：**
1. 资源列表（如 User, Post, Comment）
2. 每个资源的字段和类型
3. 资源间关系（一对多、多对多）
4. 认证需求（公开/需登录/需管理员）

**输出格式：**
```yaml
resources:
  - name: Post
    fields:
      - { name: title, type: string, required: true, maxLength: 200 }
      - { name: content, type: text, required: true }
      - { name: authorId, type: integer, required: true, ref: User }
      - { name: status, type: enum, values: [draft, published, archived], default: draft }
      - { name: createdAt, type: datetime, auto: true }
    auth:
      create: authenticated
      read: public
      update: owner
      delete: owner|admin
```

### 判断条件
- ✅ 成功：至少提取出 1 个资源，每个资源至少 2 个字段
- ❌ 失败：需求太模糊 → 向用户追问"需要哪些数据实体？"
- 🔄 失败处理：用常见模式补全（如博客 = User + Post + Comment）

### 输出
- `RESOURCE_SPEC`: 资源规格 YAML

---

## Step 2: 生成数据模型

### 输入
- Step 1 的 `RESOURCE_SPEC`

### 执行

**初始化项目：**
```bash
# Node.js + Express 方案
mkdir my-api && cd my-api
npm init -y
npm install express cors helmet morgan
npm install -D typescript @types/express @types/node ts-node nodemon

# 创建目录结构
mkdir -p src/{models,routes,controllers,middleware,utils}
```

**生成模型文件（以 Drizzle ORM + SQLite 为例）：**
```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

**模型生成规则：**

| 字段类型 | Drizzle 类型 | 验证 |
|----------|-------------|------|
| string | text() | maxLength |
| integer | integer() | min/max |
| boolean | integer({ mode: 'boolean' }) | - |
| datetime | text() | ISO 8601 |
| enum | text() | 枚举值校验 |
| text | text() | - |

```typescript
// src/models/schema.ts 示例
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').notNull().references(() => users.id),
  status: text('status').notNull().default('draft'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});
```

### 判断条件
- ✅ 成功：`npx drizzle-kit generate` 无报错
- ❌ 失败：类型错误 → 检查字段映射，修正后重试
- 🔄 失败处理：回退到原生 SQL 建表

### 输出
- `src/models/schema.ts`: 数据模型文件
- `drizzle/`: 迁移文件

---

## Step 3: 生成 CRUD 路由和控制器

### 输入
- Step 2 的数据模型

### 执行

**每个资源生成 5 个端点：**

| 方法 | 路径 | 功能 | 状态码 |
|------|------|------|--------|
| GET | /api/{resource} | 列表（分页） | 200 |
| GET | /api/{resource}/:id | 详情 | 200 / 404 |
| POST | /api/{resource} | 创建 | 201 / 400 |
| PUT | /api/{resource}/:id | 更新 | 200 / 404 |
| DELETE | /api/{resource}/:id | 删除 | 204 / 404 |

**控制器模板：**
```typescript
// src/controllers/postController.ts
import { db } from '../models/db';
import { posts } from '../models/schema';
import { eq } from 'drizzle-orm';

export const postController = {
  // GET /api/posts?page=1&limit=20
  async list(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = (page - 1) * limit;
    
    const items = await db.select().from(posts).limit(limit).offset(offset);
    const total = await db.select({ count: sql`count(*)` }).from(posts);
    
    res.json({ data: items, pagination: { page, limit, total: total[0].count } });
  },

  // GET /api/posts/:id
  async get(req, res) {
    const item = await db.select().from(posts).where(eq(posts.id, req.params.id));
    if (!item.length) return res.status(404).json({ error: 'Not found' });
    res.json({ data: item[0] });
  },

  // POST /api/posts
  async create(req, res) {
    const { title, content, authorId, status } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'title and content required' });
    
    const result = await db.insert(posts).values({ title, content, authorId, status });
    res.status(201).json({ data: { id: result.lastInsertRowid } });
  },

  // PUT /api/posts/:id
  async update(req, res) {
    const existing = await db.select().from(posts).where(eq(posts.id, req.params.id));
    if (!existing.length) return res.status(404).json({ error: 'Not found' });
    
    await db.update(posts).set(req.body).where(eq(posts.id, req.params.id));
    res.json({ data: { ...existing[0], ...req.body } });
  },

  // DELETE /api/posts/:id
  async delete(req, res) {
    const existing = await db.select().from(posts).where(eq(posts.id, req.params.id));
    if (!existing.length) return res.status(404).json({ error: 'Not found' });
    
    await db.delete(posts).where(eq(posts.id, req.params.id));
    res.status(204).send();
  },
};
```

**路由文件：**
```typescript
// src/routes/posts.ts
import { Router } from 'express';
import { postController } from '../controllers/postController';

const router = Router();
router.get('/', postController.list);
router.get('/:id', postController.get);
router.post('/', postController.create);
router.put('/:id', postController.update);
router.delete('/:id', postController.delete);

export default router;
```

### 判断条件
- ✅ 成功：`npx ts-node src/index.ts` 启动无报错
- ❌ 失败：导入错误 → 检查路径和依赖
- 🔄 失败处理：逐个路由文件排查

### 输出
- `src/controllers/`: 控制器文件
- `src/routes/`: 路由文件
- `src/index.ts`: 入口文件

---

## Step 4: 生成 OpenAPI 文档

### 输入
- Step 3 的路由定义

### 执行

```bash
npm install swagger-jsdoc swagger-ui-express
```

**从路由自动生成 OpenAPI spec：**
```yaml
# openapi.yaml
openapi: 3.0.3
info:
  title: My API
  version: 1.0.0
paths:
  /api/posts:
    get:
      summary: List posts
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: { type: array, items: { $ref: '#/components/schemas/Post' } }
                  pagination: { $ref: '#/components/schemas/Pagination' }
```

**挂载 Swagger UI：**
```typescript
// src/index.ts 中添加
import swaggerUi from 'swagger-ui-express';
import spec from '../openapi.yaml';
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
```

### 判断条件
- ✅ 成功：访问 `/docs` 显示 Swagger UI
- ❌ 失败：YAML 格式错误 → 用 `npx swagger-cli validate openapi.yaml` 检查
- 🔄 失败处理：修正 YAML 语法

### 输出
- `openapi.yaml`: API 文档
- `/docs` 路由可访问

---

## Step 5: 生成测试

### 输入
- Step 3 的路由和控制器

### 执行

```bash
npm install -D vitest supertest @types/supertest
```

**每个端点生成测试：**
```typescript
// tests/posts.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('POST /api/posts', () => {
  it('should create a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'Test', content: 'Hello', authorId: 1 });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
  });

  it('should reject missing fields', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/posts', () => {
  it('should return paginated list', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination).toBeDefined();
  });
});

describe('GET /api/posts/:id', () => {
  it('should return 404 for non-existent', async () => {
    const res = await request(app).get('/api/posts/99999');
    expect(res.status).toBe(404);
  });
});
```

```bash
# 运行测试
npx vitest run
```

### 判断条件
- ✅ 成功：所有测试通过（绿色）
- ❌ 失败：测试失败 → 查看失败原因，修复控制器逻辑
- 🔄 失败处理：逐个修复失败的测试

### 输出
- `tests/`: 测试文件
- 测试通过报告

---

## Step 6: 验证完整运行

### 输入
- 完整项目

### 执行
```bash
# 1. 启动服务
npx ts-node src/index.ts &
SERVER_PID=$!
sleep 2

# 2. 测试 CRUD 流程
# 创建
curl -s -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World","authorId":1}' | jq .

# 列表
curl -s http://localhost:3000/api/posts | jq .

# 详情
curl -s http://localhost:3000/api/posts/1 | jq .

# 更新
curl -s -X PUT http://localhost:3000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}' | jq .

# 删除
curl -s -X DELETE http://localhost:3000/api/posts/1 -w "%{http_code}"

# 3. 检查文档
curl -s http://localhost:3000/docs -o /dev/null -w "%{http_code}"

# 4. 停止服务
kill $SERVER_PID
```

### 判断条件
- ✅ 成功：5 个 CRUD 操作全部返回预期状态码，文档页面 200
- ❌ 失败：某个端点报错 → 查看错误日志，修复
- 🔄 失败处理：逐个端点排查

### 输出
- 完整可运行的 API 项目

---

## 验收标准

| 检查项 | 预期结果 | 验证命令 |
|--------|----------|----------|
| 项目启动 | 无报错，监听端口 | `curl localhost:3000/api/posts` 返回 200 |
| CRUD 完整 | 5 个端点全部可用 | 逐个 curl 测试 |
| 分页正常 | 返回 pagination 对象 | `curl localhost:3000/api/posts?page=1&limit=5` |
| 404 处理 | 不存在的 ID 返回 404 | `curl localhost:3000/api/posts/99999` |
| 400 处理 | 缺少必填字段返回 400 | `curl -X POST localhost:3000/api/posts -d '{}'` |
| API 文档 | Swagger UI 可访问 | `curl localhost:3000/docs` 返回 200 |
| 测试通过 | 全部绿色 | `npx vitest run` |

---

## 常见问题 & 排错

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| `EADDRINUSE` | 端口被占用 | 改端口或 `kill` 占用进程 |
| `Cannot find module` | 依赖未安装 | `npm install` |
| SQLite 锁错误 | 并发写入 | 使用 WAL 模式：`PRAGMA journal_mode=WAL` |
| TypeScript 编译错误 | 类型不匹配 | 检查 tsconfig.json 配置 |
| CORS 被拦截 | 未配置 CORS | 确认 `app.use(cors())` |

---

## 扩展任务（选做）

- [ ] 添加 JWT 认证中间件
- [ ] 添加请求速率限制（express-rate-limit）
- [ ] 添加输入验证（zod）
- [ ] 生成 GraphQL Schema（替代 REST）
- [ ] 添加 Docker 部署配置
- [ ] 集成 CI/CD（GitHub Actions 自动测试）
