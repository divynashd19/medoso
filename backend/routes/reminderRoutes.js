const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { authenticate } = require('../middleware/auth');

// Get Reminders
router.get('/', authenticate, reminderController.getReminders);

// Get Pending Reminders
router.get('/pending', reminderController.getPendingReminders);

// Mark Reminder as Sent
router.patch('/:reminderId/sent', authenticate, reminderController.markReminderSent);

// Delete Reminder
router.delete('/:reminderId', authenticate, reminderController.deleteReminder);

module.exports = router;
