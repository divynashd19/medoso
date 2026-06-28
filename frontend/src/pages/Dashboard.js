import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import {
  getAppointmentId,
  getStatusClass,
  formatStatus,
  formatDate,
  formatTime,
  getDoctorName,
  getAppointmentDate,
  getStartTime,
  getEndTime,
} from '../utils/appointmentHelpers';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role === 'doctor') {
      navigate('/doctor-dashboard');
      return;
    }
    fetchAppointments();
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getPatientAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(id);
    try {
      await appointmentAPI.cancelAppointment(id);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to cancel:', error);
    } finally {
      setCancellingId(null);
    }
  };

  const getFiltered = () => {
    if (filter === 'all') return appointments;
    return appointments.filter((a) => a.status === filter);
  };

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter((a) => a.status === 'scheduled').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" /> Loading your appointments...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Appointments</h1>
        <p>View and manage your upcoming healthcare visits</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <div className="stat-number">{stats.upcoming}</div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      <div className="appointments-section">
        <div className="section-header">
          <h2>Your Visits</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="filter-buttons">
              {['all', 'scheduled', 'completed', 'cancelled'].map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : formatStatus(f)}
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/book-appointment')}>
              + Book New
            </button>
          </div>
        </div>

        {getFiltered().length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No appointments found</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '20px' }}
              onClick={() => navigate('/book-appointment')}
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="appointments-list">
            {getFiltered().map((appointment) => (
              <div key={getAppointmentId(appointment)} className="appointment-card">
                <div className="appointment-header">
                  <div className="time-badge">{formatTime(getStartTime(appointment))}</div>
                  <div className="appointment-info">
                    <h3>{appointment.title}</h3>
                    <p className="appointment-meta">Dr. {getDoctorName(appointment)}</p>
                    <p className="appointment-meta">📅 {formatDate(getAppointmentDate(appointment))}</p>
                  </div>
                  <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                    {formatStatus(appointment.status)}
                  </span>
                </div>
                {(appointment.description || appointment.location) && (
                  <div className="appointment-details">
                    {appointment.description && <p>{appointment.description}</p>}
                    {appointment.location && <p><strong>Location:</strong> {appointment.location}</p>}
                  </div>
                )}
                <div className="appointment-actions">
                  <span className="appointment-meta">
                    {formatTime(getStartTime(appointment))} – {formatTime(getEndTime(appointment))}
                  </span>
                  {appointment.status === 'scheduled' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(getAppointmentId(appointment))}
                      disabled={cancellingId === getAppointmentId(appointment)}
                    >
                      {cancellingId === getAppointmentId(appointment) ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
