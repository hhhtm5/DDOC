const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MANAGER_CHAT_ID = process.env.MANAGER_CHAT_ID;

async function sendManagerNotification(text) {
  await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: MANAGER_CHAT_ID,
    text,
    parse_mode: 'HTML'
  });
}

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/services', async (req, res) => {
  const services = [
    { id: 1, name: 'Запись вокала', price: 2500, duration: 60 },
    { id: 2, name: 'Сведение', price: 5000, duration: 120 },
    { id: 3, name: 'Мастеринг', price: 3000, duration: 60 }
  ];
  res.json(services);
});

router.post('/', authenticate, async (req, res) => {
  const { service_id, date, time } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO bookings (user_id, service_id, booking_date, booking_time, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [req.userId, service_id, date, time]
    );
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  }
});

router.post('/rent/book', async (req, res) => {
  const { date, time, tariffId, clientName, clientUsername, phone } = req.body;
  const tariffs = { 1: 'Без звукорежиссёра (699 ₽)', 2: 'Со звукорежиссёром (999 ₽)', 3: 'Ночной тариф (499 ₽)' };
  const tariffName = tariffs[tariffId] || 'Неизвестно';
  const msg = `🔔 <b>Новая аренда!</b>\nДата: ${date}\nВремя: ${time}\nТариф: ${tariffName}\nКлиент: ${clientName}${clientUsername ? ` (@${clientUsername})` : ''}\nТелефон: ${phone || 'не указан'}`;
  await sendManagerNotification(msg);
  res.json({ success: true });
});

router.post('/packages/order', async (req, res) => {
  const { packageName, price, clientName, clientUsername, phone } = req.body;
  const msg = `🛒 <b>Новый заказ пакета!</b>\nПакет: ${packageName} (${price} ₽)\nКлиент: ${clientName}${clientUsername ? ` (@${clientUsername})` : ''}\nТелефон: ${phone || 'не указан'}`;
  await sendManagerNotification(msg);
  res.json({ success: true });
});

router.post('/mixing/request', async (req, res) => {
  const { tariffName, price, clientName, clientUsername, phone } = req.body;
  const msg = `🎚️ <b>Новая заявка на сведение!</b>\nТариф: ${tariffName} (${price} ₽)\nКлиент: ${clientName}${clientUsername ? ` (@${clientUsername})` : ''}\nТелефон: ${phone || 'не указан'}`;
  await sendManagerNotification(msg);
  res.json({ success: true });
});

router.post('/question', async (req, res) => {
  const { question, contact, clientName, clientUsername } = req.body;
  const msg = `💬 <b>Вопрос от клиента</b>\nОт: ${clientName}${clientUsername ? ` (@${clientUsername})` : ''}\nВопрос: ${question}\nКонтакты: ${contact || 'не указаны'}`;
  await sendManagerNotification(msg);
  res.json({ success: true });
});

module.exports = router;