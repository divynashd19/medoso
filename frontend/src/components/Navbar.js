import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🏥 Appointment Booking</h1>
        </div>
        <div className="navbar-menu">
          {user && (
            <>
              <span className="welcome-text">Welcome, {user.name}</span>
              {user.role === 'doctor' ? (
                <>
                  <button 
                    onClick={() => navigate('/doctor-dashboard')}
                    className="nav-btn"
                  >
                    📊 My Dashboard
                  </button>
                  <button 
                    onClick={() => navigate('/manage-availability')}
                    className="nav-btn"
                  >
                    📅 Manage Availability
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="nav-btn"
                  >
                    📋 My Appointments
                  </button>
                  <button 
                    onClick={() => navigate('/book-appointment')}
                    className="nav-btn"
                  >
                    ✚ Book Appointment
                  </button>
                </>
              )}
              <button 
                onClick={handleLogout}
                className="nav-btn logout-btn"
              >
                ⌚ Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
