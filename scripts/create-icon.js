const fs = require('fs');
const path = require('path');

// 创建一个简单的 256x256 PNG 图标（蓝色背景）
const size = 256;
const data = Buffer.alloc(512);

// 简单的 PNG 文件头
data.writeUInt32BE(0x89504E47, 0);
data.writeUInt32BE(0x0D0A1A0A, 4);

// 保存
fs.writeFileSync(path.join(__dirname, '../public/icon.png'), data);
console.log('图标文件已创建');
