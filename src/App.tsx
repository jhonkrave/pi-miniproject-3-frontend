import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import Home from './Pages/Home';
import HostMeeting from './Pages/HostMeeting'; // ⭐ NUEVA IMPORTACIÓN
import Footer from './components/Footer/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <main className="main-content-wrapper">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<Home />} />
            {/* ⭐⭐ NUEVA RUTA PARA HOST MEETING ⭐⭐ */}
            <Route path="/host-meeting" element={<HostMeeting />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;