# SOP: API 路由事件 Hook 接入规范

> 适用范围：龙虾大学所有 API 路由开发
> 生效日期：2026-03-14
> 优先级：必须遵守

## 规则

**每个新建或修改的 API 路由，凡涉及数据写入操作（POST/PUT/PATCH/DELETE），必须在成功操作后接入 `emitEvent()`。**

## 接入方式

### 1. 导入

```typescript
import { emitEvent } from '@/lib/services/event-service';
```

### 2. 在成功返回前调用（非阻塞，不 await）

```typescript
emitEvent({
  actor: userId 或 profileId 或 'system',
  actorType: 'student' | 'admin' | 'agent' | 'system',
  action: '部门.操作',        // 如 enrollment.create, course.enroll
  level: 'L1' | 'L2',        // L1=关键操作, L2=辅助操作
  target: 被操作对象ID,       // 可选
  targetType: '对象类型',     // 如 profile, course, portfolio
  department: '部门名',       // 招生办/教务处/学工处/考试中心/校务委员会/IT部门/家长服务
  status: 'ok',
  metadata: { 相关上下文 },   // 可选
});
```

### 3. L1 vs L2 判断标准

| 级别 | 标准 | 示例 |
|------|------|------|
| L1 | 影响学籍、教学质量、认证的核心操作 | 入学、选课、证书颁发、作品提交 |
| L2 | 运营分析用的辅助操作 | 课程浏览、进度更新、健康检查 |

### 4. action 命名规范

格式：`{领域}.{动作}`

已有 action 列表：
- enrollment.create — 入学注册
- invite.generate — 邀请码生成
- course.enroll — 选课
- course.progress — 学习进度更新
- chapter.complete — 章节完成
- portfolio.submit — 作品提交
- portfolio.review — 作品评审
- assessment.submit — 能力评估
- cert.issue — 证书颁发
- council.decision — 校务委员会决议
- parent.bind — 家长绑定
- cron.sync — 定时同步
- system.health — 系统健康检查

新增 action 时遵循同样格式，并更新此文档。

## 开发检查清单

- [ ] 新 API 路由是否有写入操作？
- [ ] 是否已导入 emitEvent？
- [ ] 是否在成功分支调用了 emitEvent？
- [ ] action 名称是否符合命名规范？
- [ ] level 是否正确（L1/L2）？
- [ ] department 是否正确？
- [ ] pnpm build 是否通过？

## 注意事项

- emitEvent 是 fire-and-forget，不要 await
- 不要在错误分支调用 emitEvent（除非要记录错误事件，此时 status='error'）
- Redis 不可用时会自动降级为同步写 SQLite，不影响业务
