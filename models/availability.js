// availability.js
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  maxCapacity: { type: Number, required: true }
});

const availabilitySchema = new mongoose.Schema({
  day: { type: String, required: true },
  slots: [slotSchema]
});

module.exports = mongoose.model('Availability', availabilitySchema);
