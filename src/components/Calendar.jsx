import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function BookingCalendar({ onSelectSlot }) {
  const [date, setDate] = useState(new Date());
  const handleDateChange = (value) => {
    setDate(value);
    onSelectSlot(value);
  };
  return <Calendar onChange={handleDateChange} value={date} minDate={new Date()} />;
}