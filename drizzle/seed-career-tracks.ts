import { db } from "../src/lib/db";
import { careerTracks } from "../src/lib/db/schema-lobster";

async function seedCareerTracks() {
  console.log("Seeding career tracks...");

  const tracks = [
    {
      id: "customer-support",
      name: "客户服务专员",
      code: "customer-support",
      icon: "💬",
      description: "在线客服、工单处理、用户咨询",
      riskLevel: "极高",
      marketDemand: "2000万+岗位",
      studyDuration: 14,
      difficulty: 1,
      order: 1,
      capabilities: JSON.stringify([
        "能处理客户在线咨询",
        "能完成工单全流程",
        "能维护常见问题库",
        "能处理客户投诉",
        "能输出服务满意度报告",
      ]),
      portfolioRequirements: JSON.stringify([
        "咨询记录 × 50 条",
        "工单处理 × 20 个",
        "FAQ 文档 × 30 条",
        "投诉处理 × 10 个",
        "满意度报告 × 4 份",
      ]),
      jobDirections: JSON.stringify([
        "在线客服",
        "售后支持",
        "工单处理",
      ]),
    },
    {
      id: "data-entry",
      name: "数据录入员",
      code: "data-entry",
      icon: "📝",
      description: "表单处理、数据清洗、文档整理",
      riskLevel: "极高",
      marketDemand: "1500万+岗位",
      studyDuration: 7,
      difficulty: 1,
      order: 2,
      capabilities: JSON.stringify([
        "能完成数据录入",
        "能清洗脏数据",
        "能转换数据格式",
        "能生成数据报表",
        "能批量处理文档",
      ]),
      portfolioRequirements: JSON.stringify([
        "数据录入 × 1000 条",
        "数据清洗 × 3 个数据集",
        "格式转换 × 10 次",
        "自动化报表 × 1 个",
        "批处理脚本 × 1 个",
      ]),
      jobDirections: JSON.stringify([
        "数据录入",
        "数据清洗",
        "质量审核",
      ]),
    },
    {
      id: "content-writer",
      name: "内容创作专员",
      code: "content-writer",
      icon: "✍️",
      description: "博客撰写、SEO内容、产品描述",
      riskLevel: "极高",
      marketDemand: "1000万+岗位",
      studyDuration: 21,
      difficulty: 2,
      order: 3,
      capabilities: JSON.stringify([
        "能产出 SEO 优化文章",
        "能撰写产品描述",
        "能运营社交媒体账号",
        "能制定内容日历",
        "能输出内容数据报告",
      ]),
      portfolioRequirements: JSON.stringify([
        "SEO 文章 × 10 篇",
        "产品文案 × 20 个",
        "运营记录 × 14 天",
        "内容日历 × 1 份",
        "数据报告 × 4 份",
      ]),
      jobDirections: JSON.stringify([
        "新媒体运营",
        "内容编辑",
        "SEO 优化师",
      ]),
    },
    {
      id: "ecommerce-ops",
      name: "电商运营专员",
      code: "ecommerce-ops",
      icon: "🛒",
      description: "店铺日常运营、销售数据分析、活动策划",
      riskLevel: "高",
      marketDemand: "500万+岗位",
      studyDuration: 21,
      difficulty: 2,
      order: 4,
      capabilities: JSON.stringify([
        "能独立完成店铺日常运营",
        "能生成销售日报",
        "能处理客户咨询",
        "能完成竞品分析报告",
        "能完成商品信息上架",
        "能策划店铺促销活动",
      ]),
      portfolioRequirements: JSON.stringify([
        "运营日志 × 7 天",
        "销售日报 × 7 份",
        "客服记录 × 20 条",
        "竞品报告 × 1 份",
        "商品上架 × 10 个",
        "活动方案 × 1 个",
      ]),
      jobDirections: JSON.stringify([
        "电商店铺运营助理",
        "跨境电商运营",
        "直播电商助理",
      ]),
    },
    {
      id: "data-analyst",
      name: "数据分析专员",
      code: "data-analyst",
      icon: "📊",
      description: "报表生成、数据可视化、趋势分析",
      riskLevel: "高",
      marketDemand: "500万+岗位",
      studyDuration: 28,
      difficulty: 3,
      order: 5,
      capabilities: JSON.stringify([
        "能完成数据清洗工作",
        "能生成业务周报",
        "能制作数据看板",
        "能输出趋势分析报告",
        "能配置自动报表",
      ]),
      portfolioRequirements: JSON.stringify([
        "清洗数据集 × 1 个",
        "业务周报 × 4 份",
        "数据看板 × 1 个",
        "趋势报告 × 1 份",
        "自动报表 × 1 个",
      ]),
      jobDirections: JSON.stringify([
        "BI 报表专员",
        "数据运营",
        "商业分析助理",
      ]),
    },
    {
      id: "admin-assistant",
      name: "行政助理",
      code: "admin-assistant",
      icon: "📋",
      description: "日程管理、邮件处理、会议安排",
      riskLevel: "高",
      marketDemand: "3000万+岗位",
      studyDuration: 14,
      difficulty: 2,
      order: 6,
      capabilities: JSON.stringify([
        "能管理领导日程",
        "能组织安排会议",
        "能处理日常邮件",
        "能完成文档归档",
        "能处理费用报销",
      ]),
      portfolioRequirements: JSON.stringify([
        "日程管理 × 14 天",
        "会议组织 × 10 次",
        "邮件处理 × 100 封",
        "文档归档 × 50 份",
        "报销处理 × 20 笔",
      ]),
      jobDirections: JSON.stringify([
        "行政助理",
        "总助",
        "办公室协调员",
      ]),
    },
  ];

  for (const track of tracks) {
    await db.insert(careerTracks).values(track).onConflictDoUpdate({
      target: careerTracks.id,
      set: track,
    });
  }

  console.log("Career tracks seeded!");
}

async function main() {
  await seedCareerTracks();
}

main()
  .then(() => {
    console.log("Seed completed!");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
