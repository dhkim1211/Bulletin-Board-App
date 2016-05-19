var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var path = require('path');

var dbConfig = require('./models/db.js');
var mongoose = require('mongoose');

//connect to db
mongoose.connect(dbConfig.url);

var app = express();

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(logger('dev')); //what is this?
app.use(cookieParser()); 

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*
//home page
app.get('/', function(req, res) {
	res.render('index2.jade');
})

//post messages
app.post('/messages', function(req, res) {
	db.collection('message').save(req.body, function(err, results) {
		if (err) { return console.log(err);}
		console.log('saved to database');

		res.redirect('messages');
	})
})

//messages page
app.get('/messages', function(req, res) {
	//cursor = mongo object
	var cursor = db.collection('message').find().toArray(function(err, results) {
		if (err) { return console.log(err);}

		res.render('messages', {posts: results});
	})
})
*/
app.listen(3000);

