---
name: react-email-skills
description: React Email 开发 - 使用 React 组件创建邮件模板、响应式设计、国际化支持、邮件服务集成。当龙虾需要创建邮件模板、发送营销邮件、设计邮件组件时触发。触发词：React Email、邮件模板、email template、营销邮件、发送邮件。
version: 2.0.0
type: executable-sop
metadata:
  category: 前端开发
  module: 邮件开发
  level: 中级
  estimated_time: 45分钟
  prerequisites: [react-19-engineering]
  tools_required: [write, read, exec, web_search]
---

# React Email 开发

## 知识库

- @react-email/components：Container、Button、Text、Image、Link
- 响应式设计：max-width 600px、移动端适配
- 邮件兼容性：避免 JS、内联样式、表格布局
- 服务集成：Resend API、SendGrid API、Nodemailer
- 国际化：i18n 插件、多语言模板切换

---

## 工作流

### NODE-01: 邮件需求分析

```yaml
id: NODE-01
input: user.request
action: |
  解析邮件模板需求：
  - 邮件类型（营销/通知/事务）
  - 目标受众
  - 品牌风格要求
  - 多语言需求
success_criteria: 需求要素 >= 3 条
output: email_spec {type, audience, style, languages[]}
on_success: NODE-02
on_failure:
  action: 询问邮件用途和目标用户
  fallback: ABORT
```

### NODE-02: 组件结构设计

```yaml
id: NODE-02
input: NODE-01.email_spec
action: |
  设计邮件组件结构：
  1. Header（Logo + 导航）
  2. Hero（主视觉 + 标题）
  3. Content（正文 + CTA）
  4. Footer（联系信息 + 退订链接）
success_criteria: 结构清晰，模块化
output: component_structure
on_success: NODE-03
```

### NODE-03: 基础模板生成

```yaml
id: NODE-03
input: NODE-02.component_structure
action: |
  生成 React Email 模板：
  1. 导入 @react-email/components
  2. 创建 Email 组件
  3. 配置 Container 宽度
  4. 添加内联样式
success_criteria: 组件可渲染
output: base_template
on_success: NODE-04
```

### NODE-04: 内容填充

```yaml
id: NODE-04
type: branch
input: NODE-01.email_spec.type
branches:
  - condition: type == "marketing"
    target: NODE-04-MARKETING
  - condition: type == "notification"
    target: NODE-04-NOTIFICATION
  - condition: type == "transactional"
    target: NODE-04-TRANSACTIONAL
  - default: NODE-04-MARKETING
output: content_blocks
```

### NODE-04-MARKETING: 营销邮件内容

```yaml
id: NODE-04-MARKETING
input: NODE-03.base_template
action: |
  填充营销邮件内容：
  1. 吸引人的标题
  2. 产品展示区
  3. 优惠信息
  4. CTA 按钮
  5. 社交链接
success_criteria: 视觉吸引力强
output: marketing_template
on_success: NODE-05
```

### NODE-04-NOTIFICATION: 通知邮件内容

```yaml
id: NODE-04-NOTIFICATION
input: NODE-03.base_template
action: |
  填充通知邮件内容：
  1. 通知类型标题
  2. 简洁正文
  3. 操作链接
  4. 时间戳
success_criteria: 信息清晰简洁
output: notification_template
on_success: NODE-05
```

### NODE-04-TRANSACTIONAL: 事务邮件内容

```yaml
id: NODE-04-TRANSACTIONAL
input: NODE-03.base_template
action: |
  填充事务邮件内容：
  1. 订单/交易信息
  2. 明细表格
  3. 状态更新
  4. 客服联系
success_criteria: 信息完整准确
output: transactional_template
on_success: NODE-05
```

### NODE-05: 响应式适配

```yaml
id: NODE-05
input: NODE-04.content_blocks
action: |
  添加响应式适配：
  1. 移动端媒体查询
  2. 弹性图片
  3. 触摸友好按钮
  4. 字体缩放
success_criteria: 移动端预览正常
output: responsive_template
on_success: NODE-06
```

### NODE-06: 国际化配置

```yaml
id: NODE-06
input: 
  template: NODE-05.responsive_template
  languages: NODE-01.email_spec.languages
action: |
  配置多语言支持：
  1. 提取文本为变量
  2. 创建语言字典
  3. 添加语言切换逻辑
  4. 生成多语言模板文件
success_criteria: 支持目标语言
output: i18n_templates
on_success: NODE-07
on_failure:
  fallback: NODE-07  # 单语言跳过
```

### NODE-07: 邮件服务集成

```yaml
id: NODE-07
input: NODE-06.i18n_templates
action: |
  配置邮件发送服务：
  1. 选择服务商（Resend/SendGrid）
  2. 创建发送函数
  3. 配置 API Key
  4. 添加错误处理
success_criteria: 发送函数可用
output: email_service_config
on_success: NODE-08
```

### NODE-08: 预览与测试

```yaml
id: NODE-08
input: NODE-07.email_service_config
action: |
  生成预览和测试：
  1. 创建预览页面
  2. 发送测试邮件
  3. 检查各客户端兼容性
success_criteria: 主流客户端显示正常
output: test_result
on_success: NODE-FINAL
on_failure:
  action: 返回兼容性问题列表
  fallback: NODE-05
```

### NODE-FINAL: 交付与部署

```yaml
id: NODE-FINAL
type: end
input: NODE-08.test_result
action: |
  1. 输出完整模板代码
  2. 提供发送示例
  3. 说明环境变量配置
  4. 给出 A/B 测试建议
output: delivery_package
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "创建邮件模板"
- "React Email 组件"
- "营销邮件设计"
- "发送通知邮件"
- "配置邮件服务"
