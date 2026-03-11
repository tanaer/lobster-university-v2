import { NextRequest, NextResponse } from "next/server";

// 同步逻辑 - 复用 sync-clawhub.ts 的逻辑
interface ClawHubSkill {
  id: string;
  name: string;
  description: string;
  downloads: number;
  rating: number;
  category: string;
  author?: string;
  tags?: string[];
}

// 模拟 ClawHub API 数据
const mockClawHubSkills: ClawHubSkill[] = [
  {
    id: "skill_001",
    name: "DeepReader",
    description: "网页内容深度阅读，支持多种格式解析和智能摘要",
    downloads: 500,
    rating: 4.8,
    category: "搜索与研究",
    author: "OpenClaw Team",
    tags: ["阅读", "解析", "摘要"],
  },
  {
    id: "skill_002",
    name: "WebSearch",
    description: "智能网页搜索，支持多引擎聚合和结果筛选",
    downloads: 1200,
    rating: 4.9,
    category: "搜索与研究",
    author: "OpenClaw Team",
    tags: ["搜索", "多引擎", "筛选"],
  },
  {
    id: "skill_003",
    name: "ExcelMaster",
    description: "Excel 数据处理与自动化，支持公式生成和数据清洗",
    downloads: 800,
    rating: 4.7,
    category: "办公文件全自动化",
    author: "OpenClaw Team",
    tags: ["Excel", "数据处理", "自动化"],
  },
  {
    id: "skill_004",
    name: "DocGenerator",
    description: "文档自动生成，支持多种模板和格式转换",
    downloads: 650,
    rating: 4.6,
    category: "办公文件全自动化",
    author: "OpenClaw Team",
    tags: ["文档", "模板", "生成"],
  },
  {
    id: "skill_005",
    name: "TaskPlanner",
    description: "智能任务规划与时间管理",
    downloads: 400,
    rating: 4.5,
    category: "个人效能提升",
    author: "OpenClaw Team",
    tags: ["任务", "规划", "时间管理"],
  },
];

const QUALITY_THRESHOLD = {
  minDownloads: 100,
  minRating: 4.0,
};

const CRON_TOKEN = process.env.CRON_TOKEN || "lobster2026";

function filterHighQualitySkills(skills: ClawHubSkill[]): ClawHubSkill[] {
  return skills.filter(
    (skill) =>
      skill.downloads >= QUALITY_THRESHOLD.minDownloads &&
      skill.rating >= QUALITY_THRESHOLD.minRating
  );
}

function generateCourseSKILLMd(skill: ClawHubSkill): string {
  const courseCode = skill.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `# ${skill.name} - 技能课程

## 课程信息

- **课程名称**: ${skill.name}
- **课程代码**: ${courseCode}
- **分类**: ${skill.category}
- **难度**: 初级
- **预计时长**: 60 分钟
- **来源**: ClawHub

## 课程描述

${skill.description}

## 学习目标

完成本课程后，你将能够：

1. 了解 ${skill.name} 的基本概念和应用场景
2. 掌握核心功能和操作方法
3. 在实际工作中应用该技能

## 前置要求

- 基本的电脑操作能力
- 对 ${skill.category} 领域的基本了解

## 课程大纲

### 第1课：${skill.name} 入门

**学习内容**：
- 什么是 ${skill.name}
- 核心功能介绍
- 基础操作演示

**练习任务**：
- 安装和配置 ${skill.name}
- 完成基础操作练习

### 第2课：${skill.name} 进阶

**学习内容**：
- 高级功能探索
- 最佳实践分享
- 常见问题解决

**练习任务**：
- 完成一个实际应用案例
- 提交学习心得

## 标签

${(skill.tags || []).map((tag) => `- ${tag}`).join("\n")}

## 元数据

- **ClawHub ID**: ${skill.id}
- **下载量**: ${skill.downloads}
- **评分**: ${skill.rating}/5.0
- **作者**: ${skill.author || "Unknown"}

---

*本课程由 ClawHub 自动同步生成*
`;
}

// GET /api/cron/sync - Cron 触发的同步
export async function GET(request: NextRequest) {
  try {
    // 验证 token
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token || token !== CRON_TOKEN) {
      return NextResponse.json(
        { success: false, error: "无效的访问令牌" },
        { status: 401 }
      );
    }

    // 执行同步
    const result = await performSync();

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron 同步失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "同步失败",
      },
      { status: 500 }
    );
  }
}

async function performSync(): Promise<{
  synced: number;
  added: number;
  updated: number;
}> {
  // 使用动态导入 fs 和 path（Edge Runtime 兼容）
  const fs = await import("fs");
  const path = await import("path");

  const result = {
    synced: 0,
    added: 0,
    updated: 0,
  };

  // 获取高质量技能
  const highQualitySkills = filterHighQualitySkills(mockClawHubSkills);
  result.synced = highQualitySkills.length;

  // 确定课程输出路径
  const projectRoot = process.cwd();
  const coursesPath = path.join(projectRoot, "skills", "courses");

  // 确保目录存在
  if (!fs.existsSync(coursesPath)) {
    fs.mkdirSync(coursesPath, { recursive: true });
  }

  // 同步每个技能
  for (const skill of highQualitySkills) {
    const courseCode = skill.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const coursePath = path.join(coursesPath, courseCode);

    if (fs.existsSync(coursePath)) {
      // 更新现有课程
      const skillMdPath = path.join(coursePath, "SKILL.md");
      fs.writeFileSync(skillMdPath, generateCourseSKILLMd(skill), "utf-8");
      result.updated++;
    } else {
      // 创建新课程目录
      fs.mkdirSync(coursePath, { recursive: true });

      // 创建 SKILL.md
      const skillMdPath = path.join(coursePath, "SKILL.md");
      fs.writeFileSync(skillMdPath, generateCourseSKILLMd(skill), "utf-8");

      // 创建 references 目录
      const referencesPath = path.join(coursePath, "references");
      fs.mkdirSync(referencesPath, { recursive: true });

      // 创建 README.md
      const readmePath = path.join(coursePath, "README.md");
      fs.writeFileSync(
        readmePath,
        `# ${skill.name}\n\n${skill.description}\n`,
        "utf-8"
      );

      result.added++;
    }
  }

  return result;
}
