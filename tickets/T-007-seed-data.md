# T-007: 创建种子数据

## 状态
🟢 DONE (2026-03-10 20:41)

## 优先级
P1

## 预计工时
1h

## 描述
创建种子数据脚本，填充测试数据用于开发和演示。

## 技术要求

### 文件位置
- `src/lib/db/seed.ts`
- `package.json` 添加 `db:seed` 脚本

### 种子数据内容

#### 测试用户 (3个)
```
user1: alice@test.com / password123 / Alice / level 5
user2: bob@test.com / password123 / Bob / level 3
user3: charlie@test.com / password123 / Charlie / level 1
```

#### 课程 (3个)
```
course1: "Next.js 15 入门" / beginner / 5 chapters
course2: "React 19 深度指南" / intermediate / 8 chapters
course3: "TypeScript 高级技巧" / advanced / 6 chapters
```

#### 章节 (每个课程 3-5 个)
- 每个章节包含标题、内容摘要、时长

#### 成就 (每个用户 1-2 个)
- first_course: 完成第一门课程
- study_1h: 学习满 1 小时

### 代码示例
```typescript
// src/lib/db/seed.ts
import { db } from "./index";
import { users, courses, chapters, achievements } from "./schema";
import { nanoid } from "nanoid";

async function seed() {
  // 清空现有数据
  await db.delete(achievements);
  await db.delete(chapters);
  await db.delete(courses);
  await db.delete(users);

  // 创建用户
  const testUsers = await db.insert(users).values([
    { id: nanoid(), name: "Alice", email: "alice@test.com", level: 5, exp: 500 },
    { id: nanoid(), name: "Bob", email: "bob@test.com", level: 3, exp: 200 },
    { id: nanoid(), name: "Charlie", email: "charlie@test.com", level: 1, exp: 0 },
  ]).returning();

  // 创建课程...
  
  console.log("Seed completed!");
}

seed();
```

## 验收标准
- [ ] `pnpm db:seed` 成功执行
- [ ] 数据库中有 3 个用户
- [ ] 数据库中有 3 门课程
- [ ] 每门课程有 3-5 个章节
- [ ] 首页可以展示课程数据

## 依赖
- T-006 (数据库迁移)

## 指派给
Codex
