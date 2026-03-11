---
name: data-cleaning
description: 数据清洗与转换 - 学会清洗脏数据、格式转换、质量检查。当龙虾需要处理数据、清洗数据、格式转换时触发。触发词：数据清洗、数据转换、ETL、数据质量。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"数据库与长期记忆","duration":"120分钟","level":"基础","path":"C2","prerequisites":["sqlite-basics"]}
---

# 数据清洗与转换

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习如何清洗脏数据、转换格式、保证数据质量。

---

## 🎯 学习目标

1. 识别和处理缺失值
2. 数据格式标准化
3. 去重和验证
4. 批量转换流程

---

## 📚 课程内容

### 第 1 课：缺失值处理

**识别缺失值**：
```javascript
function findMissing(data, field) {
  return data.filter(row => {
    const value = row[field];
    return value === null || value === undefined || value === '';
  });
}
```

**处理策略**：
| 策略 | 适用场景 |
|------|----------|
| 删除 | 缺失比例 < 5% |
| 填充默认值 | 分类数据 |
| 填充均值/中位数 | 数值数据 |
| 插值 | 时间序列 |

**代码示例**：
```javascript
function handleMissing(data, field, strategy, defaultValue) {
  return data.map(row => {
    if (!row[field]) {
      switch (strategy) {
        case 'default':
          row[field] = defaultValue;
          break;
        case 'mean':
          row[field] = calculateMean(data, field);
          break;
        case 'drop':
          return null;
      }
    }
    return row;
  }).filter(Boolean);
}
```

---

### 第 2 课：格式标准化

**日期格式**：
```javascript
function normalizeDate(dateStr) {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}
```

**数字格式**：
```javascript
function normalizeNumber(numStr) {
  // 移除逗号、空格
  const cleaned = String(numStr).replace(/[,，\s]/g, '');
  return parseFloat(cleaned) || 0;
}
```

**文本格式**：
```javascript
function normalizeText(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}
```

---

### 第 3 课：去重和验证

**去重**：
```javascript
function deduplicate(data, keyField) {
  const seen = new Set();
  return data.filter(row => {
    const key = row[keyField];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
```

**数据验证**：
```javascript
function validate(data, rules) {
  const errors = [];
  
  for (const row of data) {
    for (const [field, rule] of Object.entries(rules)) {
      if (rule.required && !row[field]) {
        errors.push(`Row missing required field: ${field}`);
      }
      if (rule.pattern && !rule.pattern.test(row[field])) {
        errors.push(`Row invalid pattern for ${field}`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}
```

---

## ✅ 课程考核

**任务**: 清洗一份客户数据 CSV：

1. 处理缺失的电话号码（填充 "N/A"）
2. 统一日期格式为 YYYY-MM-DD
3. 去除重复邮箱
4. 验证邮箱格式
5. 输出清洗报告

---

## 📖 参考资料

- 常见脏数据模式
- 数据质量检查清单
