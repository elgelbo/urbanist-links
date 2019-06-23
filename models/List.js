var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    user: String,
    lists: [String],
    members: [String]
});

// Return a Tweet model based upon the defined schema
module.exports = List = mongoose.model('List', schema);
