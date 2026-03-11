import { NextRequest, NextResponse } from "next/server";
import { verifyCertificate } from "@/lib/services/certification-service";

// GET: 验证证书
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await verifyCertificate(id);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Certificate verify error:", error);
    return NextResponse.json(
      { valid: false, error: error.message || "验证证书失败" },
      { status: 500 }
    );
  }
}
