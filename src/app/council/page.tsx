'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock, Target, Zap, Trophy, Activity } from 'lucide-react';

interface SopData {
  id: string;
  name: string;
  description: string;
  steps: string[];
  monthly_executions: number;
  success_count: number;
  fail_count: number;
}

interface DepartmentData {
  status: 'normal' | 'warning' | 'error';
  message: string;
  icon: string;
  updated_at: string;
  sops: SopData[];
  work_plan: string[];
  active_work: string;
  achievements: string[];
}

interface PerformanceData {
  score: number;
  weekly_avg: number;
  monthly_avg: number;
  warnings: number;
}

interface LogEntry {
  time: string;
  dept: string;
  action: string;
}

interface CouncilData {
  stats: {
    total_courses: number;
    total_students: number;
    total_enrollments: number;
    total_sops: number;
    system_status: string;
  };
  departments: Record<string, DepartmentData>;
  performance: Record<string, PerformanceData>;
  recent_logs: LogEntry[];
}

const statusColor: Record<string, string> = {
  normal: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

const statusLabel: Record<string, string> = {
  normal: '正常',
  warning: '警告',
  error: '异常',
};

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getScoreBg(score: number) {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export default function CouncilPage() {
  const [data, setData] = useState<CouncilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [expandedSops, setExpandedSops] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/council')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleSop = (sopId: string) => {
    setExpandedSops((prev) => {
      const next = new Set(prev);
      if (next.has(sopId)) next.delete(sopId);
      else next.add(sopId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-neutral-500 animate-pulse">加载中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">数据加载失败</div>
      </div>
    );
  }

  const departments = Object.entries(data.departments);
  const performance = data.performance ?? {};

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🦞 龙虾大学校务委员会</h1>
          <p className="text-white/80 text-sm md:text-base">实时运营状态 · 部门协同 · SOP 驱动 · 绩效考核</p>
          <div className="mt-4">
            <Link
              href="/council/events"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/20"
            >
              <Activity className="w-4 h-4" />
              事件仪表盘
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <StatCard label="总 SOP 数" value={data.stats.total_sops} icon="📋" />
          <StatCard label="在线课程" value={data.stats.total_courses} icon="📚" />
          <StatCard label="注册学员" value={data.stats.total_students.toLocaleString()} icon="👥" />
          <StatCard
            label="系统状态"
            value={statusLabel[data.stats.system_status] || '正常'}
            icon="✅"
            highlight={data.stats.system_status === 'normal' ? 'green' : 'red'}
          />
        </div>

        {/* Department Cards */}
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">八部运行状态</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {departments.map(([name, dept]) => {
            const isExpanded = expandedDept === name;
            const perf = performance[name];
            const sopCount = dept.sops?.length ?? 0;

            return (
              <div key={name} className={isExpanded ? 'sm:col-span-2 lg:col-span-4' : ''}>
                <Card
                  className={`dark:bg-neutral-900 dark:border-neutral-800 hover:shadow-md transition-all cursor-pointer ${isExpanded ? 'ring-2 ring-orange-500' : ''}`}
                  onClick={() => setExpandedDept(isExpanded ? null : name)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dept.icon}</span>
                        <CardTitle className="text-sm md:text-base">{name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-3 h-3 rounded-full ${statusColor[dept.status]} shadow-sm`} title={statusLabel[dept.status]} />
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                      <span>SOP: {sopCount} 个</span>
                      <span>{statusLabel[dept.status]}</span>
                    </div>
                    {/* Performance bar */}
                    {perf && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-neutral-500">绩效</span>
                          <span className={`text-sm font-bold ${getScoreColor(perf.score)}`}>{perf.score}分</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700">
                          <div className={`h-1.5 rounded-full ${getScoreBg(perf.score)} transition-all`} style={{ width: `${perf.score}%` }} />
                        </div>
                      </div>
                    )}
                    {/* Active work */}
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate" title={dept.active_work}>
                      <Zap className="w-3 h-3 inline mr-1 text-orange-500" />
                      {dept.active_work}
                    </p>
                  </CardContent>
                </Card>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div
                    className="mt-2 p-4 md:p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Grid: Work Plan + Active Work + Achievements */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Work Plan */}
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                        <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                          <Target className="w-4 h-4" /> 工作计划
                        </h4>
                        <ul className="space-y-2">
                          {dept.work_plan?.map((plan, i) => (
                            <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              {plan}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Active Work */}
                      <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900">
                        <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-1.5">
                          <Zap className="w-4 h-4" /> 实时工作
                        </h4>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">{dept.active_work}</p>
                      </div>

                      {/* Achievements */}
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900">
                        <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-1.5">
                          <Trophy className="w-4 h-4" /> 工作成果
                        </h4>
                        <ul className="space-y-2">
                          {dept.achievements?.map((item, i) => (
                            <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Performance detail */}
                    {perf && (
                      <div className="flex items-center gap-6 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">📊 绩效</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span>今日 <span className={`font-bold ${getScoreColor(perf.score)}`}>{perf.score}</span></span>
                          <span>周均 <span className={`font-bold ${getScoreColor(perf.weekly_avg)}`}>{perf.weekly_avg}</span></span>
                          <span>月均 <span className={`font-bold ${getScoreColor(perf.monthly_avg)}`}>{perf.monthly_avg}</span></span>
                        </div>
                      </div>
                    )}

                    {/* SOP List */}
                    {dept.sops && dept.sops.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">📋 SOP 列表 ({dept.sops.length})</h4>
                        <div className="space-y-2">
                          {dept.sops.map((sop) => {
                            const isSopOpen = expandedSops.has(sop.id);
                            const successRate = sop.monthly_executions > 0
                              ? Math.round((sop.success_count / sop.monthly_executions) * 100)
                              : 100;
                            return (
                              <div key={sop.id} className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                <button
                                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                  onClick={() => toggleSop(sop.id)}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <span className="font-mono text-xs text-orange-500 whitespace-nowrap">{sop.id}</span>
                                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{sop.name}</span>
                                  </div>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="text-xs text-neutral-500">
                                      {sop.monthly_executions}次/月
                                    </span>
                                    <span className={`text-xs font-medium ${successRate >= 90 ? 'text-green-600' : successRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {successRate}%
                                    </span>
                                    {isSopOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                                  </div>
                                </button>
                                {isSopOpen && (
                                  <div className="px-4 pb-4 pt-1 bg-neutral-50 dark:bg-neutral-800/50 space-y-3">
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{sop.description}</p>
                                    {/* Steps */}
                                    <div>
                                      <div className="text-xs font-medium text-neutral-500 mb-1.5">流程步骤</div>
                                      <div className="flex flex-wrap gap-2">
                                        {sop.steps.map((step, i) => (
                                          <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300">
                                            {step}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    {/* Execution stats */}
                                    <div className="flex items-center gap-4 text-xs">
                                      <span className="flex items-center gap-1 text-neutral-500">
                                        <Clock className="w-3.5 h-3.5" /> 本月执行 {sop.monthly_executions} 次
                                      </span>
                                      <span className="flex items-center gap-1 text-green-600">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> 成功 {sop.success_count}
                                      </span>
                                      <span className="flex items-center gap-1 text-red-500">
                                        <XCircle className="w-3.5 h-3.5" /> 失败 {sop.fail_count}
                                      </span>
                                    </div>
                                    {/* Success rate bar */}
                                    <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700">
                                      <div
                                        className={`h-1.5 rounded-full transition-all ${successRate >= 90 ? 'bg-green-500' : successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${successRate}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Logs */}
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">最近工作日志</h2>
        <Card className="dark:bg-neutral-900 dark:border-neutral-800">
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {data.recent_logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
                  <span className="text-neutral-400 dark:text-neutral-500 whitespace-nowrap text-xs mt-0.5">{log.time}</span>
                  <span className="font-medium text-neutral-600 dark:text-neutral-300 whitespace-nowrap">{log.dept}</span>
                  <span className="text-neutral-700 dark:text-neutral-400">{log.action}</span>
                </div>
              ))}
              {data.recent_logs.length === 0 && (
                <div className="px-4 py-6 text-center text-neutral-400">暂无日志</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string | number;
  icon: string;
  highlight?: 'green' | 'red';
}) {
  const highlightClass = highlight === 'green'
    ? 'text-green-600 dark:text-green-400'
    : highlight === 'red'
      ? 'text-red-600 dark:text-red-400'
      : 'text-neutral-900 dark:text-neutral-100';

  return (
    <Card className="dark:bg-neutral-900 dark:border-neutral-800">
      <CardContent className="p-4 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">{label}</div>
          <div className={`text-xl font-bold ${highlightClass}`}>{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
