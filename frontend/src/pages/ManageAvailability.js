import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../services/api';
import '../styles/DoctorViews.css';

const ManageAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [formData, setFormData] = useState({
    selectedDays: [],
    startTime: '09:00',
    endTime: '17:00',
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const days = [
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
    { name: 'Sunday', value: 0 },
  ];

  const getDayName = (dayNumber) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[dayNumber] ?? 'Unknown';
  };

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

  const handleDayChange = (dayValue, checked) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: checked
        ? [...prev.selectedDays, dayValue]
        : prev.selectedDays.filter((day) => day !== dayValue),
    }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.selectedDays.length === 0) {
      setError('Please select at least one day');
      return;
    }

    try {
      await availabilityAPI.addAvailability({
        daysOfWeek: formData.selectedDays,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      setFormData({ selectedDays: [], startTime: '09:00', endTime: '17:00' });
      fetchAvailability();
      setSuccess('Availability added successfully!');
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
    } catch {
      setError('Failed to delete availability');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" /> Loading availability...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="manage-availability">
        <div className="section-title">
          <h1>Manage Availability</h1>
          <p>Set your working hours so patients can book appointments</p>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="availability-grid">
          <div className="form-section">
            <div className="card">
              <h2>Add Time Slot</h2>
              <form onSubmit={handleAddAvailability} className="availability-form">
                <div className="form-group">
                  <label>Select Days</label>
                  <div className="days-checkboxes">
                    {days.map((day) => (
                      <label key={day.value} className="day-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.selectedDays.includes(day.value)}
                          onChange={(e) => handleDayChange(day.value, e.target.checked)}
                        />
                        {day.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input type="time" name="startTime" value={formData.startTime} onChange={handleTimeChange} required />
                  </div>
                  <div className="form-group">
                    <label>End Time</label>
                    <input type="time" name="endTime" value={formData.endTime} onChange={handleTimeChange} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Add Time Slot
                </button>
              </form>
            </div>
          </div>

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
                    <div key={slot.id} className="schedule-row">
                      <div className="schedule-col day-badge">
                        <span className="status-badge status-scheduled">{getDayName(slot.day_of_week)}</span>
                      </div>
                      <div className="schedule-col time-info">
                        <div className="time-start">{slot.start_time?.substring(0, 5)}</div>
                        <div className="time-divider">→</div>
                        <div className="time-end">{slot.end_time?.substring(0, 5)}</div>
                      </div>
                      <div className="schedule-col">
                        <button className="btn-delete" onClick={() => handleDeleteAvailability(slot.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {availability.length > 0 && (
          <div className="card" style={{ marginTop: '30px' }}>
            <h2>Weekly Overview</h2>
            <div className="weekly-grid">
              {days.map((day) => {
                const slots = availability.filter((a) => a.day_of_week === day.value);
                return (
                  <div key={day.value} className="day-box">
                    <div className="day-name">{day.name.substring(0, 3)}</div>
                    {slots.length > 0 ? (
                      <div className="day-slots">
                        {slots.map((slot) => (
                          <div key={slot.id} className="slot-time">
                            {slot.start_time?.substring(0, 5)} - {slot.end_time?.substring(0, 5)}
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
