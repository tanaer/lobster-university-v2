import { db } from "./index";
import { careerTracks } from "./schema-lobster";
import { nanoid } from "nanoid";

async function seedCareerTracks() {
  console.log("🌱 开始种子职业方向数据...");

  // 清空现有数据
  await db.delete(careerTracks);

  const tracks = [
    {
      id: nanoid(),
      name: "客户服务专员",
      code: "customer-support",
      icon: "💬",
      description: "在线客服、工单处理、用户咨询",
      riskLevel: "极高",
      marketDemand: "市场需求大，但 AI 替代风险最高",
      studyDuration: 14,
      difficulty: 1,
      capabilities: JSON.stringify([
        "处理客户咨询",
        "生成客服日报",
        "维护FAQ知识库",
        "处理投诉和退换货",
      ]),
      portfolioRequirements: JSON.stringify([
        "完成 10 个客服对话案例",
        "生成 3 份客服日报",
        "建立 1 个FAQ知识库",
      ]),
      jobDirections: JSON.stringify([
        "电商客服",
        "在线客服",
        "售后支持",
        "客服主管",
      ]),
      order: 1,
      published: true,
    },
    {
      id: nanoid(),
      name: "数据录入员",
      code: "data-entry",
      icon: "📝",
      description: "表单处理、数据清洗、文档整理",
      riskLevel: "极高",
      marketDemand: "入门门槛低，但极易被 AI 替代",
      studyDuration: 7,
      difficulty: 1,
      capabilities: JSON.stringify([
        "完成数据录入",
        "清洗脏数据",
        "批量处理文档",
        "Excel 数据处理",
      ]),
      portfolioRequirements: JSON.stringify([
        "完成 5 个数据录入项目",
        "清洗 1000+ 条数据",
        "自动化 1 个数据处理流程",
      ]),
      jobDirections: JSON.stringify([
        "数据录入员",
        "数据清洗员",
        "文档处理员",
        "行政助理",
      ]),
      order: 2,
      published: true,
    },
    {
      id: nanoid(),
      name: "内容创作专员",
      code: "content-writer",
      icon: "✍️",
      description: "博客撰写、SEO内容、产品描述",
      riskLevel: "极高",
      marketDemand: "内容需求大，但 AI 生成质量越来越高",
      studyDuration: 21,
      difficulty: 2,
      capabilities: JSON.stringify([
        "撰写SEO文章",
        "产出产品文案",
        "运营社媒账号",
        "编写营销邮件",
      ]),
      portfolioRequirements: JSON.stringify([
        "撰写 10 篇 SEO 文章",
        "创建 5 个产品描述",
        "运营 1 个社媒账号 30 天",
      ]),
      jobDirections: JSON.stringify([
        "内容运营",
        "文案策划",
        "社媒运营",
        "内容编辑",
      ]),
      order: 3,
      published: true,
    },
    {
      id: nanoid(),
      name: "电商运营专员",
      code: "ecommerce-ops",
      icon: "🛒",
      description: "店铺日常运营、销售数据分析、活动策划",
      riskLevel: "高",
      marketDemand: "电商行业持续增长，但运营工作逐渐自动化",
      studyDuration: 21,
      difficulty: 2,
      capabilities: JSON.stringify([
        "完成店铺运营",
        "生成销售日报",
        "策划促销活动",
        "优化商品排名",
      ]),
      portfolioRequirements: JSON.stringify([
        "运营 1 个模拟店铺",
        "策划 3 个促销活动",
        "生成 7 份销售日报",
        "优化 10 个商品详情页",
      ]),
      jobDirections: JSON.stringify([
        "电商运营",
        "店铺运营",
        "活动运营",
        "商品运营",
      ]),
      order: 4,
      published: true,
    },
    {
      id: nanoid(),
      name: "数据分析专员",
      code: "data-analyst",
      icon: "📊",
      description: "报表生成、数据可视化、趋势分析",
      riskLevel: "高",
      marketDemand: "数据驱动决策需求大，但工具越来越智能",
      studyDuration: 28,
      difficulty: 3,
      capabilities: JSON.stringify([
        "生成业务报表",
        "制作数据看板",
        "输出分析报告",
        "SQL 数据查询",
      ]),
      portfolioRequirements: JSON.stringify([
        "完成 5 个数据分析项目",
        "制作 3 个数据看板",
        "输出 10 份分析报告",
        "编写 20 个 SQL 查询",
      ]),
      jobDirections: JSON.stringify([
        "数据分析师",
        "商业分析师",
        "运营分析师",
        "BI 工程师",
      ]),
      order: 5,
      published: true,
    },
    {
      id: nanoid(),
      name: "行政助理",
      code: "admin-assistant",
      icon: "📋",
      description: "日程管理、邮件处理、会议安排",
      riskLevel: "高",
      marketDemand: "行政工作需求稳定，但自动化程度提高",
      studyDuration: 14,
      difficulty: 2,
      capabilities: JSON.stringify([
        "管理领导日程",
        "处理日常邮件",
        "组织安排会议",
        "文档归档管理",
      ]),
      portfolioRequirements: JSON.stringify([
        "管理 1 个领导日程 30 天",
        "处理 100 封邮件",
        "组织 10 个会议",
        "建立 1 个文档归档系统",
      ]),
      jobDirections: JSON.stringify([
        "行政助理",
        "总经理助理",
        "办公室文员",
        "行政主管",
      ]),
      order: 6,
      published: true,
    },
  ];

  const inserted = await db.insert(careerTracks).values(tracks).returning();
  console.log(`✅ 创建了 ${inserted.length} 个职业方向`);
  console.log("🎉 职业方向种子数据完成！");
}

seedCareerTracks().catch(console.error);
