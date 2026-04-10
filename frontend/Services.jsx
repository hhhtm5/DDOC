import { useState } from 'react';
import { createBooking } from '../api';

export default function Booking() {
  const [serviceId, setServiceId] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking({ service_id: serviceId, date, time });
      alert('Бронирование создано!');
    } catch (err) {
      alert('Ошибка бронирования');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Запись в студию</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <select value={serviceId} onChange={e => setServiceId(e.target.value)} style={{ padding: 12 }}>
          <option value={1}>Запись вокала</option>
          <option value={2}>Сведение</option>
          <option value={3}>Мастеринг</option>
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ padding: 12 }} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} required style={{ padding: 12 }} />
        <button type="submit" style={{ padding: 16, background: '#2AABEE', color: '#fff', border: 'none', borderRadius: 12 }}>
          Отправить заявку
        </button>
      </form>
    </div>
  );
}