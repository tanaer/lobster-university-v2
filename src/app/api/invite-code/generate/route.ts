import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inviteCodes } from "@/lib/db/schema-lobster";
import { nanoid } from "nanoid";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 去掉容易混淆的 I/O/0/1
  let code = "LX-";
  for (let i = 0; i < 32; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if (i === 7 || i === 15 || i === 23) code += "-"; // 每8位加横杠方便阅读
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId } = body;

    if (!studentId || typeof studentId !== "string") {
      return NextResponse.json(
        { error: "缺少 studentId 参数" },
        { status: 400 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72小时后过期

    await db.insert(inviteCodes).values({
      id: nanoid(),
      code,
      studentId,
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      code,
      expiresAt: Math.floor(expiresAt.getTime() / 1000),
    });
  } catch (error) {
    console.error("Generate invite code error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
