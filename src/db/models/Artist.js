const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	country: String,
	lat: Number,
	long: Number,
});

module.exports = mongoose.model('Artist', ArtistSchema);