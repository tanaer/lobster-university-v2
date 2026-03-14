import { NextRequest, NextResponse } from "next/server";
import {
  submitAssessment,
  getAssessmentReport,
  generateRadarData,
  analyzeWeaknesses,
  checkAssessmentCompletion,
  getAssessmentQuestions,
  ASSESSMENT_DIMENSIONS,
  DimensionKey,
} from "@/lib/services/assessment-service";
import { emitEvent } from "@/lib/services/event-service";

// GET: 获取评估报告或问题
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const dimension = searchParams.get("dimension") as DimensionKey | null;

    switch (action) {
      case "questions":
        // 获取指定维度的问题
        if (!dimension || !ASSESSMENT_DIMENSIONS[dimension]) {
          return NextResponse.json(
            { error: "无效的评估维度" },
            { status: 400 }
          );
        }
        return NextResponse.json({
          dimension,
          meta: ASSESSMENT_DIMENSIONS[dimension],
          questions: getAssessmentQuestions(dimension),
        });

      case "radar":
        // 获取雷达图数据
        const report = await getAssessmentReport();
        const radarData = generateRadarData(report);
        return NextResponse.json({ radarData });

      case "analysis":
        // 获取弱项分析
        const reportForAnalysis = await getAssessmentReport();
        const analysis = analyzeWeaknesses(reportForAnalysis);
        return NextResponse.json({ analysis });

      case "completion":
        // 获取评估完成度
        const completion = await checkAssessmentCompletion();
        return NextResponse.json({ completion });

      case "dimensions":
        // 获取所有维度定义
        return NextResponse.json({ dimensions: ASSESSMENT_DIMENSIONS });

      default:
        // 默认返回完整报告
        const fullReport = await getAssessmentReport();
        const fullRadarData = generateRadarData(fullReport);
        const fullAnalysis = analyzeWeaknesses(fullReport);
        const fullCompletion = await checkAssessmentCompletion();

        return NextResponse.json({
          report: fullReport,
          radarData: fullRadarData,
          analysis: fullAnalysis,
          completion: fullCompletion,
          dimensions: ASSESSMENT_DIMENSIONS,
        });
    }
  } catch (error: any) {
    console.error("Assessment GET error:", error);
    return NextResponse.json(
      { error: error.message || "获取评估数据失败" },
      { status: 500 }
    );
  }
}

// POST: 提交评估答案
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dimension, answers } = body;

    // 验证
    if (!dimension || !ASSESSMENT_DIMENSIONS[dimension as DimensionKey]) {
      return NextResponse.json(
        { error: "无效的评估维度" },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "请提交评估答案" },
        { status: 400 }
      );
    }

    // 验证答案格式
    const questions = getAssessmentQuestions(dimension as DimensionKey);
    const validAnswerKeys = new Set(questions.map(q => q.id));
    
    for (const key of Object.keys(answers)) {
      if (!validAnswerKeys.has(key)) {
        return NextResponse.json(
          { error: `无效的问题ID: ${key}` },
          { status: 400 }
        );
      }
      const value = answers[key];
      if (typeof value !== "number" || value < 1 || value > 5) {
        return NextResponse.json(
          { error: `答案值必须在1-5之间: ${key}` },
          { status: 400 }
        );
      }
    }

    // 提交评估
    const assessment = await submitAssessment({
      dimension: dimension as DimensionKey,
      answers,
    });

    // 返回更新后的报告
    const report = await getAssessmentReport();
    const radarData = generateRadarData(report);
    const analysis = analyzeWeaknesses(report);
    const completion = await checkAssessmentCompletion();

    emitEvent({ actor: assessment.profileId, actorType: 'student', action: 'assessment.submit', level: 'L1', target: assessment.id, targetType: 'assessment', department: '学生服务', status: 'ok', metadata: { dimension } });
    return NextResponse.json({
      success: true,
      assessment,
      report,
      radarData,
      analysis,
      completion,
    });
  } catch (error: any) {
    console.error("Assessment POST error:", error);
    return NextResponse.json(
      { error: error.message || "提交评估失败" },
      { status: 500 }
    );
  }
}
