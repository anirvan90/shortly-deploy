var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({ }).exec(function(err, links) {
    res.status(200).send(links);
  });
};


exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    return res.sendStatus(404);
  }
  Link.findOne({url: uri}).exec(function(err, foundUrl) {
    if (foundUrl) {
      res.status(200).send(foundUrl);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if(err) {
          console.log('Error reading URL heading: ', error);
          return res.sendStatus(404);
        }
        var link = new Link ({
                      visits: 0,
                      url: uri,
                      baseUrl: req.headers.origin,
                      title: title
        });
        link.save((err, link) => {
          if (err) {
            console.log(err);
            res.send(500, err);
          } else {
            res.status(200).send(link);
          }
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username:username}).exec(function(err,user) {
    if(!user) {
      res.redirect('/login');
    } else {
      User.comparePassword(password, user.password , function (err, match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};



exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username:username}).exec(function(err, user){
    if(!user){
      var user = new User({username:username,
                           password:password});
      user.save(function(err, user) {
        if(err) {
          res.status(500).send(err);
        } 
        util.createSession(req, res, user);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};


exports.navToLink = function(req, res) {
  Link.findOne({code: req.params[0]}).exec(function(err, link) {
    if(!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function (err, updatedLink) {
        if(err) console.log('error navigating to link');
        else {
          res.redirect(updatedLink.url);
        }
        return;
      });
    }
  });
};
