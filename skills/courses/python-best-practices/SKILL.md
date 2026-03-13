---
name: python-best-practices
description: >
  Python 最佳实践 - 代码风格、项目结构、性能优化、测试、类型注解。
  当用户需要：重构 Python 代码、设计项目结构、优化性能、
  添加类型注解、编写测试时触发。
  触发词：Python 最佳实践、代码重构、项目结构、性能优化、类型注解、单元测试
version: 2.0.0
type: executable-sop
metadata:
  category: 编程语言
  module: Python
  level: 中级
  estimated_time: 45分钟
  prerequisites: [Python 3.8+]
  tools_required: [exec, write, read]
---

# Python 最佳实践

## 知识库

- `PEP 8` - Python 代码风格指南
- `black` / `ruff` - 代码格式化
- `mypy` - 静态类型检查
- `pytest` - 测试框架
- `pydantic` - 数据验证
- `poetry` / `uv` - 现代依赖管理

---

## 工作流

### NODE-01: 代码评估

```yaml
id: NODE-01
input: user.request
type: branch
action: |
  分析代码现状：
  
  1. 获取代码：
     - 文件路径
     - 代码片段
     - 整个项目目录
  
  2. 评估维度：
     - 代码风格：是否符合 PEP 8
     - 类型注解：是否完整
     - 项目结构：是否标准
     - 测试覆盖：是否有测试
     - 性能：是否有明显问题
     - 文档：是否完善
  
  3. 确定优先级：
     - 高：安全问题、明显 bug
     - 中：风格、类型注解
     - 低：文档、优化
  
  运行基础检查：
  - flake8 / ruff 检查
  - mypy 类型检查
success_criteria: 明确改进范围
output: {code_source, issues{style, typing, structure, tests, performance, docs}, priority}
on_success: NODE-02
on_failure:
  action: 获取代码访问权限
  fallback: ABORT
```

### NODE-02: 项目结构标准化

```yaml
id: NODE-02
input: [NODE-01.code_source, NODE-01.issues.structure]
action: |
  创建标准项目结构：
  
  现代 Python 项目：
  ```
  myproject/
  ├── src/
  │   └── mypackage/
  │       ├── __init__.py
  │       ├── module1.py
  │       └── module2.py
  ├── tests/
  │   ├── __init__.py
  │   ├── test_module1.py
  │   └── conftest.py
  ├── docs/
  ├── scripts/
  ├── pyproject.toml      # 项目配置
  ├── README.md
  ├── LICENSE
  └── .gitignore
  ```
  
  pyproject.toml 配置：
  ```toml
  [build-system]
  requires = ["hatchling"]
  build-backend = "hatchling.build"
  
  [project]
  name = "mypackage"
  version = "0.1.0"
  dependencies = []
  
  [project.optional-dependencies]
  dev = ["pytest", "black", "mypy", "ruff"]
  ```
  
  重构现有代码到新结构
success_criteria: 项目结构标准化完成
output: {new_structure, files_created[], pyproject_content}
on_success: NODE-03
on_failure:
  action: 处理文件冲突
  fallback: NODE-03
```

### NODE-03: 代码格式化

```yaml
id: NODE-03
input: [NODE-01.issues.style, NODE-02.new_structure]
action: |
  应用代码格式化：
  
  安装工具：
  ```bash
  pip install black ruff
  # 或 uv add --dev black ruff
  ```
  
  运行格式化：
  ```bash
  black src/ tests/
  ruff check --fix src/ tests/
  ```
  
  配置选项（pyproject.toml）：
  ```toml
  [tool.black]
  line-length = 88
  target-version = ['py311']
  
  [tool.ruff]
  line-length = 88
  select = ['E', 'F', 'I', 'N', 'W']
  ```
  
  检查并修复：
  - 行长度
  - 导入排序
  - 未使用变量
  - 命名规范
success_criteria: 代码格式化完成
output: {formatting_changes, remaining_issues[]}
on_success: NODE-04
on_failure:
  action: 手动修复复杂问题
  fallback: NODE-04
```

### NODE-04: 添加类型注解

```yaml
id: NODE-04
input: [NODE-01.issues.typing, NODE-03.formatting_changes]
action: |
  添加类型注解：
  
  基础注解：
  ```python
  def greet(name: str) -> str:
      return f"Hello, {name}"
  
  def process(items: list[int]) -> dict[str, int]:
      return {str(i): i for i in items}
  ```
  
  复杂类型：
  ```python
  from typing import Optional, Union, Callable
  from pathlib import Path
  
  def read_file(path: Union[str, Path]) -> Optional[str]:
      ...
  ```
  
  Python 3.10+ 新语法：
  ```python
  def process(items: list[int]) -> dict[str, int | None]: ...
  ```
  
  Pydantic 模型：
  ```python
  from pydantic import BaseModel
  
  class User(BaseModel):
      id: int
      name: str
      email: str | None = None
  ```
  
  运行 mypy 检查：
  ```bash
  mypy src/ --strict
  ```
success_criteria: 类型注解添加完成
output: {typing_coverage, mypy_results}
on_success: NODE-05
on_failure:
  action: 修复类型错误
  fallback: NODE-05
```

### NODE-05: 编写测试

```yaml
id: NODE-05
input: [NODE-01.issues.tests, NODE-04.typing_coverage]
action: |
  创建测试套件：
  
  pytest 配置（pyproject.toml）：
  ```toml
  [tool.pytest.ini_options]
  testpaths = ["tests"]
  python_files = ["test_*.py"]
  addopts = "-v --tb=short"
  ```
  
  测试文件模板：
  ```python
  import pytest
  from mypackage.module import my_function
  
  def test_my_function_basic():
      result = my_function("input")
      assert result == "expected"
  
  def test_my_function_edge_cases():
      with pytest.raises(ValueError):
          my_function("")
  
  @pytest.fixture
  def sample_data():
      return {"key": "value"}
  
  def test_with_fixture(sample_data):
      assert sample_data["key"] == "value"
  ```
  
  测试类型：
  - 单元测试：单个函数
  - 集成测试：模块交互
  - 参数化测试：多组输入
  
  运行测试：
  ```bash
  pytest tests/ -v --cov=src
  ```
success_criteria: 测试编写完成
output: {test_files[], coverage_percent, test_results}
on_success: NODE-06
on_failure:
  action: 修复测试失败
  fallback: NODE-06
```

### NODE-06: 性能优化

```yaml
id: NODE-06
input: [NODE-01.issues.performance]
action: |
  分析和优化性能：
  
  性能分析：
  ```bash
  python -m cProfile -o profile.stats script.py
  python -m pstats profile.stats
  ```
  
  常见优化：
  1. 列表推导式替代循环
  2. 生成器处理大数据
  3. 使用 lru_cache 缓存
  4. 字符串用 join 而非 +
  5. 使用合适的数据结构
  
  优化示例：
  ```python
  from functools import lru_cache
  
  @lru_cache(maxsize=128)
  def expensive_function(n: int) -> int:
      ...
  
  # 生成器替代列表
  def process_large_file(path: str):
      with open(path) as f:
          for line in f:
              yield process_line(line)
  ```
  
  异步优化（I/O 密集型）：
  ```python
  import asyncio
  import aiohttp
  
  async def fetch_urls(urls: list[str]):
      async with aiohttp.ClientSession() as session:
          tasks = [fetch(session, url) for url in urls]
          return await asyncio.gather(*tasks)
  ```
  
  生成优化报告
success_criteria: 性能优化完成
output: {optimization_report, benchmarks{}}
on_success: NODE-07
on_failure:
  fallback: NODE-07
```

### NODE-07: 文档完善

```yaml
id: NODE-07
input: [NODE-01.issues.docs, NODE-06.optimization_report]
action: |
  完善项目文档：
  
  README.md 模板：
  ```markdown
  # 项目名
  
  简短描述
  
  ## 安装
  ```bash
  pip install -e ".[dev]"
  ```
  
  ## 使用
  ```python
  from mypackage import main
  main.run()
  ```
  
  ## 开发
  ```bash
  pytest
  black src/ tests/
  mypy src/
  ```
  ```
  
  代码文档字符串：
  ```python
  def process_data(data: list[dict]) -> dict:
      """处理数据并返回汇总结果。
      
      Args:
          data: 输入数据列表，每项为字典
      
      Returns:
          包含统计信息的字典
      
      Raises:
          ValueError: 当数据为空时
      """
  ```
  
  生成 API 文档（可选）：
  ```bash
  pip install mkdocs mkdocstrings
  mkdocs new docs/
  ```
success_criteria: 文档完善完成
output: {documentation_files[], doc_coverage}
on_success: NODE-08
on_failure:
  fallback: NODE-08
```

### NODE-08: 配置 CI/CD

```yaml
id: NODE-08
input: [NODE-02.new_structure, NODE-05.test_files]
action: |
  配置 GitHub Actions：
  
  .github/workflows/ci.yml：
  ```yaml
  name: CI
  
  on: [push, pull_request]
  
  jobs:
    test:
      runs-on: ubuntu-latest
      strategy:
        matrix:
          python-version: ['3.9', '3.10', '3.11', '3.12']
      
      steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      
      - name: Install dependencies
        run: |
          pip install -e ".[dev]"
      
      - name: Lint with ruff
        run: ruff check src/
      
      - name: Type check with mypy
        run: mypy src/
      
      - name: Test with pytest
        run: pytest --cov=src --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
  ```
  
  配置 pre-commit：
  ```yaml
  # .pre-commit-config.yaml
  repos:
    - repo: https://github.com/astral-sh/ruff-pre-commit
      rev: v0.1.0
      hooks:
        - id: ruff
        - id: ruff-format
  ```
success_criteria: CI/CD 配置完成
output: {ci_config_files[], workflow_status}
on_success: NODE-FINAL
on_failure:
  fallback: NODE-FINAL
```

### NODE-FINAL: 总结与交付

```yaml
id: NODE-FINAL
type: end
input: [NODE-03.formatting_changes, NODE-04.typing_coverage, NODE-05.coverage_percent, NODE-06.optimization_report]
action: |
  输出总结：
  ✅ Python 最佳实践改造完成
  
  改进清单：
  - 项目结构：标准化为 src/ 布局
  - 代码风格：black + ruff 格式化
  - 类型注解：覆盖率 {typing_coverage}%
  - 测试套件：覆盖率 {coverage_percent}%
  - 性能优化：{optimization_summary}
  - 文档完善：README + docstrings
  - CI/CD：GitHub Actions 配置
  
  使用命令：
  ```bash
  # 安装依赖
  pip install -e ".[dev]"
  
  # 运行测试
  pytest
  
  # 代码检查
  ruff check src/
  mypy src/
  
  # 格式化
  black src/ tests/
  ```
  
  后续建议：
  1. 保持测试覆盖率 > 80%
  2. 定期更新依赖
  3. 使用 pre-commit 防止问题代码提交
  4. 考虑添加性能基准测试
  
  询问用户是否需要：
  - 特定模块的深入优化
  - 部署配置（Docker/K8s）
  - 其他 Python 项目改造
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "重构 Python 代码"
- "Python 最佳实践"
- "添加类型注解"
- "优化 Python 性能"
- "设置 Python 项目"
- "编写单元测试"
