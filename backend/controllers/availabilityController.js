const Availability = require('../models/Availability');
const { formatAvailability } = require('../utils/apiFormat');

exports.setAvailability = async (req, res) => {
  try {
    const { daysOfWeek, startTime, endTime, breaks } = req.body;

    if (Array.isArray(daysOfWeek) && daysOfWeek.length > 0) {
      const savedAvailabilities = await Availability.insertMany(
        daysOfWeek.map((dayOfWeek) => ({
          doctorId: req.userId,
          dayOfWeek: parseInt(dayOfWeek, 10),
          startTime,
          endTime,
          breaks: breaks || [],
        }))
      );

      return res.status(201).json({
        message: 'Availability set successfully for multiple days',
        availabilities: savedAvailabilities.map(formatAvailability),
      });
    }

    const availability = await Availability.create({
      doctorId: req.userId,
      dayOfWeek: parseInt(daysOfWeek ?? req.body.dayOfWeek, 10),
      startTime,
      endTime,
      breaks: breaks || [],
    });

    res.status(201).json({
      message: 'Availability set successfully',
      availability: formatAvailability(availability),
    });
  } catch (error) {
    console.error('Set availability error:', error.message);
    res.status(500).json({ message: 'Failed to set availability', error: error.message });
  }
};

exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const availability = await Availability.findByDoctorId(doctorId);
    res.json(availability.map(formatAvailability));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch availability', error: error.message });
  }
};

exports.getMyAvailability = async (req, res) => {
  try {
    const availability = await Availability.findByDoctorId(req.userId);
    res.json(availability.map(formatAvailability));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch availability', error: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const { startTime, endTime, isAvailable, breaks } = req.body;

    const updates = {};
    if (startTime !== undefined) updates.startTime = startTime;
    if (endTime !== undefined) updates.endTime = endTime;
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;
    if (breaks !== undefined) updates.breaks = breaks;

    const availability = await Availability.updateById(availabilityId, updates);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    res.json({ message: 'Availability updated', availability: formatAvailability(availability) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update availability', error: error.message });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const availability = await Availability.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    await Availability.deleteById(availabilityId);
    res.json({ message: 'Availability deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete availability', error: error.message });
  }
};
