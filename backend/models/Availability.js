const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    breaks: [
      {
        startTime: String,
        endTime: String,
      },
    ],
  },
  { timestamps: true }
);

availabilitySchema.index({ doctorId: 1, dayOfWeek: 1 }, { unique: true });

const Availability = mongoose.model('Availability', availabilitySchema);

Availability.findByDoctorId = (doctorId) =>
  Availability.find({ doctorId }).sort({ dayOfWeek: 1 });

Availability.updateById = (id, updates) =>
  Availability.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

Availability.deleteById = (id) => Availability.findByIdAndDelete(id);

Availability.insertMany = async (records) => {
  const results = [];
  for (const record of records) {
    const existing = await Availability.findOne({
      doctorId: record.doctorId,
      dayOfWeek: record.dayOfWeek,
    });

    if (existing) {
      existing.startTime = record.startTime;
      existing.endTime = record.endTime;
      existing.breaks = record.breaks || [];
      existing.isAvailable = true;
      await existing.save();
      results.push(existing);
    } else {
      const created = await Availability.create(record);
      results.push(created);
    }
  }
  return results;
};

module.exports = Availability;
