# DocGenerator — 可执行 SOP

> 学完这门课，Agent 能独立完成：从数据 + 模板生成 Word/PDF/Excel 文档

## 课程元数据

| 项目 | 内容 |
|------|------|
| 课程 ID | docgenerator |
| 难度 | 初级 |
| 预计执行时间 | 15 分钟 |
| 前置技能 | shell-basics, JSON 基础 |
| 输出物 | 填充数据的 Word/PDF/Excel 文档 |

---

## 工作流总览

```
[数据 + 模板] → Step 1: 准备环境 → Step 2: 选择模板引擎 → Step 3: 填充数据 → Step 4: 导出文档 → [成品文档]
```

---

## Step 1: 准备环境与数据

### 输入
- 数据文件（JSON/YAML/CSV）
- 模板文件（docx 占位符格式或模板语法）

### 执行
```bash
# 1. 创建项目目录
mkdir doc-project && cd doc-project

# 2. 准备数据文件
cat > data.json << 'EOF'
{
  "company": "龙虾大学",
  "date": "2024-03-15",
  "items": [
    { "name": "课程A", "price": 199, "qty": 10 },
    { "name": "课程B", "price": 299, "qty": 5 }
  ],
  "total": 3485,
  "contact": {
    "name": "张三",
    "email": "zhangsan@example.com"
  }
}
EOF

# 3. 验证数据格式
jq . data.json > /dev/null && echo "✓ JSON 有效"
```

### 判断条件
- ✅ 成功：`data.json` 格式正确，包含所需字段
- ❌ 失败：JSON 格式错误 → 用 `jq` 定位错误位置
- 🔄 失败处理：修复 JSON 语法

### 输出
- `data.json`: 验证过的数据文件

---

## Step 2: 选择模板引擎

### 输入
- 目标文档格式（Word/PDF/Excel）

### 执行

**方案 A：docx-templates（Word，推荐）**
```bash
npm install docx-templates
```

**方案 B：Python docx + jinja2**
```bash
pip install python-docx Jinja2
```

**方案 C：Pandoc（Markdown → 任意格式）**
```bash
apt-get install pandoc texlive-xetex  # Ubuntu/Debian
```

### 判断条件
- ✅ 成功：工具安装成功，能执行
- ❌ 失败：依赖缺失 → 按错误提示安装
- 🔄 失败处理：换备选方案

### 输出
- 选定方案 + 安装好的工具

---

## Step 3: 创建并填充模板

### 输入
- `data.json`
- 选定的模板引擎

### 执行

**方案 A：docx-templates（Node.js）**

```bash
# 1. 创建 Word 模板（手动或用脚本）
# 模板中使用 {{company}} 作为占位符

# 2. 编写生成脚本
cat > generate.js << 'EOF'
const createReport = require('docx-templates');
const fs = require('fs');

const template = fs.readFileSync('template.docx');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const report = await createReport({
  template,
  data: {
    company: data.company,
    date: data.date,
    items: data.items,
    total: data.total,
    contact: data.contact
  },
  cmdDelimiter: ['{{', '}}']
});

fs.writeFileSync('output.docx', report);
console.log('✓ 生成 output.docx');
EOF

# 3. 执行
node generate.js
```

**方案 B：Python docx + jinja2**

```bash
cat > generate.py << 'EOF'
from docx import Document
from jinja2 import Template
import json

# 读取数据
with open('data.json') as f:
    data = json.load(f)

# 创建文档
doc = Document()
doc.add_heading(f'{data["company"]} - 报价单', 0)
doc.add_paragraph(f'日期: {data["date"]}')
doc.add_paragraph(f'联系人: {data["contact"]["name"]} ({data["contact"]["email"]})')

# 添加表格
table = doc.add_table(rows=1, cols=4)
table.style = 'Light Grid Accent 1'
hdr_cells = table.rows[0].cells
hdr_cells[0].text = '项目'
hdr_cells[1].text = '单价'
hdr_cells[2].text = '数量'
hdr_cells[3].text = '小计'

for item in data['items']:
    row_cells = table.add_row().cells
    row_cells[0].text = item['name']
    row_cells[1].text = str(item['price'])
    row_cells[2].text = str(item['qty'])
    row_cells[3].text = str(item['price'] * item['qty'])

doc.add_paragraph(f'总计: ¥{data["total"]}', style='Intense Quote')
doc.save('output.docx')
print('✓ 生成 output.docx')
EOF

python3 generate.py
```

**方案 C：Markdown + Pandoc（最简单）**

```bash
# 1. 创建 Markdown 模板
cat > template.md << 'EOF'
# {{company}} - 报价单

**日期**: {{date}}  
**联系人**: {{contact.name}} ({{contact.email}})

| 项目 | 单价 | 数量 | 小计 |
|------|------|------|------|
{{#items}}
| {{name}} | ¥{{price}} | {{qty}} | ¥{{price * qty}} |
{{/items}}

**总计: ¥{{total}}**
EOF

# 2. 使用 mustache 或手动替换
cat data.json | jq -r '
  . as $d |
  "# \($d.company) - 报价单\n\n" +
  "**日期**: \($d.date)\n" +
  "**联系人**: \($d.contact.name) (\($d.contact.email))\n\n" +
  "| 项目 | 单价 | 数量 | 小计 |\n" +
  "|------|------|------|------|\n" +
  ($d.items | map("| \(.name) | ¥\(.price) | \(.qty) | ¥\(.price * .qty) |") | join("\n")) +
  "\n\n**总计: ¥\($d.total)**"
' > output.md

# 3. 转换为 Word/PDF
pandoc output.md -o output.docx
pandoc output.md -o output.pdf --pdf-engine=xelatex
```

### 判断条件
- ✅ 成功：`output.docx` 生成，文件大小 > 10KB
- ❌ 失败：模板语法错误 → 检查占位符格式
- ❌ 失败：数据字段缺失 → 检查 JSON 键名
- 🔄 失败处理：简化模板，逐步调试

### 输出
- `output.docx`: Word 文档
- `output.pdf`: PDF 文档（如果用 Pandoc）

---

## Step 4: 验证与批量生成

### 输入
- 生成的文档

### 执行
```bash
# 1. 验证文件
ls -lh output.*
file output.docx
file output.pdf 2>/dev/null || echo "无 PDF"

# 2. 提取内容验证（docx 是 zip）
unzip -p output.docx word/document.xml | grep -o '<w:t>[^<]*<' | head -20

# 3. 批量生成（多个数据文件）
for f in data/*.json; do
  name=$(basename "$f" .json)
  jq -r '...' "$f" > "output/${name}.md"
  pandoc "output/${name}.md" -o "output/${name}.docx"
done
```

### 判断条件
- ✅ 成功：文档包含正确数据，格式正常
- ❌ 失败：乱码 → 检查编码（UTF-8）
- 🔄 失败处理：重新生成

### 输出
- 验证通过的文档

---

## 验收标准

| 检查项 | 预期结果 | 验证命令 |
|--------|----------|----------|
| 文档生成 | output.docx 存在 | `test -f output.docx` |
| 文件大小 | > 10KB | `stat -c%s output.docx` |
| 内容正确 | 包含公司名称 | `unzip -p output.docx word/document.xml \| grep -q "龙虾大学"` |
| 表格完整 | 所有行数据存在 | 检查 items 数量匹配 |
| PDF 可选 | 如有 pandoc，PDF 也生成 | `test -f output.pdf` |

---

## 常见问题 & 排错

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| 占位符未替换 | 语法不匹配 | 检查 `{{}}` vs `{{ }}` 空格 |
| 中文乱码 | 字体缺失 | 安装中文字体或指定字体 |
| 表格样式丢失 | 模板问题 | 在 Word 中预设表格样式 |
| 图片不显示 | 路径错误 | 使用绝对路径或 base64 嵌入 |
| 批量生成慢 | 逐个处理 | 使用并行处理 `xargs -P` |

---

## 扩展任务（选做）

- [ ] 生成 Excel（用 Python openpyxl）
- [ ] 添加图表（matplotlib 生成图片嵌入）
- [ ] 邮件自动发送（生成后自动发附件）
- [ ] 模板库管理（多模板选择）
- [ ] 在线预览（转 HTML 预览）
- [ ] 电子签名（插入签名图片）
