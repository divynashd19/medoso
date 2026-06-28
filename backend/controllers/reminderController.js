const Reminder = require('../models/Reminder');

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.findByUserId(req.userId);
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reminders', error: error.message });
  }
};

exports.markReminderSent = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const reminder = await Reminder.updateById(reminderId, {
      status: 'sent',
      deliveredAt: new Date(),
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder marked as sent', reminder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update reminder', error: error.message });
  }
};

exports.getPendingReminders = async (req, res) => {
  try {
    const reminders = await Reminder.findPending();
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending reminders', error: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const reminder = await Reminder.deleteById(reminderId);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete reminder', error: error.message });
  }
};
