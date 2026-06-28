export const getAppointmentId = (appointment) =>
  appointment?.id || appointment?._id?.toString?.() || appointment?._id;

export const getAppointmentDate = (appointment) =>
  appointment?.appointment_date || appointment?.appointmentDate;

export const getStartTime = (appointment) =>
  appointment?.start_time || appointment?.startTime;

export const getEndTime = (appointment) =>
  appointment?.end_time || appointment?.endTime;

export const getStatusClass = (status) => {
  const map = {
    scheduled: 'status-scheduled',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
    'no-show': 'status-noshow',
  };
  return map[status] || 'status-scheduled';
};

export const formatStatus = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : '';

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time) => (time ? time.substring(0, 5) : '');

export const getDoctorName = (appointment) =>
  appointment?.doctor?.name || appointment?.doctorId?.name || 'Unknown Doctor';

export const getPatientName = (appointment) =>
  appointment?.patient?.name || appointment?.patientId?.name || 'Unknown Patient';
