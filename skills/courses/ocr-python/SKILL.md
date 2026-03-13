---
name: ocr-python
description: >
  OCR 文字识别 - 使用 PaddleOCR 从 PDF 和图片中提取中英文文本。
  当用户需要：识别图片文字、提取 PDF 扫描件内容、处理发票合同文档、
  批量 OCR 处理时触发。
  触发词：OCR、文字识别、图片转文字、PDF 提取、扫描件识别、发票识别
version: 2.0.0
type: executable-sop
metadata:
  category: 数据处理
  module: 文档识别
  level: 初级
  estimated_time: 30分钟
  prerequisites: [Python 3.7+]
  tools_required: [exec, write, read]
---

# OCR 文字识别

## 知识库

- `PaddleOCR` - 百度开源 OCR 框架，支持中英文
- `PyMuPDF (fitz)` - PDF 处理，提取图片
- `PIL/Pillow` - 图像预处理
- 语言代码：'ch'(中文), 'en'(英文), 'ch_sim'(简体)
- 输出格式：[[[box], (text, confidence)], ...]

---

## 工作流

### NODE-01: 需求与输入分析

```yaml
id: NODE-01
input: user.request
type: branch
action: |
  解析用户需求：
  1. 输入类型：图片文件 / PDF 文件 / 图片 URL
  2. 文件格式：.jpg / .png / .pdf / .tiff
  3. 语言类型：中文 / 英文 / 混合
  4. 处理模式：单文件 / 批量处理
  5. 输出格式：纯文本 / JSON / 结构化数据
  6. 特殊需求：表格识别 / 版面分析 / 手写识别
  
  验证文件存在性和可读性
success_criteria: 明确输入和输出要求
output: {input_files[], file_type, language, mode, output_format, special_needs[]}
on_success: NODE-02
on_failure:
  action: 询问缺失信息或文件路径
  fallback: ABORT
```

### NODE-02: 环境检查与安装

```yaml
id: NODE-02
input: NODE-01.language
action: |
  检查并安装依赖：
  
  1. 检查 Python 版本：python3 --version (需 >= 3.7)
  2. 检查 paddlepaddle：pip show paddlepaddle
  3. 检查 paddleocr：pip show paddleocr
  4. 检查 PyMuPDF：pip show PyMuPDF
  
  如未安装，执行：
  ```bash
  pip3 install paddlepaddle paddleocr PyMuPDF Pillow
  ```
  
  对于 GPU 加速（可选）：
  ```bash
  pip3 install paddlepaddle-gpu
  ```
  
  验证安装：python3 -c "from paddleocr import PaddleOCR; print('OK')"
success_criteria: 所有依赖安装成功
output: {install_status, versions{}}
on_success: NODE-03
on_failure:
  action: 检查 pip 和网络连接
  fallback: ABORT
```

### NODE-03: 初始化 OCR 引擎

```yaml
id: NODE-03
input: NODE-01.language
action: |
  初始化 PaddleOCR：
  ```python
  from paddleocr import PaddleOCR
  
  ocr = PaddleOCR(
    lang='ch',           # 语言: ch/en/ch_sim
    use_angle_cls=True,  # 方向分类
    use_gpu=False,       # CPU/GPU
    show_log=False       # 静默日志
  )
  ```
  
  语言选择：
  - 纯中文 → 'ch'
  - 纯英文 → 'en'
  - 中英文混合 → 'ch'
  - 繁体中文 → 'ch_tra'
  
  首次运行会自动下载模型文件
success_criteria: OCR 引擎初始化成功
output: {ocr_instance, model_downloaded}
on_success: NODE-04
on_failure:
  action: 检查磁盘空间和网络
  fallback: ABORT
```

### NODE-04: 图片预处理（可选）

```yaml
id: NODE-04
input: [NODE-01.input_files, NODE-01.special_needs]
type: branch
action: |
  根据需求执行预处理：
  
  1. 图像增强：
     - 调整对比度和亮度
     - 去噪处理
     - 二值化（针对扫描件）
  
  2. 图像变换：
     - 旋转校正（自动检测角度）
     - 裁剪边缘空白
     - 调整分辨率（推荐 300 DPI）
  
  3. 批量预处理脚本生成
  
  如果输入质量良好，可跳过此步骤
success_criteria: 预处理完成或跳过
output: {processed_files[], preprocessing_applied}
on_success: NODE-05
on_failure:
  fallback: NODE-05
```

### NODE-05: 执行 OCR 识别

```yaml
id: NODE-05
input: [NODE-03.ocr_instance, NODE-04.processed_files, NODE-01.mode]
type: loop
action: |
  对每个文件执行 OCR：
  
  图片文件：
  ```python
  result = ocr.ocr(image_path, cls=True)
  ```
  
  PDF 文件：
  ```python
  import fitz
  pdf = fitz.open(pdf_path)
  for page_num in range(len(pdf)):
    page = pdf[page_num]
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
    img_path = f"temp_page_{page_num}.png"
    pix.save(img_path)
    result = ocr.ocr(img_path, cls=True)
  ```
  
  提取结果：
  - 文本内容
  - 置信度分数
  - 边界框坐标
max_iterations: 100
output: {ocr_results[{file, page?, text, confidence, boxes[]}]}
on_complete: NODE-06
```

### NODE-06: 结果后处理

```yaml
id: NODE-06
input: [NODE-05.ocr_results, NODE-01.output_format, NODE-01.special_needs]
action: |
  根据输出格式处理结果：
  
  纯文本格式：
  - 按阅读顺序拼接文本
  - 去除多余空格和换行
  
  JSON 格式：
  ```json
  {
    "file": "example.pdf",
    "pages": [
      {
        "page_num": 1,
        "text": "...",
        "blocks": [
          {"text": "...", "confidence": 0.95, "box": [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]}
        ]
      }
    ]
  }
  ```
  
  结构化数据（发票/合同）：
  - 正则提取关键字段
  - 表格结构识别
  - 键值对映射
success_criteria: 结果格式化完成
output: {formatted_output, output_file_path}
on_success: NODE-07
on_failure:
  action: 检查格式转换逻辑
  fallback: NODE-08
```

### NODE-07: 质量验证

```yaml
id: NODE-07
input: NODE-06.formatted_output
type: branch
action: |
  验证 OCR 质量：
  
  1. 置信度检查：
     - 平均置信度 > 0.8 为良好
     - 低置信度片段标记待人工复核
  
  2. 完整性检查：
     - 文本长度是否合理
     - 关键字段是否识别
  
  3. 格式检查：
     - 输出格式是否符合预期
     - 编码是否正确（UTF-8）
  
  生成质量报告
success_criteria: 质量检查完成
output: {quality_report{avg_confidence, low_confidence_blocks[], completeness}}
on_success: NODE-08
on_failure:
  fallback: NODE-08
```

### NODE-08: 输出保存

```yaml
id: NODE-08
input: [NODE-06.formatted_output, NODE-07.quality_report]
action: |
  保存结果到文件：
  
  文本文件：
  - {filename}.txt
  
  JSON 文件：
  - {filename}.json（带格式化和缩进）
  
  Markdown 文件：
  - {filename}.md（带原始图片引用和识别文本）
  
  CSV 文件（表格数据）：
  - {filename}.csv
  
  输出文件路径列表
success_criteria: 文件保存成功
output: {output_files[], file_sizes[]}
on_success: NODE-FINAL
on_failure:
  action: 检查目录权限和磁盘空间
  fallback: ABORT
```

### NODE-FINAL: 结果汇报

```yaml
id: NODE-FINAL
type: end
input: [NODE-08.output_files, NODE-07.quality_report, NODE-05.ocr_results]
action: |
  输出总结：
  ✅ OCR 处理完成
  📄 处理文件：{file_count} 个
  📝 识别文本：{total_chars} 字符
  📊 平均置信度：{avg_confidence}%
  💾 输出文件：{output_files}
  
  质量提示：
  - 高置信度片段可直接使用
  - 低置信度片段建议人工复核
  
  后续建议：
  1. 对于固定格式文档，可训练专用模型提升准确率
  2. 批量处理建议使用多线程加速
  3. 重要文档建议保留原始图片备查
  
  询问用户是否需要：
  - 调整识别参数重新处理
  - 提取特定结构化数据
  - 处理更多文件
output: user_response
```

---

## 快捷触发

用户说这些词时直接执行本工作流：
- "识别这张图片的文字"
- "提取 PDF 中的文字"
- "OCR 扫描件"
- "图片转文字"
- "发票识别"
