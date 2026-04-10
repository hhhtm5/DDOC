import { useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import BackButton from '../components/BackButton';

export default function Question() {
  const { tg, user } = useTelegram();
  const [text, setText] = useState('');
  const [contact, setContact] = useState('');

  const handleSend = () => {
    if (!text.trim()) return alert('Введите вопрос');

    const msg = `Вопрос от ${user?.first_name || 'клиента'} (@${user?.username || 'нет username'}):\n\n${text}\n\nКонтакты: ${contact || 'не указаны'}`;
    const url = `https://t.me/vkuve?text=${encodeURIComponent(msg)}`;
    
    if (tg && typeof tg.openTelegramLink === 'function') {
      tg.openTelegramLink(url);
      tg.close();
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <BackButton />
      <h2 style={{ fontSize: 28, marginBottom: 24 }}>Задать вопрос</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Опишите ваш вопрос..."
        rows={6}
        style={{
          padding: 18,
          width: '100%',
          fontSize: 18,
          border: '1px solid #ccc',
          borderRadius: 16,
          marginBottom: 20,
          resize: 'vertical',
        }}
      />
      <input
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Телефон или @username для связи"
        style={{
          padding: 18,
          width: '100%',
          fontSize: 18,
          border: '1px solid #ccc',
          borderRadius: 16,
          marginBottom: 30,
        }}
      />
      <button
        onClick={handleSend}
        style={{
          padding: 20,
          background: '#2AABEE',
          color: '#fff',
          border: 'none',
          borderRadius: 16,
          width: '100%',
          fontSize: 22,
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Отправить вопрос
      </button>
    </div>
  );
}
