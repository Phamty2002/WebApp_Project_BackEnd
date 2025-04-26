// src/controllers/loginController.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const util = require('util');

// Biến db.query thành hàm promise
const query = util.promisify(db.query).bind(db);

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username và password là bắt buộc.' });
    }

    // 2. Lấy user từ DB
    const rows = await query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const user = rows[0];

    // 3. So sánh mật khẩu
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 4. Kiểm tra JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ Missing JWT_SECRET in .env');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    // 5. Tạo token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // 6. Trả về response
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    console.error('🔥 loginUser error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
