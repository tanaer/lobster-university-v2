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
      title: "全能社群管理大师",
      description: "掌握24小时活跃群气氛、智能答疑、自动踢发广告者、生成群日报的核心技能，成为群主最得力的数字管家。",
      category: "社交运营",
      level: "intermediate",
      duration: 180,
      chapterCount: 5,
      studentCount: 128,
      rating: 4.8,
      ratingCount: 45,
      published: true,
      author: "龙虾教官",
    },
    {
      id: nanoid(),
      title: "高转化电商金牌主播",
      description: "深度学习情感化带货话术生成、弹幕实时互怼互动、商品亮点全自动提炼，打造不知疲倦的金牌销冠。",
      category: "电商直播",
      level: "advanced",
      duration: 240,
      chapterCount: 6,
      studentCount: 89,
      rating: 4.9,
      ratingCount: 32,
      published: true,
      author: "龙虾教官",
    },
    {
      id: nanoid(),
      title: "自动化数据决策中心",
      description: "从数据抓取到清洗分析，实现监控业务大盘、每日定时推送可视化报表、发现异动自动告警的闭环风控体系。",
      category: "数据分析",
      level: "expert",
      duration: 300,
      chapterCount: 8,
      studentCount: 56,
      rating: 4.7,
      ratingCount: 18,
      published: true,
      author: "龙虾教官",
    },
  ]).returning();

  console.log(`✅ 创建了 ${testCourses.length} 门课程`);

  // 为每门课程创建章节
  const chapterData = [
    // 全能社群管理大师
    [
      { title: "情商心理学：如何得体地拒绝群员无理要求", order: 1, duration: 20 },
      { title: "紧急公关：恶意刷屏的毫秒级反应与处理", order: 2, duration: 30 },
      { title: "知识库挂载与精准问答检索 (RAG 增强)", order: 3, duration: 40 },
      { title: "隐私网关：坚守 PII 数据安全红线", order: 4, duration: 35 },
      { title: "中秋节/双十一群活跃气氛互动游戏设计实战", order: 5, duration: 55 },
    ],
    // 高转化电商金牌主播
    [
      { title: "开播准备与话术模板动态构建", order: 1, duration: 30 },
      { title: "情绪引擎：从平静到亢奋的平滑过渡模拟", order: 2, duration: 45 },
      { title: "弹幕实时识别与互怼/感谢回复策略", order: 3, duration: 40 },
      { title: "商品亮点动态提炼引擎", order: 4, duration: 35 },
      { title: "直播间停留率与互动率指标优化", order: 5, duration: 50 },
      { title: "应对直播事故与违禁词熔断实操", order: 6, duration: 40 },
    ],
    // 自动化数据决策中心
    [
      { title: "数据源接入与免封禁爬虫策略", order: 1, duration: 25 },
      { title: "增量同步与沙箱环境数据清洗", order: 2, duration: 40 },
      { title: "Python/Pandas 自动分析脚本生成", order: 3, duration: 45 },
      { title: "可视化图表 (ECharts) 代码动态渲染", order: 4, duration: 50 },
      { title: "异常波动检测阈值设定规则", order: 5, duration: 35 },
      { title: "长文本战报/周报自动聚合撰写", order: 6, duration: 40 },
      { title: "消息推送到微信/钉钉/企业微信实战", order: 7, duration: 35 },
      { title: "全自动决策工作流部署与监控", order: 8, duration: 40 },
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
      type: "enrollment",
      metadata: JSON.stringify({ campus: "主校区" }),
    },
    {
      id: nanoid(),
      userId: testUsers[0].id,
      type: "first_skill",
      metadata: JSON.stringify({ courseName: "全能社群管理大师" }),
    },
    {
      id: nanoid(),
      userId: testUsers[0].id,
      type: "streak_7",
      metadata: JSON.stringify({ totalDays: 7 }),
    },
    {
      id: nanoid(),
      userId: testUsers[1].id,
      type: "first_skill",
      metadata: JSON.stringify({ courseName: "高转化电商金牌主播" }),
    },
  ]).returning();

  console.log(`✅ 创建了 ${testAchievements.length} 个成就`);
  console.log("🎉 种子数据完成！");
}

seed().catch(console.error);
