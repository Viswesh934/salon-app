// scheduleBookingController.js
const Booking = require('../models/booking');
const jwt = require('jsonwebtoken');

exports.scheduleBooking = async (req, res) => {
  try {
    const token=req.body.token;
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const { date, slot } = req.body;
    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({ date, 'slot.start': slot.start, 'slot.end': slot.end }) ?? null;
    if (existingBooking) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // Create a new booking
    const newBooking = new Booking({ userId, date, slot });
    await newBooking.save();

    res.status(201).json({ message: 'Booking scheduled successfully', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// listBookedSlotsController.js

exports.listBookedSlots = async (req, res) => {
  try {
    // Fetch all booked slots
    const bookedSlots = await Booking.find() ?? [];

    res.status(200).json({ bookedSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
