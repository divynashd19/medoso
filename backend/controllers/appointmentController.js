const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const { formatAppointment, toId } = require('../utils/apiFormat');
const { generateAppointmentToken } = require('../utils/appointmentToken');

const isTimeOverlap = (start1, end1, start2, end2) => {
  const [h1, m1] = start1.split(':').map(Number);
  const [h2, m2] = end1.split(':').map(Number);
  const [h3, m3] = start2.split(':').map(Number);
  const [h4, m4] = end2.split(':').map(Number);

  const time1 = h1 * 60 + m1;
  const time2 = h2 * 60 + m2;
  const time3 = h3 * 60 + m3;
  const time4 = h4 * 60 + m4;

  return time1 < time4 && time2 > time3;
};

const sameDateString = (dateValue, compareDate) => {
  const d = new Date(dateValue).toISOString().split('T')[0];
  const c = new Date(compareDate).toISOString().split('T')[0];
  return d === c;
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, title, appointmentDate, startTime, endTime, description, location } = req.body;

    if (!doctorId || !title || !appointmentDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'Doctor, title, date, and times are required' });
    }

    const appointmentDateObj = new Date(appointmentDate);
    const dayOfWeek = appointmentDateObj.getDay();

    const availabilities = await Availability.findByDoctorId(doctorId);
    const doctorAvailability = availabilities.find(
      (a) => a.dayOfWeek === dayOfWeek && a.isAvailable
    );

    if (!doctorAvailability) {
      return res.status(400).json({ message: 'Doctor is not available on this day' });
    }

    if (startTime < doctorAvailability.startTime || endTime > doctorAvailability.endTime) {
      return res.status(400).json({
        message: `Appointment time must be within doctor's available hours: ${doctorAvailability.startTime} - ${doctorAvailability.endTime}`,
      });
    }

    if (doctorAvailability.breaks?.length > 0) {
      for (const breakTime of doctorAvailability.breaks) {
        if (isTimeOverlap(startTime, endTime, breakTime.startTime, breakTime.endTime)) {
          return res.status(400).json({
            message: `Appointment conflicts with doctor's break time: ${breakTime.startTime} - ${breakTime.endTime}`,
          });
        }
      }
    }

    const allAppointments = await Appointment.findByDoctorId(doctorId);
    const existingAppointments = allAppointments.filter(
      (a) => sameDateString(a.appointmentDate, appointmentDate) && a.status === 'scheduled'
    );

    for (const existing of existingAppointments) {
      if (isTimeOverlap(startTime, endTime, existing.startTime, existing.endTime)) {
        return res.status(400).json({ message: 'Appointment time conflicts with an existing appointment' });
      }
    }

    const token = generateAppointmentToken(appointmentDateObj, startTime);
    const appointment = await Appointment.createAppointment({
      patientId: req.userId,
      doctorId,
      title,
      appointmentDate: appointmentDateObj,
      startTime,
      endTime,
      description,
      location,
      status: 'scheduled',
      token,
      bookedAt: new Date(),
    });

    const appointmentDateTime = new Date(appointmentDate);
    const [hours, minutes] = startTime.split(':');
    appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    const reminderTime = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);

    await Reminder.createReminder({
      appointmentId: appointment._id,
      userId: req.userId,
      reminderTime,
      appointmentTime: appointmentDateTime,
      message: `Reminder: You have an appointment tomorrow at ${startTime}`,
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      token,
      appointment: formatAppointment(appointment),
    });
  } catch (error) {
    console.error('Create appointment error:', error.message);
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findByPatientId(req.userId);
    const formatted = await Promise.all(
      appointments.map(async (appt) => {
        const doctor = await User.findById(appt.doctorId).select('name specialization email');
        return formatAppointment(appt, {
          doctor: doctor
            ? { name: doctor.name, specialization: doctor.specialization, email: doctor.email }
            : null,
        });
      })
    );
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findByDoctorId(req.userId);
    const formatted = await Promise.all(
      appointments.map(async (appt) => {
        const patient = await User.findById(appt.patientId).select('name email phone');
        return formatAppointment(appt, {
          patient: patient ? { name: patient.name, email: patient.email, phone: patient.phone } : null,
        });
      })
    );
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.updateById(appointmentId, { status });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated', appointment: formatAppointment(appointment) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const existing = await Appointment.findById(appointmentId);
    if (!existing) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const appointment = await Appointment.updateById(appointmentId, { status: 'cancelled' });
    res.json({ message: 'Appointment cancelled', appointment: formatAppointment(appointment) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const [patient, doctor] = await Promise.all([
      User.findById(appointment.patientId).select('name email phone'),
      User.findById(appointment.doctorId).select('name specialization email'),
    ]);

    res.json(
      formatAppointment(appointment, {
        patient: patient ? { name: patient.name, email: patient.email, phone: patient.phone } : null,
        doctor: doctor
          ? { name: doctor.name, specialization: doctor.specialization, email: doctor.email }
          : null,
      })
    );
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointment', error: error.message });
  }
};
