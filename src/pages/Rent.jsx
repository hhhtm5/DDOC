import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import Calendar from '../components/Calendar';
import TariffSelector from '../components/TariffSelector';
import BackButton from '../components/BackButton';
import api from '../api';

const tariffs = [
  { id: 1, name: 'Без звукорежиссёра', price: 699 },
  { id: 2, name: 'Со звукорежиссёром', price: 999 },
  { id: 3, name: 'Ночной тариф', price: 499 }
];

export default function Rent() {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [phone, setPhone] = useState('');

  const handleBook = async () => {
    if (!selectedDate || !selectedTariff || !selectedTime) {
      alert('Заполните все поля');
      return;
    }
    const clientName = user?.first_name || 'Клиент';
    const clientUsername = user?.username || '';
    const message = `Здравствуйте! Хочу забронировать студию на ${selectedDate.toISOString().split('T')[0]} в ${selectedTime}. Тариф: ${selectedTariff.name} (${selectedTariff.price} ₽). Меня зовут ${clientName}, телефон ${phone}.`;
    const chatUrl = `https://t.me/whomixdrugs?text=${encodeURIComponent(message)}`;
    window.Telegram.WebApp.openTelegramLink(chatUrl);
    try {
      await api.post('/rent/book', {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        tariffId: selectedTariff.id,
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
      <h2>Аренда студии</h2>
      <h3>1. Дата</h3>
      <Calendar onSelectSlot={setSelectedDate} />
      <h3>2. Время</h3>
      <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={{ padding: 12, width: '100%' }}>
        <option value="">-- Выберите время --</option>
        <option value="10:00">10:00</option>
        <option value="14:00">14:00</option>
        <option value="18:00">18:00</option>
      </select>
      <h3>3. Тариф</h3>
      <TariffSelector options={tariffs} selected={selectedTariff} onSelect={setSelectedTariff} />
      <h3>4. Телефон</h3>
      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7..." style={{ padding: 12, width: '100%' }} />
      <button onClick={handleBook} style={{ marginTop: 20, padding: 16, background: '#2AABEE', color: '#fff', border: 'none', borderRadius: 12, width: '100%' }}>
        Забронировать
      </button>
    </div>
  );
}