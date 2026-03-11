// 五维评估维度定义（客户端和服务端共享）
export const ASSESSMENT_DIMENSIONS = {
  task_completion: {
    name: "任务完成率",
    description: "完成任务的效率和质量",
    icon: "✅",
    color: "#10B981",
  },
  portfolio_quality: {
    name: "作品质量",
    description: "提交作品的质量评分",
    icon: "📦",
    color: "#8B5CF6",
  },
  learning_efficiency: {
    name: "学习效率",
    description: "学习时间与成果的比率",
    icon: "⚡",
    color: "#F59E0B",
  },
  autonomy: {
    name: "自主程度",
    description: "独立解决问题的能力",
    icon: "🎯",
    color: "#3B82F6",
  },
  job_match: {
    name: "就业匹配度",
    description: "能力与目标岗位的匹配程度",
    icon: "💼",
    color: "#EC4899",
  },
} as const;

export type DimensionKey = keyof typeof ASSESSMENT_DIMENSIONS;

// 标准选项
function getStandardOptions() {
  return [
    { value: 1, label: "完全不符合" },
    { value: 2, label: "不太符合" },
    { value: 3, label: "一般" },
    { value: 4, label: "比较符合" },
    { value: 5, label: "完全符合" },
  ];
}

// 评估问题定义
export const ASSESSMENT_QUESTIONS: Record<DimensionKey, Array<{
  id: string;
  question: string;
  options: Array<{ value: number; label: string }>;
}>> = {
  task_completion: [
    { id: "tc1", question: "我能够按时完成分配的学习任务", options: getStandardOptions() },
    { id: "tc2", question: "完成的任务质量通常达到或超过预期", options: getStandardOptions() },
    { id: "tc3", question: "面对复杂任务时，我能够分解并逐步完成", options: getStandardOptions() },
    { id: "tc4", question: "我很少因为拖延而影响任务进度", options: getStandardOptions() },
    { id: "tc5", question: "任务完成后的自我检查已成为习惯", options: getStandardOptions() },
    { id: "tc6", question: "我能有效管理多个并行任务", options: getStandardOptions() },
    { id: "tc7", question: "遇到困难时能主动寻求资源解决", options: getStandardOptions() },
    { id: "tc8", question: "完成的任务很少需要返工", options: getStandardOptions() },
    { id: "tc9", question: "我能在截止日期前合理规划时间", options: getStandardOptions() },
    { id: "tc10", question: "任务交付物的完整度通常很高", options: getStandardOptions() },
  ],
  portfolio_quality: [
    { id: "pq1", question: "我的作品通常具有清晰的逻辑结构", options: getStandardOptions() },
    { id: "pq2", question: "作品中的细节处理到位，较少错误", options: getStandardOptions() },
    { id: "pq3", question: "我注重作品的美观和用户体验", options: getStandardOptions() },
    { id: "pq4", question: "作品能够体现我的专业能力", options: getStandardOptions() },
    { id: "pq5", question: "我会根据反馈持续改进作品", options: getStandardOptions() },
    { id: "pq6", question: "作品具有创新性，不只是模仿", options: getStandardOptions() },
    { id: "pq7", question: "能将所学知识应用到作品中", options: getStandardOptions() },
    { id: "pq8", question: "作品展示了解决实际问题的能力", options: getStandardOptions() },
    { id: "pq9", question: "作品集呈现了清晰的成长轨迹", options: getStandardOptions() },
    { id: "pq10", question: "作品有足够的深度，不是表面功夫", options: getStandardOptions() },
  ],
  learning_efficiency: [
    { id: "le1", question: "我能够快速理解新概念和知识", options: getStandardOptions() },
    { id: "le2", question: "学习时能保持高度专注", options: getStandardOptions() },
    { id: "le3", question: "我使用有效的学习方法提升效率", options: getStandardOptions() },
    { id: "le4", question: "能将学到的知识迁移到新场景", options: getStandardOptions() },
    { id: "le5", question: "学习时间的投入产出比合理", options: getStandardOptions() },
    { id: "le6", question: "我善于总结和归纳学习要点", options: getStandardOptions() },
    { id: "le7", question: "能快速找到需要的学习资源", options: getStandardOptions() },
    { id: "le8", question: "复习效率高，知识遗忘率低", options: getStandardOptions() },
    { id: "le9", question: "能在实践中验证所学知识", options: getStandardOptions() },
    { id: "le10", question: "学习计划执行效率高", options: getStandardOptions() },
  ],
  autonomy: [
    { id: "au1", question: "我能独立设定学习目标和计划", options: getStandardOptions() },
    { id: "au2", question: "遇到问题时优先尝试自己解决", options: getStandardOptions() },
    { id: "au3", question: "能主动发现知识盲区并弥补", options: getStandardOptions() },
    { id: "au4", question: "我有较强的自我驱动力", options: getStandardOptions() },
    { id: "au5", question: "能在没有监督的情况下保持学习", options: getStandardOptions() },
    { id: "au6", question: "面对挫折能自我调节并继续前进", options: getStandardOptions() },
    { id: "au7", question: "能主动寻找学习和成长机会", options: getStandardOptions() },
    { id: "au8", question: "对自己的学习进度有清晰的认知", options: getStandardOptions() },
    { id: "au9", question: "能独立完成从规划到执行的全过程", options: getStandardOptions() },
    { id: "au10", question: "不依赖他人指导也能有效学习", options: getStandardOptions() },
  ],
  job_match: [
    { id: "jm1", question: "我的技能与目标岗位要求匹配", options: getStandardOptions() },
    { id: "jm2", question: "我了解目标岗位的核心能力要求", options: getStandardOptions() },
    { id: "jm3", question: "我的作品集符合行业期望", options: getStandardOptions() },
    { id: "jm4", question: "我具备目标岗位所需的软技能", options: getStandardOptions() },
    { id: "jm5", question: "对目标行业有足够的了解", options: getStandardOptions() },
    { id: "jm6", question: "能在面试中有效展示能力", options: getStandardOptions() },
    { id: "jm7", question: "我的学习方向与职业目标一致", options: getStandardOptions() },
    { id: "jm8", question: "具备目标岗位的实操经验", options: getStandardOptions() },
    { id: "jm9", question: "我的能力在同龄人中具有竞争力", options: getStandardOptions() },
    { id: "jm10", question: "能在短期内胜任目标岗位工作", options: getStandardOptions() },
  ],
};

// 计算维度分数（基于问卷答案）
export function calculateDimensionScore(answers: number[]): number {
  if (answers.length === 0) return 0;
  const sum = answers.reduce((acc, val) => acc + val, 0);
  const maxPossible = answers.length * 5;
  return Math.round((sum / maxPossible) * 100);
}

// 获取优化建议
export function getSuggestion(dimension: DimensionKey, score: number): string {
  const suggestions: Record<DimensionKey, Record<string, string>> = {
    task_completion: {
      low: "建议使用任务管理工具，将大任务拆解为小步骤，设定明确的截止时间。",
      medium: "可以尝试番茄工作法提升专注度，完成任务后及时复盘总结。",
      high: "保持当前的良好习惯，可以挑战更复杂的任务来提升能力上限。",
    },
    portfolio_quality: {
      low: "从模仿优秀作品开始，注重细节打磨，每个作品都要有明确的改进点。",
      medium: "增加作品的深度，注重用户体验和实际应用场景的考虑。",
      high: "可以尝试更具挑战性的项目，展示你的创新能力和技术深度。",
    },
    learning_efficiency: {
      low: "建立固定的学习时间和空间，减少干扰，使用主动学习方法如费曼技巧。",
      medium: "优化学习资源的选择，聚焦核心知识，避免无效的信息输入。",
      high: "可以加速学习进度，挑战更高阶的内容，同时保持知识的系统化整理。",
    },
    autonomy: {
      low: "从设定小目标开始，逐步培养自我驱动的习惯，记录自己的进步。",
      medium: "主动承担更多责任，在项目中扮演更独立的角色，减少对外部指导的依赖。",
      high: "可以开始指导他人，通过教来巩固学，进一步提升自主能力。",
    },
    job_match: {
      low: "深入研究目标岗位的JD，找出能力差距，制定针对性的提升计划。",
      medium: "增加与目标岗位相关的实战经验，完善作品集以匹配岗位要求。",
      high: "可以开始投递简历，准备面试，同时关注行业动态保持竞争力。",
    },
  };

  const level = score < 40 ? "low" : score < 70 ? "medium" : "high";
  return suggestions[dimension][level];
}

// 生成雷达图数据
export function generateRadarData(report: Record<DimensionKey, { score: number; assessedAt: Date | null }>) {
  return Object.entries(ASSESSMENT_DIMENSIONS).map(([key, meta]) => ({
    dimension: meta.name,
    key,
    score: report[key as DimensionKey]?.score ?? 0,
    fullMark: 100,
    icon: meta.icon,
    color: meta.color,
  }));
}

// 弱项分析
export function analyzeWeaknesses(report: Record<DimensionKey, { score: number; assessedAt: Date | null }>) {
  const entries = Object.entries(report) as Array<[DimensionKey, { score: number; assessedAt: Date | null }]>;
  
  // 按分数排序
  const sorted = entries.sort((a, b) => a[1].score - b[1].score);
  
  // 找出低于平均分的维度
  const avgScore = entries.reduce((sum, [, data]) => sum + data.score, 0) / entries.length;
  
  const weaknesses = sorted
    .filter(([, data]) => data.score < avgScore)
    .map(([key, data]) => ({
      dimension: key,
      ...ASSESSMENT_DIMENSIONS[key],
      score: data.score,
      gap: Math.round(avgScore - data.score),
      suggestion: getSuggestion(key, data.score),
    }));

  return {
    averageScore: Math.round(avgScore),
    weaknesses,
    strongest: sorted[sorted.length - 1] ? {
      dimension: sorted[sorted.length - 1][0] as DimensionKey,
      ...ASSESSMENT_DIMENSIONS[sorted[sorted.length - 1][0] as DimensionKey],
      score: sorted[sorted.length - 1][1].score,
    } : null,
    weakest: sorted[0] ? {
      dimension: sorted[0][0] as DimensionKey,
      ...ASSESSMENT_DIMENSIONS[sorted[0][0] as DimensionKey],
      score: sorted[0][1].score,
    } : null,
  };
}

// 获取评估问题
export function getAssessmentQuestions(dimension: DimensionKey) {
  return ASSESSMENT_QUESTIONS[dimension];
}
