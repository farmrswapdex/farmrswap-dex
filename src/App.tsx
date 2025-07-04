import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Swap from './pages/Swap';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Farms from './pages/Farms';
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
