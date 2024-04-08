// AvailabilityController.js
const Availability = require('../models/availability');
const cons = require('../codes');

// Controller for setting availability
exports.setAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const updateOperations = availability.map(dayAvailability => {
      return {
        updateOne: {
          filter: { day: dayAvailability.day },
          update: { $set: { slots: dayAvailability.slots } },
          upsert: true
        }
      };
    });

    await Availability.bulkWrite(updateOperations);

    res.status(cons.ok).json({ message: 'Availability set successfully' });
  } catch (error) {
    console.error(error);
    res.status(cons.internalerror).json({ message: cons.internalerror });
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
      return res.status(cons.notfound).json({ message: `Availability not found for ${day}` });
    }
    res.status(cons.ok).json({ date, day, availableSlots: availability.slots });
  } catch (error) {
    console.error(error);
    res.status(cons.internalerror).json({ message: cons.internalerror });
  }
};
