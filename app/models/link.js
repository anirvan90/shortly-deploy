var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');


exports.LinkSchema = new mongoose.Schema({
  tableName: String,
  hasTimestamps: true,
  defaults: {
    visits: 0
  },
  initialize: function () {
    this.on('creating', function(model, attrs, options) {
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });    
  }
});

exports.LinkModel = mongoose.model('Link', LinkSchema);

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
    // this.on('creating', function(model, attrs, options) {
    //   var shasum = crypto.createHash('sha1');
    //   shasum.update(model.get('url'));
    //   model.set('code', shasum.digest('hex').slice(0, 5));
    // });
//   }
// });

// module.exports = Link;
