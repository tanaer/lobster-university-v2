---
name: academic-research
description: 学术研究入门课程 - 学会搜索学术论文、下载文献、提取引用。触发词：arXiv、Google Scholar、文献综述、论文搜索、学术研究
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"研究技能","duration":45,"level":"初级"}
---

# 学术研究入门

> **🤖 这整个文档是给你的 — AI Agent。**

## 🎯 学习目标

完成本课程后，你将能够：

- 使用 arXiv、Google Scholar 等平台搜索学术论文
- 下载并管理学术文献（PDF）
- 从论文中提取关键信息和引用
- 撰写文献综述摘要
- 使用引用管理工具组织文献

## 📚 课程内容

### 第 1 课：学术论文搜索平台

**arXiv - 开放获取论文库**

```python
import arxiv

# 搜索论文
search = arxiv.Search(
    query="machine learning",
    max_results=10,
    sort_by=arxiv.SortCriterion.Relevance
)

for paper in search.results():
    print(f"标题: {paper.title}")
    print(f"作者: {[a.name for a in paper.authors]}")
    print(f"摘要: {paper.summary[:200]}...")
    print(f"PDF: {paper.pdf_url}")
    print("---")
```

**Google Scholar 搜索**

```python
from scholarly import scholarly

# 搜索作者
author = scholarly.search_author("Albert Einstein")
author = next(author)
print(author)

# 搜索论文
results = scholarly.search_pubs("deep learning")
paper = next(results)
print(paper['bib']['title'])
```

**Semantic Scholar API**

```python
import requests

# 搜索论文
url = "https://api.semanticscholar.org/graph/v1/paper/search"
params = {
    "query": "transformer attention mechanism",
    "limit": 10,
    "fields": "title,authors,year,abstract"
}
response = requests.get(url, params=params)
papers = response.json()

for paper in papers.get("data", []):
    print(f"{paper['year']}: {paper['title']}")
```

**关键要点：**
- arXiv：预印本论文，计算机科学/物理/数学
- Google Scholar：综合性学术搜索引擎
- Semantic Scholar：AI 驱动的学术搜索
- PubMed：生物医学文献

### 第 2 课：文献下载与管理

**下载 PDF 论文**

```python
import requests
import os

def download_paper(url, filename, headers=None):
    """下载论文 PDF"""
    if headers is None:
        headers = {}
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"下载成功: {filename}")
        return True
    else:
        print(f"下载失败: {response.status_code}")
        return False

# 从 arXiv 下载
arxiv_url = "https://arxiv.org/pdf/2301.07041.pdf"
download_paper(arxiv_url, "paper.pdf")
```

**文献管理数据结构**

```python
from dataclasses import dataclass
from datetime import datetime
from typing import List
import json

@dataclass
class Paper:
    title: str
    authors: List[str]
    year: int
    abstract: str
    url: str
    pdf_path: str = None
    tags: List[str] = None
    notes: str = ""
    date_added: str = None
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []
        if self.date_added is None:
            self.date_added = datetime.now().isoformat()
    
    def to_dict(self):
        return self.__dict__
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)

# 保存文献库
library = []

def save_library(library, filepath="library.json"):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump([p.to_dict() for p in library], f, ensure_ascii=False, indent=2)

def load_library(filepath="library.json"):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return [Paper.from_dict(d) for d in json.load(f)]
    except FileNotFoundError:
        return []
```

**关键要点：**
- 使用统一的文件命名规范
- 保留原始 URL 和元数据
- 添加标签便于检索

### 第 3 课：信息提取与引用

**提取 PDF 文本**

```python
import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    """从 PDF 提取文本"""
    doc = fitz.open(pdf_path)
    text = ""
    
    for page in doc:
        text += page.get_text()
    
    doc.close()
    return text

def extract_abstract(text):
    """提取摘要"""
    # 常见摘要标记
    markers = ["Abstract", "ABSTRACT", "摘要"]
    
    for marker in markers:
        if marker in text:
            start = text.find(marker) + len(marker)
            # 找到下一个章节
            end_markers = ["1 Introduction", "1. Introduction", "Introduction", "\n\n\n"]
            end = len(text)
            for em in end_markers:
                pos = text.find(em, start)
                if pos != -1 and pos < end:
                    end = pos
            return text[start:end].strip()
    
    return None

# 提取引用
import re

def extract_references(text):
    """提取参考文献"""
    # 查找参考文献部分
    ref_markers = ["References", "REFERENCES", "参考文献", "Bibliography"]
    
    for marker in ref_markers:
        if marker in text:
            start = text.rfind(marker)  # 最后一个出现
            refs_text = text[start:]
            
            # 简单的引用解析
            pattern = r'\[\d+\].*?(?=\[\d+\]|$)'
            refs = re.findall(pattern, refs_text, re.DOTALL)
            return refs
    
    return []
```

**生成引用格式**

```python
def format_citation(paper, style="apa"):
    """格式化引用"""
    authors = ", ".join(paper.authors)
    title = paper.title
    year = paper.year
    
    if style == "apa":
        return f"{authors} ({year}). {title}."
    elif style == "mla":
        return f'{authors}. "{title}." {year}.'
    elif style == "chicago":
        return f"{authors}. {year}. \"{title}.\""
    elif style == "bibtex":
        first_author = paper.authors[0].split()[-1].lower()
        key = f"{first_author}{year}"
        return f"""
@article{{{key},
  author = {{{" and ".join(paper.authors)}}},
  title = {{{title}}},
  year = {{{year}}},
  url = {{{paper.url}}}
}}
"""
    return f"{authors}. {title}. {year}."

# 使用示例
paper = Paper(
    title="Attention Is All You Need",
    authors=["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    year=2017,
    abstract="...",
    url="https://arxiv.org/abs/1706.03762"
)

print(format_citation(paper, "apa"))
print(format_citation(paper, "bibtex"))
```

**文献综述模板**

```python
def generate_literature_review(papers, topic):
    """生成文献综述框架"""
    review = f"# {topic} 文献综述\n\n"
    
    # 按年份分组
    by_year = {}
    for paper in papers:
        year = paper.year
        if year not in by_year:
            by_year[year] = []
        by_year[year].append(paper)
    
    # 时间线概述
    review += "## 研究时间线\n\n"
    for year in sorted(by_year.keys()):
        review += f"### {year}年\n"
        for paper in by_year[year]:
            review += f"- {paper.title}\n"
        review += "\n"
    
    # 关键论文
    review += "## 关键论文\n\n"
    for paper in papers[:5]:  # 取前5篇
        review += f"### {paper.title}\n"
        review += f"- 作者: {', '.join(paper.authors)}\n"
        review += f"- 年份: {paper.year}\n"
        review += f"- 摘要: {paper.abstract[:300]}...\n\n"
    
    return review
```

**关键要点：**
- 自动提取摘要和引用
- 支持多种引用格式
- 建立文献之间的关联

## ✅ 课程考核

完成以下任务以通过考核：

1. **论文搜索** (30分)
   - 使用 arXiv API 搜索 "large language models" 相关论文
   - 保存前 5 篇论文的元数据（标题、作者、摘要、URL）

2. **文献下载** (30分)
   - 下载 3 篇论文的 PDF
   - 创建文献库 JSON 文件，包含所有元数据

3. **信息提取** (40分)
   - 从下载的 PDF 中提取文本
   - 提取摘要和参考文献列表
   - 生成 BibTeX 格式的引用

**提交物：**
- `search_results.json` - 搜索结果
- `library.json` - 文献库
- `citations.bib` - BibTeX 引用文件

## 📖 参考资料

- [arXiv API Documentation](https://arxiv.org/help/api/)
- [Semantic Scholar API](https://www.semanticscholar.org/product/api)
- [PyMuPDF Documentation](https://pymupdf.readthedocs.io/)
- [scholarly - Google Scholar API](https://github.com/scholarly-python-package/scholarly)
- [Zotero - 开源文献管理](https://www.zotero.org/)
