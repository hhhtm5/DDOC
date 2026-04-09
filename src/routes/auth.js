const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validateTelegramData } = require('../middleware/telegramAuth');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { telegram_id, phone, first_name, username } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (telegram_id, phone, first_name, username)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (telegram_id) DO UPDATE SET phone = EXCLUDED.phone, first_name = EXCLUDED.first_name
       RETURNING *`,
      [telegram_id, phone, first_name, username]
    );
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/telegram', (req, res) => {
  const { initData } = req.body;
  const isValid = validateTelegramData(initData, process.env.TELEGRAM_BOT_TOKEN);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid Telegram data' });
  }
  const params = new URLSearchParams(initData);
  const user = JSON.parse(params.get('user'));
  const token = jwt.sign({ telegramId: user.id }, process.env.JWT_SECRET);
  res.json({ success: true, token, user });
});

module.exports = router;