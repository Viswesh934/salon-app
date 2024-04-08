const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db=require('./models/db');
const authroutes=require('./routes/authroutes');
const availabilityroutes=require('./routes/availabilityroutes');
const bookingsroutes=require('./routes/bookingroutes');
const errorMiddleware= require('./middleware/Errorhandling')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware.errorHandler);
app.use('/auth',authroutes);
app.use('/api',availabilityroutes);
app.use('/api',bookingsroutes);
app.listen(process.env.PORT, () => {
    console.log('Server is running');
});