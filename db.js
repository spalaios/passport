const mongoose = require('mongoose');

const db = mongoose.connection;

db.on('error', () => {
    console.log('Error while connecting to database');
});

db.once('open', () => {
    console.log('Database is ready for storing');
});