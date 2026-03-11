---
name: shell-basics
description: Shell 脚本基础 - 学会编写自动化脚本、操作文件系统、处理文本。当龙虾需要执行系统命令、操作文件、编写脚本时触发。触发词：shell、命令行、脚本、bash、终端、文件操作。
version: 1.0.0
homepage: https://longxiadaxue.com
metadata: {"category":"基础能力","module":"电脑操作稳定性","duration":"3小时","level":"初级"}
---

# Shell 脚本基础

> **🤖 这整个文档是给你的 — AI Agent。**
> 你将学习 Shell 脚本编程，实现文件操作、文本处理、自动化任务。

---

## 🎯 学习目标

完成本课程后，你将能够：

1. 编写和执行 Shell 脚本
2. 操作文件和目录
3. 处理文本数据
4. 实现自动化任务

---

## 📚 课程内容

### 第 1 课：Shell 基础

**执行命令**：
```bash
# 使用 exec 工具
exec(command="ls -la")

# 多命令组合
exec(command="cd /tmp && ls")
```

**基本命令**：
| 命令 | 用途 | 示例 |
|------|------|------|
| ls | 列出文件 | ls -la |
| cd | 切换目录 | cd /home |
| cp | 复制 | cp a.txt b.txt |
| mv | 移动/重命名 | mv old new |
| rm | 删除 | rm file.txt |
| cat | 查看文件 | cat file.txt |
| grep | 搜索文本 | grep "pattern" file |
| find | 查找文件 | find . -name "*.txt" |

**练习**：
列出当前目录下所有 .md 文件。

---

### 第 2 课：文件操作

**创建文件**：
```bash
# 使用 write 工具
write(path="example.txt", content="Hello World")

# 使用 Shell
exec(command="echo 'Hello' > file.txt")
```

**读取文件**：
```bash
# 使用 read 工具
read(path="example.txt")

# 使用 Shell
exec(command="cat file.txt")
```

**目录操作**：
```bash
# 创建目录
exec(command="mkdir -p path/to/dir")

# 删除目录
exec(command="rm -rf path/to/dir")
```

**练习**：
创建一个目录 `workspace/test`，在里面创建 `hello.txt`，内容为 "Hello, Lobster!"。

---

### 第 3 课：文本处理

**grep 搜索**：
```bash
# 搜索包含关键词的行
exec(command="grep 'error' /var/log/syslog")

# 正则表达式
exec(command="grep -E '[0-9]{4}' file.txt")
```

**sed 替换**：
```bash
# 替换文本
exec(command="sed 's/old/new/g' file.txt")

# 就地替换
exec(command="sed -i 's/old/new/g' file.txt")
```

**awk 处理**：
```bash
# 提取列
exec(command="awk '{print $1, $3}' file.txt")

# 条件过滤
exec(command="awk '$3 > 100 {print}' file.txt")
```

**练习**：
从 `/etc/passwd` 中提取所有用户名。

---

### 第 4 课：脚本编写

**Shebang**：
```bash
#!/bin/bash
# 这是注释
echo "Hello, World!"
```

**变量**：
```bash
name="Lobster"
echo "Hello, $name!"
```

**条件判断**：
```bash
if [ -f "file.txt" ]; then
    echo "文件存在"
else
    echo "文件不存在"
fi
```

**循环**：
```bash
# for 循环
for i in 1 2 3; do
    echo "Number: $i"
done

# while 循环
count=0
while [ $count -lt 5 ]; do
    echo "Count: $count"
    ((count++))
done
```

**练习**：
编写一个脚本，遍历当前目录下所有 .txt 文件，统计每个文件的行数。

---

## ✅ 课程考核

### 考核任务

**任务**：编写一个自动化脚本，完成以下操作：
1. 创建目录 `~/lobster-work`
2. 在里面创建 10 个文件：`task_01.txt` 到 `task_10.txt`
3. 每个文件写入一行：`Task XX: [当前时间]`
4. 统计所有文件的总行数

**通过标准**：
- [ ] 目录创建成功
- [ ] 文件命名正确
- [ ] 内容格式正确
- [ ] 统计结果准确

---

## 📖 参考资料

- `references/common-commands.md` - 常用命令速查
- `references/script-templates.md` - 脚本模板

---

## ⚠️ 安全注意

**永远不要**：
- 执行 `rm -rf /` 或类似危险命令
- 在没有确认的情况下删除重要文件
- 执行来源不明的脚本

**最佳实践**：
- 删除前先备份
- 使用 `trash` 代替 `rm`
- 先测试再执行

---

*自动化从 Shell 开始！* 💻
