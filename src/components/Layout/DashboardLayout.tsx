import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../lib/authService';
import useAuthStore from '../../stores/useAuthStore';
import './DashboardLayout.scss';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) return `${user.firstName[0]}${user.lastName[0]}`;
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="dashboard-container">
      
      {/* 📱 MOBILE HEADER (Fixed Top) */}
      <header className="mobile-header-fixed">
        <div className="brand-logo-mobile">
            <img src="/Imagenes/logo2.png" alt="Logo" onError={(e) => e.currentTarget.style.display='none'}/>
            <span>TeamLink</span>
        </div>
        
        <button className="hamburger-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
                // Icono X (Cerrar)
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            ) : (
                // Icono Hamburguesa (Menú)
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            )}
        </button>
      </header>

      {/* 📱 MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
                <div className={`mobile-nav-item ${isActive('/home')}`} onClick={() => handleMobileNav('/home')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Inicio
                </div>
                <div className={`mobile-nav-item ${isActive('/profile')}`} onClick={() => handleMobileNav('/profile')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Mi Perfil
                </div>
                <div className={`mobile-nav-item ${isActive('/about-us')}`} onClick={() => handleMobileNav('/about-us')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    Nosotros
                </div>
                
                <div className="mobile-nav-divider"></div>
                
                <div className="mobile-nav-item logout" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Cerrar Sesión
                </div>
            </div>
        </div>
      )}

      {/* 🖥️ SIDEBAR (Desktop Only) */}
      <aside className="sidebar">
        <div className="brand-logo">
            <img src="/Imagenes/logo2.png" alt="Logo" onError={(e) => e.currentTarget.style.display='none'}/>
            <span>TeamLink</span>
        </div>

        <nav className="nav-menu">
            <a className={`nav-item ${isActive('/home')}`} onClick={() => navigate('/home')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Inicio
            </a>
            <a className={`nav-item ${isActive('/profile')}`} onClick={() => navigate('/profile')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Mi Perfil
            </a>
            <a className={`nav-item ${isActive('/about-us')}`} onClick={() => navigate('/about-us')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Nosotros
            </a>
        </nav>

        <div className="nav-menu" style={{marginTop: 'auto', flex: '0'}}>
             <a className="nav-item" onClick={handleLogout} style={{color: 'var(--error)'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Cerrar Sesión
            </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-area">
        
        {/* Header Desktop */}
        <header className="dashboard-header">
            <div>
                <h1>{title || `Hola, ${user?.firstName || 'Usuario'} 👋`}</h1>
                {subtitle && <p style={{color: 'var(--text-secondary)'}}>{subtitle}</p>}
            </div>

            <div className="user-profile-pill" onClick={() => navigate('/profile')} style={{ display: window.innerWidth <= 768 ? 'none' : 'flex' }}>
                <div className="avatar-circle">{getUserInitials()}</div>
                <span className="user-name">{user?.firstName || user?.email}</span>
            </div>
        </header>

        {children}

      </main>

    </div>
  );
};

export default DashboardLayout;
