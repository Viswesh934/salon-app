// AvailabilityController.js
const Availability = require('../models/availability');

// Controller for setting availability
exports.setAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    // Construct an array of update operations for each day's availability
    const updateOperations = availability.map(dayAvailability => {
      return {
        updateOne: {
          filter: { day: dayAvailability.day }, // Filter by day
          update: { $set: { slots: dayAvailability.slots } }, // Update slots
          upsert: true // Create new document if not found
        }
      };
    });

    // Perform bulk write operation to update or insert availability data
    await Availability.bulkWrite(updateOperations);

    res.status(200).json({ message: 'Availability set successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller for getting availability by date

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const dateObj = new Date(date);
    const dayIndex = dateObj.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[dayIndex];
    const availability = await Availability.findOne({ day });
    if (!availability) {
      return res.status(404).json({ message: `Availability not found for ${day}` });
    }
    res.status(200).json({ date, day, availableSlots: availability.slots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
