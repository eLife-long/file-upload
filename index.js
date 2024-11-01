const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const FileStorage = require('./fileStorage');

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });
const fileStorage = new FileStorage();

app.use(express.static('public'));
app.use(express.json());

// 获取文件列表
app.get('/api/files', async (req, res) => {
  try {
    const files = await fileStorage.listFiles();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: '获取文件列表失败' });
  }
});

// 上传文件
app.post('/api/files', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有文件上传' });
    }
    res.json({ message: '文件上传成功' });
  } catch (err) {
    res.status(500).json({ error: '文件上传失败' });
  }
});

// 读取文件
app.get('/api/files/:filename', async (req, res) => {
  try {
    const filePath = path.join('storage', req.params.filename);
    const content = await fs.readFile(filePath);
    res.send(content);
  } catch (err) {
    res.status(404).json({ error: '文件不存在' });
  }
});

// 删除文件
app.delete('/api/files/:filename', async (req, res) => {
  try {
    const success = await fileStorage.deleteFile(req.params.filename);
    if (success) {
      res.json({ message: '文件删除成功' });
    } else {
      res.status(404).json({ error: '文件不存在' });
    }
  } catch (err) {
    res.status(500).json({ error: '文件删除失败' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});