# 事件 Hook 架构方案（v2 — Redis 修订版）

> 龙虾大学架构评审委员会 · 2026-03-14
> 议题：校务委员会要求全校交互 Hook 反馈机制
> v2 修订：基于服务器现有 Redis 实例重新设计队列层

---

## 专家评审意见

### 教授A（系统架构师 · IT部门）

龙虾大学当前是 Next.js + SQLite (Drizzle ORM) 单体架构，所有 API 路由集中在 `src/app/api/` 下，共 17 个模块。服务器已有 Redis 实例运行在 `127.0.0.1:6379`，无需额外部署。

v1 方案用进程内环形缓冲区 + JSONL WAL，存在两个问题：(1) 进程崩溃时内存队列丢失，需要 JSONL 补录逻辑；(2) 如果未来拆分多进程（如 PM2 cluster），内存队列无法共享。

**修订方案：用 Redis List 替代内存环形缓冲区，同时取消 JSONL WAL 层。** Redis 自带 AOF 持久化，崩溃恢复由 Redis 保证，不需要我们自己写 WAL。架构从三层（内存 + JSONL + SQLite）简化为两层（Redis + SQLite），代码量减少约 40%。

具体流程：`emitEvent()` 调用 `LPUSH` 将事件 JSON 写入 Redis List `lobster:events`，耗时 <1ms，完全非阻塞。独立的消费者定时器每 5 秒执行一次 `RPOP` 批量取出最多 100 条，批量 INSERT 到 SQLite。Redis List 天然 FIFO，无需自己实现环形缓冲。

额外收益：Redis `PUBLISH` 可以做实时异常告警推送，不用轮询 SQLite。

### 教授B（数据工程师 · IT部门）

数据量估算不变：日交互 3000-5000 条，峰值不超过 1 万条。每条事件 300-500 字节。

Redis 内存占用：队列中最多积压 500 条（5 秒 flush 一次，正常情况下不超过 50 条），约 250KB，可忽略不计。

存储策略调整：
- **取消 JSONL WAL 层** — Redis AOF 已覆盖崩溃恢复场景
- 热数据 30 天（SQLite `events` 表）
- 温数据永久（SQLite `stats_daily` 表）
- 冷数据归档可选：如需审计追溯，可用 cron 每日导出前一天 events 到 JSONL 归档，保留 180 天

Redis key 设计：
- `lobster:events` — List，事件队列（生产者 LPUSH，消费者 RPOP）
- `lobster:events:dead` — List，写入 SQLite 失败的死信队列
- `lobster:alerts` — Pub/Sub channel，实时异常告警

### 教授C（流程专家 · 教务处）

L1/L2 分级不变。Hook 触发仍然是非阻塞的。

失败处理简化：
1. `LPUSH` 失败（Redis 不可用）→ 降级为直接同步 INSERT SQLite（单条写入，性能略降但不丢数据）
2. SQLite 批量写入失败 → 事件留在 Redis List，下次 flush 重试；超过 3 次失败的移入 `lobster:events:dead`
3. Redis 恢复后，消费者自动恢复消费，无需人工干预

比 v1 方案少了 JSONL 补录逻辑和 dead-letter 文件管理，运维更简单。

### 教授D（运营专家 · 教务处）

校务委员会展示需求不变。新增能力：

1. **实时异常告警**：消费者在 flush 时检测异常模式（错误率突增、长时间无事件），通过 `PUBLISH lobster:alerts` 推送。告警订阅者可以是 OpenClaw cron 任务或独立脚本，比轮询 SQLite 更及时。
2. **实时事件计数**：用 Redis `INCR lobster:stats:today:total` 和 `HINCRBY lobster:stats:today:actions <action> 1` 做实时计数，仪表盘可以秒级刷新，不用查 SQLite。每日 0 点 cron 重置计数器。
3. 日报/周报聚合仍从 SQLite `events` 表生成，Redis 计数器仅用于实时展示。

---

## 最终推荐方案（v2）

### 技术选型：Redis List 队列 + SQLite 批量写入 + Pub/Sub 告警

```
请求链路（非阻塞）:

  API Route ──→ emitEvent() ──→ LPUSH Redis List ──→ 消费者 RPOP (每5s/100条)
       │                         lobster:events              ↓
       │                              │               批量 INSERT SQLite
       │                              │               events 表
       ↓                              ↓                      ↓
   正常响应                    Redis INCR 实时计数      定时聚合 (每日)
  (不受影响)                   lobster:stats:*               ↓
                                      ↓               stats_daily 表
                               实时仪表盘                    ↓
                                                     校务委员会日报
                                                          
  异常检测 ──→ PUBLISH lobster:alerts ──→ Telegram 告警
```

### 依赖

```bash
# 新增 Node.js Redis 客户端
cd lobster-university && pnpm add ioredis
```

选用 `ioredis` 而非 `redis`（node-redis）：API 更简洁，自动重连，Pipeline 支持更好，社区更活跃。

### Redis 连接配置

```typescript
// src/lib/redis.ts
import Redis from "ioredis";

export const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 200, 3000); // 最多 3 秒重试间隔
  },
});
```

### 事件数据格式

```typescript
interface LobsterEvent {
  id: string;              // nanoid
  timestamp: string;       // ISO 8601
  actor: string;           // userId / "system" / "cron" / agentId
  actorType: "student" | "admin" | "agent" | "system";
  action: string;          // "enrollment.create" / "course.progress" / "cert.issue" 等
  level: "L1" | "L2";     // 关键操作 vs 辅助操作
  target?: string;         // 被操作对象 ID（课程ID、学生ID等）
  targetType?: string;     // "course" / "profile" / "portfolio" 等
  department: string;      // 来源部门："招生办" / "教务处" / "考试中心" 等
  metadata?: Record<string, unknown>; // 额外上下文
  status: "ok" | "error";  // 操作结果
  errorMessage?: string;   // 失败原因
}
```

### Redis Key 设计

| Key | 类型 | 用途 | TTL |
|-----|------|------|-----|
| `lobster:events` | List | 事件队列（LPUSH/RPOP） | 无（消费后移除） |
| `lobster:events:dead` | List | 死信队列（写入 SQLite 失败） | 无 |
| `lobster:stats:{date}:total` | String | 当日事件总数 | 48h |
| `lobster:stats:{date}:actions` | Hash | 当日各 action 计数 | 48h |
| `lobster:stats:{date}:actors` | HyperLogLog | 当日去重活跃用户数 | 48h |
| `lobster:alerts` | Pub/Sub Channel | 实时异常告警 | N/A |

### 数据库 Schema（新增）

```sql
-- 事件日志表
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,        -- unix ms
  actor TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  action TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'L1',
  target TEXT,
  target_type TEXT,
  department TEXT NOT NULL,
  metadata TEXT,                      -- JSON
  status TEXT NOT NULL DEFAULT 'ok',
  error_message TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_actor ON events(actor);
CREATE INDEX idx_events_action ON events(action);
CREATE INDEX idx_events_level ON events(level);

-- 每日统计聚合表
CREATE TABLE stats_daily (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,          -- "2026-03-14"
  total_events INTEGER DEFAULT 0,
  l1_events INTEGER DEFAULT 0,
  l2_events INTEGER DEFAULT 0,
  unique_actors INTEGER DEFAULT 0,
  new_enrollments INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  certs_issued INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0,
  top_actions TEXT,                    -- JSON: [{action, count}]
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
```

### 存储策略

| 层级 | 存储 | 保留期 | 用途 |
|------|------|--------|------|
| 实时 | Redis List + 计数器 | 消费即删 / 48h | 队列缓冲、实时仪表盘 |
| 热数据 | SQLite `events` 表 | 30 天 | 查询、聚合、审计 |
| 温数据 | SQLite `stats_daily` 表 | 永久 | 趋势分析、校务报告 |
| 冷数据 | JSONL 归档（可选） | 180 天 | 审计追溯 |

### 失败处理

1. `LPUSH` 失败（Redis 不可用）→ 降级为直接同步 INSERT SQLite（单条，性能略降但不丢数据）
2. SQLite 批量写入失败 → 事件留在 Redis List，下次 flush 重试；超过 3 次失败移入 `lobster:events:dead`
3. Redis 恢复后 → 消费者自动恢复消费，无需人工干预
4. 进程崩溃 → Redis 中未消费的事件仍在 List 中，重启后继续消费（零丢失）

### 校务委员会展示

1. **增强现有 `/api/council/status`**：增加事件统计摘要（优先从 Redis 计数器读取，秒级响应）
2. **新增 `/api/admin/events`**：支持按时间、部门、操作类型筛选事件（从 SQLite 查询）
3. **实时仪表盘**：从 Redis `lobster:stats:*` 读取当日实时数据
4. **每日聚合报告**：通过 OpenClaw cron 每日 22:00 生成当日摘要，推送到校务委员会频道
5. **异常告警**：消费者检测异常后 `PUBLISH lobster:alerts`，订阅者即时推送到 Telegram

### Hook 触发点清单

| 部门 | 操作 | Action 标识 | 级别 |
|------|------|-------------|------|
| 招生办 | 龙虾注册 | `enrollment.create` | L1 |
| 招生办 | 邀请码生成 | `invite.generate` | L1 |
| 教务处 | 选课 | `course.enroll` | L1 |
| 教务处 | 学习进度更新 | `course.progress` | L2 |
| 教务处 | 章节完成 | `chapter.complete` | L1 |
| 学工处 | 作品提交 | `portfolio.submit` | L1 |
| 学工处 | 作品评审 | `portfolio.review` | L1 |
| 考试中心 | 能力评估 | `assessment.submit` | L1 |
| 考试中心 | 证书颁发 | `cert.issue` | L1 |
| 校务委员会 | 决议发布 | `council.decision` | L1 |
| IT部门 | 定时同步 | `cron.sync` | L2 |
| IT部门 | 系统健康检查 | `system.health` | L2 |
| 家长服务 | 家长绑定 | `parent.bind` | L1 |
| 家长服务 | 成绩查看 | `parent.view` | L2 |

---

## 实施计划

### Phase 1：基础设施（1 天）

1. `pnpm add ioredis` 安装依赖
2. 创建 `src/lib/redis.ts` — Redis 连接单例
3. 创建 `src/lib/services/event-service.ts`
   - `emitEvent()` — LPUSH 到 Redis List，失败降级同步写 SQLite
   - `startEventConsumer()` — setInterval 每 5 秒 RPOP 批量消费
   - `flushToSQLite()` — 批量 INSERT + 实时计数器更新
4. 新增 Drizzle schema：`events` 表 + `stats_daily` 表
5. 运行 migration

### Phase 2：接入 Hook（2 天）

1. 在所有 L1 API 路由中调用 `emitEvent()`
2. 优先接入：enrollment、courses/progress、portfolio、certification、council
3. 编写中间件或 helper 简化接入（一行代码即可 hook）

### Phase 3：展示与告警（1-2 天）

1. 增强 `/api/council/status` 返回实时事件统计（从 Redis 读取）
2. 新增 `/api/admin/events` 查询端点（从 SQLite 查询）
3. 配置 OpenClaw cron：每日聚合 + 异常告警
4. 实现 Pub/Sub 告警订阅者

### Phase 4：运维（持续）

1. 配置 cron 清理 30 天前的 events 表数据
2. 可选：每日导出前一天 events 到 JSONL 归档
3. 监控 Redis 内存和 SQLite 文件大小

---

## 附录：emitEvent 调用示例

```typescript
// src/lib/services/event-service.ts (核心接口)
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

const QUEUE_KEY = "lobster:events";

export function emitEvent(event: Omit<LobsterEvent, "id" | "timestamp">) {
  const full: LobsterEvent = {
    ...event,
    id: nanoid(),
    timestamp: new Date().toISOString(),
  };

  // 非阻塞：fire-and-forget，不 await
  redis.lpush(QUEUE_KEY, JSON.stringify(full)).catch((err) => {
    // Redis 不可用时降级为同步写 SQLite
    console.error("[event-hook] Redis LPUSH failed, fallback to sync SQLite", err);
    syncInsertToSQLite(full);
  });

  // 实时计数（也是 fire-and-forget）
  const date = full.timestamp.slice(0, 10); // "2026-03-14"
  redis.incr(`lobster:stats:${date}:total`).catch(() => {});
  redis.hincrby(`lobster:stats:${date}:actions`, full.action, 1).catch(() => {});
  redis.pfadd(`lobster:stats:${date}:actors`, full.actor).catch(() => {});
}

// 在 API 路由中使用（一行接入）
export async function POST(req: Request) {
  // ... 业务逻辑 ...
  const profile = await createEnrollment(data);

  // 非阻塞 hook
  emitEvent({
    actor: userId,
    actorType: "student",
    action: "enrollment.create",
    level: "L1",
    target: profile.id,
    targetType: "profile",
    department: "招生办",
    metadata: { careerTrack: data.careerTrackId },
    status: "ok",
  });

  return NextResponse.json(profile);
}
```

---

## v1 → v2 变更摘要

| 项目 | v1（内存队列 + JSONL） | v2（Redis） |
|------|----------------------|-------------|
| 队列 | 进程内环形缓冲区 | Redis List |
| 崩溃恢复 | JSONL WAL + 补录逻辑 | Redis AOF（自动） |
| 死信处理 | dead-letter JSONL 文件 | Redis `lobster:events:dead` List |
| 实时统计 | 无 | Redis 计数器 + HyperLogLog |
| 实时告警 | cron 轮询 SQLite | Redis Pub/Sub |
| 多进程支持 | ❌ 内存不共享 | ✅ 天然跨进程 |
| 代码复杂度 | 环形缓冲 + JSONL writer + 补录 | LPUSH/RPOP（~40% 代码量减少） |
| 新增依赖 | 无 | ioredis |

> 评审结论：四位教授一致同意 v2 Redis 修订方案。利用服务器现有 Redis 实例，架构从三层简化为两层，代码更简洁，崩溃恢复更可靠，还额外获得了实时统计和 Pub/Sub 告警能力。核心原则不变：**不阻塞主流程、不丢失关键事件、不过度设计**。
