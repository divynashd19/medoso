const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayOfWeek: {
    type: Number, // 0-6 (Sunday-Saturday)
    required: true,
    min: 0,
    max: 6
  },
  startTime: {
    type: String, // Format: HH:mm
    required: true
  },
  endTime: {
    type: String, // Format: HH:mm
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  breaks: [
    {
      startTime: String, // Format: HH:mm
      endTime: String    // Format: HH:mm
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Availability', availabilitySchema);
