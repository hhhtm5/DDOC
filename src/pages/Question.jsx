import { useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import BackButton from '../components/BackButton';
import api from '../api';

export default function Question() {
  const { tg, user } = useTelegram();
  const [text, setText] = useState('');
  const [contact, setContact] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await api.post('/question', {
        question: text,
        contact,
        clientName: user?.first_name
      });
      tg.close();
    } catch (e) {}
  };

  return (
    <div style={{ padding: 20 }}>
      <BackButton />
      <h2>Задать вопрос</h2>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Ваш вопрос..." rows={4} style={inputStyle} />
      <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Телефон или @username" style={inputStyle} />
      <button onClick={handleSend} style={btnStyle}>Отправить</button>
    </div>
  );
}

const btnStyle = { padding: 16, background: '#2AABEE', color: '#fff', border: 'none', borderRadius: 12, width: '100%', marginTop: 20 };
const inputStyle = { padding: 12, width: '100%', marginBottom: 12, border: '1px solid #ccc', borderRadius: 8 };
