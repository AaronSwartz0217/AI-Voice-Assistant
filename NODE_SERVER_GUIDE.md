# Node.js 服务器部署指南

## 一、前提条件

### 安装 Node.js

1. **下载 Node.js**
   - 访问官网：https://nodejs.org/
   - 下载 LTS（长期支持）版本
   - 运行安装程序，按照提示安装

2. **验证安装**
   打开命令提示符，执行：
   ```bash
   node --version
   npm --version
   ```

## 二、安装依赖

打开命令提示符，进入网站目录：

```bash
cd "c:\Users\29717\Desktop\大创网站"
```

安装所需依赖：

```bash
npm init -y
npm install express ws
```

## 三、启动服务器

### 方法1：直接启动

```bash
node server.js
```

### 方法2：使用 npm 脚本（推荐）

在 `package.json` 中添加启动脚本后：

```bash
npm start
```

## 四、成功启动后的输出

```
==================================================
服务器已启动
HTTP 访问：http://localhost:8080
WebSocket 地址：ws://localhost:8080
按 Ctrl+C 停止服务器
==================================================
```

## 五、测试功能

### 1. 访问主页

在浏览器中打开：
```
http://localhost:8080
```

### 2. 测试聊天功能

访问：
```
http://localhost:8080/apply.html
```

- 点击"连接服务器"按钮
- 输入消息并发送
- 服务器会自动回复

## 六、停止服务器

在运行服务器的命令窗口中，按 `Ctrl + C`

## 七、优势对比

### Node.js vs Python

| 特性 | Node.js | Python |
|------|---------|--------|
| 语言统一 | 前后端都用 JavaScript | 前端 JS，后端 Python |
| 性能 | 高并发，非阻塞 I/O | 相对较慢 |
| 生态 | npm 包丰富 | pip 包丰富 |
| 学习曲线 | 前端开发者友好 | 需要学习 Python |
| 实时通信 | 原生支持 WebSocket | 需要额外库 |

### 为什么选择 Node.js？

1. **技术栈统一**：前后端都使用 JavaScript，降低开发成本
2. **高性能**：事件驱动、非阻塞 I/O，适合实时应用
3. **丰富的生态**：npm 拥有大量优质包
4. **原生 WebSocket 支持**：无需额外框架
5. **易于部署**：一个命令启动所有服务

## 八、常见问题

### 问题1：找不到 node 命令

**错误信息：**
```
'node' 不是内部或外部命令
```

**解决方法：**
- 重新安装 Node.js
- 确保勾选"Add to PATH"选项
- 重启命令提示符

### 问题2：模块未找到

**错误信息：**
```
Error: Cannot find module 'express'
```

**解决方法：**
```bash
npm install express ws
```

### 问题3：端口被占用

**错误信息：**
```
Error: listen EADDRINUSE: address already in use :::8080
```

**解决方法：**
- 关闭占用 8080 端口的程序
- 或修改 server.js 中的端口号

### 问题4：无法访问网页

**可能原因：**
1. 服务器未启动
2. 端口号错误
3. 防火墙阻止

**排查步骤：**
1. 确认服务器正在运行
2. 检查控制台输出
3. 尝试访问 http://localhost:8080

## 九、package.json 示例

```json
{
  "name": "ai-voice-assistant",
  "version": "1.0.0",
  "description": "人工智能语音小助手网站",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "keywords": ["ai", "voice", "assistant"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "ws": "^8.14.2"
  }
}
```

---

**创建日期**：2026 年 5 月  
**适用环境**：Windows 10/11 + Node.js 16+
