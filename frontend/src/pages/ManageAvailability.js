import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../services/api';
import '../styles/DoctorViews.css';

const ManageAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await availabilityAPI.getMyAvailability();
      setAvailability(response.data);
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await availabilityAPI.addAvailability(formData);
      setSuccess('Availability added successfully!');
      setFormData({ dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' });
      fetchAvailability();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add availability');
    }
  };

  const handleDeleteAvailability = async (id) => {
    try {
      await availabilityAPI.deleteAvailability(id);
      fetchAvailability();
      setSuccess('Availability removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete availability');
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div> Loading...</div>;

  return (
    <div className="container">
      <div className="manage-availability">
        {/* Header */}
        <div className="section-title">
          <h1>📅 Manage Your Availability</h1>
          <p>Set your working hours to allow patients to book appointments</p>
        </div>

        {/* Success/Error Messages */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="availability-grid">
          {/* Form Section */}
          <div className="form-section">
            <div className="card">
              <h2>Add Time Slot</h2>
              <form onSubmit={handleAddAvailability} className="availability-form">
                <div className="form-group">
                  <label>Day of Week</label>
                  <select
                    name="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={handleChange}
                    required
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  ➕ Add Time Slot
                </button>
              </form>
            </div>
          </div>

          {/* Schedule Display */}
          <div className="schedule-section">
            <div className="card">
              <h2>Your Schedule</h2>
              {availability.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No availability set yet. Add your first time slot!</p>
                </div>
              ) : (
                <div className="schedule-table">
                  <div className="schedule-header">
                    <div className="schedule-col">Day</div>
                    <div className="schedule-col">Time</div>
                    <div className="schedule-col">Action</div>
                  </div>
                  {availability.map((slot) => (
                    <div key={slot._id} className="schedule-row">
                      <div className="schedule-col day-badge">
                        <span className="badge">{slot.dayOfWeek}</span>
                      </div>
                      <div className="schedule-col time-info">
                        <div className="time-start">{slot.startTime}</div>
                        <div className="time-divider">→</div>
                        <div className="time-end">{slot.endTime}</div>
                      </div>
                      <div className="schedule-col">
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteAvailability(slot._id)}
                          title="Delete this time slot"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        {availability.length > 0 && (
          <div className="card" style={{ marginTop: '30px' }}>
            <h2>Weekly Overview</h2>
            <div className="weekly-grid">
              {days.map((day) => {
                const slots = availability.filter((a) => a.dayOfWeek === day);
                return (
                  <div key={day} className="day-box">
                    <div className="day-name">{day.substring(0, 3)}</div>
                    {slots.length > 0 ? (
                      <div className="day-slots">
                        {slots.map((slot) => (
                          <div key={slot._id} className="slot-time">
                            {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-slot">Off</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAvailability;
