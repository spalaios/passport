const mongoose = require('mongoose');

const db = mongoose.connection;

db.on('error', () => {
    console.log('Error while connecting to database');
});

db.once('open', () => {
    console.log('Database is ready for storing');
});


//create the schema 

let Schema = mongoose.Schema;

let passUserSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username : {
        type : String,
        unique : true,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
         matched : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password : {
        type : String,
        required : true
    }
});

//create the model from the schema

const passUserModel = mongoose.model('passUser', passUserSchema);

module.exports = passUserModel;