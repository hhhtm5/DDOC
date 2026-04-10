import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();

  useEffect(() => {
    if (tg) tg.BackButton.hide();
  }, [tg]);

  const menuItems = [
    { title: '🗓️ Аренда студии', path: '/rent' },
    { title: '📦 Пакеты часов', path: '/packages' },
    { title: '🎚️ Сведение / Под ключ', path: '/mixing' },
    { title: '💬 Задать вопрос', path: '/question' },
  ];

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui', minHeight: '100vh', background: '#fff' }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>🎛️ Студия Zörge</h1>
      <p style={{ fontSize: 18, marginBottom: 32, color: '#666' }}>
        Добро пожаловать, {user?.first_name || 'гость'}!
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            style={{
              padding: 20,
              background: '#2AABEE',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              fontSize: 20,
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
