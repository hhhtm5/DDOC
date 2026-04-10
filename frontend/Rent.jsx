import { useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import BackButton from '../components/BackButton';
import BookingCalendar from '../components/Calendar';
import TariffSelector from '../components/TariffSelector';

const tariffs = [
  { id: 1, name: 'Без звукорежиссёра', price: 699 },
  { id: 2, name: 'Со звукорежиссёром', price: 999 },
  { id: 3, name: 'Ночной тариф', price: 499 },
];

const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

export default function Rent() {
  const { tg, user } = useTelegram();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [tariff, setTariff] = useState(null);
  const [phone, setPhone] = useState('');

  const validatePhone = (num) => {
    const cleaned = num.replace(/[\s()-]/g, '');
    return /^\+?[0-9]{10,15}$/.test(cleaned);
  };

  const handleBook = () => {
    if (!tariff) return alert('Выберите тариф');
    if (!time) return alert('Выберите время');
    if (!validatePhone(phone)) return alert('Введите корректный номер телефона');

    const formattedDate = date.toLocaleDateString('ru-RU');
    const msg = `Здравствуйте! Хочу забронировать студию на ${formattedDate} в ${time}. Тариф: ${tariff.name} (${tariff.price} ₽). Меня зовут ${user?.first_name || 'Клиент'}, телефон ${phone}.`;
    tg.openTelegramLink(`https://t.me/vkuve?text=${encodeURIComponent(msg)}`);
    tg.close();
  };

  return (
    <div style={{ padding: 20, paddingBottom: 40 }}>
      <BackButton />
      <h2 style={{ fontSize: 28, marginBottom: 24 }}>Аренда студии</h2>

      <h3 style={{ fontSize: 20, marginBottom: 12 }}>1. Выберите дату</h3>
      <BookingCalendar onSelectSlot={setDate} />

      <h3 style={{ fontSize: 20, marginBottom: 12, marginTop: 30 }}>2. Выберите время</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {timeSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => setTime(slot)}
            style={{
              padding: '12px 20px',
              borderRadius: 30,
              border: time === slot ? '2px solid #2AABEE' : '1px solid #ccc',
              background: time === slot ? '#2AABEE' : '#fff',
              color: time === slot ? '#fff' : '#000',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            {slot}
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: 20, marginBottom: 12, marginTop: 30 }}>3. Выберите тариф</h3>
      <TariffSelector options={tariffs} selected={tariff} onSelect={setTariff} />

      <h3 style={{ fontSize: 20, marginBottom: 12, marginTop: 30 }}>4. Ваш телефон</h3>
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
          marginBottom: 30,
        }}
      />

      <button
        onClick={handleBook}
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
        Забронировать
      </button>
    </div>
  );
}
