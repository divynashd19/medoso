import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI, authAPI } from '../services/api';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    doctorId: '',
    title: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await authAPI.getDoctors();
      setDoctors(response.data);
    } catch {
      setError('Failed to load doctors. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await appointmentAPI.createAppointment(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);

  return (
    <div className="container book-page">
      <div className="book-form-card">
        <h2>Book an Appointment</h2>
        <p className="subtitle">Select a doctor and choose your preferred date and time</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Doctor</label>
            <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
              <option value="">Choose a specialist...</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                  {doctor.specialization ? ` — ${doctor.specialization}` : ''}
                </option>
              ))}
            </select>
          </div>
          {selectedDoctor && (
            <div className="card" style={{ marginBottom: '20px', padding: '16px', background: 'var(--primary-50)' }}>
              <strong>{selectedDoctor.name}</strong>
              {selectedDoctor.specialization && (
                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {selectedDoctor.specialization}
                </p>
              )}
            </div>
          )}
          <div className="form-group">
            <label>Appointment Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., General Check-up, Follow-up Consultation"
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your symptoms or reason for visit..."
            />
          </div>
          <div className="form-group">
            <label>Location (optional)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Room 101, Main Clinic"
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
