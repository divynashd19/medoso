const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    appointmentDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, default: 30 },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    notes: String,
    reminderSent: { type: Boolean, default: false },
    meetingLink: String,
    location: String,
    token: { type: String, unique: true, sparse: true },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

Appointment.createAppointment = async (data) => {
  const doc = new Appointment({
    patientId: data.patientId,
    doctorId: data.doctorId,
    title: data.title,
    description: data.description,
    appointmentDate: data.appointmentDate,
    startTime: data.startTime,
    endTime: data.endTime,
    duration: data.duration,
    status: data.status || 'scheduled',
    notes: data.notes,
    reminderSent: data.reminderSent,
    meetingLink: data.meetingLink,
    location: data.location,
    token: data.token,
    bookedAt: data.bookedAt,
  });
  return doc.save();
};

Appointment.findByPatientId = (patientId) =>
  Appointment.find({ patientId }).sort({ appointmentDate: -1 });

Appointment.findByDoctorId = (doctorId) =>
  Appointment.find({ doctorId }).sort({ appointmentDate: -1 });

Appointment.updateById = (id, updates) =>
  Appointment.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

module.exports = Appointment;
