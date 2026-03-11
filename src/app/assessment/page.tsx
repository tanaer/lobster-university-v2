"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ASSESSMENT_DIMENSIONS,
  DimensionKey,
} from "@/lib/services/assessment-shared";

type Question = {
  id: string;
  question: string;
  options: Array<{ value: number; label: string }>;
};

type AssessmentData = {
  dimension: DimensionKey;
  meta: {
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  questions: Question[];
};

type RadarDataItem = {
  dimension: string;
  key: string;
  score: number;
  fullMark: number;
  icon: string;
  color: string;
};

type AnalysisData = {
  averageScore: number;
  weaknesses: Array<{
    dimension: DimensionKey;
    name: string;
    description: string;
    icon: string;
    color: string;
    score: number;
    gap: number;
    suggestion: string;
  }>;
  strongest: {
    dimension: DimensionKey;
    name: string;
    score: number;
  } | null;
  weakest: {
    dimension: DimensionKey;
    name: string;
    score: number;
  } | null;
};

type CompletionData = {
  completed: number;
  total: number;
  percentage: number;
  isComplete: boolean;
  missingDimensions: DimensionKey[];
};

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState<"select" | "questionnaire" | "report">("select");
  const [selectedDimension, setSelectedDimension] = useState<DimensionKey | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [radarData, setRadarData] = useState<RadarDataItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [completion, setCompletion] = useState<CompletionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 加载初始数据
  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assessment");
      const data = await res.json();
      if (data.radarData) setRadarData(data.radarData);
      if (data.analysis) setAnalysis(data.analysis);
      if (data.completion) setCompletion(data.completion);
    } catch (error) {
      console.error("Failed to load report:", error);
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async (dimension: DimensionKey) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assessment?action=questions&dimension=${dimension}`);
      const data = await res.json();
      setSelectedDimension(dimension);
      setAssessmentData(data);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setCurrentStep("questionnaire");
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (value: number) => {
    if (!assessmentData) return;
    const question = assessmentData.questions[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const nextQuestion = () => {
    if (!assessmentData) return;
    if (currentQuestionIndex < assessmentData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitAssessment = async () => {
    if (!selectedDimension) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dimension: selectedDimension,
          answers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRadarData(data.radarData);
        setAnalysis(data.analysis);
        setCompletion(data.completion);
        setCurrentStep("report");
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = assessmentData?.questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const allAnswered = assessmentData?.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📊</div>
          <h1 className="text-3xl font-bold text-white mb-2">五维能力评估</h1>
          <p className="text-slate-400">评估你的核心能力，发现提升空间</p>
          {completion && (
            <div className="mt-4">
              <Badge
                variant="outline"
                className={`${
                  completion.isComplete
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }`}
              >
                已完成 {completion.completed}/{completion.total} 项评估
              </Badge>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* 选择维度 */}
          {currentStep === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* 雷达图展示 */}
              {radarData.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">能力雷达图</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#475569" />
                          <PolarAngleAxis
                            dataKey="dimension"
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: "#64748b", fontSize: 10 }}
                          />
                          <Radar
                            name="能力值"
                            dataKey="score"
                            stroke="#06b6d4"
                            fill="#06b6d4"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#f1f5f9" }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 弱项分析 */}
              {analysis && analysis.weaknesses.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      🎯 提升建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.weaknesses.map((item) => (
                        <div
                          key={item.dimension}
                          className="p-4 rounded-lg bg-slate-700/50 border border-slate-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{item.icon}</span>
                              <span className="font-medium text-white">
                                {item.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 text-sm">
                                得分: {item.score}
                              </span>
                              <Badge
                                variant="outline"
                                className="bg-red-500/20 text-red-400 border-red-500/30"
                              >
                                差距: {item.gap}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm">
                            {item.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 维度选择 */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">选择评估维度</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(ASSESSMENT_DIMENSIONS).map(([key, meta]) => {
                      const dimensionData = radarData.find((d) => d.key === key);
                      const hasScore = dimensionData && dimensionData.score > 0;
                      
                      return (
                        <motion.button
                          key={key}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => startAssessment(key as DimensionKey)}
                          disabled={loading}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            hasScore
                              ? "bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20"
                              : "bg-slate-700/50 border-slate-600 hover:bg-slate-700"
                          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{meta.icon}</span>
                              <span className="font-medium text-white">
                                {meta.name}
                              </span>
                            </div>
                            {hasScore && (
                              <Badge
                                variant="outline"
                                className="bg-green-500/20 text-green-400 border-green-500/30"
                              >
                                {dimensionData.score}分
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm">
                            {meta.description}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* 问卷 */}
          {currentStep === "questionnaire" && assessmentData && currentQuestion && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{assessmentData.meta.icon}</span>
                      <div>
                        <CardTitle className="text-white">
                          {assessmentData.meta.name}
                        </CardTitle>
                        <p className="text-slate-400 text-sm">
                          {assessmentData.meta.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                    >
                      {currentQuestionIndex + 1} / {assessmentData.questions.length}
                    </Badge>
                  </div>
                  {/* 进度条 */}
                  <div className="mt-4">
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                        style={{
                          width: `${((currentQuestionIndex + 1) / assessmentData.questions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl text-white font-medium">
                      {currentQuestion.question}
                    </h3>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleAnswer(option.value)}
                          className={`w-full p-4 rounded-lg border text-left transition-all ${
                            currentAnswer === option.value
                              ? "bg-cyan-500/20 border-cyan-500 text-white"
                              : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                currentAnswer === option.value
                                  ? "border-cyan-500 bg-cyan-500"
                                  : "border-slate-500"
                              }`}
                            >
                              {currentAnswer === option.value && (
                                <span className="text-white text-sm">✓</span>
                              )}
                            </div>
                            <span>{option.label}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        上一题
                      </Button>

                      {currentQuestionIndex < assessmentData.questions.length - 1 ? (
                        <Button
                          onClick={nextQuestion}
                          disabled={currentAnswer === undefined}
                          className="bg-cyan-500 hover:bg-cyan-600 text-white"
                        >
                          下一题
                        </Button>
                      ) : (
                        <Button
                          onClick={submitAssessment}
                          disabled={!allAnswered || submitting}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          {submitting ? "提交中..." : "提交评估"}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>

              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep("select")}
                  className="text-slate-400 hover:text-white"
                >
                  返回选择
                </Button>
              </div>
            </motion.div>
          )}

          {/* 报告 */}
          {currentStep === "report" && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    评估完成！
                  </h2>
                  <p className="text-slate-400">
                    你的{assessmentData?.meta.name}评估已提交
                  </p>
                </CardContent>
              </Card>

              {/* 更新后的雷达图 */}
              {radarData.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">更新后的能力雷达图</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#475569" />
                          <PolarAngleAxis
                            dataKey="dimension"
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: "#64748b", fontSize: 10 }}
                          />
                          <Radar
                            name="能力值"
                            dataKey="score"
                            stroke="#06b6d4"
                            fill="#06b6d4"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#f1f5f9" }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="text-center">
                <Button
                  onClick={() => {
                    setCurrentStep("select");
                    setSelectedDimension(null);
                    setAssessmentData(null);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  继续评估其他维度
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
