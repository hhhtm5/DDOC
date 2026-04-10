import { useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import BackButton from '../components/BackButton';
import api from '../api';

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
    const msg = `Здравствуйте! Хочу приобрести пакет "${selected.name} (${selected.price} ₽)". Меня зовут ${user?.first_name}, телефон ${phone}.`;
    tg.openTelegramLink(`https://t.me/zorge_manager?text=${encodeURIComponent(msg)}`);
    try {
      await api.post('/packages/order', {
        packageName: selected.name,
        price: selected.price,
        clientName: user?.first_name,
        phone
      });
    } catch (e) {}
    tg.close();
  };

  return (
    <div style={{ padding: 20 }}>
      <BackButton />
      <h2>Пакеты часов</h2>
      {packages.map(p => (
        <div
          key={p.id}
          onClick={() => setSelected(p)}
          style={{
            border: '1px solid #ccc',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            cursor: 'pointer',
            background: selected?.id === p.id ? '#e0f0ff' : '#fff'
          }}
        >
          <strong>{p.name}</strong> — {p.price} ₽
        </div>
      ))}
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ваш телефон" style={inputStyle} />
      <button onClick={handleOrder} disabled={!selected} style={{ ...btnStyle, background: selected ? '#2AABEE' : '#ccc' }}>
        Оплатить
      </button>
    </div>
  );
}

const btnStyle = { padding: 16, color: '#fff', border: 'none', borderRadius: 12, width: '100%', marginTop: 20 };
const inputStyle = { padding: 12, width: '100%', marginTop: 16, border: '1px solid #ccc', borderRadius: 8 };
