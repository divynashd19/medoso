const Appointment = require('../models/Appointment');
const Reminder = require('../models/Reminder');

// Create Appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, title, appointmentDate, startTime, endTime, description, location } = req.body;

    const appointment = new Appointment({
      patientId: req.userId,
      doctorId,
      title,
      appointmentDate,
      startTime,
      endTime,
      description,
      location,
      status: 'scheduled'
    });

    await appointment.save();

    // Create reminder (24 hours before appointment)
    const appointmentDateTime = new Date(appointmentDate);
    const [hours, minutes] = startTime.split(':');
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

    const reminderTime = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);

    const reminder = new Reminder({
      appointmentId: appointment._id,
      userId: req.userId,
      reminderTime,
      appointmentTime: appointmentDateTime,
      message: `Reminder: You have an appointment tomorrow at ${startTime}`
    });

    await reminder.save();

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
};

// Get Appointments for Patient
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.userId })
      .populate('doctorId', 'name specialization email')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

// Get Appointments for Doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.userId })
      .populate('patientId', 'name email phone')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

// Update Appointment Status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};

// Cancel Appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'cancelled', updatedAt: Date.now() },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
};

// Get Single Appointment
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialization email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointment', error: error.message });
  }
};
