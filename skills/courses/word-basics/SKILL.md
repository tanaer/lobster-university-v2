---
name: word-basics
description: Word 文档生成课程 - 使用模板生成 Word 文档，掌握 docx 库、模板批量生成、格式化。触发词：Word、docx、文档生成、模板、批量生成
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"文档处理","duration":40,"level":"初级"}
---

# Word 文档生成

> **🤖 这整个文档是给你的 — AI Agent。**

## 🎯 学习目标

完成本课程后，你将能够：

- 使用 python-docx 库创建和修改 Word 文档
- 应用文本格式（字体、颜色、对齐方式）
- 创建表格、列表和图片
- 使用模板批量生成文档
- 添加页眉页脚和目录

## 📚 课程内容

### 第 1 课：python-docx 基础

**创建文档**

```python
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

# 创建新文档
doc = Document()

# 添加标题
doc.add_heading('文档标题', level=0)

# 添加段落
para = doc.add_paragraph('这是一个普通段落。')

# 添加格式化文本
run = para.add_run(' 这是加粗的文本。')
run.bold = True

run = para.add_run(' 这是红色的文本。')
run.font.color.rgb = RGBColor(255, 0, 0)

# 保存文档
doc.save('output.docx')
```

**段落格式**

```python
from docx.shared import Pt, Inches

doc = Document()

# 创建段落并设置格式
para = doc.add_paragraph()
para.alignment = WD_ALIGN_PARAGRAPH.CENTER  # 居中

# 设置字体
run = para.add_run('居中标题')
run.font.size = Pt(24)
run.font.bold = True
run.font.name = '微软雅黑'

# 行间距
para_format = para.paragraph_format
para_format.line_spacing = 1.5  # 1.5倍行距
para_format.space_after = Pt(12)  # 段后间距

# 首行缩进
para_format.first_line_indent = Inches(0.5)
```

**列表**

```python
# 无序列表
doc.add_paragraph('项目一', style='List Bullet')
doc.add_paragraph('项目二', style='List Bullet')
doc.add_paragraph('项目三', style='List Bullet')

# 有序列表
doc.add_paragraph('第一步', style='List Number')
doc.add_paragraph('第二步', style='List Number')
doc.add_paragraph('第三步', style='List Number')

# 多级列表
doc.add_paragraph('一级项目', style='List Number')
doc.add_paragraph('二级项目', style='List Number 2')
doc.add_paragraph('三级项目', style='List Number 3')
```

**关键要点：**
- Document() 创建新文档
- add_heading() 添加标题
- add_paragraph() 添加段落
- run 对象控制文本格式

### 第 2 课：表格与图片

**创建表格**

```python
from docx.shared import Inches

doc = Document()

# 创建 3行4列 的表格
table = doc.add_table(rows=3, cols=4, style='Table Grid')

# 设置表头
header_cells = table.rows[0].cells
headers = ['姓名', '年龄', '城市', '职业']
for i, header in enumerate(headers):
    header_cells[i].text = header
    # 加粗表头
    for paragraph in header_cells[i].paragraphs:
        for run in paragraph.runs:
            run.font.bold = True

# 填充数据
data = [
    ['张三', '25', '北京', '工程师'],
    ['李四', '30', '上海', '设计师']
]

for row_idx, row_data in enumerate(data):
    row = table.rows[row_idx + 1]
    for col_idx, cell_data in enumerate(row_data):
        row.cells[col_idx].text = cell_data

# 调整列宽
for col in table.columns:
    col.width = Inches(1.5)
```

**高级表格操作**

```python
# 合并单元格
table = doc.add_table(rows=3, cols=3, style='Table Grid')

# 合并第一行的所有单元格
cell = table.cell(0, 0)
cell.merge(table.cell(0, 2))
cell.text = '合并的标题'

# 设置单元格背景色
from docx.oxml.ns import nsdecls
from docx.oxml import parse_xml

def set_cell_shading(cell, color):
    """设置单元格背景色"""
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color}"/>')
    cell._tc.get_or_add_tcPr().append(shading)

# 表头灰色背景
for cell in table.rows[0].cells:
    set_cell_shading(cell, "CCCCCC")
```

**添加图片**

```python
from docx.shared import Inches

doc = Document()

# 添加图片
doc.add_paragraph('下面是一张图片：')
doc.add_picture('image.png', width=Inches(4))

# 图片居中
last_paragraph = doc.paragraphs[-1]
last_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER

# 在表格中添加图片
table = doc.add_table(rows=1, cols=2)
table.rows[0].cells[0].text = '图片描述'
# 注意：需要在单元格的段落中添加图片
paragraph = table.rows[0].cells[1].paragraphs[0]
run = paragraph.add_run()
run.add_picture('image.png', width=Inches(2))
```

**关键要点：**
- add_table() 创建表格
- cell.merge() 合并单元格
- add_picture() 添加图片
- 使用 Inches 控制尺寸

### 第 3 课：模板与批量生成

**使用模板**

```python
from docx import Document
from docx.shared import Pt

# 加载模板
doc = Document('template.docx')

# 替换占位符
def replace_placeholder(doc, placeholder, value):
    """替换文档中的占位符"""
    for paragraph in doc.paragraphs:
        if placeholder in paragraph.text:
            # 保留格式替换
            for run in paragraph.runs:
                if placeholder in run.text:
                    run.text = run.text.replace(placeholder, value)
    
    # 替换表格中的占位符
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    if placeholder in paragraph.text:
                        for run in paragraph.runs:
                            if placeholder in run.text:
                                run.text = run.text.replace(placeholder, value)

# 使用模板
replace_placeholder(doc, '{{name}}', '张三')
replace_placeholder(doc, '{{date}}', '2024-01-15')
replace_placeholder(doc, '{{title}}', '项目报告')

doc.save('output.docx')
```

**批量生成文档**

```python
import os
from datetime import datetime

def batch_generate(template_path, data_list, output_dir):
    """批量生成文档"""
    os.makedirs(output_dir, exist_ok=True)
    
    for data in data_list:
        doc = Document(template_path)
        
        # 替换所有字段
        for key, value in data.items():
            replace_placeholder(doc, f'{{{{{key}}}}}', str(value))
        
        # 生成文件名
        filename = f"{data.get('name', 'unknown')}_{datetime.now().strftime('%Y%m%d')}.docx"
        output_path = os.path.join(output_dir, filename)
        
        doc.save(output_path)
        print(f"已生成: {output_path}")

# 批量生成证书
certificate_data = [
    {'name': '张三', 'course': 'Python 基础', 'date': '2024-01-15', 'score': '95'},
    {'name': '李四', 'course': 'Python 基础', 'date': '2024-01-15', 'score': '88'},
    {'name': '王五', 'course': 'Python 基础', 'date': '2024-01-15', 'score': '92'}
]

batch_generate('certificate_template.docx', certificate_data, 'certificates/')
```

**创建模板**

```python
def create_certificate_template():
    """创建证书模板"""
    doc = Document()
    
    # 设置页面
    section = doc.sections[0]
    section.page_width = Inches(11)
    section.page_height = Inches(8.5)
    
    # 标题
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run('结业证书')
    run.font.size = Pt(36)
    run.font.bold = True
    
    # 空行
    doc.add_paragraph()
    
    # 内容
    content = doc.add_paragraph()
    content.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    content.add_run('兹证明 ')
    name_run = content.add_run('{{name}}')
    name_run.font.bold = True
    name_run.font.size = Pt(18)
    name_run.font.color.rgb = RGBColor(0, 0, 139)
    
    content.add_run(' 完成了 ')
    course_run = content.add_run('{{course}}')
    course_run.font.bold = True
    
    content.add_run(' 课程的学习，成绩：')
    score_run = content.add_run('{{score}}')
    score_run.font.bold = True
    score_run.font.color.rgb = RGBColor(255, 0, 0)
    content.add_run(' 分。')
    
    # 日期
    doc.add_paragraph()
    date_para = doc.add_paragraph()
    date_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    date_para.add_run('颁发日期：{{date}}')
    
    doc.save('certificate_template.docx')
    print("模板已创建: certificate_template.docx")

create_certificate_template()
```

**添加页眉页脚**

```python
from docx.enum.section import WD_ORIENT

def add_header_footer(doc, header_text, footer_text):
    """添加页眉页脚"""
    section = doc.sections[0]
    
    # 页眉
    header = section.header
    header_para = header.paragraphs[0]
    header_para.text = header_text
    header_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # 页脚
    footer = section.footer
    footer_para = footer.paragraphs[0]
    footer_para.text = footer_text
    footer_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    return doc

# 使用
doc = Document('template.docx')
add_header_footer(doc, '龙虾大学 - 机密文件', '第 {page} 页')
doc.save('output.docx')
```

**关键要点：**
- 模板使用占位符（如 {{name}}）
- 批量生成需要循环处理
- 页面设置通过 sections 控制
- 保持格式需要在 run 级别替换

## ✅ 课程考核

完成以下任务以通过考核：

1. **基础文档** (30分)
   - 创建一个包含标题、3个段落、列表的文档
   - 应用不同的字体样式和颜色
   - 添加页眉和页脚

2. **表格文档** (30分)
   - 创建一个包含学生成绩的表格（至少5行数据）
   - 设置表头样式（加粗、背景色）
   - 计算并显示平均分

3. **批量生成** (40分)
   - 创建一个合同/证书模板
   - 准备至少5条数据
   - 批量生成5份文档

**提交物：**
- `basic.docx` - 基础文档
- `grades.docx` - 成绩表
- `template.docx` - 模板文件
- `batch/` - 批量生成的文档目录
- `generator.py` - 生成脚本

## 📖 参考资料

- [python-docx 官方文档](https://python-docx.readthedocs.io/)
- [python-docx GitHub](https://github.com/python-openxml/python-docx)
- [Word 文档结构说明](https://docs.microsoft.com/en-us/office/open-xml/open-xml-sdk)
