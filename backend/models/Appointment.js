const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Format: HH:mm
    required: true
  },
  endTime: {
    type: String, // Format: HH:mm
    required: true
  },
  duration: {
    type: Number, // In minutes
    default: 30
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    default: null
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  meetingLink: {
    type: String,
    default: null // For online consultations
  },
  location: {
    type: String,
    default: null // For in-person appointments
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
