import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rent from './pages/Rent';
import Packages from './pages/Packages';
import Mixing from './pages/Mixing';
import Question from './pages/Question';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/mixing" element={<Mixing />} />
        <Route path="/question" element={<Question />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
