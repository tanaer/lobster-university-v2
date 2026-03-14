'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DepartmentData {
  status: 'normal' | 'warning' | 'error';
  message: string;
  sop_count: number;
  icon: string;
  updated_at: string;
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

export default function CouncilPage() {
  const [data, setData] = useState<CouncilData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/council')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🦞 龙虾大学校务委员会</h1>
          <p className="text-white/80 text-sm md:text-base">实时运营状态 · 部门协同 · SOP 驱动</p>
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
          {departments.map(([name, dept]) => (
            <Card key={name} className="dark:bg-neutral-900 dark:border-neutral-800 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{dept.icon}</span>
                    <CardTitle className="text-sm md:text-base">{name}</CardTitle>
                  </div>
                  <span className={`inline-block w-3 h-3 rounded-full ${statusColor[dept.status]} shadow-sm`} title={statusLabel[dept.status]} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>SOP: {dept.sop_count} 个</span>
                  <span>{statusLabel[dept.status]}</span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate" title={dept.message}>
                  {dept.message}
                </p>
              </CardContent>
            </Card>
          ))}
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
