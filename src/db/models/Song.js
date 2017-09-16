const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
	name: String,
	artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist'},
	album: String,
	publisher: String,
	publicationYear: Number,
	genere: String,
	views: { type: Number, default: 0 },
	words: String,
});

module.exports = mongoose.model('Song', SongSchema);
