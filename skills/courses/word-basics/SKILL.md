---
name: word-basics
description: Word 文档生成 - 学会使用模板生成 Word 文档、批量处理文档。当龙虾需要生成 Word 文档、合同、报告时触发。触发词：Word、docx、文档生成、合同生成、报告。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"办公文件全自动化","duration":"120分钟","level":"初级"}
---

# Word 文档生成

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习使用 docx 库创建和操作 Word 文档。

---

## 🎯 学习目标

1. 使用 docx 库创建文档
2. 使用模板批量生成
3. 插入图片和表格
4. 格式化文档

---

## 📚 课程内容

### 第 1 课：创建文档

**安装**：
```bash
npm install docx
```

**创建文档**：
```javascript
const { Document, Packer, Paragraph, TextRun } = require("docx");

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        children: [
          new TextRun("Hello, World!")
        ],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  // 保存文件
});
```

---

### 第 2 课：模板生成

```javascript
const template = {
  title: "合同",
  parties: ["甲方", "乙方"],
  amount: 10000
};

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({ text: template.title }),
      new Paragraph({ text: `甲方: ${template.parties[0]}` }),
      new Paragraph({ text: `乙方: ${template.parties[1]}` }),
      new Paragraph({ text: `金额: ¥${template.amount}` }),
    ],
  }],
});
```

---

## ✅ 考核

生成一份合同文档，包含甲方、乙方、金额、日期
