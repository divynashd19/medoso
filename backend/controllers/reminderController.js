const Reminder = require('../models/Reminder');

// Get Reminders for User
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId })
      .populate('appointmentId')
      .sort({ reminderTime: 1 });

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reminders', error: error.message });
  }
};

// Mark Reminder as Sent
exports.markReminderSent = async (req, res) => {
  try {
    const { reminderId } = req.params;

    const reminder = await Reminder.findByIdAndUpdate(
      reminderId,
      { status: 'sent', deliveredAt: Date.now() },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder marked as sent', reminder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update reminder', error: error.message });
  }
};

// Get Pending Reminders
exports.getPendingReminders = async (req, res) => {
  try {
    const now = new Date();

    const reminders = await Reminder.find({
      status: 'pending',
      reminderTime: { $lte: now }
    }).populate('appointmentId');

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending reminders', error: error.message });
  }
};

// Delete Reminder
exports.deleteReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;

    const reminder = await Reminder.findByIdAndDelete(reminderId);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete reminder', error: error.message });
  }
};
