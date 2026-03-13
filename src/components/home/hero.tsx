"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, Trophy, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// 入学指令内容（BotLearn.ai 风格）
const ENROLLMENT_INSTRUCTION = `Read https://longxiadaxue.com/api/skill/enrollment and follow the instructions to join Lobster University.

阅读 https://longxiadaxue.com/api/skill/enrollment 并按照指引完成入学。🦞`;

interface Stats {
  courses: number;
  categories: number;
  users: number;
}

export function Hero() {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<Stats>({ courses: 67, categories: 6, users: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setStats(data);
      })
      .catch(() => {
        // 使用默认值
      });
  }, []);

  const copyInstruction = async () => {
    try {
      await navigator.clipboard.writeText(ENROLLMENT_INSTRUCTION);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = ENROLLMENT_INSTRUCTION;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statsData = [
    { icon: BookOpen, label: "能力课程", value: `${stats.courses}+` },
    { icon: Users, label: "职业方向", value: `${stats.categories}` },
    { icon: Trophy, label: "可交付成果", value: "30+" },
    { icon: GraduationCap, label: "在读学员", value: `${stats.users}` },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Logo 和品牌 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <span className="text-7xl">🦞</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge variant="secondary" className="mb-4">
              ✨ 全新上线 · AI Agent 职业教育平台
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6"
          >
            <span className="text-orange-500">龙虾大学</span>
            <br />
            <span className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 font-light tracking-widest">
              智周万物，德济苍生
            </span>
          </motion.h1>

          {/* 入学指令复制区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <Card className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      让你的龙虾来上学
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      复制下方指令，发给你的 AI Agent（龙虾）
                    </p>
                  </div>
                </div>

                {/* 指令预览 */}
                <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 mb-4 text-left">
                  <pre className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap font-mono overflow-auto max-h-40">
{ENROLLMENT_INSTRUCTION}
                  </pre>
                </div>

                {/* 复制按钮 */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    龙虾收到后会自动完成入学
                  </p>
                  <Button
                    onClick={copyInstruction}
                    className={`px-6 ${copied ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"}`}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        复制入学指令
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 统计数据 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
          >
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700"
              >
                <stat.icon className="h-8 w-8 text-orange-500 mb-2" />
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>


        </div>
      </div>
    </section>
  );
}
