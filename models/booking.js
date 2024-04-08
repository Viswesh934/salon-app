// booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  slot: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
