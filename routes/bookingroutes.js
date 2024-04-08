const router= require('express').Router();
const Bookingcontroller= require('../controllers/BookingsController');

router.post('/bookings', Bookingcontroller.scheduleBooking);
router.get('/bookings', Bookingcontroller.listBookedSlots);
module.exports=router;