const fs = require('fs').promises;
const path = require('path');

class FileStorage {
  constructor(storageDir = 'storage') {
    this.storageDir = storageDir;
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
    } catch (err) {
      console.error('初始化存储目录失败:', err);
    }
  }

  async writeFile(filename, content) {
    try {
      const filePath = path.join(this.storageDir, filename);
      await fs.writeFile(filePath, content);
      return true;
    } catch (err) {
      console.error('写入文件失败:', err);
      return false;
    }
  }

  async readFile(filename) {
    try {
      const filePath = path.join(this.storageDir, filename);
      return await fs.readFile(filePath);
    } catch (err) {
      console.error('读取文件失败:', err);
      return null;
    }
  }

  async deleteFile(filename) {
    try {
      const filePath = path.join(this.storageDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch (err) {
      console.error('删除文件失败:', err);
      return false;
    }
  }

  async listFiles() {
    try {
      const files = await fs.readdir(this.storageDir);
      return files;
    } catch (err) {
      console.error('列出文件失败:', err);
      return [];
    }
  }
}

module.exports = FileStorage;