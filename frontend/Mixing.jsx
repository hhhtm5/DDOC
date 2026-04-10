import { useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import BackButton from '../components/BackButton';

const services = [
  { id: 1, name: 'Basic', price: 2990 },
  { id: 2, name: 'Premier', price: 5990 },
  { id: 3, name: 'Ultima', price: 7990 },
  { id: 4, name: 'Трек "Под ключ"', price: 9990 },
];

export default function Mixing() {
  const { tg, user } = useTelegram();
  const [selected, setSelected] = useState(null);
  const [phone, setPhone] = useState('');

  const validatePhone = (num) => {
    const cleaned = num.replace(/[\s()-]/g, '');
    return /^\+?[0-9]{10,15}$/.test(cleaned);
  };

  const handleOrder = () => {
    if (!selected) return alert('Выберите тариф');
    if (!validatePhone(phone)) return alert('Введите корректный номер телефона');

    const msg = `Здравствуйте! Хочу заказать сведение: ${selected.name} (${selected.price} ₽). Меня зовут ${user?.first_name || 'Клиент'}, телефон ${phone}.`;
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
      <h2 style={{ fontSize: 28, marginBottom: 24 }}>Сведение / Под ключ</h2>
      {services.map((s) => (
        <div
          key={s.id}
          onClick={() => setSelected(s)}
          style={{
            border: selected?.id === s.id ? '3px solid #2AABEE' : '1px solid #ccc',
            borderRadius: 20,
            padding: 24,
            marginBottom: 16,
            cursor: 'pointer',
            background: selected?.id === s.id ? '#f0f9ff' : '#fff',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: '700' }}>{s.name}</div>
          <div style={{ fontSize: 32, fontWeight: '800', color: '#2AABEE', marginTop: 8 }}>
            {s.price} ₽
          </div>
        </div>
      ))}
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+7 900 123 45 67"
        style={{
          padding: 18,
          width: '100%',
          fontSize: 18,
          border: '1px solid #ccc',
          borderRadius: 16,
          marginTop: 20,
          marginBottom: 30,
        }}
      />
      <button
        onClick={handleOrder}
        disabled={!selected}
        style={{
          padding: 20,
          background: !selected ? '#ccc' : '#2AABEE',
          color: '#fff',
          border: 'none',
          borderRadius: 16,
          width: '100%',
          fontSize: 22,
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Заказать
      </button>
    </div>
  );
}
