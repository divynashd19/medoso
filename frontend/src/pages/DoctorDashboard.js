import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import '../styles/DoctorDashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const fetchDoctorData = useCallback(async () => {
    try {
      const response = await appointmentAPI.getDoctorAppointments();
      setAppointments(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctorData();
  }, [fetchDoctorData]);

  const calculateStats = (appointments) => {
    const today = new Date().toDateString();
    
    const stats = {
      todayAppointments: appointments.filter(
        (apt) => new Date(apt.appointmentDate).toDateString() === today
      ).length,
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter((apt) => apt.status === 'confirmed').length,
      pendingAppointments: appointments.filter((apt) => apt.status === 'pending').length,
    };
    setStats(stats);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentAPI.updateAppointmentStatus(appointmentId, newStatus);
      fetchDoctorData();
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    return appointments.filter((apt) => apt.status === filter);
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div> Loading...</div>;

  return (
    <div className="container">
      <div className="doctor-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Doctor Dashboard</h1>
            <p className="subtitle">Manage your appointments and schedule</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/manage-availability')}>
            📅 Manage Availability
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.todayAppointments}</div>
              <div className="stat-label">Today's Appointments</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.confirmedAppointments}</div>
              <div className="stat-label">Confirmed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pendingAppointments}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalAppointments}</div>
              <div className="stat-label">Total Appointments</div>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="appointments-section">
          <div className="section-header">
            <h2>Schedule Management</h2>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
                onClick={() => setFilter('confirmed')}
              >
                Confirmed
              </button>
              <button
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>

          {getFilteredAppointments().length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No appointments in this category</p>
            </div>
          ) : (
            <div className="appointments-list">
              {getFilteredAppointments().map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-time">
                      <div className="time-badge">
                        {appointment.startTime.substring(0, 5)}
                      </div>
                    </div>
                    <div className="appointment-info">
                      <h3>{appointment.title}</h3>
                      <p className="patient-name">Patient: {appointment.patientId?.name}</p>
                      <p className="appointment-date">
                        📅 {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="status-badge" style={{
                      background: appointment.status === 'confirmed' ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' :
                                 appointment.status === 'pending' ? 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' :
                                 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: appointment.status === 'pending' ? '#333' : 'white'
                    }}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </div>
                  </div>

                  <div className="appointment-details">
                    <p><strong>Duration:</strong> {appointment.startTime.substring(0, 5)} - {appointment.endTime.substring(0, 5)}</p>
                    {appointment.description && (
                      <p><strong>Notes:</strong> {appointment.description}</p>
                    )}
                    {appointment.location && (
                      <p><strong>Location:</strong> {appointment.location}</p>
                    )}
                  </div>

                  <div className="appointment-actions">
                    {appointment.status === 'pending' && (
                      <>
                        <button
                          className="btn-action btn-confirm"
                          onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                        >
                          ✓ Confirm
                        </button>
                        <button
                          className="btn-action btn-cancel"
                          onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                        >
                          ✕ Cancel
                        </button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button
                        className="btn-action btn-complete"
                        onClick={() => handleStatusChange(appointment._id, 'completed')}
                      >
                        ✓ Mark Completed
                      </button>
                    )}
                    <button className="btn-action btn-view">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
