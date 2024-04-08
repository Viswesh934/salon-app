const router= require('express').Router();
const Availabilitycontroller= require('../controllers/AvailabilityController');

router.post('/availability', Availabilitycontroller.setAvailability);
router.get('/available-slots/:date', Availabilitycontroller.getAvailableSlots);
module.exports=router;