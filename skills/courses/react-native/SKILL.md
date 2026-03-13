---
name: react-native
description: React Native 移动开发 - 跨平台组件、导航系统、原生模块、性能优化。当龙虾需要开发移动应用、创建跨平台 App、集成原生功能时触发。触发词：React Native、移动应用、App 开发、跨平台、iOS Android。
version: 2.0.0
type: executable-sop
metadata:
  category: 移动开发
  module: React Native
  level: 中级
  estimated_time: 60分钟
  prerequisites: [react-19-engineering]
  tools_required: [write, read, exec]
---

# React Native 移动开发

## 知识库

- 核心组件：View、Text、Image、ScrollView、FlatList
- 导航：React Navigation（Stack、Tab、Drawer）
- 样式：StyleSheet、Flexbox、响应式单位
- 原生模块：Native Modules、Native UI Components
- 性能：FlashList、Reanimated、Hermes 引擎

---

## 工作流

### NODE-01: App 需求分析

```yaml
id: NODE-01
input: user.request
action: |
  解析 App 需求：
  - 目标平台（iOS/Android/双端）
  - 核心功能列表
  - UI 风格参考
  - 是否需要原生功能
success_criteria: 功能列表 >= 3 条
output: app_spec {platforms, features[], style, native_needs}
on_success: NODE-02
on_failure:
  action: 询问 App 的核心功能
  fallback: ABORT
```

### NODE-02: 项目初始化

```yaml
id: NODE-02
input: NODE-01.app_spec
action: |
  初始化 React Native 项目：
  1. npx react-native init 或 Expo init
  2. 配置 TypeScript
  3. 设置目录结构
  4. 安装核心依赖
success_criteria: 项目可启动
output: project_initialized
on_success: NODE-03
```

### NODE-03: 导航系统配置

```yaml
id: NODE-03
input: NODE-01.app_spec.features
action: |
  配置 React Navigation：
  1. 安装 @react-navigation/native
  2. 创建 Stack Navigator
  3. 配置 Tab Navigator（如需要）
  4. 设置路由配置文件
success_criteria: 导航可跳转
output: navigation_setup
on_success: NODE-04
```

### NODE-04: 基础组件开发

```yaml
id: NODE-04
type: loop
input: NODE-01.app_spec.features
each: feature
action: |
  为每个功能开发组件：
  1. 创建屏幕组件
  2. 添加样式
  3. 连接导航
  4. 添加基础交互
max_iterations: 10
output: screen_components[]
on_complete: NODE-05
```

### NODE-05: 原生模块检查

```yaml
id: NODE-05
type: branch
input: NODE-01.app_spec.native_needs
branches:
  - condition: native_needs.length > 0
    target: NODE-06-NATIVE
  - default: NODE-07
output: native_check_result
```

### NODE-06-NATIVE: 原生模块集成

```yaml
id: NODE-06-NATIVE
type: loop
input: NODE-01.app_spec.native_needs
each: native_feature
action: |
  集成原生功能：
  - 相机：react-native-camera
  - 定位：react-native-geolocation-service
  - 推送：@react-native-firebase/messaging
  - 支付：react-native-iap
  - 生物识别：react-native-biometrics
max_iterations: 5
output: native_modules[]
on_complete: NODE-07
on_failure:
  action: 检查原生依赖安装
  fallback: NODE-07
```

### NODE-07: 状态管理配置

```yaml
id: NODE-07
input: NODE-04.screen_components
action: |
  配置状态管理：
  1. 选择方案（Zustand/Redux Toolkit）
  2. 创建 store
  3. 连接组件
  4. 配置持久化（AsyncStorage）
success_criteria: 状态可共享和持久化
output: state_management
on_success: NODE-08
```

### NODE-08: 性能优化

```yaml
id: NODE-08
input: project_files
action: |
  执行性能优化：
  1. FlatList → FlashList 替换
  2. 图片优化（resize、cache）
  3. 添加 Reanimated 动画
  4. 启用 Hermes 引擎
success_criteria: 滚动流畅，启动快
output: optimization_report
on_success: NODE-09
```

### NODE-09: 构建与测试

```yaml
id: NODE-09
input: optimized_project
action: |
  构建测试版本：
  1. iOS: npx react-native run-ios
  2. Android: npx react-native run-android
  3. 检查控制台错误
  4. 测试核心功能
success_criteria: 构建成功，无崩溃
output: build_result
on_success: NODE-FINAL
on_failure:
  action: 返回构建错误
  fallback: NODE-02
```

### NODE-FINAL: 交付与部署指南

```yaml
id: NODE-FINAL
type: end
input: NODE-09.build_result
action: |
  1. 输出项目结构
  2. 提供运行命令
  3. 说明打包流程（App Store/Play Store）
  4. 给出后续优化建议
output: delivery_package
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "创建 React Native App"
- "开发移动应用"
- "React Native 导航配置"
- "集成原生模块"
- "跨平台 App 开发"
