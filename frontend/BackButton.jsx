import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tg } = useTelegram();

  useEffect(() => {
    if (!tg) return;
    if (location.pathname === '/') {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
      const handler = () => navigate(-1);
      tg.BackButton.onClick(handler);
      return () => tg.BackButton.offClick(handler);
    }
  }, [tg, location.pathname, navigate]);

  return null;
}
