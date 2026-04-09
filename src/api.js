import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const authTelegram = (initData) => api.post('/auth/telegram', { initData });
export const registerPhone = (data) => api.post('/auth/register', data);
export const getServices = () => api.get('/bookings/services');
export const createBooking = (data) => api.post('/bookings', data);
export default api;