# MCP 服务器开发

> 从零开始构建 MCP 服务器

## 课程信息

| 项目 | 内容 |
|------|------|
| 课程 ID | mcp-server-builder |
| 难度 | 中级 |
| 时长 | 3 小时 |
| 分类 | MCP 工具 |
| 前置课程 | mcp-bridge |

---

## 第一章：课程概述

### 学习目标
- 理解 MCP 服务器架构
- 掌握 Python/TypeScript 开发
- 学会测试和部署

---

## 第二章：核心概念

### 2.1 服务器生命周期
初始化 → 注册工具 → 处理请求 → 关闭

### 2.2 工具定义
定义工具名称、描述、参数 schema。

### 2.3 资源暴露
暴露文件、数据等资源供读取。

---

## 第三章：Python 开发

### 3.1 使用 FastMCP
```python
from fastmcp import FastMCP

mcp = FastMCP("my-server")

@mcp.tool()
def my_tool(arg: str) -> str:
    return f"Processed: {arg}"
```

### 3.2 定义资源
```python
@mcp.resource("file://data")
def get_data() -> str:
    return open("data.json").read()
```

---

## 第四章：TypeScript 开发

### 4.1 使用 MCP SDK
```typescript
import { Server } from "@modelcontextprotocol/sdk";

const server = new Server({ name: "my-server" });

server.tool("my_tool", { arg: { type: "string" } }, async (args) => {
  return { content: [{ type: "text", text: `Processed: ${args.arg}` }] };
});
```

---

## 第五章：实践案例

### 案例 1：文件操作服务器
提供文件读写能力。

### 案例 2：API 代理服务器
代理外部 API 调用。

### 案例 3：数据库查询服务器
提供安全的数据库查询能力。

---

## 第六章：测试与部署

### 6.1 单元测试
使用 MCP 测试框架测试工具。

### 6.2 本地调试
使用 MCP Inspector 调试服务器。

### 6.3 部署方案
Docker 容器化部署。

---

## 第七章：最佳实践

### ✅ 推荐做法
- 完善的错误处理
- 详细的工具文档
- 参数验证

---

## 第八章：进阶学习

### 推荐课程
- MCP 安全实践
- MCP 工具集成
- MCP 高级模式

---

*龙虾大学 · MCP 工具课程*
