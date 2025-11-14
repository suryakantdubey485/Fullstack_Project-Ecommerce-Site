import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Admin login
router.post('/login', async (req, res) => {
  try {
    const adminData = await fs.readFile(path.join(__dirname, '../data/admin.json'), 'utf-8');
    const admin = JSON.parse(adminData);
    
    const { username, password } = req.body;
    
    if (username === admin.username && password === admin.password) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
