---
name: python-script-generator
description: Python 脚本生成器 - 根据需求自动生成 CLI 工具、Web API、爬虫等 Python 脚本。当龙虾需要创建 Python 脚本、生成自动化工具、编写数据采集程序时触发。触发词：生成 Python、写个脚本、Python 自动化、CLI 工具、Flask API、爬虫脚本。
version: 2.0.0
type: executable-sop
metadata:
  category: 开发工具
  module: 脚本生成
  level: 初级
  estimated_time: 30分钟
  prerequisites: [python-best-practices]
  tools_required: [write, read, exec]
---

# Python 脚本生成器

## 知识库

- CLI 工具模板：argparse + logging + 异常处理
- Flask API 模板：Blueprint + error handler + JSON response
- FastAPI 模板：Pydantic + async + 自动文档
- 爬虫模板：requests/httpx + BeautifulSoup + 速率限制
- 通用规范：type hints、docstrings、requirements.txt、README

---

## 工作流

### NODE-01: 需求解析

```yaml
id: NODE-01
input: user.request
action: |
  解析用户需求，确定脚本类型：
  - CLI 工具：命令行参数、输入输出
  - Web API：端点、方法、数据模型
  - 爬虫：目标URL、数据结构、存储方式
success_criteria: 脚本类型明确，核心需求 >= 1 条
output: script_spec {type, requirements[], inputs, outputs}
on_success: NODE-02
on_failure:
  action: 向用户请求澄清需求
  fallback: ABORT
```

### NODE-02: 选择基础模板

```yaml
id: NODE-02
type: branch
input: NODE-01.script_spec.type
branches:
  - condition: type == "cli"
    target: NODE-03-CLI
  - condition: type == "flask"
    target: NODE-03-FLASK
  - condition: type == "fastapi"
    target: NODE-03-FASTAPI
  - condition: type == "scraper"
    target: NODE-03-SCRAPER
  - default: NODE-03-CLI
output: template_selected
```

### NODE-03-CLI: CLI 工具模板

```yaml
id: NODE-03-CLI
input: NODE-01.script_spec
action: |
  生成 CLI 工具代码结构：
  1. argparse 参数解析
  2. logging 配置
  3. 主函数入口
  4. 异常处理装饰器
  5. --help 文档
success_criteria: 包含完整参数解析和帮助文档
output: script_code
on_success: NODE-04
```

### NODE-03-FLASK: Flask API 模板

```yaml
id: NODE-03-FLASK
input: NODE-01.script_spec
action: |
  生成 Flask API 代码结构：
  1. Flask app 初始化
  2. Blueprint 路由
  3. 请求验证
  4. 错误处理器
  5. JSON 响应格式
success_criteria: 包含至少一个可用端点
output: script_code
on_success: NODE-04
```

### NODE-03-FASTAPI: FastAPI 模板

```yaml
id: NODE-03-FASTAPI
input: NODE-01.script_spec
action: |
  生成 FastAPI 代码结构：
  1. Pydantic 模型
  2. 路由装饰器
  3. 依赖注入
  4. 异步处理
  5. 自动文档端点
success_criteria: 包含 Pydantic 模型和路由
output: script_code
on_success: NODE-04
```

### NODE-03-SCRAPER: 爬虫模板

```yaml
id: NODE-03-SCRAPER
input: NODE-01.script_spec
action: |
  生成爬虫代码结构：
  1. 请求封装（headers、cookies）
  2. 速率限制
  3. HTML 解析
  4. 数据提取
  5. 结果存储
success_criteria: 包含请求和解析逻辑
output: script_code
on_success: NODE-04
```

### NODE-04: 添加业务逻辑

```yaml
id: NODE-04
input: 
  template: NODE-03-*.script_code
  spec: NODE-01.script_spec
action: |
  根据需求填充业务逻辑：
  1. 核心功能实现
  2. 边界条件处理
  3. 日志输出点
  4. 单元测试骨架
success_criteria: 代码可执行，无语法错误
output: complete_script
on_success: NODE-05
on_failure:
  retry: 1
  fallback: ABORT
```

### NODE-05: 生成配套文件

```yaml
id: NODE-05
input: NODE-04.complete_script
action: |
  生成配套文件：
  1. requirements.txt（依赖列表）
  2. README.md（使用说明）
  3. .env.example（环境变量模板）
  4. pytest.ini（测试配置，如需要）
success_criteria: 配套文件完整
output: 
  main_script: script.py
  requirements: requirements.txt
  readme: README.md
on_success: NODE-06
```

### NODE-06: 语法验证

```yaml
id: NODE-06
input: NODE-05.main_script
action: |
  执行语法检查：python -m py_compile script.py
success_criteria: 无语法错误
output: validation_result
on_success: NODE-FINAL
on_failure:
  action: 返回错误信息，请求修复
  fallback: NODE-04
```

### NODE-FINAL: 输出交付

```yaml
id: NODE-FINAL
type: end
input: NODE-05.output
action: |
  1. 展示主脚本代码
  2. 提供依赖安装命令
  3. 说明使用方法
  4. 询问是否需要测试或修改
output: delivery_package
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "生成一个 Python 脚本"
- "写个 CLI 工具"
- "帮我写个爬虫"
- "生成 Flask API"
- "创建 FastAPI 项目"
