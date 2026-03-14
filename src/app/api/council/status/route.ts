import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { emitEvent } from '@/lib/services/event-service';
import { redis } from '@/lib/redis';

interface DepartmentStatus {
  status: 'normal' | 'warning' | 'error';
  message: string;
  sop_count: number;
  icon: string;
  updated_at: string;
}

interface CouncilState {
  departments: Record<string, DepartmentStatus>;
  recent_logs: Array<{ time: string; dept: string; action: string }>;
}

const STATE_PATH = path.join(process.cwd(), 'council-state.json');

function readState(): CouncilState {
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
}

function writeState(state: CouncilState) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const state = readState();

    // 从 Redis 读取今日事件统计
    let eventStats = null;
    try {
      const today = new Date().toISOString().slice(0, 10);
      const [total, actions, actors] = await Promise.all([
        redis.get(`lobster:stats:${today}:total`),
        redis.hgetall(`lobster:stats:${today}:actions`),
        redis.pfcount(`lobster:stats:${today}:actors`),
      ]);
      eventStats = {
        date: today,
        total: parseInt(total || "0"),
        actions: actions || {},
        uniqueActors: actors,
      };
    } catch {
      // Redis 不可用，降级不返回统计
    }

    return NextResponse.json({ departments: state.departments, eventStats });
  } catch (error) {
    console.error('Status GET error:', error);
    return NextResponse.json({ error: 'Failed to read state' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { department, status, message } = body as {
      department: string;
      status: 'normal' | 'warning' | 'error';
      message: string;
    };

    if (!department || !status || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: department, status, message' },
        { status: 400 }
      );
    }

    const state = readState();

    if (!state.departments[department]) {
      return NextResponse.json(
        { error: `Unknown department: ${department}` },
        { status: 404 }
      );
    }

    state.departments[department].status = status;
    state.departments[department].message = message;
    state.departments[department].updated_at = new Date().toISOString();

    // Add to recent logs
    state.recent_logs.unshift({
      time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }).replace(',', ''),
      dept: department,
      action: message,
    });

    // Keep only last 50 logs
    if (state.recent_logs.length > 50) {
      state.recent_logs = state.recent_logs.slice(0, 50);
    }

    writeState(state);

    emitEvent({ actor: 'system', actorType: 'system', action: 'council.decision', level: 'L1', target: department, targetType: 'department', department, status: 'ok', metadata: { status, message } });
    return NextResponse.json({ success: true, department: state.departments[department] });
  } catch (error) {
    console.error('Status POST error:', error);
    return NextResponse.json({ error: 'Failed to update state' }, { status: 500 });
  }
}
