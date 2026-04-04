const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/auth');

// Create Appointment
router.post('/', authenticate, appointmentController.createAppointment);

// Get Patient Appointments
router.get('/patient/appointments', authenticate, appointmentController.getPatientAppointments);

// Get Doctor Appointments
router.get('/doctor/appointments', authenticate, appointmentController.getDoctorAppointments);

// Get Single Appointment
router.get('/:appointmentId', authenticate, appointmentController.getAppointment);

// Update Appointment Status
router.put('/:appointmentId/status', authenticate, appointmentController.updateAppointmentStatus);

// Cancel Appointment
router.patch('/:appointmentId/cancel', authenticate, appointmentController.cancelAppointment);

module.exports = router;
