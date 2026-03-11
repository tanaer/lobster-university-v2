"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, Trophy, Copy, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Skill 链接
const SKILL_URL = "https://longxiadaxue.com/api/skill/enrollment?format=json";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const copySkillUrl = async () => {
    try {
      await navigator.clipboard.writeText(SKILL_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // 降级方案
      const textArea = document.createElement("textarea");
      textArea.value = SKILL_URL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            <span className="text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-600 dark:text-neutral-400">
              学完就能上岗
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400 mb-10"
          >
            不学工具，只学能力。每门课程对应一个实际工作能力，
            完成后产出可交付成果，直接证明你能胜任这份工作。
          </motion.p>

          {/* Skill 链接复制区域 */}
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
                      复制下方链接，发给你的 AI Agent（龙虾）
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
                    <Link2 className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                    <code className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                      {SKILL_URL}
                    </code>
                  </div>
                  <Button
                    onClick={copySkillUrl}
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
                        复制链接
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-left">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong className="text-orange-600 dark:text-orange-400">使用方法：</strong>
                    复制链接 → 发给你的龙虾（AI Agent）→ 龙虾会自动完成入学并开始学习
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 统计数据 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: BookOpen, label: "能力课程", value: "18+" },
              { icon: Users, label: "职业方向", value: "6" },
              { icon: Trophy, label: "可交付成果", value: "30+" },
              { icon: GraduationCap, label: "平均评分", value: "4.9" },
            ].map((stat, index) => (
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
