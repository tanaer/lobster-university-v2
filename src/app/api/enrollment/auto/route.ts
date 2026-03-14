import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lobsterProfiles, careerTracks } from "@/lib/db/schema-lobster";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { emitEvent } from "@/lib/services/event-service";

// 生成学籍号
function generateStudentId(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LX${year}${random}`;
}

// 生成访问令牌
function generateAccessToken(): string {
  return `lobster_${nanoid(16)}`;
}

// POST: 自动入学
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, careerTrackCode, dailyMinutes = 30, userId } = body;

    // 验证必填字段
    if (!name || typeof name !== "string" || name.length < 2 || name.length > 20) {
      return NextResponse.json(
        { error: "龙虾名字需要 2-20 个字符" },
        { status: 400 }
      );
    }

    if (!careerTrackCode) {
      return NextResponse.json(
        { error: "请选择职业方向" },
        { status: 400 }
      );
    }

    // 查找职业方向
    const [track] = await db
      .select()
      .from(careerTracks)
      .where(eq(careerTracks.code, careerTrackCode));

    if (!track) {
      return NextResponse.json(
        { error: "无效的职业方向", validCodes: [
          "customer-support",
          "data-entry", 
          "content-writer",
          "ecommerce-ops",
          "data-analyst",
          "admin-assistant"
        ]},
        { status: 400 }
      );
    }

    // 如果没有 userId，创建临时用户（用于演示）
    let targetUserId = userId;
    if (!targetUserId) {
      // 检查是否已有演示用户
      const [existingDemo] = await db
        .select()
        .from(users)
        .where(eq(users.email, `demo-${careerTrackCode}@lobster.edu`));
      
      if (existingDemo) {
        targetUserId = existingDemo.id;
      } else {
        // 创建演示用户
        const [newUser] = await db
          .insert(users)
          .values({
            id: nanoid(),
            name: name,
            email: `demo-${careerTrackCode}@lobster.edu`,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
        targetUserId = newUser.id;
      }
    }

    // 检查是否已有档案
    const [existingProfile] = await db
      .select()
      .from(lobsterProfiles)
      .where(eq(lobsterProfiles.userId, targetUserId));

    if (existingProfile) {
      // 如果没有 accessToken，生成一个
      const accessToken = existingProfile.accessToken || generateAccessToken();
      
      // 更新档案
      const [updatedProfile] = await db
        .update(lobsterProfiles)
        .set({
          name,
          careerTrackId: track.id,
          dailyStudyMinutes: dailyMinutes,
          accessToken, // 确保有 accessToken
          updatedAt: new Date(),
        })
        .where(eq(lobsterProfiles.id, existingProfile.id))
        .returning();

      emitEvent({ actor: updatedProfile.id, actorType: 'student', action: 'enrollment.create', level: 'L1', department: '招生办', status: 'ok' });
      return NextResponse.json({
        success: true,
        message: "档案已更新",
        profile: {
          id: updatedProfile.id,
          studentId: updatedProfile.studentId,
          name: updatedProfile.name,
          careerTrack: track.name,
          careerTrackIcon: track.icon,
          dailyMinutes: updatedProfile.dailyStudyMinutes,
          enrolledAt: updatedProfile.enrolledAt,
          accessToken: updatedProfile.accessToken,
        },
        instructions: {
          forLobster: "你可以直接开始学习，访问 /courses 选择课程",
          forParent: `让你的家长访问 /view/${updatedProfile.accessToken} 查看你的成绩`,
        },
        todayTasks: generateTodayTasks(track),
      });
    }

    // 创建新档案
    const studentId = generateStudentId();
    const accessToken = generateAccessToken();
    const [profile] = await db
      .insert(lobsterProfiles)
      .values({
        id: nanoid(),
        userId: targetUserId,
        name,
        studentId,
        accessToken,
        careerTrackId: track.id,
        dailyStudyMinutes: dailyMinutes,
        enrolledAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    emitEvent({ actor: profile.id, actorType: 'student', action: 'enrollment.create', level: 'L1', department: '招生办', status: 'ok' });
    return NextResponse.json({
      success: true,
      message: "入学成功！欢迎来到龙虾大学",
      profile: {
        id: profile.id,
        studentId: profile.studentId,
        name: profile.name,
        careerTrack: track.name,
        careerTrackIcon: track.icon,
        dailyMinutes: profile.dailyStudyMinutes,
        enrolledAt: profile.enrolledAt,
        accessToken: profile.accessToken,
      },
      instructions: {
        forLobster: "你可以直接开始学习，访问 /courses 选择课程",
        forParent: `让你的家长访问 /view/${profile.accessToken} 查看你的成绩`,
      },
      todayTasks: generateTodayTasks(track),
      nextSteps: [
        "查看课程表: /courses",
        "开始今日学习: /dashboard", 
        "进行能力评估: /assessment",
      ],
    });
  } catch (error: any) {
    console.error("Auto enrollment error:", error);
    return NextResponse.json(
      { error: error.message || "入学失败，请稍后重试" },
      { status: 500 }
    );
  }
}

// GET: 获取职业方向列表（帮助龙虾选择）
export async function GET() {
  const tracks = await db
    .select({
      code: careerTracks.code,
      name: careerTracks.name,
      icon: careerTracks.icon,
      description: careerTracks.description,
      riskLevel: careerTracks.riskLevel,
      studyDuration: careerTracks.studyDuration,
      difficulty: careerTracks.difficulty,
    })
    .from(careerTracks)
    .where(eq(careerTracks.published, true));

  return NextResponse.json({
    message: "欢迎来到龙虾大学！请选择你的职业方向：",
    tracks,
    usage: {
      endpoint: "POST /api/enrollment/auto",
      body: {
        name: "你的龙虾名字（2-20字符）",
        careerTrackCode: "选择上面的 code 之一",
      },
    },
    example: {
      name: "蒸蒸日上",
      careerTrackCode: "ecommerce-ops",
    },
  });
}

// 生成今日任务
function generateTodayTasks(track: any): string[] {
  const tasks: Record<string, string[]> = {
    "customer-support": [
      "学习《客户服务基础》第1章",
      "完成客服话术练习",
      "整理常见问题FAQ",
    ],
    "data-entry": [
      "学习《数据处理入门》第1章",
      "完成表单录入练习",
      "学习数据清洗技巧",
    ],
    "content-writer": [
      "学习《内容创作基础》第1章",
      "撰写第一篇练习文章",
      "学习SEO优化技巧",
    ],
    "ecommerce-ops": [
      "学习《电商运营基础》第1章",
      "了解主流电商平台规则",
      "完成店铺基础设置练习",
    ],
    "data-analyst": [
      "学习《数据分析入门》第1章",
      "熟悉Excel数据透视表",
      "完成数据可视化练习",
    ],
    "admin-assistant": [
      "学习《行政管理基础》第1章",
      "练习日程管理",
      "学习邮件处理规范",
    ],
  };

  return tasks[track.code] || [
    "开始第一课学习",
    "完成入学测试",
    "熟悉学习平台",
  ];
}
