import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import {
  getAppointmentId,
  getStatusClass,
  formatStatus,
  formatDate,
  formatTime,
  getPatientName,
  getAppointmentDate,
  getStartTime,
} from '../utils/appointmentHelpers';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalAppointments: 0,
    scheduledAppointments: 0,
    completedAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const calculateStats = (data) => {
    const today = new Date().toDateString();
    setStats({
      todayAppointments: data.filter(
        (apt) => new Date(getAppointmentDate(apt)).toDateString() === today
      ).length,
      totalAppointments: data.length,
      scheduledAppointments: data.filter((apt) => apt.status === 'scheduled').length,
      completedAppointments: data.filter((apt) => apt.status === 'completed').length,
    });
  };

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

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" /> Loading dashboard...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Doctor Dashboard</h1>
          <p>Manage your appointments and patient schedule</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/manage-availability')}>
          Manage Availability
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-number">{stats.todayAppointments}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div>
            <div className="stat-number">{stats.scheduledAppointments}</div>
            <div className="stat-label">Scheduled</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <div className="stat-number">{stats.completedAppointments}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div>
            <div className="stat-number">{stats.totalAppointments}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>

      <div className="appointments-section">
        <div className="section-header">
          <h2>Patient Schedule</h2>
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
        </div>

        {getFilteredAppointments().length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No appointments in this category</p>
          </div>
        ) : (
          <div className="appointments-list">
            {getFilteredAppointments().map((appointment) => (
              <div key={getAppointmentId(appointment)} className="appointment-card">
                <div className="appointment-header">
                  <div className="time-badge">{formatTime(getStartTime(appointment))}</div>
                  <div className="appointment-info">
                    <h3>{appointment.title}</h3>
                    <p className="appointment-meta">Patient: {getPatientName(appointment)}</p>
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
                  {appointment.status === 'scheduled' && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusChange(getAppointmentId(appointment), 'completed')}
                      >
                        Mark Completed
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusChange(getAppointmentId(appointment), 'cancelled')}
                      >
                        Cancel
                      </button>
                    </>
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

export default DoctorDashboard;
