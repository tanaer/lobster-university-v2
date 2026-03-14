import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inviteCodes, parentStudentBindings, parents, lobsterProfiles, careerTracks } from "@/lib/db/schema-lobster";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { code, confirm } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "请输入邀请码" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // 查找邀请码
    const [invite] = await db
      .select()
      .from(inviteCodes)
      .where(eq(inviteCodes.code, normalizedCode))
      .limit(1);

    if (!invite) {
      return NextResponse.json({ error: "邀请码不存在" }, { status: 404 });
    }

    // 检查是否锁定
    if (invite.lockedUntil && new Date(invite.lockedUntil) > new Date()) {
      const remainMin = Math.ceil(
        (new Date(invite.lockedUntil).getTime() - Date.now()) / 60000
      );
      return NextResponse.json(
        { error: `邀请码已锁定，请 ${remainMin} 分钟后重试` },
        { status: 429 }
      );
    }

    // 检查是否已使用
    if (invite.used) {
      return NextResponse.json({ error: "邀请码已被使用" }, { status: 400 });
    }

    // 检查是否过期
    if (new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json({ error: "邀请码已过期" }, { status: 400 });
    }

    // 查找学员信息
    const [student] = await db
      .select({
        id: lobsterProfiles.id,
        name: lobsterProfiles.name,
        avatar: lobsterProfiles.avatar,
        studentId: lobsterProfiles.studentId,
        careerTrackId: lobsterProfiles.careerTrackId,
        status: lobsterProfiles.status,
      })
      .from(lobsterProfiles)
      .where(eq(lobsterProfiles.id, invite.studentId))
      .limit(1);

    if (!student) {
      // 记录失败次数
      const newAttempts = (invite.failedAttempts || 0) + 1;
      const updateData: Record<string, unknown> = { failedAttempts: newAttempts };
      if (newAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 60 * 60 * 1000); // 锁定1小时
      }
      await db.update(inviteCodes).set(updateData).where(eq(inviteCodes.id, invite.id));
      return NextResponse.json({ error: "关联学员不存在" }, { status: 404 });
    }

    // 获取职业方向名称
    let careerTrackName: string | undefined;
    if (student.careerTrackId) {
      const [track] = await db
        .select({ name: careerTracks.name })
        .from(careerTracks)
        .where(eq(careerTracks.id, student.careerTrackId))
        .limit(1);
      careerTrackName = track?.name;
    }

    // 如果不是确认绑定，只返回学员信息
    if (!confirm) {
      return NextResponse.json({
        success: true,
        student: {
          id: student.id,
          name: student.name,
          level: student.status === "active" ? "在读" : student.status,
          careerTrack: careerTrackName,
          avatar: student.avatar,
        },
      });
    }

    // 确认绑定流程
    const userId = session.user.id;

    // 查找或创建家长记录
    let [parent] = await db
      .select()
      .from(parents)
      .where(eq(parents.id, userId))
      .limit(1);

    if (!parent) {
      await db.insert(parents).values({
        id: userId,
        name: session.user.name || "家长",
        email: session.user.email || null,
        avatar: session.user.image || null,
        provider: "email", // better-auth 管理实际 provider
        providerId: userId,
      });
      [parent] = await db.select().from(parents).where(eq(parents.id, userId)).limit(1);
    }

    // 检查是否已绑定
    const [existing] = await db
      .select()
      .from(parentStudentBindings)
      .where(
        and(
          eq(parentStudentBindings.parentId, userId),
          eq(parentStudentBindings.studentId, student.id)
        )
      )
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "您已绑定该学员" }, { status: 400 });
    }

    // 创建绑定
    await db.insert(parentStudentBindings).values({
      id: nanoid(),
      parentId: userId,
      studentId: student.id,
    });

    // 标记邀请码已使用
    await db
      .update(inviteCodes)
      .set({
        used: true,
        parentId: userId,
      })
      .where(eq(inviteCodes.id, invite.id));

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        level: student.status === "active" ? "在读" : student.status,
        careerTrack: careerTrackName,
      },
    });
  } catch (error) {
    console.error("Parent bind error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
