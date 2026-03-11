"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DailyReminderData = {
  streak: number;
  todayStats: {
    todayStudyMinutes: number;
    dailyGoal: number;
    goalMet: boolean;
    progress: number;
  };
  suggestion: {
    message: string;
    type: "encourage" | "challenge" | "remind" | "celebrate";
    action?: string;
  };
  settings: {
    enabled: boolean;
    reminderTime: string;
    notifyBeforeGoal: boolean;
  };
  profile: {
    name: string;
    careerTrackId: string | null;
  };
};

type Props = {
  className?: string;
};

export function DailyReminder({ className }: Props) {
  const [data, setData] = useState<DailyReminderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminderData();
  }, []);

  const loadReminderData = async () => {
    try {
      const res = await fetch("/api/reminder");
      if (res.ok) {
        const reminderData = await res.json();
        setData(reminderData);
      }
    } catch (error) {
      console.error("Failed to load reminder data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const getSuggestionIcon = () => {
    switch (data.suggestion.type) {
      case "celebrate":
        return "🎉";
      case "challenge":
        return "💪";
      case "encourage":
        return "🚀";
      case "remind":
        return "⏰";
      default:
        return "💡";
    }
  };

  const getProgressColor = () => {
    if (data.todayStats.goalMet) return "bg-green-500";
    if (data.todayStats.progress >= 50) return "bg-yellow-500";
    return "bg-cyan-500";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 连续学习天数 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🔥</div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {data.streak}
                  </div>
                  <div className="text-orange-300 text-sm">天连续学习</div>
                </div>
              </div>
              {data.streak >= 7 && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  自律达人！
                </Badge>
              )}
              {data.streak >= 3 && data.streak < 7 && (
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  保持势头！
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 今日学习建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <span className="text-2xl">{getSuggestionIcon()}</span>
              今日建议
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-3">{data.suggestion.message}</p>
            {data.suggestion.action && (
              <div className="flex items-center gap-2 text-sm text-cyan-400">
                <span>→</span>
                <span>{data.suggestion.action}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 今日目标进度 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              📅 今日目标
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">学习进度</span>
                <span className="text-white font-medium">
                  {data.todayStats.todayStudyMinutes} / {data.todayStats.dailyGoal} 分钟
                </span>
              </div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(data.todayStats.progress, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${getProgressColor()}`}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">
                  {data.todayStats.progress}% 完成
                </span>
                {data.todayStats.goalMet ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    ✓ 今日目标已达成
                  </Badge>
                ) : (
                  <span className="text-slate-400 text-sm">
                    还需 {data.todayStats.dailyGoal - data.todayStats.todayStudyMinutes} 分钟
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 快捷操作 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => {
              window.location.href = "/assessment";
            }}
          >
            📊 能力评估
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => {
              window.location.href = "/courses";
            }}
          >
            📚 开始学习
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
