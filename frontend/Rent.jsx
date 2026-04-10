import { useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import BackButton from '../components/BackButton';
import BookingCalendar from '../components/Calendar';
import TariffSelector from '../components/TariffSelector';
import api from '../api';

const tariffs = [
  { id: 1, name: 'Без звукорежиссёра', price: 699 },
  { id: 2, name: 'Со звукорежиссёром', price: 999 },
  { id: 3, name: 'Ночной тариф', price: 499 }
];

export default function Rent() {
  const { tg, user } = useTelegram();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [tariff, setTariff] = useState(null);
  const [phone, setPhone] = useState('');

  const handleBook = async () => {
    if (!tariff || !time) return alert('Выберите время и тариф');
    const msg = `Здравствуйте! Хочу забронировать студию на ${date.toISOString().split('T')[0]} в ${time}. Тариф: ${tariff.name} (${tariff.price} ₽). Меня зовут ${user?.first_name}, телефон ${phone}.`;
    tg.openTelegramLink(`https://t.me/zorge_manager?text=${encodeURIComponent(msg)}`);
    try {
      await api.post('/rent/book', {
        date: date.toISOString().split('T')[0],
        time,
        tariffId: tariff.id,
        clientName: user?.first_name,
        phone
      });
    } catch (e) {}
    tg.close();
  };

  return (
    <div style={{ padding: 20 }}>
      <BackButton />
      <h2>Аренда студии</h2>
      <h3>Дата</h3>
      <BookingCalendar onSelectSlot={setDate} />
      <h3>Время</h3>
      <select value={time} onChange={e => setTime(e.target.value)} style={inputStyle}>
        <option value="">-- Выберите --</option>
        <option value="10:00">10:00</option>
        <option value="14:00">14:00</option>
        <option value="18:00">18:00</option>
      </select>
      <h3>Тариф</h3>
      <TariffSelector options={tariffs} selected={tariff} onSelect={setTariff} />
      <h3>Телефон</h3>
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7..." style={inputStyle} />
      <button onClick={handleBook} style={btnStyle}>Забронировать</button>
    </div>
  );
}

const btnStyle = { padding: 16, background: '#2AABEE', color: '#fff', border: 'none', borderRadius: 12, width: '100%', marginTop: 20 };
const inputStyle = { padding: 12, width: '100%', marginBottom: 12, border: '1px solid #ccc', borderRadius: 8 };
