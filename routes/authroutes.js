const router= require('express').Router();
const Authcontroller= require('../controllers/Authcontroller');

router.post('/register', Authcontroller.register);
router.post('/login', Authcontroller.login);
router.post('/logout', Authcontroller.logout);

module.exports=router;