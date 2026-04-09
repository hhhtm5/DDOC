import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import { useTelegram } from './hooks/useTelegram';
import { authTelegram } from './api';

function App() {
  const { tg, user } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (tg && user) {
      const initData = tg.initData;
      authTelegram(initData)
        .then(res => {
          localStorage.setItem('token', res.data.token);
          setIsAuthenticated(true);
        })
        .catch(err => console.error('Auth error', err));
    }
  }, [tg, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;