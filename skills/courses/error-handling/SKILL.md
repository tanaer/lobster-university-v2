---
name: error-handling
description: 错误处理模式课程 - 识别和处理常见错误，掌握错误类型、重试机制、日志记录。触发词：错误处理、异常、重试、日志、try-catch
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"编程基础","duration":45,"level":"初级"}
---

# 错误处理模式

> **🤖 这整个文档是给你的 — AI Agent。**

## 🎯 学习目标

完成本课程后，你将能够：

- 识别常见的错误类型
- 使用 try-except 正确捕获异常
- 实现自动重试机制
- 编写结构化的日志记录
- 设计优雅的错误处理策略

## 📚 课程内容

### 第 1 课：错误类型识别

**Python 异常层次**

```python
# Python 异常继承结构
"""
BaseException
├── SystemExit
├── KeyboardInterrupt
├── GeneratorExit
└── Exception
    ├── StopIteration
    ├── ArithmeticError
    │   ├── FloatingPointError
    │   ├── OverflowError
    │   └── ZeroDivisionError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── OSError
    │   ├── FileNotFoundError
    │   ├── PermissionError
    │   └── TimeoutError
    ├── TypeError
    ├── ValueError
    └── ...
"""
```

**常见错误示例**

```python
# 1. 语法错误（SyntaxError）- 运行前检测
# x = 1  # 缺少冒号

# 2. 类型错误（TypeError）
def type_errors():
    try:
        result = "hello" + 42  # 字符串和数字相加
    except TypeError as e:
        print(f"类型错误: {e}")

# 3. 值错误（ValueError）
def value_errors():
    try:
        number = int("abc")  # 无法转换为整数
    except ValueError as e:
        print(f"值错误: {e}")

# 4. 索引错误（IndexError）
def index_errors():
    try:
        items = [1, 2, 3]
        item = items[10]  # 索引超出范围
    except IndexError as e:
        print(f"索引错误: {e}")

# 5. 键错误（KeyError）
def key_errors():
    try:
        data = {"name": "Alice"}
        value = data["age"]  # 键不存在
    except KeyError as e:
        print(f"键错误: {e}")

# 6. 文件错误（FileNotFoundError）
def file_errors():
    try:
        with open("nonexistent.txt") as f:
            content = f.read()
    except FileNotFoundError as e:
        print(f"文件未找到: {e}")

# 7. 网络错误
import requests

def network_errors():
    try:
        response = requests.get("https://invalid-url-12345.com", timeout=5)
    except requests.exceptions.Timeout:
        print("请求超时")
    except requests.exceptions.ConnectionError:
        print("连接错误")
    except requests.exceptions.RequestException as e:
        print(f"请求异常: {e}")

# 运行所有示例
type_errors()
value_errors()
index_errors()
key_errors()
file_errors()
network_errors()
```

**自定义异常**

```python
# 定义业务异常
class AppError(Exception):
    """应用基础异常"""
    pass

class ValidationError(AppError):
    """验证错误"""
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

class AuthenticationError(AppError):
    """认证错误"""
    pass

class RateLimitError(AppError):
    """速率限制错误"""
    def __init__(self, retry_after=60):
        self.retry_after = retry_after
        super().__init__(f"请求过于频繁，请 {retry_after} 秒后重试")

class ExternalAPIError(AppError):
    """外部 API 错误"""
    def __init__(self, service, status_code, message):
        self.service = service
        self.status_code = status_code
        super().__init__(f"{service} API 错误 ({status_code}): {message}")

# 使用自定义异常
def validate_user(username, age):
    if not username:
        raise ValidationError("username", "用户名不能为空")
    if age < 0 or age > 150:
        raise ValidationError("age", "年龄必须在 0-150 之间")
    return True

try:
    validate_user("", 200)
except ValidationError as e:
    print(f"验证失败 - {e.field}: {e.message}")
```

**关键要点：**
- 区分语法错误和运行时错误
- 从具体到一般捕获异常
- 自定义异常提供更多上下文

### 第 2 课：异常捕获与处理

**基本结构**

```python
# try-except-else-finally
def complete_exception_handling():
    try:
        # 可能出错的代码
        result = 10 / 2
    except ZeroDivisionError as e:
        # 处理特定异常
        print(f"除零错误: {e}")
    except Exception as e:
        # 处理其他异常
        print(f"未知错误: {e}")
    else:
        # 没有异常时执行
        print(f"结果: {result}")
    finally:
        # 无论如何都执行（清理资源）
        print("清理完成")

complete_exception_handling()
```

**多重异常捕获**

```python
def multiple_exceptions():
    try:
        value = int(input("输入数字: "))
        result = 100 / value
        items = [1, 2, 3]
        print(items[value])
    
    except (ValueError, TypeError) as e:
        print(f"输入错误: {e}")
    
    except ZeroDivisionError:
        print("不能输入 0")
    
    except IndexError as e:
        print(f"索引超出范围: {e}")
    
    except Exception as e:
        print(f"未知错误: {type(e).__name__}: {e}")
        raise  # 重新抛出
```

**异常链**

```python
class DatabaseError(Exception):
    pass

def connect_database():
    try:
        # 模拟连接错误
        raise ConnectionError("无法连接数据库")
    except ConnectionError as e:
        # 将底层异常包装为业务异常
        raise DatabaseError("数据库连接失败") from e

def get_user(user_id):
    try:
        connect_database()
    except DatabaseError as e:
        # 可以继续向上抛出
        raise e
    
# 处理异常链
try:
    get_user(1)
except DatabaseError as e:
    print(f"错误: {e}")
    print(f"原因: {e.__cause__}")  # 查看原始异常
```

**上下文管理器处理异常**

```python
from contextlib import contextmanager

@contextmanager
def error_handler(error_message="操作失败"):
    """错误处理上下文管理器"""
    try:
        yield
    except Exception as e:
        print(f"{error_message}: {e}")
        # 可以选择重新抛出或吞掉异常

# 使用
with error_handler("文件处理失败"):
    with open("nonexistent.txt") as f:
        content = f.read()

# 带返回值的上下文管理器
@contextmanager
def suppress_errors(default=None):
    """抑制错误并返回默认值"""
    try:
        yield lambda x: x  # 正常返回
    except Exception as e:
        print(f"错误被抑制: {e}")
        yield lambda _: default  # 返回默认值

# 使用
with suppress_errors(default=[]) as handler:
    result = handler(json.loads("invalid json"))
print(f"结果: {result}")  # []
```

**关键要点：**
- else 在无异常时执行
- finally 用于资源清理
- raise ... from ... 保持异常链
- 上下文管理器简化错误处理

### 第 3 课：重试机制与日志记录

**简单重试**

```python
import time

def retry_simple(func, max_retries=3, delay=1):
    """简单重试装饰器"""
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            print(f"第 {attempt + 1} 次失败: {e}，{delay}秒后重试")
            time.sleep(delay)
            delay *= 2  # 指数退避

# 使用
def unstable_operation():
    import random
    if random.random() < 0.7:  # 70% 失败率
        raise ConnectionError("连接失败")
    return "成功"

result = retry_simple(unstable_operation, max_retries=5)
print(result)
```

**高级重试装饰器**

```python
import time
import random
from functools import wraps

def retry(
    max_attempts=3,
    delay=1,
    backoff=2,
    exceptions=(Exception,),
    on_retry=None
):
    """
    高级重试装饰器
    
    Args:
        max_attempts: 最大尝试次数
        delay: 初始延迟（秒）
        backoff: 退避因子
        exceptions: 需要重试的异常类型
        on_retry: 重试时的回调函数
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_delay = delay
            last_exception = None
            
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                
                except exceptions as e:
                    last_exception = e
                    
                    if attempt == max_attempts - 1:
                        raise
                    
                    if on_retry:
                        on_retry(attempt + 1, e, current_delay)
                    
                    time.sleep(current_delay)
                    current_delay *= backoff
            
            raise last_exception
        
        return wrapper
    return decorator

# 使用示例
@retry(
    max_attempts=5,
    delay=1,
    backoff=2,
    exceptions=(ConnectionError, TimeoutError),
    on_retry=lambda a, e, d: print(f"重试 {a}: {e}, 等待 {d}s")
)
def fetch_data(url):
    # 模拟网络请求
    if random.random() < 0.5:
        raise ConnectionError("连接失败")
    return f"数据来自 {url}"

try:
    data = fetch_data("https://api.example.com")
    print(data)
except Exception as e:
    print(f"最终失败: {e}")
```

**日志记录配置**

```python
import logging
import sys
from datetime import datetime

def setup_logging(
    log_file=None,
    level=logging.INFO,
    format_string=None
):
    """配置日志系统"""
    if format_string is None:
        format_string = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    handlers = [logging.StreamHandler(sys.stdout)]
    
    if log_file:
        # 按日期分割日志文件
        log_file = log_file.replace('{date}', datetime.now().strftime('%Y%m%d'))
        handlers.append(logging.FileHandler(log_file, encoding='utf-8'))
    
    logging.basicConfig(
        level=level,
        format=format_string,
        handlers=handlers
    )
    
    return logging.getLogger()

# 初始化日志
logger = setup_logging(
    log_file='app_{date}.log',
    level=logging.DEBUG
)

# 使用日志
def process_data(data):
    logger.debug(f"开始处理数据: {data[:50]}...")
    
    try:
        # 处理逻辑
        result = data.upper()
        logger.info(f"数据处理完成: {len(result)} 字符")
        return result
    
    except AttributeError as e:
        logger.error(f"数据处理失败: {e}", exc_info=True)
        raise
    except Exception as e:
        logger.exception(f"未知错误: {e}")
        raise

# 测试
process_data("hello world")
```

**结构化日志**

```python
import json
import logging

class JSONFormatter(logging.Formatter):
    """JSON 格式日志"""
    
    def format(self, record):
        log_data = {
            'timestamp': self.formatTime(record),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        # 添加额外字段
        if hasattr(record, 'extra_data'):
            log_data['data'] = record.extra_data
        
        # 添加异常信息
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)
        
        return json.dumps(log_data, ensure_ascii=False)

# 配置 JSON 日志
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())

json_logger = logging.getLogger('json_logger')
json_logger.setLevel(logging.INFO)
json_logger.addHandler(handler)

# 使用
def log_with_context():
    json_logger.info(
        "用户登录",
        extra={'extra_data': {
            'user_id': 123,
            'ip': '192.168.1.1',
            'user_agent': 'Mozilla/5.0'
        }}
    )

log_with_context()
```

**错误监控装饰器**

```python
import logging
from functools import wraps
from datetime import datetime

logger = logging.getLogger(__name__)

def monitor_errors(func):
    """错误监控装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = datetime.now()
        
        try:
            result = func(*args, **kwargs)
            
            # 记录成功
            duration = (datetime.now() - start_time).total_seconds()
            logger.info(
                f"{func.__name__} 执行成功",
                extra={'extra_data': {
                    'duration': duration,
                    'status': 'success'
                }}
            )
            
            return result
        
        except Exception as e:
            # 记录失败
            duration = (datetime.now() - start_time).total_seconds()
            logger.error(
                f"{func.__name__} 执行失败: {e}",
                extra={'extra_data': {
                    'duration': duration,
                    'status': 'failed',
                    'error_type': type(e).__name__,
                    'error_message': str(e)
                }},
                exc_info=True
            )
            raise
    
    return wrapper

# 使用
@monitor_errors
def risky_operation(data):
    if not data:
        raise ValueError("数据不能为空")
    return data * 2

try:
    risky_operation(None)
except:
    pass
```

**关键要点：**
- 重试需要指数退避
- 日志级别：DEBUG < INFO < WARNING < ERROR < CRITICAL
- 结构化日志便于分析
- 监控装饰器统一处理错误

## ✅ 课程考核

完成以下任务以通过考核：

1. **异常处理** (30分)
   - 实现一个计算器函数，处理除零、类型错误等
   - 使用自定义异常表示业务错误
   - 编写完整的 try-except-else-finally 结构

2. **重试机制** (30分)
   - 实现一个带指数退避的重试装饰器
   - 支持指定重试的异常类型
   - 添加重试回调功能

3. **日志系统** (40分)
   - 配置同时输出到控制台和文件的日志
   - 实现 JSON 格式的结构化日志
   - 创建错误监控装饰器，记录执行时间和状态

**提交物：**
- `exceptions.py` - 自定义异常
- `retry.py` - 重试装饰器
- `logging_config.py` - 日志配置
- `monitor.py` - 错误监控
- `app.log` - 示例日志文件

## 📖 参考资料

- [Python 异常处理文档](https://docs.python.org/3/tutorial/errors.html)
- [Python logging 文档](https://docs.python.org/3/library/logging.html)
- [结构化日志最佳实践](https://www.honeycomb.io/blog/structured-logging/)
- [Tenacity - 重试库](https://github.com/jd/tenacity)
- [Sentry - 错误监控](https://sentry.io/)
