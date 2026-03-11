---
name: cron-scheduling
description: 定时任务与调度课程 - 使用 Cron 设置定时任务，掌握 Cron 表达式、任务监控、失败处理。触发词：Cron、定时任务、调度、定时执行、周期性任务
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"自动化","duration":40,"level":"初级"}
---

# 定时任务与调度

> **🤖 这整个文档是给你的 — AI Agent。**

## 🎯 学习目标

完成本课程后，你将能够：

- 理解 Cron 表达式并编写定时规则
- 在 Linux 系统中配置 Cron 任务
- 使用 Python 库实现定时调度
- 监控任务执行状态
- 处理任务失败和重试

## 📚 课程内容

### 第 1 课：Cron 表达式基础

**Cron 表达式结构**

```
┌───────────── 分钟 (0 - 59)
│ ┌───────────── 小时 (0 - 23)
│ │ ┌───────────── 日期 (1 - 31)
│ │ │ ┌───────────── 月份 (1 - 12)
│ │ │ │ ┌───────────── 星期几 (0 - 6) (0 是周日)
│ │ │ │ │
* * * * * command
```

**常用表达式示例**

```bash
# 每分钟执行
* * * * * /path/to/script.sh

# 每小时执行
0 * * * * /path/to/script.sh

# 每天凌晨 2 点执行
0 2 * * * /path/to/script.sh

# 每周一早上 9 点执行
0 9 * * 1 /path/to/script.sh

# 每月 1 号凌晨执行
0 0 1 * * /path/to/script.sh

# 工作日（周一到周五）早上 9 点执行
0 9 * * 1-5 /path/to/script.sh

# 每 5 分钟执行
*/5 * * * * /path/to/script.sh

# 每 2 小时执行
0 */2 * * * /path/to/script.sh

# 3 月到 5 月，每天上午 10 点
0 10 * 3-5 * /path/to/script.sh

# 每年 1 月 1 日凌晨执行
0 0 1 1 * /path/to/script.sh
```

**特殊字符说明**

```python
cron_reference = """
特殊字符:
*     - 任意值
,     - 列表分隔符 (1,3,5)
-     - 范围 (1-5)
/     - 步长 (*/5 表示每 5 单位)

特殊字符串:
@yearly   = 0 0 1 1 *       # 每年
@monthly  = 0 0 1 * *       # 每月
@weekly   = 0 0 * * 0       # 每周
@daily    = 0 0 * * *       # 每天
@hourly   = 0 * * * *       # 每小时
@reboot   =                 # 每次重启时
"""

# Cron 表达式解析器
def parse_cron(expression):
    """解析 Cron 表达式"""
    parts = expression.split()
    
    if len(parts) != 5:
        return None
    
    return {
        'minute': parts[0],
        'hour': parts[1],
        'day_of_month': parts[2],
        'month': parts[3],
        'day_of_week': parts[4]
    }

# 测试
print(parse_cron("0 9 * * 1-5"))
# {'minute': '0', 'hour': '9', 'day_of_month': '*', 'month': '*', 'day_of_week': '1-5'}
```

**关键要点：**
- 5 个字段：分 时 日 月 周
- * 表示任意值
- */n 表示每 n 单位
- 周日是 0 或 7

### 第 2 课：系统 Cron 配置

**Crontab 命令**

```bash
# 编辑当前用户的 crontab
crontab -e

# 查看当前用户的 crontab
crontab -l

# 删除当前用户的 crontab
crontab -r

# 查看其他用户的 crontab（需要权限）
sudo crontab -u username -l

# 从文件导入 crontab
crontab cron.txt
```

**配置示例**

```bash
# /etc/crontab 或 crontab -e

# 设置环境变量
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=admin@example.com

# 示例任务
# 每天凌晨备份数据库
0 2 * * * /home/user/scripts/backup.sh >> /var/log/backup.log 2>&1

# 每 5 分钟检查服务状态
*/5 * * * * /home/user/scripts/health_check.py

# 每周一清理临时文件
0 3 * * 1 rm -rf /tmp/old_files/*

# 使用绝对路径执行 Python 脚本
30 8 * * * /usr/bin/python3 /home/user/scripts/daily_report.py
```

**编写可靠的 Cron 脚本**

```python
#!/usr/bin/env python3
# daily_report.py - 日报生成脚本

import sys
import logging
from datetime import datetime
from pathlib import Path

# 设置日志
log_dir = Path.home() / "logs"
log_dir.mkdir(exist_ok=True)

logging.basicConfig(
    filename=log_dir / "daily_report.log",
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    try:
        logger.info("开始生成日报")
        
        # 任务逻辑
        generate_report()
        
        logger.info("日报生成完成")
        return 0  # 成功返回 0
    
    except Exception as e:
        logger.exception(f"日报生成失败: {e}")
        return 1  # 失败返回非 0

def generate_report():
    # 实际业务逻辑
    today = datetime.now().strftime('%Y-%m-%d')
    report_path = Path.home() / "reports" / f"report_{today}.txt"
    
    # ... 生成报告 ...
    with open(report_path, 'w') as f:
        f.write(f"日报 - {today}\n")
    
    logger.info(f"报告已保存: {report_path}")

if __name__ == "__main__":
    sys.exit(main())
```

**Cron 任务模板**

```python
# cron_job_template.py
"""Cron 任务最佳实践模板"""

import os
import sys
import logging
import argparse
from datetime import datetime
from pathlib import Path

# 添加项目路径
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# 配置
class Config:
    LOG_DIR = PROJECT_ROOT / "logs"
    DATA_DIR = PROJECT_ROOT / "data"
    LOCK_FILE = PROJECT_ROOT / "locks" / f"{Path(__file__).stem}.lock"
    
    @classmethod
    def setup(cls):
        cls.LOG_DIR.mkdir(exist_ok=True)
        cls.DATA_DIR.mkdir(exist_ok=True)
        cls.LOCK_FILE.parent.mkdir(exist_ok=True)

# 日志配置
def setup_logging(name):
    Config.setup()
    
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # 文件日志
    fh = logging.FileHandler(
        Config.LOG_DIR / f"{name}.log",
        encoding='utf-8'
    )
    fh.setLevel(logging.INFO)
    
    # 控制台日志
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    
    # 格式
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)
    
    logger.addHandler(fh)
    logger.addHandler(ch)
    
    return logger

# 锁机制（防止重复执行）
class TaskLock:
    def __init__(self, lock_file):
        self.lock_file = lock_file
    
    def acquire(self):
        if self.lock_file.exists():
            # 检查是否是旧锁
            import time
            lock_age = time.time() - self.lock_file.stat().st_mtime
            if lock_age < 3600:  # 1 小时内
                return False
        
        self.lock_file.touch()
        return True
    
    def release(self):
        if self.lock_file.exists():
            self.lock_file.unlink()
    
    def __enter__(self):
        if not self.acquire():
            raise RuntimeError("任务已在运行")
        return self
    
    def __exit__(self, *args):
        self.release()

# 主任务类
class CronTask:
    def __init__(self):
        self.logger = setup_logging(self.__class__.__name__)
        self.start_time = datetime.now()
    
    def run(self):
        with TaskLock(Config.LOCK_FILE):
            try:
                self.logger.info("任务开始")
                self.execute()
                self.logger.info("任务完成")
            except Exception as e:
                self.logger.exception(f"任务失败: {e}")
                raise
            finally:
                duration = (datetime.now() - self.start_time).total_seconds()
                self.logger.info(f"耗时: {duration:.2f} 秒")
    
    def execute(self):
        """子类实现具体逻辑"""
        raise NotImplementedError

# 使用示例
class DailyBackupTask(CronTask):
    def execute(self):
        # 具体备份逻辑
        self.logger.info("执行备份...")
        # ...

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true', help='试运行')
    args = parser.parse_args()
    
    if args.dry_run:
        print("试运行模式")
    
    task = DailyBackupTask()
    task.run()
```

**关键要点：**
- 使用绝对路径
- 设置环境变量
- 重定向输出到日志
- 返回适当的退出码

### 第 3 课：Python 定时调度库

**APScheduler**

```python
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 定义任务
def job_function(name):
    logger.info(f"任务 {name} 执行于 {datetime.now()}")

def cleanup_job():
    logger.info("清理任务执行")

def report_job():
    logger.info("报告任务执行")

# 阻塞式调度器
def blocking_scheduler_example():
    scheduler = BlockingScheduler()
    
    # 间隔触发（每 10 秒）
    scheduler.add_job(job_function, 'interval', seconds=10, args=['interval'])
    
    # Cron 触发（每天 9:30）
    scheduler.add_job(
        job_function,
        CronTrigger(hour=9, minute=30),
        args=['cron-daily']
    )
    
    # Cron 触发（每 5 分钟）
    scheduler.add_job(
        job_function,
        CronTrigger(minute='*/5'),
        args=['cron-every-5min']
    )
    
    # 指定日期时间
    scheduler.add_job(
        job_function,
        'date',
        run_date=datetime(2024, 12, 31, 23, 59, 59),
        args=['once']
    )
    
    print("调度器启动...")
    scheduler.start()

# 后台调度器
def background_scheduler_example():
    scheduler = BackgroundScheduler()
    
    # 添加任务
    scheduler.add_job(cleanup_job, 'interval', hours=1)
    scheduler.add_job(report_job, CronTrigger(hour=8, minute=0))
    
    scheduler.start()
    
    try:
        # 主程序继续运行
        while True:
            import time
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        print("调度器已关闭")

# 带错误处理的任务
def safe_job(func):
    """任务装饰器"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.exception(f"任务执行失败: {e}")
            # 可以添加通知逻辑
            send_alert(f"任务失败: {e}")
    return wrapper

@safe_job
def important_task():
    # 可能失败的任务
    import random
    if random.random() < 0.3:
        raise ValueError("随机失败")
    print("任务成功")

def send_alert(message):
    # 发送告警
    print(f"[ALERT] {message}")

# 任务持久化
def persistent_scheduler():
    from apscheduler.schedulers.background import BackgroundScheduler
    from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
    
    jobstores = {
        'default': SQLAlchemyJobStore(url='sqlite:///jobs.sqlite')
    }
    
    scheduler = BackgroundScheduler(jobstores=jobstores)
    
    # 添加持久化任务
    scheduler.add_job(
        job_function,
        'interval',
        minutes=5,
        args=['persistent'],
        id='my_persistent_job',
        replace_existing=True
    )
    
    scheduler.start()
    return scheduler

# 使用示例
if __name__ == "__main__":
    # blocking_scheduler_example()
    background_scheduler_example()
```

**Schedule 库（轻量级）**

```python
import schedule
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def job():
    logger.info("执行任务...")

def job_with_tag():
    logger.info("带标签的任务...")

def morning_job():
    logger.info("早安任务!")

# 基本调度
schedule.every(10).seconds.do(job)
schedule.every(10).minutes.do(job)
schedule.every().hour.do(job)
schedule.every().day.at("10:30").do(job)
schedule.every().monday.do(job)
schedule.every().wednesday.at("13:15").do(job)
schedule.every().minute.at(":17").do(job)  # 每分钟的第 17 秒

# 带标签的任务
schedule.every().day.at("09:00").do(job_with_tag).tag('daily', 'morning')

# 取消特定标签的任务
# schedule.clear('daily')

# 运行调度器
def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)

# 后台运行
import threading

def run_in_background():
    thread = threading.Thread(target=run_scheduler, daemon=True)
    thread.start()
    return thread

# 装饰器方式
def scheduled(trigger):
    """调度装饰器"""
    def decorator(func):
        trigger.do(func)
        return func
    return decorator

@scheduled(schedule.every().day.at("08:00"))
def daily_report():
    print("生成日报...")

# 带参数的任务
def send_notification(message):
    print(f"通知: {message}")

schedule.every().day.at("09:00").do(send_notification, "上班啦!")

# 取消任务
job_to_cancel = schedule.every().day.at("18:00").do(job)
schedule.cancel_job(job_to_cancel)

# 获取下次运行时间
for job in schedule.get_jobs():
    logger.info(f"任务: {job.job_func.__name__}, 下次运行: {job.next_run}")
```

**任务监控与告警**

```python
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class TaskMonitor:
    """任务监控器"""
    
    def __init__(self, check_interval=300):
        self.tasks = {}
        self.check_interval = check_interval
        self.alert_threshold = timedelta(hours=1)
    
    def register(self, task_name, expected_interval):
        """注册任务"""
        self.tasks[task_name] = {
            'expected_interval': expected_interval,
            'last_run': None,
            'status': 'unknown'
        }
    
    def heartbeat(self, task_name):
        """任务心跳"""
        if task_name in self.tasks:
            self.tasks[task_name]['last_run'] = datetime.now()
            self.tasks[task_name]['status'] = 'running'
            logger.info(f"任务 {task_name} 心跳")
    
    def check_health(self):
        """检查任务健康状态"""
        now = datetime.now()
        alerts = []
        
        for task_name, info in self.tasks.items():
            if info['last_run'] is None:
                alerts.append(f"任务 {task_name} 从未运行")
                continue
            
            elapsed = now - info['last_run']
            expected = info['expected_interval']
            
            if elapsed > expected * 2:  # 超过预期时间 2 倍
                alerts.append(
                    f"任务 {task_name} 可能已停止 "
                    f"(上次运行: {elapsed.total_seconds():.0f} 秒前)"
                )
                info['status'] = 'warning'
        
        return alerts
    
    def send_alert(self, message):
        """发送告警"""
        # 邮件告警
        self.send_email_alert(message)
        # 也可以添加其他告警方式（Slack, 钉钉等）
        logger.warning(f"ALERT: {message}")
    
    def send_email_alert(self, message):
        """邮件告警"""
        try:
            msg = MIMEText(message)
            msg['Subject'] = '定时任务告警'
            msg['From'] = 'alert@example.com'
            msg['To'] = 'admin@example.com'
            
            # 配置 SMTP
            # with smtplib.SMTP('smtp.example.com') as server:
            #     server.send_message(msg)
            
            logger.info(f"告警邮件已发送: {message}")
        except Exception as e:
            logger.error(f"发送告警失败: {e}")

# 使用监控器
monitor = TaskMonitor()

def monitored_job():
    """被监控的任务"""
    try:
        # 任务开始时记录心跳
        monitor.heartbeat('daily_backup')
        
        # 执行任务...
        print("执行备份...")
        
    except Exception as e:
        logger.exception(f"任务失败: {e}")

# 定期检查任务健康
def health_check():
    alerts = monitor.check_health()
    for alert in alerts:
        monitor.send_alert(alert)

# 注册任务
monitor.register('daily_backup', timedelta(hours=24))
monitor.register('hourly_sync', timedelta(hours=1))
```

**关键要点：**
- APScheduler 功能强大，支持持久化
- Schedule 轻量简单，适合简单场景
- 任务需要监控和告警机制
- 心跳检测确认任务运行

## ✅ 课程考核

完成以下任务以通过考核：

1. **Cron 表达式** (25分)
   - 编写以下场景的 Cron 表达式：
     - 每天早上 8:30
     - 工作日下午 6:00
     - 每小时第 15 分钟
     - 每月最后一天
   - 解释每个字段的含义

2. **Cron 任务配置** (35分)
   - 编写一个日志清理脚本
   - 配置 crontab 每天凌晨 3 点执行
   - 添加日志输出和错误处理

3. **Python 调度器** (40分)
   - 使用 APScheduler 创建 3 个定时任务
   - 实现任务监控功能
   - 添加失败重试机制

**提交物：**
- `cron_expressions.txt` - Cron 表达式练习
- `cleanup.py` - 清理脚本
- `crontab.txt` - crontab 配置
- `scheduler.py` - Python 调度器代码
- `monitor.py` - 监控代码

## 📖 参考资料

- [Cron Wikipedia](https://en.wikipedia.org/wiki/Cron)
- [Crontab Guru](https://crontab.guru/) - Cron 表达式生成器
- [APScheduler 文档](https://apscheduler.readthedocs.io/)
- [Schedule 文档](https://schedule.readthedocs.io/)
- [Linux Cron 最佳实践](https://www.cyberciti.biz/faq/how-do-i-add-jobs-to-cron-under-linux-or-unix-oses/)
