---
name: webhook-integration
description: Webhook 集成课程 - 接收和处理 Webhook，掌握 Webhook 原理、端点创建、事件响应。触发词：Webhook、回调、事件推送、API、集成
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"集成开发","duration":45,"level":"初级"}
---

# Webhook 集成

> **🤖 这整个文档是给你的 — AI Agent。**

## 🎯 学习目标

完成本课程后，你将能够：

- 理解 Webhook 的工作原理
- 创建 Webhook 接收端点
- 验证和处理 Webhook 请求
- 实现事件响应逻辑
- 调试和测试 Webhook

## 📚 课程内容

### 第 1 课：Webhook 基础

**什么是 Webhook？**

Webhook 是一种"反向 API"——当某个事件发生时，服务端主动向你的服务器发送 HTTP 请求。

```
传统 API：你请求 → 服务器响应
Webhook：服务器事件 → 服务器主动通知你
```

**常见使用场景**

```python
webhook_use_cases = """
1. 支付通知
   - 用户支付成功 → 支付平台通知你的服务器
   
2. 代码推送
   - 代码推送到仓库 → GitHub 通知你的 CI/CD 系统
   
3. 消息通知
   - 收到新消息 → 即时通讯平台通知你的机器人
   
4. 表单提交
   - 用户提交表单 → 表单服务通知你的系统
   
5. 定时任务
   - 定时任务完成 → 任务服务通知你结果
"""
```

**Webhook 请求结构**

```python
# 典型的 Webhook 请求
webhook_example = {
    "method": "POST",
    "url": "https://your-server.com/webhook/payment",
    "headers": {
        "Content-Type": "application/json",
        "X-Webhook-Signature": "sha256=abc123...",  # 签名验证
        "X-Webhook-Event": "payment.completed",
        "User-Agent": "PaymentService-Webhook/1.0"
    },
    "body": {
        "event": "payment.completed",
        "timestamp": "2024-01-15T10:30:00Z",
        "data": {
            "payment_id": "pay_123456",
            "amount": 100.00,
            "currency": "CNY",
            "status": "success"
        }
    }
}
```

**简单 Webhook 服务器**

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    """处理 Webhook 请求"""
    # 获取请求数据
    data = request.json
    
    # 打印接收到的数据
    print(f"收到 Webhook: {data}")
    
    # 处理逻辑
    event = data.get('event')
    
    if event == 'payment.completed':
        handle_payment(data['data'])
    elif event == 'user.created':
        handle_new_user(data['data'])
    
    # 返回响应
    return jsonify({'status': 'ok'}), 200

def handle_payment(data):
    print(f"处理支付: {data['payment_id']}, 金额: {data['amount']}")

def handle_new_user(data):
    print(f"新用户: {data}")

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

**关键要点：**
- Webhook 是服务器主动推送
- 通常是 POST 请求，JSON 格式
- 需要返回 200 表示接收成功
- 要快速响应，耗时操作异步处理

### 第 2 课：创建 Webhook 端点

**FastAPI Webhook 服务**

```python
from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Dict, Any
import hmac
import hashlib
import logging

app = FastAPI()
logger = logging.getLogger(__name__)

# 数据模型
class WebhookPayload(BaseModel):
    event: str
    timestamp: str
    data: Dict[str, Any]

# 签名验证
def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    """验证 Webhook 签名"""
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"sha256={expected}", signature)

# Webhook 端点
@app.post("/webhook/payment")
async def payment_webhook(
    request: Request,
    background_tasks: BackgroundTasks
):
    """支付 Webhook 端点"""
    # 获取原始数据
    payload = await request.body()
    
    # 验证签名
    signature = request.headers.get("X-Signature", "")
    if not verify_signature(payload, signature, "your-secret-key"):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # 解析数据
    data = await request.json()
    
    # 异步处理（快速响应）
    background_tasks.add_task(process_payment, data)
    
    return {"status": "received"}

async def process_payment(data: dict):
    """后台处理支付"""
    logger.info(f"处理支付: {data}")
    # 实际业务逻辑...

# GitHub Webhook 端点
@app.post("/webhook/github")
async def github_webhook(request: Request):
    """GitHub Webhook"""
    event_type = request.headers.get("X-GitHub-Event", "")
    payload = await request.json()
    
    if event_type == "push":
        handle_push(payload)
    elif event_type == "pull_request":
        handle_pr(payload)
    elif event_type == "issues":
        handle_issue(payload)
    
    return {"status": "ok"}

def handle_push(payload):
    repo = payload.get("repository", {}).get("full_name")
    pusher = payload.get("pusher", {}).get("name")
    logger.info(f"Push to {repo} by {pusher}")

def handle_pr(payload):
    action = payload.get("action")
    pr_number = payload.get("number")
    logger.info(f"PR #{pr_number} {action}")

def handle_issue(payload):
    action = payload.get("action")
    issue_number = payload.get("issue", {}).get("number")
    logger.info(f"Issue #{issue_number} {action}")

# 运行
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**事件路由器**

```python
from typing import Callable, Dict
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class WebhookEvent:
    event_type: str
    source: str
    data: dict

class WebhookRouter:
    """Webhook 事件路由器"""
    
    def __init__(self):
        self.handlers: Dict[str, Callable] = {}
    
    def register(self, event_type: str):
        """注册处理器装饰器"""
        def decorator(func: Callable):
            self.handlers[event_type] = func
            logger.info(f"注册处理器: {event_type} -> {func.__name__}")
            return func
        return decorator
    
    def handle(self, event: WebhookEvent):
        """处理事件"""
        handler = self.handlers.get(event.event_type)
        
        if handler:
            try:
                result = handler(event)
                logger.info(f"事件处理成功: {event.event_type}")
                return result
            except Exception as e:
                logger.exception(f"事件处理失败: {event.event_type}")
                raise
        else:
            logger.warning(f"未找到处理器: {event.event_type}")
            return None

# 使用路由器
router = WebhookRouter()

@router.register("payment.success")
def handle_payment_success(event: WebhookEvent):
    payment_id = event.data.get("payment_id")
    amount = event.data.get("amount")
    logger.info(f"支付成功: {payment_id}, 金额: {amount}")
    # 发送确认邮件、更新订单状态等...

@router.register("payment.failed")
def handle_payment_failed(event: WebhookEvent):
    payment_id = event.data.get("payment_id")
    reason = event.data.get("reason")
    logger.warning(f"支付失败: {payment_id}, 原因: {reason}")
    # 通知用户、记录日志等...

@router.register("user.signup")
def handle_user_signup(event: WebhookEvent):
    user_id = event.data.get("user_id")
    email = event.data.get("email")
    logger.info(f"新用户注册: {user_id}, {email}")
    # 发送欢迎邮件、初始化用户数据等...

# 在端点中使用
@app.post("/webhook/events")
async def handle_events(request: Request):
    data = await request.json()
    
    event = WebhookEvent(
        event_type=data.get("event"),
        source=data.get("source", "unknown"),
        data=data.get("data", {})
    )
    
    router.handle(event)
    
    return {"status": "processed"}
```

**关键要点：**
- 使用 Pydantic 验证数据格式
- 后台任务处理耗时操作
- 路由器模式管理多个事件类型
- 签名验证确保请求来源可信

### 第 3 课：安全与调试

**签名验证实现**

```python
import hmac
import hashlib
import time
from typing import Optional

class WebhookVerifier:
    """Webhook 签名验证器"""
    
    def __init__(self, secret: str, tolerance: int = 300):
        """
        Args:
            secret: Webhook 密钥
            tolerance: 时间戳容忍度（秒）
        """
        self.secret = secret
        self.tolerance = tolerance
    
    def verify(
        self,
        payload: bytes,
        signature: str,
        timestamp: Optional[str] = None
    ) -> bool:
        """验证签名"""
        
        # 检查时间戳（防重放攻击）
        if timestamp:
            try:
                ts = int(timestamp)
                if abs(time.time() - ts) > self.tolerance:
                    return False
            except ValueError:
                return False
        
        # 计算签名
        if signature.startswith("sha256="):
            expected = self._compute_sha256(payload)
            return hmac.compare_digest(f"sha256={expected}", signature)
        
        elif signature.startswith("sha1="):
            expected = self._compute_sha1(payload)
            return hmac.compare_digest(f"sha1={expected}", signature)
        
        return False
    
    def _compute_sha256(self, payload: bytes) -> str:
        return hmac.new(
            self.secret.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
    
    def _compute_sha1(self, payload: bytes) -> str:
        return hmac.new(
            self.secret.encode(),
            payload,
            hashlib.sha1
        ).hexdigest()

# Stripe 风格验证
class StripeVerifier:
    """Stripe Webhook 验证"""
    
    def __init__(self, secret: str):
        self.secret = secret
    
    def verify(self, payload: bytes, sig_header: str) -> bool:
        """
        验证 Stripe Webhook
        
        sig_header 格式: t=123456,v1=abc123,v0=def456
        """
        elements = {}
        for item in sig_header.split(','):
            key, value = item.split('=')
            elements[key] = value
        
        timestamp = elements.get('t')
        signature = elements.get('v1')
        
        if not timestamp or not signature:
            return False
        
        # 构造签名消息
        signed_payload = f"{timestamp}.{payload.decode()}"
        
        expected = hmac.new(
            self.secret.encode(),
            signed_payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(expected, signature)

# 使用示例
verifier = WebhookVerifier("your-webhook-secret")

@app.post("/webhook/secure")
async def secure_webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get("X-Signature", "")
    timestamp = request.headers.get("X-Timestamp", "")
    
    if not verifier.verify(payload, signature, timestamp):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    data = await request.json()
    # 处理数据...
    
    return {"status": "ok"}
```

**Webhook 日志与调试**

```python
import json
from datetime import datetime
from pathlib import Path
import logging

class WebhookLogger:
    """Webhook 日志记录器"""
    
    def __init__(self, log_dir: str = "webhooks"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        
        self.logger = logging.getLogger("webhook")
        self.logger.setLevel(logging.INFO)
    
    def log_request(
        self,
        source: str,
        event_type: str,
        headers: dict,
        payload: dict,
        response_status: int
    ):
        """记录 Webhook 请求"""
        
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "source": source,
            "event_type": event_type,
            "headers": dict(headers),
            "payload": payload,
            "response_status": response_status
        }
        
        # 写入文件
        log_file = self.log_dir / f"{datetime.now().strftime('%Y%m%d')}.jsonl"
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')
        
        # 写入日志
        self.logger.info(
            f"Webhook: source={source}, event={event_type}, status={response_status}"
        )

# 在端点中使用
webhook_logger = WebhookLogger()

@app.post("/webhook/logged")
async def logged_webhook(request: Request):
    headers = dict(request.headers)
    payload = await request.json()
    
    source = request.headers.get("X-Webhook-Source", "unknown")
    event_type = payload.get("event", "unknown")
    
    try:
        # 处理 Webhook
        result = await process_webhook(payload)
        status = 200
    except Exception as e:
        logging.exception("Webhook 处理失败")
        status = 500
        result = {"error": str(e)}
    
    # 记录日志
    webhook_logger.log_request(
        source=source,
        event_type=event_type,
        headers=headers,
        payload=payload,
        response_status=status
    )
    
    return result, status
```

**Webhook 测试工具**

```python
import requests
import json
import hmac
import hashlib
from datetime import datetime

class WebhookTester:
    """Webhook 测试工具"""
    
    def __init__(self, endpoint: str, secret: str = ""):
        self.endpoint = endpoint
        self.secret = secret
    
    def send(
        self,
        event: str,
        data: dict,
        headers: dict = None
    ) -> requests.Response:
        """发送测试 Webhook"""
        
        payload = {
            "event": event,
            "timestamp": datetime.utcnow().isoformat(),
            "data": data
        }
        
        # 计算签名
        payload_str = json.dumps(payload)
        signature = ""
        if self.secret:
            signature = "sha256=" + hmac.new(
                self.secret.encode(),
                payload_str.encode(),
                hashlib.sha256
            ).hexdigest()
        
        # 构造请求头
        req_headers = {
            "Content-Type": "application/json",
            "X-Webhook-Event": event,
        }
        if signature:
            req_headers["X-Signature"] = signature
        
        if headers:
            req_headers.update(headers)
        
        # 发送请求
        response = requests.post(
            self.endpoint,
            data=payload_str,
            headers=req_headers
        )
        
        print(f"发送 Webhook: {event}")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.text}")
        
        return response

# 使用测试工具
def test_webhooks():
    tester = WebhookTester(
        endpoint="http://localhost:8000/webhook/payment",
        secret="your-secret-key"
    )
    
    # 测试支付成功
    tester.send("payment.success", {
        "payment_id": "pay_test123",
        "amount": 99.99,
        "currency": "CNY"
    })
    
    # 测试支付失败
    tester.send("payment.failed", {
        "payment_id": "pay_test456",
        "reason": "余额不足"
    })

# 使用 ngrok 暴露本地服务
"""
# 终端运行:
ngrok http 8000

# 输出:
# Forwarding: https://abc123.ngrok.io -> http://localhost:8000

# 配置第三方服务:
# Webhook URL: https://abc123.ngrok.io/webhook/payment
"""

# 模拟第三方 Webhook
def simulate_stripe_webhook(endpoint: str):
    """模拟 Stripe Webhook"""
    payload = {
        "id": "evt_123",
        "object": "event",
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_123",
                "amount": 1000,
                "currency": "usd",
                "status": "succeeded"
            }
        }
    }
    
    response = requests.post(
        endpoint,
        json=payload,
        headers={
            "Content-Type": "application/json",
            "Stripe-Signature": "t=123,v1=abc"
        }
    )
    
    return response

def simulate_github_webhook(endpoint: str):
    """模拟 GitHub Webhook"""
    payload = {
        "ref": "refs/heads/main",
        "repository": {
            "id": 123,
            "name": "my-repo",
            "full_name": "user/my-repo"
        },
        "pusher": {
            "name": "developer",
            "email": "dev@example.com"
        },
        "commits": [
            {
                "id": "abc123",
                "message": "Add new feature",
                "author": {"name": "developer"}
            }
        ]
    }
    
    response = requests.post(
        endpoint,
        json=payload,
        headers={
            "Content-Type": "application/json",
            "X-GitHub-Event": "push",
            "X-GitHub-Delivery": "12345"
        }
    )
    
    return response
```

**关键要点：**
- 签名验证防止伪造请求
- 时间戳防止重放攻击
- 记录所有 Webhook 便于调试
- 使用 ngrok 测试本地服务

## ✅ 课程考核

完成以下任务以通过考核：

1. **基础端点** (30分)
   - 创建一个 FastAPI Webhook 服务
   - 实现 `/webhook/test` 端点
   - 返回接收到的数据

2. **安全验证** (30分)
   - 实现签名验证功能
   - 支持 SHA256 签名
   - 添加时间戳验证

3. **事件处理** (40分)
   - 创建事件路由器
   - 实现 3 种事件处理器
   - 添加日志记录
   - 使用测试工具验证

**提交物：**
- `webhook_server.py` - Webhook 服务
- `verifier.py` - 签名验证
- `router.py` - 事件路由器
- `tester.py` - 测试工具
- `webhook.log` - 日志示例

## 📖 参考资料

- [Webhook 最佳实践](https://webhook.best/)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [GitHub Webhook 文档](https://docs.github.com/en/developers/webhooks-and-events/webhooks)
- [Stripe Webhook 指南](https://stripe.com/docs/webhooks)
- [ngrok](https://ngrok.com/) - 本地服务暴露工具
