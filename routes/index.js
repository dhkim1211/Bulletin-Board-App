var express = require('express');
var router = express.Router();

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

//module.exports = router;

module.exports = function(passport){
 
  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('signin', { message: req.flash('message') });
  });
 
  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/index2',
    failureRedirect: '/',
    failureFlash : true 
  }));
 
  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });
 
  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/index2',
    failureRedirect: '/signup',
    failureFlash : true 
  }));

  /* Handle Logout */
	router.get('/signout', function(req, res) {
	  req.logout();
	  res.redirect('/');
	});

  /* GET Home Page */
	router.get('/index2', isAuthenticated, function(req, res){
	  res.render('index2', { user: req.user });
	});

  //Post new message
  router.post('/messages', function(req, res) {
    var Message = require('../models/message.js');
    var newMessage = new Message();

    newMessage.username = req.user.username;
    newMessage.title = req.param('title');
    newMessage.message = req.param('message');

    newMessage.save(function(err){
      if (err) {
        console.log("Error in saving message");
        throw err;
      }
      console.log("Message Saved!");
      res.redirect('index2');
    })
  })

  router.get('/messages', function(req, res) {
    var Message = require('../models/message.js');
    Message.find(function(err, data) {
      if (err) {throw err;}
      res.render('messages', {posts: data})
    })

  })

 
  return router;
}