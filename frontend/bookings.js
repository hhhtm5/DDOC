import { useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import BackButton from '../components/BackButton';
import api from '../api';

const services = [
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
    const msg = `Здравствуйте! Хочу заказать сведение: ${selected.name} (${selected.price} ₽). Меня зовут ${user?.first_name}, телефон ${phone}.`;
    tg.openTelegramLink(`https://t.me/zorge_manager?text=${encodeURIComponent(msg)}`);
    try {
      await api.post('/mixing/request', {
        tariffName: selected.name,
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
      <h2>Сведение / Под ключ</h2>
      {services.map(s => (
        <div
          key={s.id}
          onClick={() => setSelected(s)}
          style={{
            border: '1px solid #ccc',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            cursor: 'pointer',
            background: selected?.id === s.id ? '#e0f0ff' : '#fff'
          }}
        >
          <strong>{s.name}</strong> — {s.price} ₽
        </div>
      ))}
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ваш телефон" style={inputStyle} />
      <button onClick={handleOrder} disabled={!selected} style={{ ...btnStyle, background: selected ? '#2AABEE' : '#ccc' }}>
        Заказать
      </button>
    </div>
  );
}

const btnStyle = { padding: 16, color: '#fff', border: 'none', borderRadius: 12, width: '100%', marginTop: 20 };
const inputStyle = { padding: 12, width: '100%', marginTop: 16, border: '1px solid #ccc', borderRadius: 8 };
