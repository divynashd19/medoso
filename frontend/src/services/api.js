import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getDoctors: () => api.get('/auth/doctors'),
};

// Appointment Service
export const appointmentAPI = {
  createAppointment: (data) => api.post('/appointments', data),
  getPatientAppointments: () => api.get('/appointments/patient/appointments'),
  getDoctorAppointments: () => api.get('/appointments/doctor/appointments'),
  getAppointment: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  cancelAppointment: (id) => api.patch(`/appointments/${id}/cancel`),
};

// Availability Service
export const availabilityAPI = {
  setAvailability: (data) => api.post('/availability', data),
  getDoctorAvailability: (doctorId) => api.get(`/availability/${doctorId}`),
  updateAvailability: (id, data) => api.put(`/availability/${id}`, data),
  deleteAvailability: (id) => api.delete(`/availability/${id}`),
};

// Reminder Service
export const reminderAPI = {
  getReminders: () => api.get('/reminders'),
  getPendingReminders: () => api.get('/reminders/pending'),
  markAsSent: (id) => api.patch(`/reminders/${id}/sent`),
  deleteReminder: (id) => api.delete(`/reminders/${id}`),
};

export default api;
