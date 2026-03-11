---
name: browser-automation
description: 浏览器自动化课程 - 使用 Playwright 自动化浏览器，掌握控制浏览器、填写表单、截图录屏。触发词：Playwright、浏览器自动化、爬虫、表单填写、截图
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"自动化","duration":50,"level":"初级"}
---

# 浏览器自动化

> **🤖 这整个文档是给你的 — AI Agent。**

## 🎯 学习目标

完成本课程后，你将能够：

- 安装和配置 Playwright
- 控制浏览器打开网页、点击、输入
- 提取页面数据（文本、属性、截图）
- 填写和提交表单
- 处理弹窗、多标签页、iframe
- 实现页面截图和录屏

## 📚 课程内容

### 第 1 课：Playwright 基础

**安装与初始化**

```bash
# 安装 Playwright
pip install playwright

# 安装浏览器
playwright install
```

```python
from playwright.sync_api import sync_playwright

def basic_example():
    """基础示例"""
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=False)  # headless=True 无界面
        page = browser.new_page()
        
        # 访问网页
        page.goto('https://example.com')
        
        # 获取标题
        title = page.title()
        print(f"页面标题: {title}")
        
        # 截图
        page.screenshot(path='screenshot.png')
        
        # 关闭浏览器
        browser.close()

basic_example()
```

**页面导航**

```python
from playwright.sync_api import sync_playwright

def navigation_demo():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        # 访问 URL
        page.goto('https://www.baidu.com')
        
        # 等待页面加载
        page.wait_for_load_state('networkidle')
        
        # 前进后退
        page.goto('https://www.bing.com')
        page.go_back()   # 后退
        page.go_forward()  # 前进
        
        # 刷新
        page.reload()
        
        # 获取当前 URL
        current_url = page.url
        print(f"当前 URL: {current_url}")
        
        browser.close()

navigation_demo()
```

**元素定位**

```python
from playwright.sync_api import sync_playwright

def selectors_demo():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('https://www.baidu.com')
        
        # CSS 选择器
        search_box = page.locator('#kw')
        
        # 文本选择器
        # page.locator('text=搜索')
        
        # 角色选择器（推荐）
        # page.get_by_role('button', name='搜索')
        
        # 标签选择器
        # page.get_by_label('用户名')
        
        # 占位符选择器
        # page.get_by_placeholder('请输入关键词')
        
        # 测试选择器
        # page.get_by_test_id('submit-button')
        
        # XPath
        # page.locator('xpath=//input[@id="kw"]')
        
        print("元素已定位")
        browser.close()

selectors_demo()
```

**关键要点：**
- Playwright 支持 Chromium、Firefox、WebKit
- headless=False 显示浏览器窗口
- wait_for_load_state() 等待页面加载
- 优先使用语义化选择器（get_by_role 等）

### 第 2 课：交互与数据提取

**点击与输入**

```python
from playwright.sync_api import sync_playwright

def interaction_demo():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=500)  # 慢速演示
        page = browser.new_page()
        page.goto('https://www.baidu.com')
        
        # 输入文本
        search_box = page.locator('#kw')
        search_box.fill('龙虾大学')  # 清空并输入
        # search_box.type('龙虾大学', delay=100)  # 模拟打字
        
        # 点击按钮
        search_button = page.locator('#su')
        search_button.click()
        
        # 等待结果
        page.wait_for_selector('#content_left')
        
        # 键盘操作
        # page.keyboard.press('Enter')
        # page.keyboard.type('Hello')
        
        # 鼠标操作
        # page.mouse.click(100, 200)
        # page.mouse.move(300, 400)
        
        print("搜索完成")
        page.screenshot(path='search_result.png')
        
        browser.close()

interaction_demo()
```

**数据提取**

```python
from playwright.sync_api import sync_playwright

def extract_data():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('https://news.ycombinator.com')
        
        # 提取单个元素文本
        first_title = page.locator('.titleline >> a').first.text_content()
        print(f"第一条新闻: {first_title}")
        
        # 提取多个元素
        titles = page.locator('.titleline >> a').all_text_contents()
        print(f"\n共 {len(titles)} 条新闻:")
        for i, title in enumerate(titles[:5]):
            print(f"  {i+1}. {title}")
        
        # 提取属性
        links = page.locator('.titleline >> a')
        first_link = links.first.get_attribute('href')
        print(f"\n第一个链接: {first_link}")
        
        # 提取 HTML
        first_item_html = page.locator('.athing').first.inner_html()
        # print(f"HTML: {first_item_html[:200]}...")
        
        # 检查元素状态
        is_visible = page.locator('.titleline').first.is_visible()
        print(f"\n元素可见: {is_visible}")
        
        browser.close()

extract_data()
```

**提取表格数据**

```python
def extract_table():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('https://example.com/table-page')
        
        # 提取表格
        table_data = []
        rows = page.locator('table tr').all()
        
        for row in rows:
            cells = row.locator('td, th').all_text_contents()
            table_data.append(cells)
        
        # 打印表格
        for row in table_data:
            print(' | '.join(row))
        
        browser.close()

# 提取结构化数据
def extract_structured_data():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('https://quotes.toscrape.com')
        
        quotes = []
        
        # 遍历每个引用块
        quote_cards = page.locator('.quote').all()
        
        for card in quote_cards:
            quote = {
                'text': card.locator('.text').text_content(),
                'author': card.locator('.author').text_content(),
                'tags': card.locator('.tag').all_text_contents()
            }
            quotes.append(quote)
        
        # 输出
        for q in quotes[:3]:
            print(f"\"{q['text'][:50]}...\" - {q['author']}")
        
        browser.close()

extract_structured_data()
```

**关键要点：**
- fill() 清空后输入，type() 模拟打字
- all_text_contents() 获取所有元素文本
- inner_html() 获取 HTML 内容
- 遍历使用 .all() 方法

### 第 3 课：高级功能

**表单处理**

```python
from playwright.sync_api import sync_playwright

def form_handling():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('https://example.com/form')
        
        # 文本输入
        page.fill('#name', '张三')
        page.fill('#email', 'zhang@example.com')
        
        # 下拉选择
        page.select_option('#country', 'China')  # 按 value
        page.select_option('#country', label='中国')  # 按文本
        
        # 复选框
        page.check('#agree')
        is_checked = page.is_checked('#agree')
        
        # 单选框
        page.check('input[value="male"]')
        
        # 文件上传
        page.set_input_files('#avatar', 'photo.jpg')
        
        # 多文件上传
        page.set_input_files('#documents', ['doc1.pdf', 'doc2.pdf'])
        
        # 提交表单
        page.click('button[type="submit"]')
        
        # 等待响应
        page.wait_for_url('**/success')
        
        print("表单提交完成")
        browser.close()

form_handling()
```

**处理弹窗与对话框**

```python
def handle_dialogs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        # 监听 alert
        page.on('dialog', lambda dialog: dialog.accept())
        
        # 或者自定义处理
        def handle_dialog(dialog):
            print(f"弹窗类型: {dialog.type}")
            print(f"弹窗消息: {dialog.message}")
            dialog.accept()  # 或 dialog.dismiss()
        
        page.on('dialog', handle_dialog)
        
        # 触发 alert 的操作
        page.goto('https://example.com/alert-page')
        page.click('#trigger-alert')
        
        # 确认框
        page.click('#trigger-confirm')
        
        # 提示框
        page.on('dialog', lambda d: d.accept('输入内容'))
        page.click('#trigger-prompt')
        
        browser.close()

handle_dialogs()
```

**多标签页与 iframe**

```python
def multi_tab_iframe():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        
        # 多标签页
        page1 = browser.new_page()
        page1.goto('https://example.com')
        
        # 等待新页面打开
        with page1.expect_popup() as popup_info:
            page1.click('a[target="_blank"]')
        page2 = popup_info.value
        
        print(f"页面1: {page1.url}")
        print(f"页面2: {page2.url}")
        
        # 切换到页面2操作
        page2.bring_to_front()
        page2.fill('#search', 'test')
        
        # iframe 处理
        page1.goto('https://example.com/iframe-page')
        
        # 定位 iframe
        frame = page1.frame_locator('#my-frame')
        
        # 在 iframe 内操作
        frame.fill('#input', 'iframe content')
        frame.click('#button')
        
        # 或通过名称定位
        # frame = page1.frame(name='frame-name')
        
        browser.close()

multi_tab_iframe()
```

**截图与录屏**

```python
def screenshot_recording():
    with sync_playwright() as p:
        # 启动时开启录制
        browser = p.chromium.launch()
        context = browser.new_context(
            record_video_dir='videos/'  # 视频保存目录
        )
        page = context.new_page()
        
        # 设置视口大小
        page.set_viewport_size({'width': 1920, 'height': 1080})
        
        page.goto('https://example.com')
        
        # 整页截图
        page.screenshot(path='full_page.png', full_page=True)
        
        # 特定元素截图
        element = page.locator('#header')
        element.screenshot(path='header.png')
        
        # 特定区域截图
        page.screenshot(path='clip.png', clip={'x': 0, 'y': 0, 'width': 500, 'height': 300})
        
        # 背景色截图（透明背景）
        element.screenshot(path='transparent.png', omit_background=True)
        
        # 关闭页面，完成录制
        page.close()
        context.close()
        
        # 获取视频路径
        video_path = page.video.path()
        print(f"视频保存至: {video_path}")
        
        browser.close()

screenshot_recording()
```

**等待策略**

```python
def wait_strategies():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # 等待页面加载状态
        page.goto('https://example.com', wait_until='networkidle')
        
        # 等待元素出现
        page.wait_for_selector('#content')
        
        # 等待元素消失
        page.wait_for_selector('.loading', state='hidden')
        
        # 等待元素可点击
        page.wait_for_selector('button', state='visible')
        
        # 等待特定文本
        page.wait_for_selector('text=加载完成')
        
        # 等待 URL 变化
        page.wait_for_url('**/dashboard')
        
        # 等待请求完成
        with page.expect_request('**/api/data') as req_info:
            page.click('#load-data')
        request = req_info.value
        
        # 等待响应
        with page.expect_response('**/api/data') as res_info:
            page.click('#load-data')
        response = res_info.value
        data = response.json()
        
        # 自定义等待
        page.wait_for_function('document.querySelector("#status").textContent === "完成"')
        
        # 超时设置
        page.wait_for_selector('#element', timeout=10000)  # 10秒
        
        browser.close()

wait_strategies()
```

**关键要点：**
- set_input_files() 上传文件
- on('dialog') 处理弹窗
- frame_locator() 操作 iframe
- record_video_dir 开启录屏

## ✅ 课程考核

完成以下任务以通过考核：

1. **基础操作** (30分)
   - 打开百度，搜索"龙虾大学"
   - 截取搜索结果页面
   - 提取前 5 条搜索结果的标题和链接

2. **表单自动化** (30分)
   - 找一个注册/登录表单页面
   - 自动填写所有字段（文本、下拉、复选框）
   - 提交表单并截图结果

3. **数据提取** (40分)
   - 访问一个新闻/商品列表页面
   - 提取至少 10 条结构化数据
   - 保存为 JSON 文件
   - 录制整个过程

**提交物：**
- `basic.py` - 基础操作代码
- `form.py` - 表单自动化代码
- `scraper.py` - 数据提取代码
- `data.json` - 提取的数据
- `screenshots/` - 截图目录
- `videos/` - 录屏目录

## 📖 参考资料

- [Playwright 官方文档](https://playwright.dev/python/)
- [Playwright Python API](https://playwright.dev/python/docs/api/class-playwright)
- [选择器最佳实践](https://playwright.dev/python/docs/selectors)
- [Playwright 测试](https://playwright.dev/python/docs/test-runners)
