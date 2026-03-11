---
name: browser-automation
description: 浏览器自动化 - 学会使用 Playwright 自动化浏览器操作。当龙虾需要自动填表、截图、网页测试时触发。触发词：浏览器自动化、Playwright、自动化测试、表单填写。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"电脑操作稳定性","duration":"180分钟","level":"中级"}
---

# 浏览器自动化

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习 Playwright 控制浏览器实现自动化操作。

---

## 🎯 学习目标

1. 使用 Playwright 控制浏览器
2. 自动填写表单
3. 截图和录屏
4. 处理弹窗和对话框

---

## 📚 课程内容

### 第 1 课：启动浏览器

```javascript
const { chromium } = require('playwright');

const browser = await chromium.launch();
const page = await browser.newPage();

// 访问网页
await page.goto('https://example.com');
```

### 第 2 课：表单填写

```javascript
// 填写输入框
await page.fill('#username', 'myuser');
await page.fill('#password', 'mypassword');

// 点击按钮
await page.click('#submit');
```

### 第 3 课：截图和等待

```javascript
// 截图
await page.screenshot({ path: 'screenshot.png' });

// 等待元素
await page.waitForSelector('#result');

// 获取内容
const text = await page.textContent('#result');
```

---

## ✅ 考核

1. 自动登录网站
2. 填写表单并提交
3. 截图保存结果
