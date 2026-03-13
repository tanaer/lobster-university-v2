---
name: mobile-app-analytics
description: >
  移动应用数据分析 - 集成 Firebase Analytics、Mixpanel、Amplitude 等平台，
  追踪用户行为、分析留存率、构建转化漏斗、生成数据报告。
  当用户需要：配置移动分析 SDK、设计事件追踪、分析用户行为、
  构建数据看板、优化转化漏斗时触发。
  触发词：移动分析、Firebase Analytics、用户行为、留存率、转化漏斗、事件追踪
version: 2.0.0
type: executable-sop
metadata:
  category: 数据分析
  module: 移动应用
  level: 中级
  estimated_time: 50分钟
  prerequisites: [移动应用项目, 分析平台账号]
  tools_required: [write, read, web_search]
---

# 移动应用分析

## 知识库

- Firebase Analytics：免费、与 Google 生态集成、实时数据
- Mixpanel：强大的漏斗和留存分析、用户分群
- Amplitude：产品分析、路径分析、实验平台
- 关键指标：DAU/MAU、留存率、LTV、ARPU、转化率
- 事件模型：事件名 + 参数，用户属性

---

## 工作流

### NODE-01: 需求与平台选择

```yaml
id: NODE-01
input: user.request
type: branch
action: |
  分析需求：
  1. 应用平台：iOS / Android / 跨平台(Flutter/React Native)
  2. 分析目标：用户获取 / 留存优化 / 转化提升 / 产品迭代
  3. 数据量预估：日活用户数
  4. 预算限制：免费 / 付费
  5. 技术栈：原生 / Flutter / React Native / Unity
  
  平台推荐：
  - 免费起步 + Google 生态 → Firebase
  - 深度漏斗分析 → Mixpanel
  - 产品实验 + 路径分析 → Amplitude
success_criteria: 确定分析平台和目标
output: {platform, app_platform, goals[], budget, tech_stack}
on_success: NODE-02
on_failure:
  action: 询问关键信息
  fallback: ABORT
```

### NODE-02: SDK 集成配置

```yaml
id: NODE-02
input: [NODE-01.platform, NODE-01.tech_stack]
action: |
  生成 SDK 集成代码：
  
  Firebase (Android/build.gradle):
  ```gradle
  implementation 'com.google.firebase:firebase-analytics:21.5.0'
  ```
  
  Firebase (iOS/Podfile):
  ```ruby
  pod 'FirebaseAnalytics'
  ```
  
  Firebase (Flutter):
  ```yaml
  dependencies:
    firebase_analytics: ^10.8.0
  ```
  
  Mixpanel (React Native):
  ```javascript
  import { Mixpanel } from 'mixpanel-react-native';
  const mixpanel = new Mixpanel('YOUR_TOKEN');
  mixpanel.init();
  ```
  
  提供配置文件和初始化代码
success_criteria: SDK 配置代码生成完成
output: {sdk_config, initialization_code, setup_steps[]}
on_success: NODE-03
on_failure:
  fallback: NODE-03
```

### NODE-03: 事件追踪设计

```yaml
id: NODE-03
input: [NODE-01.goals, NODE-01.platform]
action: |
  设计事件追踪方案：
  
  核心事件（必追踪）：
  - app_open：应用启动
  - screen_view：页面浏览
  - user_signup：用户注册
  - purchase：购买完成
  
  自定义事件（根据目标）：
  - 内容：content_view, content_share
  - 社交：friend_invite, message_sent
  - 电商：add_to_cart, checkout_started
  
  事件参数标准：
  - content_type, content_id
  - source, medium, campaign
  - value, currency
  
  生成事件追踪代码模板
success_criteria: 事件方案设计完成
output: {events_schema[], tracking_code_examples[]}
on_success: NODE-04
on_failure:
  fallback: ABORT
```

### NODE-04: 用户属性配置

```yaml
id: NODE-04
input: NODE-01.goals
action: |
  定义用户属性（User Properties）：
  
  基础属性：
  - user_id, signup_date, subscription_tier
  
  行为属性：
  - total_sessions, total_purchases, favorite_category
  
  技术属性：
  - app_version, os_version, device_model
  
  生成设置用户属性的代码：
  ```javascript
  // Firebase
  analytics.setUserProperties({
    subscription_tier: 'premium',
    favorite_category: 'sports'
  });
  
  // Mixpanel
  mixpanel.getPeople().set('subscription_tier', 'premium');
  ```
success_criteria: 用户属性方案完成
output: {user_properties[], property_code_examples[]}
on_success: NODE-05
on_failure:
  fallback: NODE-05
```

### NODE-05: 转化漏斗设计

```yaml
id: NODE-05
input: [NODE-01.goals, NODE-03.events_schema]
action: |
  设计关键转化漏斗：
  
  示例漏斗：
  1. 注册漏斗：app_open → tutorial_complete → signup_start → signup_complete
  2. 购买漏斗：product_view → add_to_cart → checkout_start → purchase_complete
  3. 留存漏斗：first_open → day_1_return → day_7_return → day_30_return
  
  每个漏斗包含：
  - 步骤名称和对应事件
  - 预期转化率基准
  - 优化建议
  
  生成漏斗配置代码/界面操作指南
success_criteria: 漏斗设计完成
output: {funnels[], funnel_configs[]}
on_success: NODE-06
on_failure:
  fallback: NODE-06
```

### NODE-06: 留存分析配置

```yaml
id: NODE-06
input: NODE-01.platform
action: |
  配置留存分析：
  
  留存类型：
  - N日留存：第N天返回应用的用户比例
  - 周留存 / 月留存
  - 自定义留存：完成特定事件后的留存
  
  配置步骤（Firebase）：
  1. 确保自动收集的 first_open 事件正常
  2. 在控制台查看留存报告
  3. 按用户属性细分留存
  
  配置步骤（Mixpanel）：
  1. 创建 Retention Report
  2. 选择起始事件和返回事件
  3. 设置时间范围和分析维度
  
  生成留存追踪代码（如需要自定义）
success_criteria: 留存分析配置完成
output: {retention_config, analysis_steps[]}
on_success: NODE-07
on_failure:
  fallback: NODE-07
```

### NODE-07: 数据验证测试

```yaml
id: NODE-07
input: [NODE-03.events_schema, NODE-04.user_properties]
action: |
  执行数据验证：
  
  1. DebugView 实时验证（Firebase）：
     - 启用 Debug 模式
     - 触发事件并实时查看
  
  2. 事件参数验证：
     - 检查参数类型正确
     - 验证必填参数存在
     - 确认参数值有效
  
  3. 数据完整性检查：
     - 无重复事件
     - 无丢失事件
     - 时间戳正确
  
  生成测试清单和验证代码
success_criteria: 数据验证通过
output: {validation_results, issues[]}
on_success: NODE-08
on_failure:
  action: 修复数据问题
  fallback: NODE-03
```

### NODE-08: 数据看板搭建

```yaml
id: NODE-08
input: [NODE-01.goals, NODE-05.funnels, NODE-06.retention_config]
action: |
  搭建数据看板：
  
  核心指标卡片：
  - DAU/MAU、新增用户、活跃用户
  - 平均使用时长、会话数
  - 留存率（1日/7日/30日）
  - 转化率、ARPU、LTV
  
  图表类型：
  - 趋势图：指标随时间变化
  - 漏斗图：转化步骤流失
  - 留存表：同期群分析
  - 分布图：用户行为分布
  
  生成看板配置指南和截图示例
success_criteria: 看板配置完成
output: {dashboard_config, chart_setups[]}
on_success: NODE-09
on_failure:
  fallback: NODE-09
```

### NODE-09: 分析报告模板

```yaml
id: NODE-09
input: [NODE-08.dashboard_config, NODE-01.goals]
action: |
  创建分析报告模板：
  
  周报模板：
  - 关键指标变化（环比/同比）
  - 漏斗转化分析
  - 留存趋势
  - 异常点标注
  
  月报模板：
  - 用户增长分析
  - 功能使用分析
  - 用户分群洞察
  - 下月优化建议
  
  生成报告模板文件（Markdown/Excel）
success_criteria: 报告模板创建完成
output: {report_templates[], metrics_definitions[]}
on_success: NODE-FINAL
on_failure:
  fallback: NODE-FINAL
```

### NODE-FINAL: 交付与培训

```yaml
id: NODE-FINAL
type: end
input: [NODE-09.report_templates, NODE-08.dashboard_config]
action: |
  输出总结：
  ✅ 分析平台：{platform} 配置完成
  📊 追踪事件：{event_count} 个
  👥 用户属性：{property_count} 个
  📈 转化漏斗：{funnel_count} 个
  📋 报告模板：已生成
  
  团队培训要点：
  1. 事件命名规范：蛇形命名，统一前缀
  2. 参数传递标准：类型一致，避免空值
  3. 版本发布流程：新增事件需文档化
  4. 数据查看权限：控制敏感数据访问
  
  后续优化建议：
  - 设置异常告警
  - 定期进行数据质量审计
  - A/B 测试集成
  
  询问用户是否需要其他平台的配置
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "配置 Firebase Analytics"
- "设计应用事件追踪"
- "分析用户留存率"
- "搭建转化漏斗"
- "移动应用数据分析"
