var path = require('path');
var mongoose = require('mongoose');
var mongoosePath = process.env.DB_USERS_URLS || 'mongodb://localhost/db_users_urls';
mongoose.connect(mongoosePath);
var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { 
  console.log('MONGO IS ON ');
});


module.exports = db;
