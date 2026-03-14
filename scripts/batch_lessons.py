#!/usr/bin/env python3
"""批量写入 16 门基础课程的 lessons"""
import json
import sys
sys.path.insert(0, '/root/.openclaw/workspace/lobster-university/scripts')
from importlib import import_module

# 直接调用 update 函数
import sqlite3

DB_PATH = "/root/.openclaw/workspace/lobster-university/lobster.db"

def update(course_id, lessons):
    for l in lessons:
        assert "title" in l
        assert "duration" in l
        assert "type" in l and l["type"] in ("learn", "practice", "assess")
    conn = sqlite3.connect(DB_PATH)
    conn.execute("UPDATE skill_courses SET lessons = ? WHERE id = ?",
                (json.dumps(lessons, ensure_ascii=False), course_id))
    conn.commit()
    conn.close()
    print(f"✓ {course_id} 已更新 {len(lessons)} 个课时")

courses = {
    "course_web_search": [
        {"title": "搜索引擎原理与 Brave Search API 使用", "duration": 25, "type": "learn"},
        {"title": "搜索技巧：引号精确匹配、site: 限定、filetype: 过滤", "duration": 20, "type": "learn"},
        {"title": "用 web_search + web_fetch 完成一次完整信息检索", "duration": 30, "type": "practice"},
        {"title": "独立完成「AI Agent 市场现状」搜索并输出结构化报告", "duration": 45, "type": "assess"}
    ],
    "course_excel": [
        {"title": "xlsx 库读写 Excel：工作簿、工作表、JSON 互转", "duration": 25, "type": "learn"},
        {"title": "数据清洗：去空值、去重、格式统一、默认值填充", "duration": 20, "type": "learn"},
        {"title": "读取订单数据并完成清洗与分组统计", "duration": 35, "type": "practice"},
        {"title": "独立处理脏数据并生成 sales_report.xlsx 统计报表", "duration": 40, "type": "assess"}
    ],
    "course_academic": [
        {"title": "学术搜索平台：arXiv API、Semantic Scholar、Google Scholar", "duration": 30, "type": "learn"},
        {"title": "文献管理：下载 PDF、元数据存储、JSON 文献库", "duration": 25, "type": "learn"},
        {"title": "引用格式与文献综述：APA/BibTeX 生成、摘要提取", "duration": 25, "type": "learn"},
        {"title": "用 arXiv API 搜索论文并建立本地文献库", "duration": 40, "type": "practice"},
        {"title": "独立完成 LLM 主题文献检索、PDF 提取与 BibTeX 引用生成", "duration": 60, "type": "assess"}
    ],
    "course_a2_web_extraction": [
        {"title": "HTML DOM 结构与 CSS 选择器定位元素", "duration": 25, "type": "learn"},
        {"title": "web_fetch 提取策略：Markdown/Text 模式与内容过滤", "duration": 20, "type": "learn"},
        {"title": "从新闻网站提取标题、正文、链接等结构化数据", "duration": 35, "type": "practice"},
        {"title": "独立从 GitHub 仓库页提取名称、Star、README 摘要", "duration": 40, "type": "assess"}
    ],
    "course_a4_info_synthesis": [
        {"title": "多源信息收集策略：Web/学术/新闻交叉检索", "duration": 30, "type": "learn"},
        {"title": "信息去重、交叉验证与可信度评估", "duration": 25, "type": "learn"},
        {"title": "结构化报告模板：执行摘要、主要发现、建议、附录", "duration": 25, "type": "learn"},
        {"title": "从 5 个来源收集信息并完成去重合并", "duration": 40, "type": "practice"},
        {"title": "独立撰写一份 AI Agent 市场调研报告（含数据表格）", "duration": 60, "type": "assess"}
    ],
    "course_b1_shell_basics": [
        {"title": "Shell 基础命令：ls/cd/cp/mv/rm/cat/grep/find", "duration": 25, "type": "learn"},
        {"title": "文件与目录操作：创建、读取、权限管理", "duration": 20, "type": "learn"},
        {"title": "文本处理三剑客：grep 搜索、sed 替换、awk 提取", "duration": 25, "type": "learn"},
        {"title": "脚本编写：变量、条件判断、循环、Shebang", "duration": 25, "type": "learn"},
        {"title": "编写脚本批量创建文件并统计行数", "duration": 40, "type": "practice"},
        {"title": "独立编写自动化脚本：创建目录、批量生成文件、统计汇总", "duration": 45, "type": "assess"}
    ],
    "course_b3_word_basics": [
        {"title": "python-docx 基础：文档创建、段落格式、字体样式", "duration": 25, "type": "learn"},
        {"title": "表格与图片：创建表格、合并单元格、插入图片", "duration": 20, "type": "learn"},
        {"title": "模板与批量生成：占位符替换、页眉页脚、循环生成", "duration": 20, "type": "learn"},
        {"title": "创建含标题、表格、列表的格式化文档", "duration": 25, "type": "practice"},
        {"title": "独立完成证书模板设计并批量生成 5 份文档", "duration": 30, "type": "assess"}
    ],
    "course_b4_pdf_basics": [
        {"title": "PDF 文本提取：PyMuPDF 与 pypdf 读取文本和图片", "duration": 20, "type": "learn"},
        {"title": "PDF 创建与合并拆分：ReportLab 生成、水印与加密", "duration": 20, "type": "learn"},
        {"title": "从 PDF 提取文本并合并多个 PDF 文件", "duration": 25, "type": "practice"},
        {"title": "独立完成 PDF 报告创建、合并、加水印、加密全流程", "duration": 25, "type": "assess"}
    ],
    "course_c1_sqlite_basics": [
        {"title": "SQLite 连接与表设计：主键、外键、索引、数据类型", "duration": 25, "type": "learn"},
        {"title": "CRUD 操作：参数化查询、批量插入、软删除", "duration": 25, "type": "learn"},
        {"title": "复杂查询：JOIN、子查询、聚合函数、GROUP BY", "duration": 25, "type": "learn"},
        {"title": "事务与备份：BEGIN/COMMIT/ROLLBACK、数据库导出", "duration": 20, "type": "learn"},
        {"title": "设计学生成绩系统并完成 CRUD 与统计查询", "duration": 30, "type": "practice"},
        {"title": "独立完成成绩排名、课程统计、不及格名单等复杂查询", "duration": 25, "type": "assess"}
    ],
    "course_c2_data_cleaning": [
        {"title": "缺失值识别与处理策略：删除、填充、插值", "duration": 25, "type": "learn"},
        {"title": "格式标准化：日期统一、数字清洗、文本规范化", "duration": 20, "type": "learn"},
        {"title": "去重与数据验证：唯一键去重、正则校验、规则引擎", "duration": 20, "type": "learn"},
        {"title": "清洗一份包含缺失值和格式混乱的客户数据", "duration": 25, "type": "practice"},
        {"title": "独立完成 CSV 数据清洗并输出清洗报告", "duration": 30, "type": "assess"}
    ],
    "course_c3_vector_db": [
        {"title": "向量嵌入原理：文本向量化、余弦相似度、距离度量", "duration": 25, "type": "learn"},
        {"title": "嵌入模型使用：OpenAI Embedding 与 sentence-transformers", "duration": 20, "type": "learn"},
        {"title": "Milvus 安装与操作：集合创建、索引构建、语义搜索", "duration": 25, "type": "learn"},
        {"title": "RAG 架构：检索增强生成、文档分块、提示词构建", "duration": 25, "type": "learn"},
        {"title": "搭建 Milvus 集合并实现 10 条文档的语义搜索", "duration": 40, "type": "practice"},
        {"title": "独立构建 RAG 系统：文档入库、语义检索、LLM 生成回答", "duration": 45, "type": "assess"}
    ],
    "course_c4_knowledge_graph": [
        {"title": "图数据库概念：节点、关系、属性、标签", "duration": 25, "type": "learn"},
        {"title": "Neo4j 安装与 Cypher 基础：CREATE、MATCH、MERGE", "duration": 25, "type": "learn"},
        {"title": "Cypher 高级查询：路径查找、模式匹配、聚合统计", "duration": 25, "type": "learn"},
        {"title": "知识图谱建模：领域实体抽取与关系定义", "duration": 20, "type": "learn"},
        {"title": "构建公司知识图谱：创建人物/公司/产品节点与关系", "duration": 40, "type": "practice"},
        {"title": "独立完成图谱查询：员工列表、最短路径、关系推理", "duration": 45, "type": "assess"}
    ],
    "course_d1_error_handling": [
        {"title": "Python 异常体系：常见错误类型与自定义异常", "duration": 25, "type": "learn"},
        {"title": "异常捕获模式：try-except-else-finally、异常链、上下文管理器", "duration": 25, "type": "learn"},
        {"title": "重试机制与日志系统：指数退避、结构化日志、监控装饰器", "duration": 25, "type": "learn"},
        {"title": "实现带指数退避的重试装饰器和 JSON 结构化日志", "duration": 25, "type": "practice"},
        {"title": "独立编写错误监控系统：异常捕获 + 重试 + 日志记录", "duration": 20, "type": "assess"}
    ],
    "course_d2_cron_scheduling": [
        {"title": "Cron 表达式语法：五字段结构、特殊字符、常用模式", "duration": 20, "type": "learn"},
        {"title": "系统 Cron 配置与 Python 调度库（APScheduler/Schedule）", "duration": 20, "type": "learn"},
        {"title": "编写带锁机制和日志的 Cron 任务脚本", "duration": 25, "type": "practice"},
        {"title": "独立配置 3 个定时任务并实现任务监控与失败告警", "duration": 25, "type": "assess"}
    ],
    "course_d3_browser_automation": [
        {"title": "Playwright 安装与浏览器控制：启动、导航、元素定位", "duration": 25, "type": "learn"},
        {"title": "交互操作：点击、输入、数据提取、表格解析", "duration": 25, "type": "learn"},
        {"title": "高级功能：表单填写、弹窗处理、iframe、多标签页", "duration": 25, "type": "learn"},
        {"title": "截图录屏与等待策略：全页截图、元素截图、智能等待", "duration": 20, "type": "learn"},
        {"title": "自动化搜索百度并提取前 5 条结果", "duration": 40, "type": "practice"},
        {"title": "独立完成数据抓取：访问列表页、提取 10 条结构化数据、保存 JSON", "duration": 45, "type": "assess"}
    ],
    "course_d4_webhook": [
        {"title": "Webhook 原理：反向 API、事件推送、请求结构", "duration": 20, "type": "learn"},
        {"title": "FastAPI 端点创建与事件路由器模式", "duration": 20, "type": "learn"},
        {"title": "安全与调试：HMAC 签名验证、防重放、日志记录", "duration": 20, "type": "learn"},
        {"title": "创建 Webhook 服务并实现 3 种事件处理器", "duration": 30, "type": "practice"},
        {"title": "独立完成签名验证 + 事件路由 + 测试工具全流程", "duration": 30, "type": "assess"}
    ]
}

for course_id, lessons in courses.items():
    total = sum(l["duration"] for l in lessons)
    update(course_id, lessons)
    print(f"  总时长: {total}min, 课时数: {len(lessons)}")

print(f"\n✅ 全部 {len(courses)} 门课程 lessons 已写入数据库")
