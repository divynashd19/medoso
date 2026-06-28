const toId = (doc) => {
  if (!doc) return null;
  if (typeof doc === 'string') return doc;
  return doc.id || doc._id?.toString();
};

const formatUser = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  return {
    id: toId(obj),
    name: obj.name,
    email: obj.email,
    role: obj.role,
    phone: obj.phone,
    specialization: obj.specialization,
    bio: obj.bio,
    isActive: obj.isActive,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const formatAppointment = (appointment, extras = {}) => {
  if (!appointment) return null;
  const obj = appointment.toObject ? appointment.toObject() : appointment;
  const date = obj.appointmentDate ? new Date(obj.appointmentDate) : null;

  return {
    id: toId(obj),
    patient_id: toId(obj.patientId),
    doctor_id: toId(obj.doctorId),
    title: obj.title,
    description: obj.description,
    appointment_date: date ? date.toISOString().split('T')[0] : obj.appointmentDate,
    appointmentDate: obj.appointmentDate,
    start_time: obj.startTime,
    end_time: obj.endTime,
    startTime: obj.startTime,
    endTime: obj.endTime,
    duration: obj.duration,
    status: obj.status,
    notes: obj.notes,
    location: obj.location,
    meeting_link: obj.meetingLink,
    created_at: obj.createdAt,
    updated_at: obj.updatedAt,
    ...extras,
  };
};

const formatAvailability = (slot) => {
  if (!slot) return null;
  const obj = slot.toObject ? slot.toObject() : slot;
  return {
    id: toId(obj),
    doctor_id: toId(obj.doctorId),
    day_of_week: obj.dayOfWeek,
    dayOfWeek: obj.dayOfWeek,
    start_time: obj.startTime,
    end_time: obj.endTime,
    startTime: obj.startTime,
    endTime: obj.endTime,
    is_available: obj.isAvailable,
    breaks: obj.breaks || [],
  };
};

module.exports = {
  toId,
  formatUser,
  formatAppointment,
  formatAvailability,
};
