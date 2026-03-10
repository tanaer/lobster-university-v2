import { db } from "./index";
import { users, courses, chapters, achievements } from "./schema";
import { nanoid } from "nanoid";

async function seed() {
  console.log("🌱 开始种子数据...");

  // 清空现有数据
  await db.delete(achievements);
  await db.delete(chapters);
  await db.delete(courses);
  await db.delete(users);

  // 创建测试用户
  const testUsers = await db.insert(users).values([
    { 
      id: nanoid(), 
      name: "Alice", 
      email: "alice@test.com", 
      level: 5, 
      exp: 500,
      streak: 7,
      totalStudyTime: 120,
    },
    { 
      id: nanoid(), 
      name: "Bob", 
      email: "bob@test.com", 
      level: 3, 
      exp: 200,
      streak: 3,
      totalStudyTime: 60,
    },
    { 
      id: nanoid(), 
      name: "Charlie", 
      email: "charlie@test.com", 
      level: 1, 
      exp: 0,
      streak: 0,
      totalStudyTime: 0,
    },
  ]).returning();

  console.log(`✅ 创建了 ${testUsers.length} 个用户`);

  // 创建课程
  const testCourses = await db.insert(courses).values([
    {
      id: nanoid(),
      title: "Next.js 15 入门",
      description: "从零开始学习 Next.js 15，掌握 App Router、Server Components 等核心概念",
      category: "前端开发",
      level: "beginner",
      duration: 180,
      chapterCount: 5,
      studentCount: 128,
      rating: 4.8,
      ratingCount: 45,
      published: true,
      author: "龙虾教授",
    },
    {
      id: nanoid(),
      title: "React 19 深度指南",
      description: "深入理解 React 19 新特性，包括 Suspense、Transitions、Server Components",
      category: "前端开发",
      level: "intermediate",
      duration: 300,
      chapterCount: 8,
      studentCount: 89,
      rating: 4.9,
      ratingCount: 32,
      published: true,
      author: "龙虾教授",
    },
    {
      id: nanoid(),
      title: "TypeScript 高级技巧",
      description: "掌握 TypeScript 高级类型、泛型编程、类型体操等进阶技能",
      category: "编程语言",
      level: "advanced",
      duration: 240,
      chapterCount: 6,
      studentCount: 56,
      rating: 4.7,
      ratingCount: 18,
      published: true,
      author: "龙虾教授",
    },
  ]).returning();

  console.log(`✅ 创建了 ${testCourses.length} 门课程`);

  // 为每门课程创建章节
  const chapterData = [
    // Next.js 15 入门
    [
      { title: "环境搭建与项目初始化", order: 1, duration: 20 },
      { title: "App Router 基础", order: 2, duration: 30 },
      { title: "Server Components 详解", order: 3, duration: 40 },
      { title: "数据获取与缓存", order: 4, duration: 35 },
      { title: "部署与优化", order: 5, duration: 55 },
    ],
    // React 19 深度指南
    [
      { title: "React 19 新特性概览", order: 1, duration: 25 },
      { title: "Suspense 进阶", order: 2, duration: 40 },
      { title: "Transitions 与并发渲染", order: 3, duration: 45 },
      { title: "Server Components 实战", order: 4, duration: 50 },
      { title: "表单与 Actions", order: 5, duration: 35 },
      { title: "性能优化策略", order: 6, duration: 40 },
      { title: "测试与调试", order: 7, duration: 35 },
      { title: "实战项目", order: 8, duration: 30 },
    ],
    // TypeScript 高级技巧
    [
      { title: "类型系统回顾", order: 1, duration: 30 },
      { title: "条件类型", order: 2, duration: 45 },
      { title: "映射类型", order: 3, duration: 40 },
      { title: "模板字面量类型", order: 4, duration: 35 },
      { title: "类型体操实战", order: 5, duration: 50 },
      { title: "实战项目", order: 6, duration: 40 },
    ],
  ];

  let totalChapters = 0;
  for (let i = 0; i < testCourses.length; i++) {
    const courseChapters = chapterData[i];
    const inserted = await db.insert(chapters).values(
      courseChapters.map((ch) => ({
        id: nanoid(),
        courseId: testCourses[i].id,
        title: ch.title,
        content: `# ${ch.title}\n\n这是 ${testCourses[i].title} 课程的第 ${ch.order} 章内容。`,
        order: ch.order,
        duration: ch.duration,
        isFree: ch.order === 1, // 第一章免费
      }))
    ).returning();
    totalChapters += inserted.length;
  }

  console.log(`✅ 创建了 ${totalChapters} 个章节`);

  // 创建成就
  const testAchievements = await db.insert(achievements).values([
    {
      id: nanoid(),
      userId: testUsers[0].id,
      type: "first_course",
      metadata: JSON.stringify({ courseName: "Next.js 15 入门" }),
    },
    {
      id: nanoid(),
      userId: testUsers[0].id,
      type: "study_1h",
      metadata: JSON.stringify({ totalMinutes: 120 }),
    },
    {
      id: nanoid(),
      userId: testUsers[1].id,
      type: "first_course",
      metadata: JSON.stringify({ courseName: "React 19 深度指南" }),
    },
  ]).returning();

  console.log(`✅ 创建了 ${testAchievements.length} 个成就`);
  console.log("🎉 种子数据完成！");
}

seed().catch(console.error);
