var path = require('path');
var mongoose = require('mongoose');
var mongoosePath = 'mongodb://localhost/db_users_urls';
mongoose.connect(mongoosePath);
var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { 
  console.log('MONGO IS ON ');
});

db.UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

db.LinkSchema = new mongoose.Schema({
    hasTimestamps: {type: Boolean, default: true},
    visits: {type: Number, default: 0},
    url: String,
    baseUrl: String,
    title: String
});


module.exports = db;
