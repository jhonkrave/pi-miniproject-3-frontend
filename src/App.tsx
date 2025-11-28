import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import AuthAction from './Pages/AuthAction/AuthAction';
import PrivacyPolicy from './Pages/Legal/PrivacyPolicy';
import DataDeletion from './Pages/Legal/DataDeletion';
import Home from './Pages/Home/Home';
import HostMeeting from './Pages/HostMeeting/HostMeeting'; // ⭐ NUEVA IMPORTACIÓN
import Footer from './components/Footer/Footer';
import Profile from './Pages/Profile/Profile';
import AboutUs from './Pages/AboutUs/AboutUs';
import AuthProvider from './components/AuthProvider';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <main className="main-content-wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/action" element={<AuthAction />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              
              {/* Protected Routes */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/meeting/:id" element={
                <ProtectedRoute>
                  <HostMeeting />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/about-us" element={<AboutUs />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
