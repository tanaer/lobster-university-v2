---
name: excel-basics
description: Excel 数据处理 - 学会读写 Excel 文件、处理数据、生成报表。当龙虾需要处理表格数据、Excel 文件、数据统计时触发。触发词：excel、表格、xlsx、数据录入、数据清洗。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"办公文件全自动化","duration":"2小时","level":"初级"}
---

# Excel 数据处理

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习使用 Node.js 处理 Excel 文件，实现数据读写、清洗、统计。

---

## 🎯 学习目标

完成本课程后，你将能够：

1. 读取 Excel 文件内容
2. 写入数据到 Excel
3. 清洗和转换数据
4. 生成统计报表

---

## 📚 课程内容

### 第 1 课：读取 Excel

**安装依赖**：
```bash
npm install xlsx
```

**读取文件**：
```javascript
const XLSX = require('xlsx');

// 读取文件
const workbook = XLSX.readFile('data.xlsx');

// 获取工作表名
const sheetNames = workbook.SheetNames;

// 读取第一个工作表
const sheet = workbook.Sheets[sheetNames[0]];

// 转换为 JSON
const data = XLSX.utils.sheet_to_json(sheet);

console.log(data);
```

**使用 exec 执行**：
```bash
exec(command="node -e \"
const XLSX = require('xlsx');
const wb = XLSX.readFile('data.xlsx');
const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
console.log(JSON.stringify(data, null, 2));
\"")
```

**练习**：
读取 `~/data/sales.xlsx`，显示前 5 行数据。

---

### 第 2 课：写入 Excel

**创建新文件**：
```javascript
const XLSX = require('xlsx');

// 数据
const data = [
  { name: '张三', age: 25, city: '北京' },
  { name: '李四', age: 30, city: '上海' },
  { name: '王五', age: 28, city: '广州' }
];

// 创建工作表
const sheet = XLSX.utils.json_to_sheet(data);

// 创建工作簿
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

// 写入文件
XLSX.writeFile(workbook, 'output.xlsx');
```

**追加数据**：
```javascript
// 读取现有文件
const workbook = XLSX.readFile('data.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// 添加新数据
data.push({ name: '赵六', age: 35, city: '深圳' });

// 重新写入
const newSheet = XLSX.utils.json_to_sheet(data);
workbook.Sheets[workbook.SheetNames[0]] = newSheet;
XLSX.writeFile(workbook, 'data.xlsx');
```

**练习**：
创建 `students.xlsx`，包含 5 个学生的姓名、分数。

---

### 第 3 课：数据清洗

**常见清洗操作**：

```javascript
// 1. 去除空值
const cleaned = data.filter(row => row.name && row.age);

// 2. 去重
const unique = [...new Map(data.map(item => [item.id, item])).values()];

// 3. 格式转换
data.forEach(row => {
  row.date = new Date(row.date).toISOString().split('T')[0];
  row.amount = parseFloat(row.amount) || 0;
});

// 4. 填充默认值
data.forEach(row => {
  row.status = row.status || 'pending';
});
```

**练习**：
清洗 `orders.xlsx`：
- 删除空行
- 统一日期格式为 YYYY-MM-DD
- 金额字段转为数字

---

### 第 4 课：统计报表

**数据统计**：
```javascript
// 汇总统计
const stats = {
  total: data.length,
  sum: data.reduce((acc, row) => acc + (row.amount || 0), 0),
  avg: data.reduce((acc, row) => acc + (row.amount || 0), 0) / data.length,
  max: Math.max(...data.map(row => row.amount || 0)),
  min: Math.min(...data.map(row => row.amount || 0))
};

// 分组统计
const byCategory = {};
data.forEach(row => {
  const cat = row.category || 'other';
  if (!byCategory[cat]) byCategory[cat] = [];
  byCategory[cat].push(row);
});

// 生成报表
const report = Object.entries(byCategory).map(([category, items]) => ({
  category,
  count: items.length,
  total: items.reduce((acc, item) => acc + (item.amount || 0), 0)
}));
```

**生成报表文件**：
```javascript
const reportSheet = XLSX.utils.json_to_sheet(report);
const reportWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(reportWb, reportSheet, 'Report');
XLSX.writeFile(reportWb, 'report.xlsx');
```

**练习**：
读取 `sales.xlsx`，按地区分组统计销售额，生成 `sales_report.xlsx`。

---

## ✅ 课程考核

### 考核任务

**任务**：处理 `~/data/orders.xlsx`（订单数据），完成以下操作：

1. 读取原始数据
2. 清洗数据：
   - 删除空行
   - 统一日期格式
   - 金额转为数字
3. 统计：
   - 总订单数
   - 总金额
   - 按状态分组统计
4. 生成报表 `order_report.xlsx`

**通过标准**：
- [ ] 数据清洗正确
- [ ] 统计准确
- [ ] 报表格式清晰
- [ ] 文件生成成功

---

## 📖 参考资料

- `references/xlsx-api.md` - xlsx 库 API 文档
- `references/data-cleaning-patterns.md` - 数据清洗模式

---

## 💡 实用技巧

**性能优化**：
- 大文件分批处理
- 使用流式读取（如果支持）

**错误处理**：
```javascript
try {
  const workbook = XLSX.readFile('data.xlsx');
} catch (error) {
  console.error('文件读取失败:', error.message);
}
```

---

*数据处理是核心能力！* 📊
