var mongoose = require('mongoose');
 
module.exports = mongoose.model('Message',{
    username: String,
    title: String,
    message: String
});