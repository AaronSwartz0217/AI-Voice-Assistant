const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// 服务静态文件
app.use(express.static(path.join(__dirname)));

// 根路径
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 存储所有连接的客户端
const clients = new Set();

// 存储消息历史（最多100条）
const messageHistory = [];
const MAX_MESSAGES = 100;

// 添加系统消息
function addSystemMessage(content) {
    const message = {
        type: 'system',
        content: content,
        timestamp: new Date().toISOString(),
        timeStr: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    messageHistory.push(message);
    if (messageHistory.length > MAX_MESSAGES) {
        messageHistory.shift();
    }
    return message;
}

// 添加用户消息
function addUserMessage(clientId, content, contentType = 'text', fileName = '') {
    const message = {
        type: 'user',
        clientId: clientId,
        content: content,
        contentType: contentType,
        fileName: fileName,
        timestamp: new Date().toISOString(),
        timeStr: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    messageHistory.push(message);
    if (messageHistory.length > MAX_MESSAGES) {
        messageHistory.shift();
    }
    return message;
}

// 广播消息给所有客户端
function broadcast(message) {
    const msgWithOnline = Object.assign({}, message, { onlineCount: clients.size });
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msgWithOnline));
        }
    });
}

// 生成客户端ID
function generateClientId() {
    return 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// WebSocket 连接处理
wss.on('connection', (ws, req) => {
    const clientId = generateClientId();
    ws.clientId = clientId;
    clients.add(ws);

    const timeStr = new Date().toLocaleTimeString('zh-CN');
    console.log('[' + timeStr + '] Client connected: ' + clientId + ', online: ' + clients.size);

    // 发送欢迎消息和历史消息
    const welcomeMsg = addSystemMessage('欢迎加入聊天室！');
    ws.send(JSON.stringify({ type: 'history', messages: messageHistory, onlineCount: clients.size }));
    broadcast(Object.assign({}, welcomeMsg, { onlineCount: clients.size }));

    // 接收消息
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            if (message.type === 'message' && message.content) {
                const contentType = message.contentType || 'text';
                const fileName = message.fileName || '';
                const userMsg = addUserMessage(clientId, message.content, contentType, fileName);
                broadcast(userMsg);
                
                if (contentType === 'image') {
                    console.log('[' + new Date().toLocaleTimeString('zh-CN') + '] Image from ' + clientId + ': ' + fileName);
                } else if (contentType === 'file') {
                    console.log('[' + new Date().toLocaleTimeString('zh-CN') + '] File from ' + clientId + ': ' + fileName);
                } else {
                    console.log('[' + new Date().toLocaleTimeString('zh-CN') + '] Message from ' + clientId + ': ' + message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''));
                }
            }
        } catch (error) {
            console.error('[' + new Date().toLocaleTimeString('zh-CN') + '] Message parse error:', error.message);
        }
    });

    // 连接关闭
    ws.on('close', () => {
        clients.delete(ws);
        const timeStr = new Date().toLocaleTimeString('zh-CN');
        console.log('[' + timeStr + '] Client disconnected: ' + clientId + ', online: ' + clients.size);
        
        if (clients.size > 0) {
            const leaveMsg = addSystemMessage('有用户离开聊天室，当前在线 ' + clients.size + ' 人');
            broadcast(leaveMsg);
        }
    });

    // 错误处理
    ws.on('error', (error) => {
        console.error('[' + new Date().toLocaleTimeString('zh-CN') + '] WebSocket error:', error.message);
    });
});

// 启动服务器
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('WebSocket Chat Server Started');
    console.log('HTTP: http://localhost:' + PORT);
    console.log('WebSocket: ws://localhost:' + PORT);
    console.log('Press Ctrl+C to stop');
    console.log('='.repeat(60));
});
