import { useState } from 'react';
import BackButton from '../components/BackButton';
import api from '../api';
import { useTelegram } from '../hooks/useTelegram';

const tariffs = [
  { id: 1, name: 'Basic', price: 2990 },
  { id: 2, name: 'Premier', price: 5990 },
  { id: 3, name: 'Ultima', price: 7990 },
  { id: 4, name: 'Трек "Под ключ"', price: 9990 }
];

export default function Mixing() {
  const { tg, user } = useTelegram();
  const [selected, setSelected] = useState(null);
  const [phone, setPhone] = useState('');

  const handleOrder = async () => {
    if (!selected) return;
    const clientName = user?.first_name || 'Клиент';
    const clientUsername = user?.username || '';
    const message = `Здравствуйте! Хочу заказать сведение: ${selected.name} (${selected.price} ₽). Меня зовут ${clientName}, телефон ${phone}.`;
    const chatUrl = `https://t.me/whomixdrugs?text=${encodeURIComponent(message)}`;
    window.Telegram.WebApp.openTelegramLink(chatUrl);
    try {
      await api.post('/mixing/request', {
        tariffName: selected.name,
        price: selected.price,
        clientName,
        clientUsername,
        phone
      });
    } catch (err) {
      console.error(err);
    }
    window.Telegram.WebApp.close();
  };

  return (
    <div style={{ padding: 20 }}>
      <BackButton />
      <h2>Сведение / Под ключ</h2>
      {tariffs.map(t => (
        <div key={t.id} style={{ border: '1px solid #ccc', borderRadius: 12, padding: 16, marginBottom: 12, cursor: 'pointer', background: selected?.id === t.id ? '#e0f0ff' : '#fff' }} onClick={() => setSelected(t)}>
          <strong>{t.name}</strong> — {t.price} ₽
        </div>
      ))}
      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ваш телефон" style={{ padding: 12, width: '100%', marginTop: 16 }} />
      <button onClick={handleOrder} disabled={!selected} style={{ marginTop: 20, padding: 16, background: selected ? '#2AABEE' : '#ccc', color: '#fff', border: 'none', borderRadius: 12, width: '100%' }}>
        Заказать
      </button>
    </div>
  );
}