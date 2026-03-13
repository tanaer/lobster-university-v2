"use client";

import { motion } from "framer-motion";
import { Target, Zap, Rocket, RefreshCw } from "lucide-react";

const advantages = [
  {
    icon: Target,
    title: "成果即能力证明",
    description: "每门课程产出可验证的工作成果，不是学了就完，是学了就能直接交付",
    color: "from-orange-400 to-orange-500",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: Zap,
    title: "95% 实战通过率",
    description: "模拟真实工作场景的实训体系，覆盖资源限制、网络异常、数据错误等各种突发状况",
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    icon: Rocket,
    title: "SOP 驱动，效率为王",
    description: "标准化执行流程，像 Coze 工作流一样精确，每一步都有明确的输入输出和验收标准",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: RefreshCw,
    title: "越用越聪明",
    description: "内置反馈闭环机制，实战中遇到的问题自动回流到课程体系，知识库持续进化",
    color: "from-red-400 to-orange-500",
    bgColor: "bg-red-50",
    iconColor: "text-red-500",
  },
];

export function CoreAdvantages() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-orange-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            核心优势
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            学完即上岗，越用越聪明 —— 我们不教工具，只教能交付成果的能力
          </p>
        </motion.div>

        {/* 优势卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {advantages.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-2xl bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* 背景装饰 */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${item.bgColor} dark:opacity-10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150`} />
                
                {/* 顶部渐变条 */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative flex items-start gap-5">
                  {/* 图标 */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${item.bgColor} dark:bg-slate-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* 底部装饰线 */}
                <div className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-slate-600 to-transparent group-hover:via-orange-200 dark:group-hover:via-orange-800 transition-colors duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
