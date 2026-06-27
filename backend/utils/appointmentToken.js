const generateAppointmentToken = (appointmentDate, startTime) => {
  const stamp = new Date(appointmentDate);
  const [hours, minutes] = startTime.split(':').map(Number);
  stamp.setHours(hours, minutes, 0, 0);

  const datePart = stamp.toISOString().slice(0, 10).replace(/-/g, '');
  const timePart = `${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}`;
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `APT-${datePart}-${timePart}-${randomPart}`;
};

module.exports = { generateAppointmentToken };
