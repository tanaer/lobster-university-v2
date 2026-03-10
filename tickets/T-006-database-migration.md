# T-006: 执行数据库迁移

## 状态
🟢 DONE (2026-03-10 20:27)

## 优先级
P0

## 预计工时
30min

## 描述
使用 Drizzle Kit 执行数据库迁移，创建所有表。

## 技术要求

### 命令
```bash
# 生成迁移文件
pnpm drizzle-kit generate

# 执行迁移
pnpm drizzle-kit migrate
```

### 需要创建的表
1. users - 用户表
2. sessions - 会话表
3. accounts - 账户表
4. verifications - 验证表
5. courses - 课程表
6. chapters - 章节表
7. progress - 学习进度表
8. enrollments - 课程注册表
9. reviews - 评价表
10. achievements - 成就表

### 数据库文件
- 位置: `./data/lobster.db`
- 类型: SQLite (libSQL)

## 验收标准
- [ ] 所有 10 个表成功创建
- [ ] 外键约束正确设置
- [ ] 索引正确创建 (email unique, etc.)
- [ ] 可以使用 `pnpm drizzle-kit studio` 查看数据库

## 依赖
无

## 指派给
Codex
