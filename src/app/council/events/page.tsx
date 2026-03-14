'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Activity, Users, BarChart2, Clock } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LobsterEvent {
  id: string;
  timestamp: number;
  actor: string;
  actorType: string;
  action: string;
  level: string;
  target: string | null;
  targetType: string | null;
  department: string;
  metadata: string | null;
  status: string;
  errorMessage: string | null;
}

interface TodayStats {
  date: string;
  total: number;
  actions: Record<string, string>;
  uniqueActors: number;
}

interface StatsResponse {
  today: TodayStats;
  dailyStats: unknown[];
}

interface EventsResponse {
  events: LobsterEvent[];
  total: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPARTMENTS = ['全部', '招生办', '教务处', '学工处', '考试中心', '校务委员会', 'IT部门', '家长服务'];

const DEPT_COLORS: Record<string, string> = {
  招生办: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  教务处: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  学工处: 'bg-green-500/20 text-green-300 border-green-500/30',
  考试中心: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  校务委员会: 'bg-red-500/20 text-red-300 border-red-500/30',
  IT部门: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  家长服务: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

const DEPT_DOT: Record<string, string> = {
  招生办: 'bg-orange-400',
  教务处: 'bg-blue-400',
  学工处: 'bg-green-400',
  考试中心: 'bg-purple-400',
  校务委员会: 'bg-red-400',
  IT部门: 'bg-cyan-400',
  家长服务: 'bg-pink-400',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}/${day}`;
}

function isToday(ts: number): boolean {
  const d = new Date(ts);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: string }) {
  if (level === 'L1') {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
        L1
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-600/50 text-slate-400 border border-slate-600/50">
      L2
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
        status === 'ok' ? 'bg-green-400' : 'bg-red-400'
      }`}
    />
  );
}

function ActionBar({ actions }: { actions: Record<string, string> }) {
  const entries = Object.entries(actions)
    .map(([k, v]) => ({ action: k, count: parseInt(v) || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (entries.length === 0) {
    return <p className="text-slate-500 text-xs">暂无数据</p>;
  }

  const max = entries[0]?.count || 1;

  return (
    <div className="space-y-1.5">
      {entries.map(({ action, count }) => (
        <div key={action} className="flex items-center gap-2">
          <span className="text-xs text-slate-400 w-28 truncate flex-shrink-0">{action}</span>
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(4, (count / max) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-300 w-6 text-right flex-shrink-0">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EventsDashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [eventsData, setEventsData] = useState<EventsResponse | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>('全部');
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      try {
        const eventsUrl =
          selectedDept === '全部'
            ? '/api/admin/events?limit=20'
            : `/api/admin/events?limit=20&department=${encodeURIComponent(selectedDept)}`;

        const [statsRes, eventsRes] = await Promise.all([
          fetch('/api/admin/events/stats'),
          fetch(eventsUrl),
        ]);

        const [statsJson, eventsJson] = await Promise.all([statsRes.json(), eventsRes.json()]);
        setStats(statsJson);
        setEventsData(eventsJson);
        setLastRefresh(new Date());
      } catch {
        // silently fail on refresh
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedDept]
  );

  // Initial fetch + re-fetch on department change
  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => fetchData(true), 10_000);
    return () => clearInterval(timer);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400 animate-pulse text-lg">加载中...</div>
      </div>
    );
  }

  const today = stats?.today;
  const eventList = eventsData?.events ?? [];
  const totalEvents = eventsData?.total ?? 0;

  const refreshTime = `${String(lastRefresh.getHours()).padStart(2, '0')}:${String(lastRefresh.getMinutes()).padStart(2, '0')}:${String(lastRefresh.getSeconds()).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/council"
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                校务委员会
              </Link>
              <span className="text-slate-600">/</span>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-400" />
                <h1 className="text-lg font-bold text-white">事件仪表盘</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-400' : ''}`} />
              <span>上次刷新 {refreshTime}・每 10 秒自动刷新</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* Today's Stats */}
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">今日实时概览</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total events */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <BarChart2 className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">今日事件总数</div>
                  <div className="text-2xl font-bold text-white">{today?.total ?? 0}</div>
                </div>
              </CardContent>
            </Card>

            {/* Unique actors */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">今日活跃用户</div>
                  <div className="text-2xl font-bold text-white">{today?.uniqueActors ?? 0}</div>
                </div>
              </CardContent>
            </Card>

            {/* Date */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">统计日期</div>
                  <div className="text-base font-bold text-white">{today?.date ?? '—'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action distribution */}
        {today && Object.keys(today.actions).length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300">今日 Action 分布</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ActionBar actions={today.actions} />
            </CardContent>
          </Card>
        )}

        {/* Department filter */}
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">部门筛选</h2>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedDept === dept
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                    : dept === '全部'
                    ? 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'
                    : `${DEPT_COLORS[dept] ?? 'bg-slate-700/50 text-slate-400 border-slate-600'} hover:opacity-80`
                }`}
              >
                {dept !== '全部' && (
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${DEPT_DOT[dept] ?? 'bg-slate-400'}`}
                  />
                )}
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Events timeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              最近事件流
              {selectedDept !== '全部' && (
                <span className="ml-2 text-orange-400 normal-case">· {selectedDept}</span>
              )}
            </h2>
            <span className="text-xs text-slate-500">共 {totalEvents} 条</span>
          </div>

          {eventList.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="py-12 text-center text-slate-500">暂无事件数据</CardContent>
            </Card>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-700" />

              <div className="space-y-0">
                {eventList.map((ev, idx) => {
                  const showDate = idx === 0 || !isToday(ev.timestamp);
                  const prevEv = eventList[idx - 1];
                  const prevDate = prevEv ? formatDate(prevEv.timestamp) : null;
                  const thisDate = formatDate(ev.timestamp);
                  const showDateDivider = idx > 0 && thisDate !== prevDate;

                  return (
                    <div key={ev.id}>
                      {(idx === 0 && !isToday(ev.timestamp) || showDateDivider) && (
                        <div className="flex items-center gap-3 py-2 pl-6">
                          <span className="text-xs text-slate-500 font-medium">{thisDate}</span>
                          <div className="flex-1 h-px bg-slate-700/50" />
                        </div>
                      )}
                      <div className="flex items-start gap-3 py-2.5 group">
                        {/* Timeline dot */}
                        <div className="relative flex-shrink-0 mt-1">
                          <StatusDot status={ev.status} />
                        </div>

                        {/* Content card */}
                        <div className="flex-1 min-w-0 pl-2 pb-2 border-b border-slate-800 group-last:border-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <LevelBadge level={ev.level} />
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                  DEPT_COLORS[ev.department] ?? 'bg-slate-700/50 text-slate-400 border-slate-600'
                                }`}
                              >
                                <span
                                  className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${DEPT_DOT[ev.department] ?? 'bg-slate-400'}`}
                                />
                                {ev.department}
                              </span>
                              <span className="text-sm font-medium text-slate-200">{ev.action}</span>
                            </div>
                            <span className="text-xs text-slate-500 whitespace-nowrap font-mono">
                              {isToday(ev.timestamp) ? formatTime(ev.timestamp) : `${formatDate(ev.timestamp)} ${formatTime(ev.timestamp)}`}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                            <span>
                              <span className="text-slate-400">{ev.actor}</span>
                              <span className="ml-1 text-slate-600">({ev.actorType})</span>
                            </span>
                            {ev.target && (
                              <>
                                <span className="text-slate-700">→</span>
                                <span className="text-slate-400 truncate max-w-[180px]">{ev.target}</span>
                              </>
                            )}
                            {ev.status === 'error' && ev.errorMessage && (
                              <span className="text-red-400 truncate max-w-[200px]">{ev.errorMessage}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
