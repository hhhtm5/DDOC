import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();

  useEffect(() => {
    if (tg) tg.BackButton.hide();
  }, [tg]);

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui' }}>
      <h1>🎛️ Студия Zörge</h1>
      <p>Добро пожаловать, {user?.first_name || 'гость'}!</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button onClick={() => navigate('/rent')} style={btnStyle}>🗓️ Аренда студии</button>
        <button onClick={() => navigate('/packages')} style={btnStyle}>📦 Пакеты часов</button>
        <button onClick={() => navigate('/mixing')} style={btnStyle}>🎚️ Сведение / Под ключ</button>
        <button onClick={() => navigate('/question')} style={btnStyle}>💬 Задать вопрос</button>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: 16,
  background: '#2AABEE',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  fontSize: 16,
  cursor: 'pointer'
};
