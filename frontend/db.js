import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

export default function BackButton() {
  const navigate = useNavigate();
  const { tg } = useTelegram();

  useEffect(() => {
    if (!tg) return;
    tg.BackButton.show();
    const handler = () => navigate(-1);
    tg.BackButton.onClick(handler);
    return () => tg.BackButton.offClick(handler);
  }, [tg, navigate]);

  return null;
}
