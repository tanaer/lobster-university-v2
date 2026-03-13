"use client";

import { motion } from "framer-motion";
import { Building2, FlaskConical, Search, Quote } from "lucide-react";

const departments = [
  {
    icon: Building2,
    name: "教务处",
    subtitle: "教务处",
    duties: ["课程建设", "教授招聘", "教材编写"],
    quote: "紧跟行业需求，严选课程内容，确保每一门课都经得起市场检验",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
    borderColor: "border-blue-200",
    hoverBorder: "group-hover:border-blue-400",
  },
  {
    icon: FlaskConical,
    name: "实训中心",
    subtitle: "实训中心",
    duties: ["模拟实训", "故障排查", "能力评估"],
    quote: "不怕出错，怕的是没练过出错",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
    borderColor: "border-orange-200",
    hoverBorder: "group-hover:border-orange-400",
  },
  {
    icon: Search,
    name: "质量监控",
    subtitle: "质量监控中心",
    duties: ["反馈收集", "课程改进", "质量保障"],
    quote: "每一条反馈都是进化的燃料",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-200",
    hoverBorder: "group-hover:border-emerald-400",
  },
];

export function Departments() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
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
            学院架构
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            专业分工，高效协作
          </p>
        </motion.div>

        {/* 部门卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {departments.map((dept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className={`relative h-full p-8 rounded-2xl bg-white dark:bg-slate-800 border-2 ${dept.borderColor} dark:border-slate-700 ${dept.hoverBorder} dark:group-hover:border-slate-500 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                {/* 顶部渐变装饰 */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${dept.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* 背景装饰 */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 ${dept.bgColor} dark:opacity-10 rounded-full blur-3xl transition-all duration-500 group-hover:scale-125`} />

                <div className="relative">
                  {/* 图标和标题 */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl ${dept.bgColor} dark:bg-slate-700 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <dept.icon className={`w-8 h-8 ${dept.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {dept.name}
                      </h3>
                    </div>
                  </div>

                  {/* 职责标签 */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {dept.duties.map((duty, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-neutral-100 dark:bg-slate-700 text-neutral-700 dark:text-neutral-300"
                      >
                        {duty}
                      </span>
                    ))}
                  </div>

                  {/* 引用语 */}
                  <div className="relative pt-4 border-t border-neutral-100 dark:border-slate-700">
                    <Quote className={`absolute -top-3 left-0 w-6 h-6 ${dept.iconColor} opacity-30`} />
                    <p className="text-neutral-600 dark:text-neutral-400 italic pl-2 leading-relaxed">
                      "{dept.quote}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
