# T-009: 首页数据展示

## 状态
🟢 DONE (2026-03-10 21:15)

## 优先级
P1

## 预计工时
1.5h

## 描述
首页从数据库读取真实课程数据并展示。

## 技术要求

### 文件位置
- `src/app/page.tsx`
- `src/lib/services/course.ts` (新建)

### 实现要点

1. **创建课程服务**
```typescript
// src/lib/services/course.ts
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function getCourses(limit = 10) {
  return db.select().from(courses)
    .where(eq(courses.published, true))
    .orderBy(desc(courses.createdAt))
    .limit(limit);
}

export async function getCourseById(id: string) {
  const [course] = await db.select().from(courses).where(eq(courses.id, id));
  return course;
}

export async function getFeaturedCourses() {
  return db.select().from(courses)
    .where(eq(courses.published, true))
    .orderBy(desc(courses.rating))
    .limit(3);
}
```

2. **首页改造 (Server Component)**
```typescript
// src/app/page.tsx
import { getFeaturedCourses, getCourses } from "@/lib/services/course";
import { Hero } from "@/components/home/hero";
import { CourseGrid } from "@/components/course/course-grid";

export default async function Home() {
  const featuredCourses = await getFeaturedCourses();
  const allCourses = await getCourses(9);

  return (
    <main>
      <Hero />
      
      <section className="container py-12">
        <h2>推荐课程</h2>
        <CourseGrid courses={featuredCourses} />
      </section>
      
      <section className="container py-12">
        <h2>全部课程</h2>
        <CourseGrid courses={allCourses} />
      </section>
    </main>
  );
}
```

## 验收标准
- [ ] 首页显示真实课程数据 (非 mock)
- [ ] 推荐课程按评分排序
- [ ] 全部课程按时间排序
- [ ] 课程卡片显示: 标题、描述、时长、学生数

## 依赖
- T-006 (数据库迁移)
- T-007 (种子数据)

## 指派给
Codex
