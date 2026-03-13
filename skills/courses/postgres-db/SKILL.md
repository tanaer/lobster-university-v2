---
name: postgres-db
description: >
  PostgreSQL 数据库操作 - 执行 SQL 查询、管理表结构、备份恢复、性能监控。
  当用户需要：查询数据、导出表结构、备份数据库、优化慢查询、
  监控性能指标时触发。
  触发词：PostgreSQL、postgres、SQL 查询、数据库备份、表结构、性能优化
version: 2.0.0
type: executable-sop
metadata:
  category: 数据库
  module: PostgreSQL
  level: 中级
  estimated_time: 40分钟
  prerequisites: [PostgreSQL 客户端, 数据库连接信息]
  tools_required: [exec, write, read]
---

# PostgreSQL 数据库

## 知识库

- `psql` - 交互式命令行客户端
- `pg_dump` / `pg_restore` - 备份恢复工具
- `EXPLAIN ANALYZE` - 查询执行计划
- 连接参数：host, port, database, user, password
- 系统表：pg_stat_activity, pg_stat_user_tables

---

## 工作流

### NODE-01: 连接配置

```yaml
id: NODE-01
input: user.request
type: branch
action: |
  解析连接信息：
  
  必需参数：
  - host: 数据库主机地址
  - port: 端口（默认 5432）
  - database: 数据库名
  - user: 用户名
  - password: 密码
  
  可选参数：
  - sslmode: SSL 模式（prefer/require/disable）
  - schema: 默认 schema（默认 public）
  
  连接字符串格式：
  ```
  postgresql://user:password@host:port/database?sslmode=require
  ```
  
  环境变量方式：
  - PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD
  
  验证连接可用性
success_criteria: 连接信息完整且有效
output: {connection_config, connection_string, env_vars{}}
on_success: NODE-02
on_failure:
  action: 询问缺失的连接信息
  fallback: ABORT
```

### NODE-02: 连接测试

```yaml
id: NODE-02
input: NODE-01.connection_config
action: |
  测试数据库连接：
  
  ```bash
  PGPASSWORD={password} psql \
    -h {host} -p {port} -U {user} -d {database} \
    -c "SELECT version();"
  ```
  
  或 Python：
  ```python
  import psycopg2
  conn = psycopg2.connect(**connection_config)
  cursor = conn.cursor()
  cursor.execute("SELECT version();")
  version = cursor.fetchone()
  ```
  
  检查：
  - 网络连通性
  - 认证是否通过
  - 数据库是否存在
  - 权限是否足够
success_criteria: 连接成功
output: {connection_status, server_version, test_latency_ms}
on_success: NODE-03
on_failure:
  action: |
    根据错误处理：
    - connection refused → 检查 host/port
    - authentication failed → 检查 user/password
    - database does not exist → 确认数据库名
    - permission denied → 检查用户权限
  fallback: ABORT
```

### NODE-03: 任务类型识别

```yaml
id: NODE-03
input: user.request
type: branch
action: |
  识别任务类型：
  
  1. 数据查询：
     - SELECT 查询
     - 聚合统计
     - 多表关联
  
  2. 结构管理：
     - 查看表结构
     - 导出 schema
     - 创建/修改表
  
  3. 数据修改：
     - INSERT/UPDATE/DELETE
     - 批量导入
     - 数据迁移
  
  4. 备份恢复：
     - 全库备份
     - 单表备份
     - 数据恢复
  
  5. 性能优化：
     - 慢查询分析
     - 索引优化
     - 配置调优
  
  6. 监控诊断：
     - 连接监控
     - 锁分析
     - 空间使用
success_criteria: 确定任务类型
output: {task_type, task_details{}}
on_success: NODE-04
on_failure:
  action: 澄清任务需求
  fallback: ABORT
```

### NODE-04: 执行数据查询

```yaml
id: NODE-04
input: [NODE-03.task_details, NODE-01.connection_config]
action: |
  执行 SQL 查询：
  
  查询执行：
  ```bash
  psql -h {host} -U {user} -d {database} -c "{sql}"
  ```
  
  格式化输出选项：
  - --csv → CSV 格式
  - --json → JSON 格式
  - -P format=aligned → 表格对齐
  
  结果处理：
  - 限制行数（LIMIT）
  - 保存到文件
  - 格式化显示
  
  安全注意：
  - 避免在日志中暴露密码
  - 大结果集使用游标分批获取
success_criteria: 查询成功执行
output: {query_result, row_count, execution_time_ms}
on_success: NODE-05
on_failure:
  action: |
    根据错误处理：
    - syntax error → 修正 SQL 语法
    - permission denied → 检查表权限
    - table does not exist → 确认表名/schema
  retry: 2
  fallback: ABORT
```

### NODE-05: 导出表结构

```yaml
id: NODE-05
input: [NODE-03.task_details, NODE-01.connection_config]
action: |
  导出数据库结构：
  
  完整 schema 导出：
  ```bash
  pg_dump -h {host} -U {user} -d {database} \
    --schema-only --no-owner --no-privileges \
    > schema.sql
  ```
  
  单表结构导出：
  ```bash
  pg_dump -h {host} -U {user} -d {database} \
    --table={table_name} --schema-only \
    > table_schema.sql
  ```
  
  元数据查询：
  ```sql
  -- 表列表
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public';
  
  -- 表结构
  SELECT column_name, data_type, is_nullable 
  FROM information_schema.columns 
  WHERE table_name = '{table}';
  
  -- 索引
  SELECT indexname, indexdef FROM pg_indexes 
  WHERE tablename = '{table}';
  ```
  
  生成 Markdown 格式文档
success_criteria: 结构导出完成
output: {schema_files[], table_documentation}
on_success: NODE-06
on_failure:
  action: 检查权限和表名
  fallback: ABORT
```

### NODE-06: 数据库备份

```yaml
id: NODE-06
input: [NODE-03.task_details, NODE-01.connection_config]
action: |
  执行数据库备份：
  
  全库备份：
  ```bash
  pg_dump -h {host} -U {user} -d {database} \
    --verbose --file=backup_{database}_{date}.sql
  ```
  
  压缩备份：
  ```bash
  pg_dump -h {host} -U {user} -d {database} | gzip > backup.sql.gz
  ```
  
  单表备份：
  ```bash
  pg_dump -h {host} -U {user} -d {database} \
    --table={table_name} > table_backup.sql
  ```
  
  仅数据（无结构）：
  ```bash
  pg_dump --data-only > data_backup.sql
  ```
  
  备份验证：
  - 检查文件大小
  - 验证文件头
  
  设置备份轮转（保留最近 N 个）
success_criteria: 备份成功创建
output: {backup_file_path, file_size_mb, checksum}
on_success: NODE-07
on_failure:
  action: 检查磁盘空间和权限
  fallback: ABORT
```

### NODE-07: 性能分析

```yaml
id: NODE-07
input: [NODE-03.task_details, NODE-01.connection_config]
action: |
  执行性能分析：
  
  查询执行计划：
  ```sql
  EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
  {query};
  ```
  
  慢查询检查：
  ```sql
  SELECT query, mean_exec_time, calls 
  FROM pg_stat_statements 
  ORDER BY mean_exec_time DESC 
  LIMIT 10;
  ```
  
  表统计信息：
  ```sql
  SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_live_tup
  FROM pg_stat_user_tables
  ORDER BY n_live_tup DESC;
  ```
  
  索引使用：
  ```sql
  SELECT schemaname, tablename, indexrelname, idx_scan
  FROM pg_stat_user_indexes
  ORDER BY idx_scan DESC;
  ```
  
  连接状态：
  ```sql
  SELECT state, count(*) FROM pg_stat_activity 
  GROUP BY state;
  ```
  
  生成性能报告
success_criteria: 分析完成
output: {performance_report, recommendations[]}
on_success: NODE-08
on_failure:
  action: 检查 pg_stat_statements 扩展
  fallback: NODE-08
```

### NODE-08: 结果输出

```yaml
id: NODE-08
input: [NODE-04.query_result, NODE-05.schema_files, NODE-06.backup_file_path, NODE-07.performance_report]
action: |
  格式化输出结果：
  
  查询结果：
  - 表格格式显示（限制前 20 行）
  - 保存完整结果到文件
  - 提供总行数
  
  结构导出：
  - 提供 SQL 文件路径
  - 生成 Markdown 文档
  
  备份文件：
  - 文件路径和大小
  - 校验和
  - 恢复命令示例
  
  性能报告：
  - 关键指标摘要
  - 优化建议
  
  生成执行摘要
success_criteria: 结果输出完成
output: {output_summary, file_paths[]}
on_success: NODE-FINAL
on_failure:
  fallback: NODE-FINAL
```

### NODE-FINAL: 完成与建议

```yaml
id: NODE-FINAL
type: end
input: [NODE-08.output_summary, NODE-03.task_type]
action: |
  输出总结：
  ✅ 任务类型：{task_type}
  📊 执行结果：{output_summary}
  💾 输出文件：{file_paths}
  
  数据库维护建议：
  1. 定期执行 VACUUM ANALYZE 更新统计信息
  2. 监控磁盘空间使用
  3. 定期备份重要数据
  4. 审查慢查询日志
  5. 及时更新 PostgreSQL 版本
  
  安全建议：
  - 使用强密码和 SSL 连接
  - 限制数据库用户权限
  - 避免在生产环境直接执行复杂查询
  
  询问用户是否需要：
  - 执行其他查询
  - 设置定期备份任务
  - 优化特定慢查询
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "查询 PostgreSQL"
- "备份数据库"
- "导出表结构"
- "分析慢查询"
- "数据库性能优化"
