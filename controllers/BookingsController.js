const Booking = require('../models/booking');
const jwt = require('jsonwebtoken');
const cons = require('../codes');

exports.scheduleBooking = async (req, res) => {
  try {
    const token = req.body.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const { date, slot } = req.body;
    const existingBooking = await Booking.findOne({ date, 'slot.start': slot.start, 'slot.end': slot.end }) ?? null;
    if (existingBooking) {
      return res.status(cons.badrequest).json({ message: cons.notavailable });
    }
    const newBooking = new Booking({ userId, date, slot });
    await newBooking.save();
    res.status(cons.created).json({ message: cons.successful, booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(cons.internalerror).json({ message: cons.internalerror });
  }
};

exports.listBookedSlots = async (req, res) => {
  try {
    const bookedSlots = await Booking.find() ?? [];
    res.status(cons.ok).json({ bookedSlots });
  } catch (error) {
    console.error(error);
    res.status(cons.internalerror).json({ message: cons.internalerror });
  }
};

