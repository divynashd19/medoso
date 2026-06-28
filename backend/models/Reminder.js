const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reminderTime: { type: Date, required: true },
    appointmentTime: { type: Date, required: true },
    reminderType: { type: String, enum: ['email', 'sms', 'in-app'], default: 'email' },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    deliveredAt: Date,
  },
  { timestamps: true }
);

const Reminder = mongoose.model('Reminder', reminderSchema);

Reminder.createReminder = async (data) => {
  const doc = new Reminder({
    appointmentId: data.appointmentId,
    userId: data.userId,
    reminderTime: data.reminderTime,
    appointmentTime: data.appointmentTime,
    reminderType: data.reminderType || 'email',
    message: data.message,
    status: data.status || 'pending',
    deliveredAt: data.deliveredAt,
  });
  return doc.save();
};

Reminder.findPending = () =>
  Reminder.find({ status: 'pending', reminderTime: { $lte: new Date() } });

Reminder.findByUserId = (userId) =>
  Reminder.find({ userId }).sort({ reminderTime: -1 });

Reminder.updateById = (id, updates) =>
  Reminder.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

Reminder.deleteById = (id) => Reminder.findByIdAndDelete(id);

module.exports = Reminder;
