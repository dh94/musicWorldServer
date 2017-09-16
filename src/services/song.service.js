const Artist = require('../db/models/Artist');
const Song = require('../db/models/Song');

module.exports = class SongService {
	static createSong({ name, artist, album, publisher, publicationYear, genere, words }){
		const song = new Song();
		song.name = name;
		song.album = album;
		song.publisher = publisher;
		song.publicationYear = publicationYear;
		song.genere = genere;
		song.words = words;

		return Artist.findById(artist)
			.then(foundArtist => {
				if (!foundArtist)
					throw new Error("no such artist");
				song.artist = foundArtist;
				return song.save();
			});
	}

	static updateSong({ id, input: { name, artist, album, publisher, publicationYear, genere, words } }) {
		return Song.findById(id)
			.then(song => {
				if (!song)
					throw new Error('no such song');
				if (name)
					song.name = name;
				if (album)
					song.album = album;
				if (publisher)
					song.publisher = publisher;
				if (publicationYear)
					song.publicationYear = publicationYear;
				if (genere)
					song.genere = genere;
				if (words)
					song.words = words;

				if (artist)
					return Artist.findById(artist)
						.then(foundArtist => {
							if (!foundArtist)
								throw new Error("no such artist");
							song.artist = foundArtist;
							return song.save();
						});
				else
					return song.save();
			});
	}

	static removeSong({ id }) {
		return Song.findByIdAndRemove(id).populate('artist')
			.then(song => {
				if (!song)
					throw new Error('no such song');
				return song;
			});
	}

	static songViewed({ id }) {
		return Song.findById(id).populate('artist')
			.then(song => {
				song.views += 1;
				return song.save()
					.then(() => song);
			});
	}

	static topSongs() {
		return Song.find({}).sort('-views').limit(10).populate('artist');
	}

	static allSongs() {
		return Song.find({}).populate('artist');
	}
}
