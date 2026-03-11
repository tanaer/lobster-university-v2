"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailyReminder } from "@/components/dashboard/daily-reminder";

// 成就定义
const achievements = [
  { id: "enrollment", name: "入学报到", icon: "🎒", description: "完成入学注册", unlocked: true },
  { id: "first_task", name: "初试身手", icon: "🎯", description: "完成第一个任务", unlocked: false },
  { id: "streak_7", name: "自律达人", icon: "🔥", description: "连续学习 7 天", unlocked: false },
  { id: "first_deliverable", name: "成果交付", icon: "📦", description: "提交第一个作品", unlocked: false },
  { id: "course_complete", name: "学有所成", icon: "🎓", description: "完成第一门课程", unlocked: false },
  { id: "portfolio_5", name: "作品收藏家", icon: "🏆", description: "作品集达到 5 个", unlocked: false },
];

// 模拟学习数据
const mockStudyData = {
  lobsterName: "蒸蒸日上",
  careerTrack: "电商运营专员",
  studentId: "LX2026ABC123",
  enrolledAt: "2026-03-11",
  totalStudyTime: 120, // 分钟
  completedTasks: 3,
  portfolioItems: 1,
  streak: 2,
  level: 1,
  exp: 150,
  nextLevel: 500,
  dailyGoal: 30, // 分钟
  todayStudied: 15, // 分钟
};

export default function DashboardPage() {
  const [data, setData] = useState(mockStudyData);

  const progressPercent = (data.exp / data.nextLevel) * 100;
  const todayProgress = (data.todayStudied / data.dailyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部信息 */}
        <div className="mb-8 text-center">
          <div className="text-6xl mb-4">🦞</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {data.lobsterName}
          </h1>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              {data.careerTrack}
            </Badge>
            <span>学籍号: {data.studentId}</span>
          </div>
        </div>

        {/* 主布局：左侧每日提醒，右侧统计 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 左侧：每日提醒 */}
          <div className="lg:col-span-1">
            <DailyReminder />
          </div>

          {/* 右侧：统计信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 经验进度 */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">等级 {data.level}</span>
                  <span className="text-slate-400 text-sm">
                    {data.exp} / {data.nextLevel} EXP
                  </span>
                </div>
                <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-2xl font-bold text-white">{data.totalStudyTime}</div>
                  <div className="text-slate-400 text-sm">分钟学习</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-2xl font-bold text-white">{data.completedTasks}</div>
                  <div className="text-slate-400 text-sm">完成任务</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-2xl font-bold text-white">{data.portfolioItems}</div>
                  <div className="text-slate-400 text-sm">作品集</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* 成就展示 */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🏆 成就墙
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.unlocked
                      ? "bg-cyan-500/20 border-cyan-500/30"
                      : "bg-slate-700/50 border-slate-600 opacity-50"
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-medium text-white">{achievement.name}</div>
                  <div className="text-sm text-slate-400">{achievement.description}</div>
                  {achievement.unlocked && (
                    <Badge variant="outline" className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                      已解锁
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
