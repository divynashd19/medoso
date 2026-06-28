import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <div className="navbar-brand-icon">🏥</div>
          <h1>MediBook</h1>
        </div>
        <div className="navbar-menu">
          {user ? (
            <>
              <span className="welcome-text">Hi, {user.name}</span>
              {user.role === 'doctor' ? (
                <>
                  <button onClick={() => navigate('/doctor-dashboard')} className="nav-btn">
                    Dashboard
                  </button>
                  <button onClick={() => navigate('/manage-availability')} className="nav-btn">
                    Availability
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/dashboard')} className="nav-btn">
                    Appointments
                  </button>
                  <button onClick={() => navigate('/book-appointment')} className="nav-btn nav-btn-primary">
                    Book Now
                  </button>
                </>
              )}
              <button onClick={handleLogout} className="nav-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            !isAuthPage && (
              <>
                <button onClick={() => navigate('/login')} className="nav-btn">
                  Sign In
                </button>
                <button onClick={() => navigate('/register')} className="nav-btn nav-btn-primary">
                  Get Started
                </button>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
