var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var db = require('../app/config');
var { User } = require('../app/models/user');
var { Link } = require('../app/models/link');

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
  Link.find({ } , function(links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    return res.sendStatus(404);
  }
  let code = util.setCode(uri);
  Link.findOne({url: uri}, function(err, foundUrl) {
    if (foundUrl) {
      res.status(200).send(foundUrl);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if(err) {
          return res.sendStatus(404);
        }

        let link = new Link ({
                      hasTimestamps: true,
                      visits: 0,
                      url: code,
                      baseUrl: req.headers.origin,
                      title: title
        });
        link.save((err) => {
          if (err) console.log(err);
          res.sendStatus(200);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({},function (err, data) {
    console.log(data);
  });
  User.findOne({username:username}, function(err, user) { /*).exec(function(err,user) {*/
    console.log(user);
    if(!user) {
      res.redirect('/login');
    } else {
      util.comparePassword(password, user.password, function (match) {
        //console.log('MATCH line 100 ----->>>>>>>', match, password, user.password);
        if (match) {
          util.createSession(req, res, user);
          // res.redirect('/');        
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
      password = util.hashPassword(password).then(function(hash) {
        var user = new User({username:username,
                             password:hash});
        user.save(function() {
          res.redirect('/');
       });
      });
      // res.sendStatus(200);
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  })
};


exports.navToLink = function(req, res) {

  Link.findOne({url: req.params[0]}).exec(function(err, link) {
    if(!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function (err, updatedLink) {
        if(err) console.log('error navigating to link');
        else {
          res.redirect(updatedLink.url);
        }
      });
    }
  });
};
