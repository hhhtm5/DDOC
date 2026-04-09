import { useState } from 'react';
import BackButton from '../components/BackButton';
import api from '../api';
import { useTelegram } from '../hooks/useTelegram';

export default function Question() {
  const { tg, user } = useTelegram();
  const [text, setText] = useState('');
  const [contact, setContact] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    const clientName = user?.first_name || 'Клиент';
    const clientUsername = user?.username || '';
    const message = `Вопрос: ${text}\nКонтакты: ${contact || 'не указаны'}\nОт: ${clientName} (@${clientUsername})`;
    try {
      await api.post('/question', { question: text, contact, clientName, clientUsername });
      alert('Вопрос отправлен!');
      window.Telegram.WebApp.close();
    } catch (err) {
      console.error(err);
      alert('Ошибка отправки');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <BackButton />
      <h2>Задать вопрос</h2>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Ваш вопрос..." rows={4} style={{ width: '100%', padding: 12 }} />
      <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Телефон или @username" style={{ width: '100%', padding: 12, marginTop: 12 }} />
      <button onClick={handleSend} style={{ marginTop: 20, padding: 16, background: '#2AABEE', color: '#fff', border: 'none', borderRadius: 12, width: '100%' }}>
        Отправить
      </button>
    </div>
  );
}