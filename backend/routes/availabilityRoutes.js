const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { authenticate, authorize } = require('../middleware/auth');

// Set Availability (Doctors only)
router.post('/', authenticate, authorize(['doctor']), availabilityController.setAvailability);

// Get My Availability (Doctors only)
router.get('/my', authenticate, authorize(['doctor']), availabilityController.getMyAvailability);

// Get Doctor Availability
router.get('/:doctorId', availabilityController.getDoctorAvailability);

// Update Availability (Doctors only)
router.put('/:availabilityId', authenticate, authorize(['doctor']), availabilityController.updateAvailability);

// Delete Availability (Doctors only)
router.delete('/:availabilityId', authenticate, authorize(['doctor']), availabilityController.deleteAvailability);

module.exports = router;
