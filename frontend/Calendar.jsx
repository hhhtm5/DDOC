import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function BookingCalendar({ onSelectSlot }) {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (value) => {
    setDate(value);
    onSelectSlot(value);
  };

  const tileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Calendar
      onChange={handleDateChange}
      value={date}
      minDate={new Date()}
      locale="ru-RU"
      tileDisabled={tileDisabled}
      prev2Label={null}
      next2Label={null}
    />
  );
}
