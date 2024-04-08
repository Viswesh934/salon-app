const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGODB_URI;
console.log(uri);
mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});
module.exports = db;