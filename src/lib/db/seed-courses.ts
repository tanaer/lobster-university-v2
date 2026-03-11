import { db } from "../index";
import { courses } from "./schema-lobster";

const seedCourses = [
  // 模块 1: 搜索与知识获取
  {
    id: "course_web_search_basics",
    name: "Web 搜索入门",
    code: "web-search-basics",
    description: "学会使用搜索引擎获取信息、提取关键内容、整理成报告",
    module: "搜索与知识获取",
    category: "基础能力",
    duration: 120,
    level: "初级",
    skillPath: "skills/courses/web-search/SKILL.md",
    objectives: JSON.stringify([
      "使用搜索引擎查找信息",
      "从搜索结果中筛选有价值的内容",
      "提取网页关键信息",
      "整理成结构化报告"
    ]),
    prerequisites: null,
    order: 1,
  },
  {
    id: "course_academic_research",
    name: "学术研究入门",
    code: "academic-research",
    description: "学会搜索学术论文、下载文献、提取引用",
    module: "搜索与知识获取",
    category: "基础能力",
    duration: 180,
    level: "中级",
    skillPath: "skills/courses/academic-research/SKILL.md",
    objectives: JSON.stringify([
      "使用 arXiv、Google Scholar 搜索论文",
      "下载和阅读学术论文",
      "提取论文关键信息",
      "整理文献综述"
    ]),
    prerequisites: JSON.stringify(["course_web_search_basics"]),
    order: 2,
  },
  
  // 模块 2: 办公文件全自动化
  {
    id: "course_excel_basics",
    name: "Excel 数据处理",
    code: "excel-basics",
    description: "学会读写 Excel 文件、处理数据、生成报表",
    module: "办公文件全自动化",
    category: "基础能力",
    duration: 120,
    level: "初级",
    skillPath: "skills/courses/excel-basics/SKILL.md",
    objectives: JSON.stringify([
      "读取 Excel 文件内容",
      "写入数据到 Excel",
      "清洗和转换数据",
      "生成统计报表"
    ]),
    prerequisites: null,
    order: 10,
  },
  {
    id: "course_word_basics",
    name: "Word 文档生成",
    code: "word-basics",
    description: "学会使用模板生成 Word 文档、批量处理文档",
    module: "办公文件全自动化",
    category: "基础能力",
    duration: 120,
    level: "初级",
    skillPath: "skills/courses/word-basics/SKILL.md",
    objectives: JSON.stringify([
      "使用 docx 库创建文档",
      "使用模板批量生成",
      "插入图片和表格",
      "格式化文档"
    ]),
    prerequisites: null,
    order: 11,
  },
  {
    id: "course_pdf_basics",
    name: "PDF 提取与生成",
    code: "pdf-basics",
    description: "学会从 PDF 提取内容、生成 PDF 文档",
    module: "办公文件全自动化",
    category: "基础能力",
    duration: 90,
    level: "初级",
    skillPath: "skills/courses/pdf-basics/SKILL.md",
    objectives: JSON.stringify([
      "从 PDF 提取文本",
      "提取 PDF 中的表格",
      "生成 PDF 文档",
      "合并和拆分 PDF"
    ]),
    prerequisites: null,
    order: 12,
  },
  
  // 模块 3: 数据库与长期记忆
  {
    id: "course_sqlite_basics",
    name: "SQLite 数据库基础",
    code: "sqlite-basics",
    description: "学会使用 SQLite 存储和查询数据",
    module: "数据库与长期记忆",
    category: "基础能力",
    duration: 150,
    level: "初级",
    skillPath: "skills/courses/sqlite-basics/SKILL.md",
    objectives: JSON.stringify([
      "创建数据库和表",
      "插入和查询数据",
      "更新和删除数据",
      "编写复杂查询"
    ]),
    prerequisites: null,
    order: 20,
  },
  {
    id: "course_vector_db",
    name: "向量数据库入门",
    code: "vector-db",
    description: "学会使用 Milvus 实现语义搜索",
    module: "数据库与长期记忆",
    category: "基础能力",
    duration: 180,
    level: "中级",
    skillPath: "skills/courses/vector-db/SKILL.md",
    objectives: JSON.stringify([
      "理解向量嵌入",
      "安装和使用 Milvus",
      "实现语义搜索",
      "构建 RAG 应用"
    ]),
    prerequisites: JSON.stringify(["course_sqlite_basics"]),
    order: 21,
  },
  
  // 模块 4: 电脑操作稳定性
  {
    id: "course_shell_basics",
    name: "Shell 脚本基础",
    code: "shell-basics",
    description: "学会编写自动化脚本、操作文件系统",
    module: "电脑操作稳定性",
    category: "基础能力",
    duration: 180,
    level: "初级",
    skillPath: "skills/courses/shell-basics/SKILL.md",
    objectives: JSON.stringify([
      "编写和执行 Shell 脚本",
      "操作文件和目录",
      "处理文本数据",
      "实现自动化任务"
    ]),
    prerequisites: null,
    order: 30,
  },
  {
    id: "course_browser_automation",
    name: "浏览器自动化",
    code: "browser-automation",
    description: "学会使用 Playwright 自动化浏览器操作",
    module: "电脑操作稳定性",
    category: "基础能力",
    duration: 180,
    level: "中级",
    skillPath: "skills/courses/browser-automation/SKILL.md",
    objectives: JSON.stringify([
      "使用 Playwright 控制浏览器",
      "自动填写表单",
      "截图和录屏",
      "处理弹窗和对话框"
    ]),
    prerequisites: JSON.stringify(["course_shell_basics"]),
    order: 31,
  },
  
  // 模块 5: 稳定性与容错
  {
    id: "course_error_handling",
    name: "错误处理模式",
    code: "error-handling",
    description: "学会识别和处理常见错误、实现重试机制",
    module: "稳定性与容错",
    category: "基础能力",
    duration: 120,
    level: "中级",
    skillPath: "skills/courses/error-handling/SKILL.md",
    objectives: JSON.stringify([
      "识别常见错误类型",
      "编写错误处理代码",
      "实现自动重试",
      "记录错误日志"
    ]),
    prerequisites: JSON.stringify(["course_shell_basics"]),
    order: 40,
  },
  
  // 模块 6: 多通道与调度
  {
    id: "course_cron_scheduling",
    name: "定时任务与调度",
    code: "cron-scheduling",
    description: "学会使用 Cron 设置定时任务、24/7 主动执行",
    module: "多通道与调度",
    category: "基础能力",
    duration: 90,
    level: "初级",
    skillPath: "skills/courses/cron-scheduling/SKILL.md",
    objectives: JSON.stringify([
      "理解 Cron 表达式",
      "设置定时任务",
      "监控任务执行",
      "处理任务失败"
    ]),
    prerequisites: JSON.stringify(["course_shell_basics"]),
    order: 50,
  },
  {
    id: "course_webhook_integration",
    name: "Webhook 集成",
    code: "webhook-integration",
    description: "学会接收和处理 Webhook、实现事件驱动",
    module: "多通道与调度",
    category: "基础能力",
    duration: 120,
    level: "中级",
    skillPath: "skills/courses/webhook-integration/SKILL.md",
    objectives: JSON.stringify([
      "理解 Webhook 原理",
      "创建 Webhook 端点",
      "验证和处理请求",
      "实现事件响应"
    ]),
    prerequisites: null,
    order: 51,
  },
];

export async function seedCourses() {
  console.log("🌱 Seeding courses...");
  
  for (const course of seedCourses) {
    await db.insert(courses).values({
      ...course,
      enrollCount: 0,
      completionRate: 0,
      published: true,
    }).onConflictDoUpdate({
      target: courses.id,
      set: {
        ...course,
        updatedAt: new Date(),
      },
    });
    console.log(`  ✓ ${course.name}`);
  }
  
  console.log("✅ Courses seeded!");
}
