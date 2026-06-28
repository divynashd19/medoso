import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleGetStarted = () => {
    if (user) {
      navigate(user.role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Healthcare made simple</span>
          <h1>
            Book appointments with
            <span className="gradient-text"> trusted doctors</span>
          </h1>
          <p className="hero-subtitle">
            Schedule visits, manage your health calendar, and connect with specialists —
            all in one beautiful, easy-to-use platform.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={handleGetStarted}>
              {user ? 'Go to Dashboard' : 'Get Started Free'}
            </button>
            {!user && (
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>
                Sign In
              </button>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>24/7</strong>
              <span>Online booking</span>
            </div>
            <div className="hero-stat">
              <strong>100+</strong>
              <span>Specialists</span>
            </div>
            <div className="hero-stat">
              <strong>5 min</strong>
              <span>Average booking</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-card-main">
            <div className="hero-card-icon">📅</div>
            <h3>Next Appointment</h3>
            <p className="hero-card-date">Tomorrow, 10:30 AM</p>
            <p className="hero-card-doctor">Dr. Sarah Mitchell</p>
            <span className="hero-card-badge">Confirmed</span>
          </div>
          <div className="hero-card hero-card-float">
            <span>✓</span>
            <div>
              <strong>Reminder sent</strong>
              <p>24 hours before visit</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Everything you need</h2>
        <p className="features-subtitle">Powerful features for patients and healthcare providers</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🩺</div>
            <h3>Find Doctors</h3>
            <p>Browse specialists by expertise and book the right doctor for your needs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Smart Scheduling</h3>
            <p>Real-time availability slots so you never double-book or miss an opening.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Reminders</h3>
            <p>Automatic notifications before your appointment so you're always prepared.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Doctor Dashboard</h3>
            <p>Doctors manage schedules, confirm visits, and track their patient load.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to take control of your health?</h2>
          <p>Join thousands of patients and doctors using our platform today.</p>
          <button className="btn btn-primary btn-lg" onClick={handleGetStarted}>
            {user ? 'Open Dashboard' : 'Create Free Account'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
