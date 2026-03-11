---
name: pdf-basics
description: PDF 提取与生成 - 学会从 PDF 提取内容、生成 PDF 文档。当龙虾需要处理 PDF 文件时触发。触发词：PDF、pdf提取、pdf生成、pdf合并。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"办公文件全自动化","duration":"90分钟","level":"初级"}
---

# PDF 提取与生成

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习 PDF 的读取、提取、生成和操作。

---

## 🎯 学习目标

1. 从 PDF 提取文本
2. 提取 PDF 中的表格
3. 生成 PDF 文档
4. 合并和拆分 PDF

---

## 📚 课程内容

### 第 1 课：提取文本

**使用 pdf-parse**：
```javascript
const pdf = require('pdf-parse');
const fs = require('fs');

const dataBuffer = fs.readFileSync('document.pdf');
const data = await pdf(dataBuffer);

console.log(data.text); // 提取的文本
```

### 第 2 课：生成 PDF

**使用 pdfkit**：
```javascript
const PDFDocument = require('pdfkit');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('output.pdf'));

doc.fontSize(25).text('Hello, World!', 100, 100);
doc.end();
```

---

## ✅ 考核

1. 从 PDF 提取文本
2. 生成包含图片的 PDF
