var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

exports.Link = mongoose.model('Link', db.LinkSchema);

