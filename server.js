var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var db;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'jade');
app.use(express.static('public'));

//connect to db
MongoClient.connect('mongodb://dhkim1211:nycda@ds011369.mlab.com:11369/messageboard', function(err, database) {
	//..start the server
	if (err) {
		return console.log(err);
	}
	db = database;
	app.listen(3000, function() {
		console.log('listening on 3000');
	})
})



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

