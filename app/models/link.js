var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var linkSchema = mongoose.Schema({
    visits: Number,
    url: String,
    baseUrl: String,
    title: String,
    code: String
});

linkSchema.pre('save', function (next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code =  shasum.digest('hex').slice(0, 5);
  next();
})

var Link = mongoose.model('Link', linkSchema);


module.exports = Link;