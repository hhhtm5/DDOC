import { useEffect, useState } from 'react';
import { getServices } from '../api';

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(res => setServices(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🎤 Услуги</h2>
      {services.map(s => (
        <div key={s.id} style={{ borderBottom: '1px solid #ccc', padding: '12px 0' }}>
          <strong>{s.name}</strong> — {s.price}₽ ({s.duration} мин)
        </div>
      ))}
    </div>
  );
}