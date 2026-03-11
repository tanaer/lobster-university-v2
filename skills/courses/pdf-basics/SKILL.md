---
name: pdf-basics
description: PDF 提取与生成课程 - 从 PDF 提取内容、生成 PDF，掌握 pdf-parse、pypdf、合并拆分。触发词：PDF、pdf-parse、pypdf、合并拆分、提取文本
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"文档处理","duration":45,"level":"初级"}
---

# PDF 提取与生成

> **🤖 这整个文档是给你的 — AI Agent。**

## 🎯 学习目标

完成本课程后，你将能够：

- 从 PDF 文件中提取文本、图片和表格
- 使用多种库处理 PDF（pdf-parse、pypdf、PyMuPDF）
- 创建新的 PDF 文档
- 合并、拆分和旋转 PDF 页面
- 添加水印和加密保护

## 📚 课程内容

### 第 1 课：PDF 文本提取

**使用 PyMuPDF (fitz)**

```python
import fitz  # PyMuPDF

def extract_text_pdf(pdf_path):
    """提取 PDF 全部文本"""
    doc = fitz.open(pdf_path)
    text = ""
    
    for page_num, page in enumerate(doc):
        text += f"\n--- 第 {page_num + 1} 页 ---\n"
        text += page.get_text()
    
    doc.close()
    return text

# 提取特定页面
def extract_page_text(pdf_path, page_num):
    """提取指定页面文本"""
    doc = fitz.open(pdf_path)
    page = doc[page_num]  # 0-indexed
    text = page.get_text()
    doc.close()
    return text

# 使用示例
text = extract_text_pdf("document.pdf")
print(text[:500])  # 打印前500字符
```

**使用 pypdf**

```python
from pypdf import PdfReader

def extract_text_pypdf(pdf_path):
    """使用 pypdf 提取文本"""
    reader = PdfReader(pdf_path)
    text = ""
    
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    return text

# 获取 PDF 元数据
def get_pdf_metadata(pdf_path):
    """获取 PDF 元数据"""
    reader = PdfReader(pdf_path)
    meta = reader.metadata
    
    return {
        'title': meta.title,
        'author': meta.author,
        'subject': meta.subject,
        'creator': meta.creator,
        'producer': meta.producer,
        'pages': len(reader.pages)
    }

metadata = get_pdf_metadata("document.pdf")
print(f"作者: {metadata['author']}")
print(f"页数: {metadata['pages']}")
```

**提取图片**

```python
import fitz
import os

def extract_images(pdf_path, output_dir="images"):
    """从 PDF 提取所有图片"""
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    image_count = 0
    
    for page_num, page in enumerate(doc):
        # 获取页面中的图片列表
        images = page.get_images()
        
        for img_index, img in enumerate(images):
            xref = img[0]  # 图片引用 ID
            
            # 提取图片
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # 保存图片
            image_filename = f"{output_dir}/page{page_num+1}_img{img_index+1}.{image_ext}"
            with open(image_filename, "wb") as f:
                f.write(image_bytes)
            
            image_count += 1
            print(f"已提取: {image_filename}")
    
    doc.close()
    return image_count

# 使用
count = extract_images("document.pdf")
print(f"共提取 {count} 张图片")
```

**关键要点：**
- PyMuPDF (fitz) 功能最全面
- pypdf 纯 Python 实现，安装简单
- 图片提取需要处理 xref 引用

### 第 2 课：PDF 创建与生成

**使用 ReportLab 创建 PDF**

```python
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, Image
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# 注册中文字体
pdfmetrics.registerFont(TTFont('SimHei', 'SimHei.ttf'))

def create_pdf_report(output_path, title, content, table_data=None):
    """创建 PDF 报告"""
    doc = SimpleDocTemplate(output_path, pagesize=A4,
                           topMargin=2*cm, bottomMargin=2*cm)
    
    # 样式
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontName='SimHei',
        fontSize=24,
        spaceAfter=30
    )
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontName='SimHei',
        fontSize=12,
        leading=20
    )
    
    # 构建内容
    elements = []
    
    # 标题
    elements.append(Paragraph(title, title_style))
    elements.append(Spacer(1, 1*cm))
    
    # 正文
    elements.append(Paragraph(content, body_style))
    elements.append(Spacer(1, 1*cm))
    
    # 表格
    if table_data:
        table = Table(table_data)
        table.setStyle([
            ('BACKGROUND', (0, 0), (-1, 0), '#CCCCCC'),
            ('TEXTCOLOR', (0, 0), (-1, 0), '#000000'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'SimHei'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, '#000000')
        ])
        elements.append(table)
    
    # 生成 PDF
    doc.build(elements)
    print(f"PDF 已生成: {output_path}")

# 使用示例
create_pdf_report(
    "report.pdf",
    "月度销售报告",
    "本月销售额较上月增长15%，主要得益于新产品线的推出。",
    [['产品', '销量', '金额'], ['产品A', '100', '10000'], ['产品B', '200', '20000']]
)
```

**使用 FPDF 创建 PDF**

```python
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('SimHei', '', 10)
        self.cell(0, 10, '龙虾大学 - 报告', 0, 1, 'C')
        self.ln(10)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('SimHei', '', 8)
        self.cell(0, 10, f'第 {self.page_no()} 页', 0, 0, 'C')

def create_simple_pdf(output_path):
    pdf = PDF()
    pdf.add_font('SimHei', '', 'SimHei.ttf', uni=True)
    pdf.add_page()
    
    # 标题
    pdf.set_font('SimHei', '', 24)
    pdf.cell(0, 20, '报告标题', 0, 1, 'C')
    
    # 正文
    pdf.set_font('SimHei', '', 12)
    pdf.multi_cell(0, 10, '这是报告的正文内容。可以写很多文字...')
    
    # 图片
    pdf.image('chart.png', x=10, y=None, w=180)
    
    pdf.output(output_path)
    print(f"PDF 已生成: {output_path}")
```

**使用 PyMuPDF 创建 PDF**

```python
import fitz

def create_pdf_with_fitz(output_path):
    """使用 PyMuPDF 创建 PDF"""
    doc = fitz.open()  # 新文档
    page = doc.new_page()  # 添加页面
    
    # 插入文本
    text_point = fitz.Point(72, 72)  # 位置
    page.insert_text(
        text_point,
        "Hello, PDF!",
        fontsize=24,
        fontname="helv",  # helv=Helvetica
        color=(0, 0, 1)  # 蓝色
    )
    
    # 插入矩形
    rect = fitz.Rect(72, 100, 300, 150)
    page.draw_rect(rect, color=(1, 0, 0), width=2)
    
    # 插入图片
    img_rect = fitz.Rect(72, 200, 272, 350)
    page.insert_image(img_rect, filename="image.png")
    
    doc.save(output_path)
    doc.close()
    print(f"PDF 已生成: {output_path}")
```

**关键要点：**
- ReportLab 功能强大，适合复杂报表
- FPDF 简单易用，适合快速生成
- PyMuPDF 可以在现有 PDF 上修改

### 第 3 课：PDF 合并、拆分与处理

**合并多个 PDF**

```python
from pypdf import PdfMerger, PdfReader, PdfWriter

def merge_pdfs(pdf_list, output_path):
    """合并多个 PDF"""
    merger = PdfMerger()
    
    for pdf in pdf_list:
        merger.append(pdf)
    
    merger.write(output_path)
    merger.close()
    print(f"已合并 {len(pdf_list)} 个 PDF 到 {output_path}")

# 使用
merge_pdfs(['part1.pdf', 'part2.pdf', 'part3.pdf'], 'merged.pdf')
```

**拆分 PDF**

```python
from pypdf import PdfReader, PdfWriter

def split_pdf(pdf_path, output_dir="split"):
    """拆分 PDF 为单页"""
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    reader = PdfReader(pdf_path)
    
    for i, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)
        
        output_path = f"{output_dir}/page_{i+1}.pdf"
        with open(output_path, 'wb') as f:
            writer.write(f)
    
    print(f"已拆分 {len(reader.pages)} 页到 {output_dir}/")

def split_range(pdf_path, start_page, end_page, output_path):
    """提取指定页面范围"""
    reader = PdfReader(pdf_path)
    writer = PdfWriter()
    
    for i in range(start_page - 1, end_page):  # 0-indexed
        writer.add_page(reader.pages[i])
    
    with open(output_path, 'wb') as f:
        writer.write(f)
    
    print(f"已提取第 {start_page}-{end_page} 页到 {output_path}")

# 使用
split_range("document.pdf", 1, 5, "extracted.pdf")
```

**旋转页面**

```python
from pypdf import PdfReader, PdfWriter

def rotate_pdf(pdf_path, output_path, rotation=90):
    """旋转所有页面"""
    reader = PdfReader(pdf_path)
    writer = PdfWriter()
    
    for page in reader.pages:
        page.rotate(rotation)  # 90, 180, 270
        writer.add_page(page)
    
    with open(output_path, 'wb') as f:
        writer.write(f)
    
    print(f"已旋转 {rotation} 度并保存到 {output_path}")
```

**添加水印**

```python
import fitz

def add_watermark(pdf_path, watermark_text, output_path):
    """添加文字水印"""
    doc = fitz.open(pdf_path)
    
    for page in doc:
        # 创建水印
        rect = page.rect
        text_point = fitz.Point(rect.width/2, rect.height/2)
        
        # 旋转45度
        page.insert_text(
            text_point,
            watermark_text,
            fontsize=60,
            color=(0.8, 0.8, 0.8),  # 浅灰色
            rotate=45
        )
    
    doc.save(output_path)
    doc.close()
    print(f"已添加水印并保存到 {output_path}")

# 使用图片水印
def add_image_watermark(pdf_path, watermark_img, output_path):
    """添加图片水印"""
    doc = fitz.open(pdf_path)
    
    for page in doc:
        rect = page.rect
        # 水印位置（右下角）
        img_rect = fitz.Rect(
            rect.width - 150,
            rect.height - 100,
            rect.width - 10,
            rect.height - 10
        )
        page.insert_image(img_rect, filename=watermark_img)
    
    doc.save(output_path)
    doc.close()
```

**加密与解密**

```python
from pypdf import PdfReader, PdfWriter

def encrypt_pdf(pdf_path, output_path, password):
    """加密 PDF"""
    reader = PdfReader(pdf_path)
    writer = PdfWriter()
    
    for page in reader.pages:
        writer.add_page(page)
    
    # 加密
    writer.encrypt(password)
    
    with open(output_path, 'wb') as f:
        writer.write(f)
    
    print(f"已加密并保存到 {output_path}")

def decrypt_pdf(pdf_path, output_path, password):
    """解密 PDF"""
    reader = PdfReader(pdf_path)
    
    if reader.is_encrypted:
        reader.decrypt(password)
    
    writer = PdfWriter()
    
    for page in reader.pages:
        writer.add_page(page)
    
    with open(output_path, 'wb') as f:
        writer.write(f)
    
    print(f"已解密并保存到 {output_path}")
```

**关键要点：**
- PdfMerger 用于合并，PdfWriter 用于创建
- 页面旋转角度：90, 180, 270
- 加密需要设置用户密码

## ✅ 课程考核

完成以下任务以通过考核：

1. **文本提取** (30分)
   - 从给定 PDF 中提取全部文本
   - 统计字数和页数
   - 提取所有图片到 images/ 目录

2. **PDF 创建** (30分)
   - 创建一份报告 PDF，包含：
     - 标题（居中、大字体）
     - 正文（3段以上）
     - 表格（至少3行数据）
     - 页眉页脚

3. **PDF 处理** (40分)
   - 合并3个 PDF 文件
   - 从合并后的 PDF 提取第2-4页
   - 添加水印 "龙虾大学"
   - 设置密码保护

**提交物：**
- `extracted_text.txt` - 提取的文本
- `report.pdf` - 创建的报告
- `merged.pdf` - 合并的文件
- `watermarked.pdf` - 加水印的文件
- `processor.py` - 处理脚本

## 📖 参考资料

- [PyMuPDF 文档](https://pymupdf.readthedocs.io/)
- [pypdf 文档](https://pypdf.readthedocs.io/)
- [ReportLab 文档](https://www.reportlab.com/docs/reportlab-userguide.pdf)
- [FPDF 文档](https://py-pdf.github.io/fpdf2/)
