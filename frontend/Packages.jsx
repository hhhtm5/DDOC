import { useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import BackButton from '../components/BackButton';

const packages = [
  { id: 1, name: '6 часов', price: 3500 },
  { id: 2, name: '12 часов', price: 6000 },
  { id: 3, name: '24 часа', price: 12000 },
];

export default function Packages() {
  const { tg, user } = useTelegram();
  const [selected, setSelected] = useState(null);
  const [phone, setPhone] = useState('');

  const validatePhone = (num) => {
    const cleaned = num.replace(/[\s()-]/g, '');
    return /^\+?[0-9]{10,15}$/.test(cleaned);
  };

  const handleOrder = () => {
    if (!selected) return alert('Выберите пакет');
    if (!validatePhone(phone)) return alert('Введите корректный номер телефона');

    const msg = `Здравствуйте! Хочу приобрести пакет "${selected.name} (${selected.price} ₽)". Меня зовут ${user?.first_name || 'Клиент'}, телефон ${phone}.`;
    tg.openTelegramLink(`https://t.me/vkuve?text=${encodeURIComponent(msg)}`);
    tg.close();
  };

  return (
    <div style={{ padding: 20 }}>
      <BackButton />
      <h2 style={{ fontSize: 28, marginBottom: 24 }}>Пакеты часов</h2>
      {packages.map((p) => (
        <div
          key={p.id}
          onClick={() => setSelected(p)}
          style={{
            border: selected?.id === p.id ? '3px solid #2AABEE' : '1px solid #ccc',
            borderRadius: 20,
            padding: 24,
            marginBottom: 16,
            cursor: 'pointer',
            background: selected?.id === p.id ? '#f0f9ff' : '#fff',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: '700' }}>{p.name}</div>
          <div style={{ fontSize: 32, fontWeight: '800', color: '#2AABEE', marginTop: 8 }}>
            {p.price} ₽
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
        Оплатить
      </button>
    </div>
  );
}
