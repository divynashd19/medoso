const Availability = require('../models/Availability');

// Set Doctor Availability
exports.setAvailability = async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime, breaks } = req.body;

    const availability = new Availability({
      doctorId: req.userId,
      dayOfWeek,
      startTime,
      endTime,
      breaks: breaks || []
    });

    await availability.save();

    res.status(201).json({
      message: 'Availability set successfully',
      availability
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to set availability', error: error.message });
  }
};

// Get Doctor Availability
exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const availability = await Availability.find({ doctorId });

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch availability', error: error.message });
  }
};

// Update Availability
exports.updateAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const { startTime, endTime, isAvailable, breaks } = req.body;

    const availability = await Availability.findByIdAndUpdate(
      availabilityId,
      {
        startTime,
        endTime,
        isAvailable,
        breaks: breaks || [],
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    res.json({ message: 'Availability updated', availability });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update availability', error: error.message });
  }
};

// Delete Availability
exports.deleteAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;

    const availability = await Availability.findByIdAndDelete(availabilityId);

    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    res.json({ message: 'Availability deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete availability', error: error.message });
  }
};
