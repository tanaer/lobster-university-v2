import { db } from "./index";
import { skillCourses } from "./schema-lobster";

const seedCoursesData = [
  // ========== 路径 A: 信息处理专家 ==========
  // A1: Web 搜索基础
  {
    id: "course_a1_web_search",
    name: "Web 搜索基础",
    code: "web-search-basics",
    description: "学会使用搜索引擎获取信息、筛选结果、整理报告",
    module: "搜索与知识获取",
    category: "基础能力",
    duration: 120,
    level: "入门",
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
  // A2: 网页内容提取
  {
    id: "course_a2_web_extraction",
    name: "网页内容提取",
    code: "web-extraction",
    description: "学会从任意网页提取结构化信息、处理动态内容",
    module: "搜索与知识获取",
    category: "基础能力",
    duration: 120,
    level: "基础",
    skillPath: "skills/courses/web-extraction/SKILL.md",
    objectives: JSON.stringify([
      "理解网页 DOM 结构",
      "使用 CSS 选择器定位元素",
      "提取文本、链接、图片",
      "处理动态加载内容"
    ]),
    prerequisites: JSON.stringify(["course_a1_web_search"]),
    order: 2,
  },
  // A3: 学术检索
  {
    id: "course_a3_academic_research",
    name: "学术检索",
    code: "academic-research",
    description: "学会搜索学术论文、下载文献、提取引用",
    module: "搜索与知识获取",
    category: "基础能力",
    duration: 180,
    level: "进阶",
    skillPath: "skills/courses/academic-research/SKILL.md",
    objectives: JSON.stringify([
      "使用 arXiv、Google Scholar 搜索论文",
      "下载和阅读学术论文",
      "提取论文关键信息",
      "整理文献综述"
    ]),
    prerequisites: JSON.stringify(["course_a1_web_search", "course_a2_web_extraction"]),
    order: 3,
  },
  // A4: 信息整合报告
  {
    id: "course_a4_info_synthesis",
    name: "信息整合报告",
    code: "info-synthesis",
    description: "学会将多源信息整合成结构化报告",
    module: "搜索与知识获取",
    category: "基础能力",
    duration: 180,
    level: "高级",
    skillPath: "skills/courses/info-synthesis/SKILL.md",
    objectives: JSON.stringify([
      "多源信息收集策略",
      "信息去重和验证",
      "结构化报告撰写",
      "可视化呈现"
    ]),
    prerequisites: JSON.stringify(["course_a3_academic_research"]),
    order: 4,
  },

  // ========== 路径 B: 办公自动化专家 ==========
  // B1: Shell 脚本基础
  {
    id: "course_b1_shell_basics",
    name: "Shell 脚本基础",
    code: "shell-basics",
    description: "学会编写自动化脚本、操作文件系统",
    module: "电脑操作稳定性",
    category: "基础能力",
    duration: 180,
    level: "入门",
    skillPath: "skills/courses/shell-basics/SKILL.md",
    objectives: JSON.stringify([
      "编写和执行 Shell 脚本",
      "操作文件和目录",
      "处理文本数据",
      "实现自动化任务"
    ]),
    prerequisites: null,
    order: 10,
  },
  // B2: Excel 数据处理
  {
    id: "course_b2_excel_basics",
    name: "Excel 数据处理",
    code: "excel-basics",
    description: "学会读写 Excel 文件、处理数据、生成报表",
    module: "办公文件全自动化",
    category: "基础能力",
    duration: 120,
    level: "基础",
    skillPath: "skills/courses/excel-basics/SKILL.md",
    objectives: JSON.stringify([
      "读取 Excel 文件内容",
      "写入数据到 Excel",
      "清洗和转换数据",
      "生成统计报表"
    ]),
    prerequisites: JSON.stringify(["course_b1_shell_basics"]),
    order: 11,
  },
  // B3: Word 文档生成
  {
    id: "course_b3_word_basics",
    name: "Word 文档生成",
    code: "word-basics",
    description: "学会使用模板生成 Word 文档、批量处理",
    module: "办公文件全自动化",
    category: "基础能力",
    duration: 120,
    level: "基础",
    skillPath: "skills/courses/word-basics/SKILL.md",
    objectives: JSON.stringify([
      "使用 docx 库创建文档",
      "使用模板批量生成",
      "插入图片和表格",
      "格式化文档"
    ]),
    prerequisites: JSON.stringify(["course_b1_shell_basics"]),
    order: 12,
  },
  // B4: PDF 操作
  {
    id: "course_b4_pdf_basics",
    name: "PDF 操作",
    code: "pdf-basics",
    description: "学会从 PDF 提取内容、生成 PDF 文档",
    module: "办公文件全自动化",
    category: "基础能力",
    duration: 90,
    level: "进阶",
    skillPath: "skills/courses/pdf-basics/SKILL.md",
    objectives: JSON.stringify([
      "从 PDF 提取文本",
      "提取 PDF 中的表格",
      "生成 PDF 文档",
      "合并和拆分 PDF"
    ]),
    prerequisites: JSON.stringify(["course_b2_excel_basics", "course_b3_word_basics"]),
    order: 13,
  },

  // ========== 路径 C: 数据管理专家 ==========
  // C1: SQLite 数据库
  {
    id: "course_c1_sqlite_basics",
    name: "SQLite 数据库",
    code: "sqlite-basics",
    description: "学会使用 SQLite 存储和查询数据",
    module: "数据库与长期记忆",
    category: "基础能力",
    duration: 150,
    level: "入门",
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
  // C2: 数据清洗
  {
    id: "course_c2_data_cleaning",
    name: "数据清洗",
    code: "data-cleaning",
    description: "学会清洗脏数据、格式转换、质量检查",
    module: "数据库与长期记忆",
    category: "基础能力",
    duration: 120,
    level: "基础",
    skillPath: "skills/courses/data-cleaning/SKILL.md",
    objectives: JSON.stringify([
      "识别和处理缺失值",
      "数据格式标准化",
      "去重和验证",
      "批量转换流程"
    ]),
    prerequisites: JSON.stringify(["course_c1_sqlite_basics"]),
    order: 21,
  },
  // C3: 向量数据库
  {
    id: "course_c3_vector_db",
    name: "向量数据库",
    code: "vector-db",
    description: "学会使用 Milvus 实现语义搜索",
    module: "数据库与长期记忆",
    category: "基础能力",
    duration: 180,
    level: "进阶",
    skillPath: "skills/courses/vector-db/SKILL.md",
    objectives: JSON.stringify([
      "理解向量嵌入",
      "安装和使用 Milvus",
      "实现语义搜索",
      "构建 RAG 应用"
    ]),
    prerequisites: JSON.stringify(["course_c2_data_cleaning"]),
    order: 22,
  },
  // C4: 知识图谱
  {
    id: "course_c4_knowledge_graph",
    name: "知识图谱",
    code: "knowledge-graph",
    description: "学会使用 Neo4j 构建知识图谱",
    module: "数据库与长期记忆",
    category: "基础能力",
    duration: 180,
    level: "高级",
    skillPath: "skills/courses/knowledge-graph/SKILL.md",
    objectives: JSON.stringify([
      "理解图数据库概念",
      "使用 Neo4j 存储节点和关系",
      "编写 Cypher 查询",
      "构建实际知识图谱"
    ]),
    prerequisites: JSON.stringify(["course_c3_vector_db"]),
    order: 23,
  },

  // ========== 路径 D: 自动化工程师 ==========
  // D1: 错误处理
  {
    id: "course_d1_error_handling",
    name: "错误处理模式",
    code: "error-handling",
    description: "学会识别和处理常见错误、实现重试机制",
    module: "稳定性与容错",
    category: "基础能力",
    duration: 120,
    level: "入门",
    skillPath: "skills/courses/error-handling/SKILL.md",
    objectives: JSON.stringify([
      "识别常见错误类型",
      "编写错误处理代码",
      "实现自动重试",
      "记录错误日志"
    ]),
    prerequisites: null,
    order: 30,
  },
  // D2: 定时任务
  {
    id: "course_d2_cron_scheduling",
    name: "定时任务",
    code: "cron-scheduling",
    description: "学会使用 Cron 设置定时任务",
    module: "多通道与调度",
    category: "基础能力",
    duration: 90,
    level: "基础",
    skillPath: "skills/courses/cron-scheduling/SKILL.md",
    objectives: JSON.stringify([
      "理解 Cron 表达式",
      "设置定时任务",
      "监控任务执行",
      "处理任务失败"
    ]),
    prerequisites: JSON.stringify(["course_d1_error_handling"]),
    order: 31,
  },
  // D3: 浏览器自动化
  {
    id: "course_d3_browser_automation",
    name: "浏览器自动化",
    code: "browser-automation",
    description: "学会使用 Playwright 自动化浏览器",
    module: "电脑操作稳定性",
    category: "基础能力",
    duration: 180,
    level: "进阶",
    skillPath: "skills/courses/browser-automation/SKILL.md",
    objectives: JSON.stringify([
      "使用 Playwright 控制浏览器",
      "自动填写表单",
      "截图和录屏",
      "处理弹窗和对话框"
    ]),
    prerequisites: JSON.stringify(["course_d2_cron_scheduling"]),
    order: 32,
  },
  // D4: Webhook
  {
    id: "course_d4_webhook",
    name: "Webhook 集成",
    code: "webhook-integration",
    description: "学会接收和处理 Webhook",
    module: "多通道与调度",
    category: "基础能力",
    duration: 120,
    level: "进阶",
    skillPath: "skills/courses/webhook-integration/SKILL.md",
    objectives: JSON.stringify([
      "理解 Webhook 原理",
      "创建 Webhook 端点",
      "验证和处理请求",
      "实现事件响应"
    ]),
    prerequisites: JSON.stringify(["course_d2_cron_scheduling"]),
    order: 33,
  },
];

export async function seedCourses() {
  console.log("🌱 Seeding 16 courses...");
  
  for (const course of seedCoursesData) {
    await db.insert(skillCourses).values({
      ...course,
      enrollCount: 0,
      completionRate: 0,
      published: true,
    }).onConflictDoUpdate({
      target: skillCourses.id,
      set: {
        ...course,
        updatedAt: new Date(),
      },
    });
    console.log(`  ✓ ${course.name}`);
  }
  
  console.log("✅ All 16 courses seeded!");
}
