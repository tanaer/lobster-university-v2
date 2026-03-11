"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 职业方向数据
const careerTracks = [
  {
    id: "customer-support",
    code: "customer-support",
    name: "客户服务专员",
    icon: "💬",
    description: "在线客服、工单处理、用户咨询",
    riskLevel: "极高",
    studyDuration: 14,
    difficulty: 1,
    capabilities: ["处理客户咨询", "生成客服日报", "维护FAQ知识库"],
  },
  {
    id: "data-entry",
    code: "data-entry",
    name: "数据录入员",
    icon: "📝",
    description: "表单处理、数据清洗、文档整理",
    riskLevel: "极高",
    studyDuration: 7,
    difficulty: 1,
    capabilities: ["完成数据录入", "清洗脏数据", "批量处理文档"],
  },
  {
    id: "content-writer",
    code: "content-writer",
    name: "内容创作专员",
    icon: "✍️",
    description: "博客撰写、SEO内容、产品描述",
    riskLevel: "极高",
    studyDuration: 21,
    difficulty: 2,
    capabilities: ["撰写SEO文章", "产出产品文案", "运营社媒账号"],
  },
  {
    id: "ecommerce-ops",
    code: "ecommerce-ops",
    name: "电商运营专员",
    icon: "🛒",
    description: "店铺日常运营、销售数据分析、活动策划",
    riskLevel: "高",
    studyDuration: 21,
    difficulty: 2,
    capabilities: ["完成店铺运营", "生成销售日报", "策划促销活动"],
  },
  {
    id: "data-analyst",
    code: "data-analyst",
    name: "数据分析专员",
    icon: "📊",
    description: "报表生成、数据可视化、趋势分析",
    riskLevel: "高",
    studyDuration: 28,
    difficulty: 3,
    capabilities: ["生成业务报表", "制作数据看板", "输出分析报告"],
  },
  {
    id: "admin-assistant",
    code: "admin-assistant",
    name: "行政助理",
    icon: "📋",
    description: "日程管理、邮件处理、会议安排",
    riskLevel: "高",
    studyDuration: 14,
    difficulty: 2,
    capabilities: ["管理领导日程", "处理日常邮件", "组织安排会议"],
  },
];

export default function EnrollmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    selectedTrack: "",
    dailyMinutes: 30,
    reminderTime: "09:00",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step === 1 && formData.name.trim()) {
      setStep(2);
    } else if (step === 2 && formData.selectedTrack) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "极高": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "高": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return "⭐".repeat(difficulty);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step >= s
                    ? "bg-cyan-500 border-cyan-500 text-white"
                    : "border-slate-600 text-slate-600"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="flex text-sm text-slate-400 justify-between">
            <span>命名龙虾</span>
            <span>选择方向</span>
            <span>学习设置</span>
          </div>
        </div>

        {/* Step 1: 命名龙虾 */}
        {step === 1 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                🦞 给你的龙虾起个名字
              </CardTitle>
              <CardDescription className="text-slate-400">
                这是你的数字员工，给它一个有意义的名字吧
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">龙虾名字</Label>
                <Input
                  id="name"
                  placeholder="例如：蒸蒸日上、学霸007、蒜蓉粉丝..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-500">
                  2-20个字符，支持中文、英文、数字
                </p>
              </div>
              
              {formData.name && (
                <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <p className="text-cyan-400">
                    预览: <span className="text-xl font-bold">🦞 {formData.name}</span>
                  </p>
                </div>
              )}
              
              <Button
                onClick={handleNext}
                disabled={!formData.name.trim()}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                下一步：选择职业方向
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: 选择职业方向 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                选择 🦞 {formData.name} 的职业方向
              </h2>
              <p className="text-slate-400">
                根据市场需求和 AI 替代风险排序，选择一个最适合的方向
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careerTracks.map((track) => (
                <Card
                  key={track.id}
                  className={`cursor-pointer transition-all ${
                    formData.selectedTrack === track.id
                      ? "bg-cyan-500/20 border-cyan-500"
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-500"
                  }`}
                  onClick={() => setFormData({ ...formData, selectedTrack: track.id })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{track.icon}</span>
                        <div>
                          <CardTitle className="text-lg text-white">{track.name}</CardTitle>
                          <p className="text-sm text-slate-400">{track.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className={getRiskColor(track.riskLevel)}>
                        替代风险: {track.riskLevel}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-700 text-slate-300">
                        {track.studyDuration} 天
                      </Badge>
                      <Badge variant="outline" className="bg-slate-700 text-slate-300">
                        {getDifficultyStars(track.difficulty)}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-400">
                      <p className="font-medium text-slate-300 mb-1">核心能力:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {track.capabilities.map((cap, i) => (
                          <li key={i}>{cap}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-slate-600 text-slate-300"
              >
                上一步
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.selectedTrack}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                下一步：学习设置
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: 学习设置 */}
        {step === 3 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                设置 🦞 {formData.name} 的学习计划
              </CardTitle>
              <CardDescription className="text-slate-400">
                龙虾会按照你的设置自主学习并汇报进度
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">每日学习时长目标</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={formData.dailyMinutes}
                    onChange={(e) => setFormData({ ...formData, dailyMinutes: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-cyan-400 font-bold w-20 text-right">
                    {formData.dailyMinutes} 分钟
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminder" className="text-slate-300">学习提醒时间</Label>
                <Input
                  id="reminder"
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
              
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                <h3 className="font-medium text-white mb-3">入学确认</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>龙虾名字: <span className="text-cyan-400">🦞 {formData.name}</span></p>
                  <p>职业方向: <span className="text-cyan-400">
                    {careerTracks.find(t => t.id === formData.selectedTrack)?.name}
                  </span></p>
                  <p>每日学习: <span className="text-cyan-400">{formData.dailyMinutes} 分钟</span></p>
                  <p>学习周期: <span className="text-cyan-400">
                    {careerTracks.find(t => t.id === formData.selectedTrack)?.studyDuration} 天
                  </span></p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="border-slate-600 text-slate-300"
                >
                  上一步
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  {isSubmitting ? "正在入学..." : "确认入学"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
