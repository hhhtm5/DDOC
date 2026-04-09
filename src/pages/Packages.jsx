import { useState } from 'react';
import BackButton from '../components/BackButton';
import api from '../api';
import { useTelegram } from '../hooks/useTelegram';

const packages = [
  { id: 1, name: '6 часов', price: 3500 },
  { id: 2, name: '12 часов', price: 6000 },
  { id: 3, name: '24 часа', price: 12000 }
];

export default function Packages() {
  const { tg, user } = useTelegram();
  const [selected, setSelected] = useState(null);
  const [phone, setPhone] = useState('');

  const handleOrder = async () => {
    if (!selected) return;
    const clientName = user?.first_name || 'Клиент';
    const clientUsername = user?.username || '';
    const message = `Здравствуйте! Хочу приобрести пакет "${selected.name} (${selected.price} ₽)". Меня зовут ${clientName}, телефон ${phone}.`;
    const chatUrl = `https://t.me/whomixdrugs?text=${encodeURIComponent(message)}`;
    window.Telegram.WebApp.openTelegramLink(chatUrl);
    try {
      await api.post('/packages/order', {
        packageName: selected.name,
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
      <h2>Пакеты часов</h2>
      {packages.map(pkg => (
        <div key={pkg.id} style={{ border: '1px solid #ccc', borderRadius: 12, padding: 16, marginBottom: 12, cursor: 'pointer', background: selected?.id === pkg.id ? '#e0f0ff' : '#fff' }} onClick={() => setSelected(pkg)}>
          <strong>{pkg.name}</strong> — {pkg.price} ₽
        </div>
      ))}
      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ваш телефон" style={{ padding: 12, width: '100%', marginTop: 16 }} />
      <button onClick={handleOrder} disabled={!selected} style={{ marginTop: 20, padding: 16, background: selected ? '#2AABEE' : '#ccc', color: '#fff', border: 'none', borderRadius: 12, width: '100%' }}>
        Оплатить
      </button>
    </div>
  );
}